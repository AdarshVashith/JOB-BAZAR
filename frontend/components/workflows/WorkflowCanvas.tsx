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
  FolderPlus,
  Trash2,
  AlertCircle,
} from "lucide-react";

import { WorkflowNodeComponent } from "./CustomNodes";
import NodePaletteModal from "./NodePaletteModal";
import NodeConfigDrawer from "./NodeConfigDrawer";
import ExecutionLogModal from "./ExecutionLogModal";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Pre-configured Starter Templates
const TEMPLATES = [
  {
    name: "AI Data Extraction Pipeline",
    description: "Manual Trigger → Fetch REST API → AI Agent Summary",
    nodes: [
      {
        id: "node_trigger",
        type: "custom",
        position: { x: 60, y: 160 },
        data: {
          type: "manual_trigger",
          name: "Manual Start",
          category: "Trigger",
          parameters: { test_payload: '{"topic": "Quantum Computing 2026"}' },
        },
      },
      {
        id: "node_http",
        type: "custom",
        position: { x: 380, y: 160 },
        data: {
          type: "http_request",
          name: "Fetch REST API",
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
        position: { x: 720, y: 160 },
        data: {
          type: "llm_agent",
          name: "AI Summarizer",
          category: "AI",
          parameters: {
            prompt: "Summarize the key insights from this payload in 2 bullet points:\n{{$json}}",
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
    name: "Webhook → Python Transform → Branching",
    description: "Incoming Webhook → Python Custom Transform → If/Else Condition",
    nodes: [
      {
        id: "node_webhook",
        type: "custom",
        position: { x: 60, y: 180 },
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
            code: "body = $json.get('body', {})\nresult = {'payload_len': len(str(body)), 'valid': True, 'processed_at': 1788349000}\n",
          },
        },
      },
      {
        id: "node_branch",
        type: "custom",
        position: { x: 720, y: 180 },
        data: {
          type: "condition_if",
          name: "Validate Output",
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
  {
    name: "Autonomous Code Auditor",
    description: "Manual Code Ingest → Python Analysis → AI Code Reviewer",
    nodes: [
      {
        id: "node_trigger",
        type: "custom",
        position: { x: 60, y: 160 },
        data: {
          type: "manual_trigger",
          name: "Code Input",
          category: "Trigger",
          parameters: { test_payload: '{"code": "def divide(a, b): return a / b"}' },
        },
      },
      {
        id: "node_ai",
        type: "custom",
        position: { x: 420, y: 160 },
        data: {
          type: "llm_agent",
          name: "Security Critic",
          category: "AI",
          parameters: {
            prompt: "Analyze this code for potential ZeroDivisionError or edge cases and output fixed code:\n{{$json}}",
            output_format: "text",
          },
        },
      },
    ],
    edges: [
      { id: "e1", source: "node_trigger", target: "node_ai", animated: true },
    ],
  },
];

export default function WorkflowCanvas() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<any | null>(null);
  const [workflowName, setWorkflowName] = useState("AI Data Extraction Pipeline");
  const [nodeSchemas, setNodeSchemas] = useState<any[]>([]);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(TEMPLATES[0].nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(TEMPLATES[0].edges);

  // UI Modals & Drawers
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [executions, setExecutions] = useState<any[]>([]);
  const [lastExecutionResult, setLastExecutionResult] = useState<any | null>(null);

  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  const nodeTypes = useMemo(() => ({ custom: WorkflowNodeComponent }), []);

  const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Fetch node registry schemas
  useEffect(() => {
    async function loadSchemas() {
      try {
        const res = await fetch(`${API}/workflows/nodes/registry`, {
          headers: getAuthHeaders(),
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
      const res = await fetch(`${API}/workflows`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const list = await res.json();
        setWorkflows(list);
      }
    } catch (err) {
      console.error("Failed to load workflows:", err);
    }
  }, []);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  // Load a single workflow by ID
  async function loadSingleWorkflow(id: string) {
    try {
      const res = await fetch(`${API}/workflows/${id}`, {
        headers: getAuthHeaders(),
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

  // Load template
  function loadTemplate(tpl: (typeof TEMPLATES)[0]) {
    setWorkflowName(tpl.name);
    setNodes(tpl.nodes);
    setEdges(tpl.edges);
    setCurrentWorkflow(null);
    setLastExecutionResult(null);
  }

  // Create new blank workflow
  function handleNewBlank() {
    setWorkflowName("Untitled Workflow");
    setNodes([
      {
        id: "node_trigger_init",
        type: "custom",
        position: { x: 80, y: 180 },
        data: {
          type: "manual_trigger",
          name: "Manual Start",
          category: "Trigger",
          parameters: { test_payload: "{}" },
        },
      },
    ]);
    setEdges([]);
    setCurrentWorkflow(null);
    setLastExecutionResult(null);
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
      position: { x: 260 + Math.random() * 80, y: 160 + Math.random() * 80 },
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
    setErrorBanner("");
    try {
      if (currentWorkflow?.id) {
        // Update existing
        const res = await fetch(`${API}/workflows/${currentWorkflow.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({
            name: workflowName,
            nodes,
            edges,
          }),
        });
        if (!res.ok) throw new Error("Failed to update workflow");
      } else {
        // Create new
        const res = await fetch(`${API}/workflows`, {
          method: "POST",
          headers: getAuthHeaders(),
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
        } else {
          throw new Error("Failed to save workflow");
        }
      }
      loadWorkflows();
    } catch (err: any) {
      setErrorBanner(err.message || "Failed to save workflow");
    } finally {
      setSaving(false);
    }
  }

  // Delete current workflow
  async function handleDeleteWorkflow() {
    if (!currentWorkflow?.id) {
      handleNewBlank();
      return;
    }
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    try {
      await fetch(`${API}/workflows/${currentWorkflow.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      loadWorkflows();
      handleNewBlank();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // Execute workflow with 100% direct reliability
  async function handleExecute() {
    setExecuting(true);
    setErrorBanner("");
    // Set all nodes to pulsing running status
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, executionStatus: "running" },
      }))
    );

    try {
      // Execute in-memory graph directly
      const execRes = await fetch(`${API}/workflows/execute-direct`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          name: workflowName,
          nodes,
          edges,
          workflow_id: currentWorkflow?.id,
          payload: { trigger: "manual", timestamp: Date.now() },
        }),
      });

      if (!execRes.ok) {
        const errData = await execRes.json();
        throw new Error(errData.detail || "Workflow execution failed");
      }

      const execData = await execRes.json();
      setLastExecutionResult(execData);
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

      // Refresh executions history
      if (currentWorkflow?.id) {
        fetchExecutions(currentWorkflow.id);
      } else {
        setExecutions([
          {
            id: execData.execution_id,
            status: execData.status,
            trigger_type: "manual",
            duration_ms: execData.duration_ms,
            started_at: new Date().toISOString(),
            node_results: execData.node_results,
          },
        ]);
        setIsLogsOpen(true);
      }
    } catch (err: any) {
      console.error("Execution error:", err);
      setErrorBanner(err.message || "Execution failed");
      // Reset statuses
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: { ...n.data, executionStatus: "error" },
        }))
      );
    } finally {
      setExecuting(false);
    }
  }

  // Fetch execution history for modal
  async function fetchExecutions(wfId?: string) {
    const id = wfId || currentWorkflow?.id;
    if (!id) {
      if (lastExecutionResult) {
        setExecutions([
          {
            id: lastExecutionResult.execution_id,
            status: lastExecutionResult.status,
            trigger_type: "manual",
            duration_ms: lastExecutionResult.duration_ms,
            started_at: new Date().toISOString(),
            node_results: lastExecutionResult.node_results,
          },
        ]);
        setIsLogsOpen(true);
      }
      return;
    }

    try {
      const res = await fetch(`${API}/workflows/${id}/executions`, {
        headers: getAuthHeaders(),
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
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-sm sm:text-base font-serif font-medium text-[#1F1915] bg-transparent hover:bg-[#FAF9F6] focus:bg-[#FAF9F6] border border-transparent focus:border-[#DDD9D1] rounded-lg px-2 py-1 outline-none transition-all max-w-[200px] sm:max-w-xs"
          />

          {workflows.length > 0 && (
            <select
              value={currentWorkflow?.id || ""}
              onChange={(e) => {
                if (e.target.value) loadSingleWorkflow(e.target.value);
              }}
              className="text-xs bg-[#FAF9F6] border border-[#EBE8E2] rounded-lg px-2.5 py-1 text-[#6B6359] outline-none hidden md:inline"
            >
              <option value="">Saved Workflows ({workflows.length})...</option>
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleNewBlank}
            title="Create New Blank Workflow"
            className="w-7 h-7 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F6] text-[#6B6359] flex items-center justify-center transition-all shadow-sm"
          >
            <FolderPlus size={14} />
          </button>

          {webhookUrl && (
            <div className="hidden xl:flex items-center gap-1.5 bg-[#E8F4F0] border border-[#C2E3D6] px-2.5 py-1 rounded-full text-xs text-[#2D7A5E]">
              <Webhook size={12} />
              <span className="font-mono text-[10px] truncate max-w-[120px]">
                {currentWorkflow?.webhook_slug}
              </span>
              <button
                onClick={copyWebhook}
                title="Copy Public Webhook URL"
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
          <button
            onClick={() => loadTemplate(TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)])}
            title="Load Pre-configured Template"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F6] text-xs font-medium text-[#1F1915] shadow-sm transition-all"
          >
            <LayoutTemplate size={13} className="text-[#2B2FE0]" />
            <span className="hidden sm:inline">Templates</span>
          </button>

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

      {/* Error Banner */}
      {errorBanner && (
        <div className="bg-[#FEE2E2] border-b border-[#FECACA] px-6 py-2 text-xs text-[#DC2626] flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{errorBanner}</span>
          </div>
          <button onClick={() => setErrorBanner("")} className="hover:underline">
            Dismiss
          </button>
        </div>
      )}

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
