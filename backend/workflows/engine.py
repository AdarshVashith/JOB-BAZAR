# backend/workflows/engine.py
from typing import Any, Dict, List, Optional
import time
import uuid
from datetime import datetime
from .nodes import registry
from services.db import get_db

class WorkflowExecutionEngine:
    """
    Topological DAG Workflow Execution Engine.
    Executes a saved graph of nodes and edges, resolving data dependencies step by step.
    """

    @classmethod
    def _topological_sort(
        cls,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Sort nodes using Kahn's algorithm so dependencies execute before their children.
        """
        node_map = {n["id"]: n for n in nodes}
        in_degree = {n["id"]: 0 for n in nodes}
        adj = {n["id"]: [] for n in nodes}

        for edge in edges:
            src = edge.get("source")
            tgt = edge.get("target")
            if src in adj and tgt in in_degree:
                adj[src].append(edge)
                in_degree[tgt] += 1

        # Queue nodes with in_degree == 0 (triggers / entrypoints)
        queue = [n_id for n_id, deg in in_degree.items() if deg == 0]
        sorted_nodes = []

        while queue:
            curr_id = queue.pop(0)
            if curr_id in node_map:
                sorted_nodes.append(node_map[curr_id])

            for edge in adj.get(curr_id, []):
                tgt = edge.get("target")
                if tgt in in_degree:
                    in_degree[tgt] -= 1
                    if in_degree[tgt] == 0:
                        queue.append(tgt)

        # If there are disconnected nodes that were not reached, append them
        sorted_ids = {n["id"] for n in sorted_nodes}
        for n in nodes:
            if n["id"] not in sorted_ids:
                sorted_nodes.append(n)

        return sorted_nodes

    @classmethod
    async def execute_workflow(
        cls,
        workflow_id: str,
        user_id: Optional[str] = None,
        trigger_type: str = "manual",
        initial_payload: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Execute a complete workflow by ID from the database or payload.
        """
        pool = await get_db()
        execution_id = str(uuid.uuid4())
        start_time = time.time()

        # 1. Fetch workflow from database
        async with pool.acquire() as conn:
            wf_row = await conn.fetchrow(
                "SELECT id, user_id, name, nodes, edges FROM workflows WHERE id = $1",
                workflow_id
            )

        if not wf_row:
            raise ValueError(f"Workflow {workflow_id} not found")

        nodes: List[Dict[str, Any]] = wf_row["nodes"] or []
        edges: List[Dict[str, Any]] = wf_row["edges"] or []

        if isinstance(nodes, str):
            import json
            nodes = json.loads(nodes)
        if isinstance(edges, str):
            import json
            edges = json.loads(edges)

        # 2. Insert execution record
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO workflow_executions
                (id, workflow_id, user_id, status, trigger_type, node_results, started_at)
                VALUES ($1, $2, $3, 'running', $4, '{}'::jsonb, NOW())
                """,
                execution_id,
                workflow_id,
                user_id or wf_row["user_id"],
                trigger_type,
            )

        # 3. Perform topological sort
        sorted_nodes = cls._topological_sort(nodes, edges)

        # Map to store per-node outputs: { node_id: output_dict }
        node_outputs: Dict[str, Any] = {}
        node_logs: Dict[str, Any] = {}
        execution_status = "success"
        execution_error = None

        # Build reverse edge index to easily find parent outputs: { target_id: [edges] }
        parent_edges: Dict[str, List[Dict[str, Any]]] = {}
        for edge in edges:
            tgt = edge.get("target")
            parent_edges.setdefault(tgt, []).append(edge)

        # 4. Walk the sorted graph
        for node in sorted_nodes:
            n_id = node.get("id")
            n_type = node.get("type") or node.get("data", {}).get("type")
            n_params = node.get("data", {}).get("parameters", {})
            if not n_params and "parameters" in node:
                n_params = node["parameters"]

            node_impl = registry.get(n_type)
            if not node_impl:
                # Unknown node type - record error and continue
                node_logs[n_id] = {
                    "status": "error",
                    "error": f"Unknown node type '{n_type}'",
                    "duration_ms": 0,
                    "output": {},
                }
                continue

            # Gather input from upstream parent nodes
            upstream_edges = parent_edges.get(n_id, [])
            combined_input: Dict[str, Any] = {}

            if not upstream_edges:
                # Entrypoint node / trigger -> use initial payload
                combined_input = initial_payload or {}
            else:
                for edge in upstream_edges:
                    src_id = edge.get("source")
                    src_handle = edge.get("sourceHandle", "main")
                    src_output = node_outputs.get(src_id, {})

                    # If parent was a Condition node and output handle doesn't match branch, skip
                    if src_output.get("branch") and src_handle != src_output.get("branch"):
                        continue

                    if isinstance(src_output, dict):
                        combined_input.update(src_output)
                    else:
                        combined_input[src_id] = src_output

            # Execute node
            node_start = time.time()
            try:
                out = await node_impl.run(
                    input_data=combined_input,
                    params=n_params,
                    context={
                        "workflow_id": workflow_id,
                        "execution_id": execution_id,
                        "node_id": n_id,
                        "user_id": user_id,
                    }
                )
                node_duration = int((time.time() - node_start) * 1000)
                node_outputs[n_id] = out
                node_logs[n_id] = {
                    "status": "success",
                    "duration_ms": node_duration,
                    "input": combined_input,
                    "output": out,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            except Exception as e:
                node_duration = int((time.time() - node_start) * 1000)
                execution_status = "failed"
                execution_error = str(e)
                node_logs[n_id] = {
                    "status": "error",
                    "error": str(e),
                    "duration_ms": node_duration,
                    "input": combined_input,
                    "output": {},
                    "timestamp": datetime.utcnow().isoformat(),
                }
                break

        # 5. Finalize execution record in Postgres
        total_duration = int((time.time() - start_time) * 1000)
        import json

        async with pool.acquire() as conn:
            await conn.execute(
                """
                UPDATE workflow_executions
                SET status = $1, error = $2, duration_ms = $3, node_results = $4::jsonb, finished_at = NOW()
                WHERE id = $5
                """,
                execution_status,
                execution_error,
                total_duration,
                json.dumps(node_logs),
                execution_id,
            )

        return {
            "execution_id": execution_id,
            "workflow_id": workflow_id,
            "status": execution_status,
            "error": execution_error,
            "duration_ms": total_duration,
            "node_results": node_logs,
        }
