# backend/routes/workflows.py
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import uuid
import json

from routes.dependencies import get_current_user, get_optional_user
from services.db import get_db
from workflows.nodes import registry
from workflows.engine import WorkflowExecutionEngine

router = APIRouter(prefix="/workflows", tags=["workflows"])


class CreateWorkflowRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    nodes: Optional[List[Dict[str, Any]]] = []
    edges: Optional[List[Dict[str, Any]]] = []
    is_active: Optional[bool] = False
    cron_expression: Optional[str] = None


class UpdateWorkflowRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None
    is_active: Optional[bool] = None
    cron_expression: Optional[str] = None


class ExecuteWorkflowRequest(BaseModel):
    payload: Optional[Dict[str, Any]] = {}


@router.get("/nodes/registry")
async def get_node_registry():
    """Return all available pluggable node types and parameter schemas."""
    return {"nodes": registry.list_all()}


@router.get("")
async def list_workflows(user=Depends(get_optional_user)):
    """List all workflows belonging to the current user."""
    pool = await get_db()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, name, description, is_active, webhook_slug, cron_expression,
                   jsonb_array_length(nodes) as node_count,
                   created_at, updated_at
            FROM workflows
            WHERE user_id = $1
            ORDER BY updated_at DESC
            """,
            user["user_id"]
        )

        return [
            {
                "id": str(r["id"]),
                "name": r["name"],
                "description": r["description"],
                "is_active": r["is_active"],
                "webhook_slug": r["webhook_slug"],
                "cron_expression": r["cron_expression"],
                "node_count": r["node_count"] or 0,
                "created_at": r["created_at"].isoformat() if r["created_at"] else None,
                "updated_at": r["updated_at"].isoformat() if r["updated_at"] else None,
            }
            for r in rows
        ]


@router.post("")
async def create_workflow(
    body: CreateWorkflowRequest,
    user=Depends(get_optional_user)
):
    """Create a new workflow."""
    pool = await get_db()
    wf_id = str(uuid.uuid4())
    webhook_slug = str(uuid.uuid4())[:8]

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO workflows
            (id, user_id, name, description, nodes, edges, is_active, webhook_slug, cron_expression)
            VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8, $9)
            RETURNING id, name, description, is_active, webhook_slug, created_at
            """,
            wf_id,
            user["user_id"],
            body.name,
            body.description,
            json.dumps(body.nodes or []),
            json.dumps(body.edges or []),
            body.is_active or False,
            webhook_slug,
            body.cron_expression,
        )

        return {
            "id": str(row["id"]),
            "name": row["name"],
            "description": row["description"],
            "is_active": row["is_active"],
            "webhook_slug": row["webhook_slug"],
            "nodes": body.nodes or [],
            "edges": body.edges or [],
            "created_at": row["created_at"].isoformat(),
        }


