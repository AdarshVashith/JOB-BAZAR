"use client";

import { useRef } from "react";
import { AgentEvent } from "./DashboardTabs";
import { Play, Square, RotateCcw, CheckCircle2, AlertCircle, Sparkles, Paperclip } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Props {
  runId: string | null;
  setRunId: (id: string | null) => void;
  events: AgentEvent[];
  setEvents: (fn: (prev: AgentEvent[]) => AgentEvent[]) => void;
  status: "idle" | "running" | "done" | "error";
  setStatus: (s: "idle" | "running" | "done" | "error") => void;
  contextFiles?: string[];
}

export default function GoalRunner({
  runId,
  setRunId,
  events,
  setEvents,
  status,
  setStatus,
  contextFiles,
}: Props) {
  const goalRef = useRef<HTMLTextAreaElement>(null);
  const runningRef = useRef(false);
  const wsRef = useRef<WebSocket | null>(null);
  const running = status === "running";

  function stop() {
    wsRef.current?.close();
    runningRef.current = false;
    setStatus("idle");
  }

  function reset() {
    stop();
    setRunId(null);
    setEvents(() => []);
    setStatus("idle");
    if (goalRef.current) goalRef.current.value = "";
  }

  async function handleRun() {
    const goal = goalRef.current?.value.trim();
    if (!goal || running) return;
    runningRef.current = true;
    setEvents(() => []);
    setRunId(null);
    setStatus("running");

    try {
      const res = await fetch(`${API}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ goal, context_files: contextFiles ?? [] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("RUN RESPONSE:", data);
      if (data.github) {
        setEvents(() => [
          {
            node: "github",
            messages: [data.result],
          },
        ]);

        setStatus("done");
        runningRef.current = false;
        return;
      }

      const { run_id } = data;
      setRunId(run_id);

      const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";
      const ws = new WebSocket(`${WS_URL}/ws/${run_id}`);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        const event = JSON.parse(e.data);
        console.log("WS EVENT:", event);

        if (event.type === "done") {
          setStatus("done");
          runningRef.current = false;
          ws.close();
          return;
        }

        if (event.error) {
          setStatus("error");
          runningRef.current = false;
          ws.close();
          return;
        }

        setEvents((prev) => [...prev, event]);
      };

      ws.onerror = () => {
        setStatus("error");
        runningRef.current = false;
      };
    } catch (err) {
      console.error(err);
      setStatus("error");
      runningRef.current = false;
    }
  }

  return (
    <div className="bg-[#FFFFFE] border border-[#EBE8E2] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-medium text-[#1F1915] font-serif flex items-center gap-2">
            <Sparkles size={18} className="text-[#0000CD]" />
            Multi-Agent Goal Execution
          </h2>
          <p className="text-sm text-[#6B6359] mt-0.5">
            Describe your objective. Specialist agents will plan, research, write sandboxed code, and critique.
          </p>
        </div>
        
        {/* Safety badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4F0] border border-[#C2E3D6] text-[#2D7A5E] text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A5E]" />
          Sandboxed Execution
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={goalRef}
          disabled={running}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleRun();
          }}
          placeholder={`Describe your goal in plain English (e.g., "Build a weather forecast CLI with caching")

Specialist Shortcuts:
• /planner     → Create DAG execution plan only
• /researcher  → Perform web search & synthesis
• /coder       → Generate and execute verified code
• /critic      → Security & quality verification
• /rag         → Query uploaded context documents`}
          className="w-full h-36 rounded-lg bg-[#FAF9F5] border border-[#DDD9D1]
                     p-4 resize-none text-sm text-[#1F1915] placeholder:text-[#B5AFA5]
                     outline-none focus:border-[#0000CD] focus:ring-2 focus:ring-[#0000CD]/15
                     transition-all disabled:opacity-60 leading-relaxed font-sans"
        />
      </div>

      {contextFiles && contextFiles.length > 0 && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-[#0000CD] bg-[#E8EEFF] px-3 py-1.5 rounded-md border border-[#0000CD]/20">
          <Paperclip size={13} />
          <span className="font-medium">
            {contextFiles.length} context file{contextFiles.length > 1 ? "s" : ""}:
          </span>
          <span className="text-[#6B6359] truncate">
            {contextFiles.join(", ")}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <button
          onClick={handleRun}
          disabled={running}
          className="btn-primary-blue text-sm font-medium shadow-sm hover:shadow"
        >
          {running ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Orchestrating Workflow…
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" />
              Execute Workflow
            </>
          )}
        </button>

        <button
          onClick={stop}
          disabled={!running}
          className="btn-outline-warm text-sm hover:border-[#D84C4C] hover:text-[#D84C4C]"
        >
          <Square size={14} />
          Stop
        </button>

        <button
          onClick={reset}
          disabled={running}
          className="btn-outline-warm text-sm"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        <div className="ml-auto text-xs font-medium">
          {status === "running" && (
            <span className="badge-blue animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#0000CD]" />
              Agents Active
            </span>
          )}
          {status === "done" && (
            <span className="badge-safety">
              <CheckCircle2 size={13} />
              Goal Completed
            </span>
          )}
          {status === "error" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F2] border border-[#F5C2C2] text-[#D84C4C]">
              <AlertCircle size={13} />
              Execution Error
            </span>
          )}
        </div>
      </div>

      {running && (
        <div className="mt-4 h-1 bg-[#F5F3ED] rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-[#0000CD] to-[#1E3A8A] rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}
