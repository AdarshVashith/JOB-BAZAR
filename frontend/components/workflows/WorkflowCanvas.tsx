"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  Play,
  Save,
  Plus,
  History,
  Sparkles,
  Webhook,
  Copy,
  Check,
  LayoutTemplate,
  Loader2,
  FolderOpen,
} from "lucide-react";

import { WorkflowNodeComponent } from "./CustomNodes";
import NodePaletteModal from "./NodePaletteModal";
import NodeConfigDrawer from "./NodeConfigDrawer";
import ExecutionLogModal from "./ExecutionLogModal";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Pre-configured Starter Templates
const TEMPLATES = [
  {
    name: "AI Data Extraction Pipeline",
    description: "Manual Trigger → Fetch API Data → AI Agent Summary",
    nodes: [
      {
        id: "node_trigger",
        type: "custom",
        position: { x: 50, y: 150 },
        data: {
          type: "manual_trigger",
          name: "Manual Start",
          category: "Trigger",
          parameters: { test_payload: '{"topic": "quantum computing"}' },
        },
      },
      {
        id: "node_http",
        type: "custom",
        position: { x: 380, y: 150 },
        data: {
          type: "http_request",
          name: "Fetch API",
          category: "Action",
          parameters: {
            method: "GET",
            url: "https://jsonplaceholder.typicode.com/posts/1",
          },
        },
      },
      {
        id: "node_ai",
        type: "custom",
        position: { x: 710, y: 150 },
        data: {
          type: "llm_agent",
          name: "AI Summarizer",
          category: "AI",
          parameters: {
            prompt: "Summarize this JSON data in 2 bullet points:\n{{$json}}",
            output_format: "text",
          },
        },
      },
    ],
    edges: [
      { id: "e1", source: "node_trigger", target: "node_http", animated: true },
      { id: "e2", source: "node_http", target: "node_ai", animated: true },
    ],
  },
  {
    name: "Webhook → Python Transform → Branch",
    description: "Webhook Listener → Python Transform → If/Else Branching",
    nodes: [
      {
        id: "node_webhook",
        type: "custom",
        position: { x: 50, y: 180 },
        data: {
          type: "webhook_trigger",
          name: "Webhook Listener",
          category: "Trigger",
          parameters: { http_method: "POST" },
        },
      },
      {
        id: "node_code",
        type: "custom",
        position: { x: 380, y: 180 },
        data: {
          type: "code_function",
          name: "Python Logic",
          category: "Transform",
          parameters: {
            code: "body = $json.get('body', {})\nresult = {'score': len(str(body)), 'valid': True}\n",
          },
        },
      },
      {
        id: "node_branch",
        type: "custom",
        position: { x: 710, y: 180 },
        data: {
          type: "condition_if",
          name: "Check Valid",
          category: "Logic",
          parameters: { field: "data.valid", operator: "is_truthy" },
        },
      },
    ],
    edges: [
      { id: "e1", source: "node_webhook", target: "node_code", animated: true },
      { id: "e2", source: "node_code", target: "node_branch", animated: true },
    ],
  },
];