@router.get("/{workflow_id}")
async def get_workflow(
    workflow_id: str,
    user=Depends(get_optional_user)
):
    """Get single workflow with full nodes and edges."""
    pool = await get_db()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT id, user_id, name, description, nodes, edges, is_active, webhook_slug, cron_expression, created_at, updated_at
            FROM workflows
            WHERE id = $1 AND user_id = $2
            """,
            workflow_id,
            user["user_id"]
        )

        if not row:
            raise HTTPException(status_code=404, detail="Workflow not found")

        nodes = row["nodes"] or []
        edges = row["edges"] or []
        if isinstance(nodes, str):
            nodes = json.loads(nodes)
        if isinstance(edges, str):
            edges = json.loads(edges)

        return {
            "id": str(row["id"]),
            "name": row["name"],
            "description": row["description"],
            "is_active": row["is_active"],
            "webhook_slug": row["webhook_slug"],
            "cron_expression": row["cron_expression"],
            "nodes": nodes,
            "edges": edges,
            "created_at": row["created_at"].isoformat() if row["created_at"] else None,
            "updated_at": row["updated_at"].isoformat() if row["updated_at"] else None,
        }


@router.put("/{workflow_id}")
async def update_workflow(
    workflow_id: str,
    body: UpdateWorkflowRequest,
    user=Depends(get_optional_user)
):
    """Update workflow graph (nodes, edges, name, etc.)."""
    pool = await get_db()
    async with pool.acquire() as conn:
        existing = await conn.fetchrow(
            "SELECT id FROM workflows WHERE id = $1 AND user_id = $2",
            workflow_id,
            user["user_id"]
        )
        if not existing:
            raise HTTPException(status_code=404, detail="Workflow not found")

        updates = []
        params = [workflow_id, user["user_id"]]
        idx = 3

        if body.name is not None:
            updates.append(f"name = ${idx}")
            params.append(body.name)
            idx += 1
        if body.description is not None:
            updates.append(f"description = ${idx}")
            params.append(body.description)
            idx += 1
        if body.nodes is not None:
            updates.append(f"nodes = ${idx}::jsonb")
            params.append(json.dumps(body.nodes))
            idx += 1
        if body.edges is not None:
            updates.append(f"edges = ${idx}::jsonb")
            params.append(json.dumps(body.edges))
            idx += 1
        if body.is_active is not None:
            updates.append(f"is_active = ${idx}")
            params.append(body.is_active)
            idx += 1
        if body.cron_expression is not None:
            updates.append(f"cron_expression = ${idx}")
            params.append(body.cron_expression)
            idx += 1

        updates.append("updated_at = NOW()")

        query = f"""
        UPDATE workflows
        SET {', '.join(updates)}
        WHERE id = $1 AND user_id = $2
        RETURNING id, name, is_active, updated_at
        """
        row = await conn.fetchrow(query, *params)
        return {"success": True, "id": str(row["id"]), "name": row["name"]}


@router.delete("/{workflow_id}")
async def delete_workflow(
    workflow_id: str,
    user=Depends(get_optional_user)
):
    """Delete a workflow."""
    pool = await get_db()
    async with pool.acquire() as conn:
        await conn.execute(
            "DELETE FROM workflows WHERE id = $1 AND user_id = $2",
            workflow_id,
            user["user_id"]
        )
        return {"success": True}


class ExecuteDirectBody(BaseModel):
    name: Optional[str] = "Live Canvas Workflow"
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    payload: Optional[Dict[str, Any]] = {}
    workflow_id: Optional[str] = None


class TestSingleNodeBody(BaseModel):
    node_type: str
    parameters: Optional[Dict[str, Any]] = {}
    test_input: Optional[Dict[str, Any]] = {}


@router.post("/execute-direct")
async def execute_direct_endpoint(
    body: ExecuteDirectBody,
    user=Depends(get_optional_user)
):
    """Run in-memory canvas workflow graph directly."""
    result = await WorkflowExecutionEngine.execute_graph_direct(
        nodes=body.nodes,
        edges=body.edges,
        workflow_id=body.workflow_id,
        user_id=user["user_id"],
        trigger_type="manual",
        initial_payload=body.payload,
    )
    return result


@router.post("/nodes/test-single")
async def test_single_node_endpoint(
    body: TestSingleNodeBody,
    user=Depends(get_optional_user)
):
    """Test run an individual node with custom test input."""
    node_impl = registry.get(body.node_type)
    if not node_impl:
        raise HTTPException(status_code=400, detail=f"Unknown node type: {body.node_type}")

    try:
        out = await node_impl.run(
            input_data=body.test_input or {},
            params=body.parameters or {},
            context={"user_id": user["user_id"]}
        )
        return {"success": True, "output": out}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/{workflow_id}/execute")
async def execute_workflow_endpoint(
    workflow_id: str,
    body: Optional[ExecuteWorkflowRequest] = None,
    user=Depends(get_optional_user)
):
    """Run workflow execution."""
    payload = body.payload if body else {}
    result = await WorkflowExecutionEngine.execute_workflow(
        workflow_id=workflow_id,
        user_id=user["user_id"],
        trigger_type="manual",
        initial_payload=payload,
    )
    return result


@router.get("/{workflow_id}/executions")
async def list_workflow_executions(
    workflow_id: str,
    user=Depends(get_optional_user)
):
    """List execution history for workflow."""
    pool = await get_db()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, status, trigger_type, duration_ms, started_at, finished_at, error, node_results
            FROM workflow_executions
            WHERE workflow_id = $1 AND user_id = $2
            ORDER BY started_at DESC
            LIMIT 30
            """,
            workflow_id,
            user["user_id"]
        )

        return [
            {
                "id": str(r["id"]),
                "status": r["status"],
                "trigger_type": r["trigger_type"],
                "duration_ms": r["duration_ms"],
                "error": r["error"],
                "started_at": r["started_at"].isoformat() if r["started_at"] else None,
                "finished_at": r["finished_at"].isoformat() if r["finished_at"] else None,
                "node_results": r["node_results"] if isinstance(r["node_results"], dict) else json.loads(r["node_results"] or "{}"),
            }
            for r in rows
        ]


# ── Public Webhook Trigger Endpoint ─────────────────────────────────
@router.api_route("/webhooks/{webhook_slug}", methods=["GET", "POST", "PUT"])
async def handle_public_webhook(webhook_slug: str, request: Request):
    """Public incoming webhook that triggers associated active workflow."""
    pool = await get_db()
    async with pool.acquire() as conn:
        wf = await conn.fetchrow(
            "SELECT id, user_id, is_active FROM workflows WHERE webhook_slug = $1",
            webhook_slug
        )

    if not wf:
        raise HTTPException(status_code=404, detail="Webhook not found")

    if not wf["is_active"]:
        return {"status": "ignored", "message": "Workflow is currently paused / inactive"}

    body = {}
    try:
        body = await request.json()
    except Exception:
        body = {"raw": (await request.body()).decode("utf-8", errors="ignore")}

    webhook_payload = {
        "method": request.method,
        "headers": dict(request.headers),
        "query_params": dict(request.query_params),
        "body": body,
    }

    result = await WorkflowExecutionEngine.execute_workflow(
        workflow_id=str(wf["id"]),
        user_id=str(wf["user_id"]),
        trigger_type="webhook",
        initial_payload=webhook_payload,
    )

    return {
        "status": "executed",
        "execution_id": result["execution_id"],
        "workflow_status": result["status"],
        "duration_ms": result["duration_ms"],
    }