export default function WorkflowCanvas() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<any | null>(null);
  const [workflowName, setWorkflowName] = useState("My Workflow");
  const [nodeSchemas, setNodeSchemas] = useState<any[]>([]);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  // UI Modals & Drawers
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [executions, setExecutions] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const nodeTypes = useMemo(() => ({ custom: WorkflowNodeComponent }), []);

  // Fetch node registry schemas
  useEffect(() => {
    async function loadSchemas() {
      try {
        const res = await fetch(`${API}/workflows/nodes/registry`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setNodeSchemas(data.nodes || []);
        }
      } catch (err) {
        console.error("Failed to load node registry:", err);
      }
    }
    loadSchemas();
  }, []);

  // Fetch workflows list
  const loadWorkflows = useCallback(async () => {
    try {
      const res = await fetch(`${API}/workflows`, { credentials: "include" });
      if (res.ok) {
        const list = await res.json();
        setWorkflows(list);
        if (list.length > 0 && !currentWorkflow) {
          loadSingleWorkflow(list[0].id);
        } else if (list.length === 0) {
          // Load starter template
          loadTemplate(TEMPLATES[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load workflows:", err);
    }
  }, [currentWorkflow]);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  // Load a single workflow by ID
  async function loadSingleWorkflow(id: string) {
    try {
      const res = await fetch(`${API}/workflows/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const wf = await res.json();
        setCurrentWorkflow(wf);
        setWorkflowName(wf.name);
        setNodes(wf.nodes || []);
        setEdges(wf.edges || []);
      }
    } catch (err) {
      console.error("Failed to load workflow details:", err);
    }
  }

  // Load a starter template
  function loadTemplate(tpl: (typeof TEMPLATES)[0]) {
    setWorkflowName(tpl.name);
    setNodes(tpl.nodes);
    setEdges(tpl.edges);
    setCurrentWorkflow(null);
  }

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  // Add node from palette
  const handleAddNode = (nodeType: string) => {
    const schema = nodeSchemas.find((s) => s.type === nodeType);
    const newId = `node_${Date.now()}`;
    const defaultParams: Record<string, any> = {};
    schema?.parameters?.forEach((p: any) => {
      if (p.default !== undefined) defaultParams[p.name] = p.default;
    });

    const newNode: Node = {
      id: newId,
      type: "custom",
      position: { x: 250 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: {
        type: nodeType,
        name: schema?.name || nodeType,
        category: schema?.category || "Action",
        parameters: defaultParams,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
  };

  // Update node parameters from drawer
  const handleUpdateNodeParameters = (
    nodeId: string,
    parameters: Record<string, any>
  ) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                parameters,
              },
            }
          : n
      )
    );
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
  };

  // Save workflow to backend
  async function handleSave() {
    setSaving(true);
    try {
      if (currentWorkflow?.id) {
        // Update existing
        await fetch(`${API}/workflows/${currentWorkflow.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: workflowName,
            nodes,
            edges,
          }),
        });
      } else {
        // Create new
        const res = await fetch(`${API}/workflows`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: workflowName,
            nodes,
            edges,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          setCurrentWorkflow(created);
        }
      }
      loadWorkflows();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }

  // Execute workflow
  async function handleExecute() {
    setExecuting(true);
    // Reset statuses
    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, executionStatus: "running" } }))
    );

    try {
      let wfId = currentWorkflow?.id;

      // Save first if not saved yet
      if (!wfId) {
        const saveRes = await fetch(`${API}/workflows`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: workflowName, nodes, edges }),
        });
        const savedData = await saveRes.json();
        wfId = savedData.id;
        setCurrentWorkflow(savedData);
      } else {
        await fetch(`${API}/workflows/${wfId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: workflowName, nodes, edges }),
        });
      }

      // Trigger execution endpoint
      const execRes = await fetch(`${API}/workflows/${wfId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const execData = await execRes.json();
      const nodeLogs = execData.node_results || {};

      // Update node visual status badges
      setNodes((nds) =>
        nds.map((n) => {
          const log = nodeLogs[n.id];
          return {
            ...n,
            data: {
              ...n.data,
              executionStatus: log
                ? log.status === "success"
                  ? "success"
                  : "error"
                : undefined,
            },
          };
        })
      );

      // Open execution logs
      fetchExecutions(wfId);
    } catch (err) {
      console.error("Execution error:", err);
    } finally {
      setExecuting(false);
    }
  }

  // Fetch execution history for modal
  async function fetchExecutions(wfId?: string) {
    const id = wfId || currentWorkflow?.id;
    if (!id) return;
    try {
      const res = await fetch(`${API}/workflows/${id}/executions`, {
        credentials: "include",
      });
      if (res.ok) {
        const list = await res.json();
        setExecutions(list);
        setIsLogsOpen(true);
      }
    } catch (err) {
      console.error("Fetch executions error:", err);
    }
  }

  const webhookUrl = currentWorkflow?.webhook_slug
    ? `${API}/workflows/webhooks/${currentWorkflow.webhook_slug}`
    : null;

  const copyWebhook = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#FAF9F5] relative">
      {/* Top Editorial Toolbar */}
      <div className="h-14 border-b border-[#EBE8E2] bg-[#FFFFFE] px-6 flex items-center justify-between z-10 shadow-sm flex-shrink-0">
        {/* Left: Workflow Selector & Name */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-base font-serif font-medium text-[#1F1915] bg-transparent hover:bg-[#FAF9F6] focus:bg-[#FAF9F6] border border-transparent focus:border-[#DDD9D1] rounded-lg px-2 py-1 outline-none transition-all"
          />

          {workflows.length > 0 && (
            <select
              value={currentWorkflow?.id || ""}
              onChange={(e) => {
                if (e.target.value) loadSingleWorkflow(e.target.value);
              }}
              className="text-xs bg-[#FAF9F6] border border-[#EBE8E2] rounded-lg px-2.5 py-1 text-[#6B6359] outline-none"
            >
              <option value="">Switch Workflow...</option>
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.name} ({wf.node_count || 0} nodes)
                </option>
              ))}
            </select>
          )}

          {webhookUrl && (
            <div className="hidden lg:flex items-center gap-1.5 bg-[#E8F4F0] border border-[#C2E3D6] px-2.5 py-1 rounded-full text-xs text-[#2D7A5E]">
              <Webhook size={12} />
              <span className="font-mono text-[10px] truncate max-w-[140px]">
                {currentWorkflow?.webhook_slug}
              </span>
              <button
                onClick={copyWebhook}
                title="Copy Webhook URL"
                className="hover:text-[#1F1915]"
              >
                {copiedWebhook ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Templates */}
          <div className="dropdown relative">
            <button
              onClick={() => loadTemplate(TEMPLATES[0])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F6] text-xs font-medium text-[#1F1915] shadow-sm transition-all"
            >
              <LayoutTemplate size={13} />
              <span className="hidden sm:inline">Templates</span>
            </button>
          </div>

          {/* Add Step */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F6] text-xs font-medium text-[#1F1915] shadow-sm transition-all"
          >
            <Plus size={14} className="text-[#2B2FE0]" />
            <span>Add Node</span>
          </button>

          {/* Execution History */}
          <button
            onClick={() => fetchExecutions()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F6] text-xs font-medium text-[#1F1915] shadow-sm transition-all"
          >
            <History size={13} />
            <span className="hidden sm:inline">Logs</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F6] text-xs font-medium text-[#1F1915] shadow-sm transition-all"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin text-[#2B2FE0]" />
            ) : (
              <Save size={13} />
            )}
            <span>Save</span>
          </button>

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            disabled={executing}
            className="btn-primary-blue py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-warm-md"
          >
            {executing ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Running DAG...</span>
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" />
                <span>Execute Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main React Flow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#FAF9F6]"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1.2}
            color="#DDD9D1"
          />
          <Controls className="!bg-[#FFFFFE] !border !border-[#EBE8E2] !rounded-xl !shadow-warm-md" />
          <MiniMap
            nodeColor="#2B2FE0"
            maskColor="rgba(250, 249, 246, 0.75)"
            className="!bg-[#FFFFFE] !border !border-[#EBE8E2] !rounded-xl !shadow-warm-md"
          />
        </ReactFlow>
      </div>

      {/* Modals & Drawers */}
      <NodePaletteModal
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectNode={handleAddNode}
        nodeSchemas={nodeSchemas}
      />

      <NodeConfigDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdateParameters={handleUpdateNodeParameters}
        onDeleteNode={handleDeleteNode}
        nodeSchemas={nodeSchemas}
      />

      <ExecutionLogModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        executions={executions}
      />
    </div>
  );
}
