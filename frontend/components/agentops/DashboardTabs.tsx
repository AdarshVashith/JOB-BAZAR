"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AgentGraph from "./AgentGraph";
import FilesPanel from "./FilesPanel";
import GoalRunner from "./GoalRunner";
import LogsPanel from "./LogsPanel";
import OutputTerminal from "./OutputTerminal";
import UploadPanel from "./UploadPanel";
import { LayoutDashboard, Radio, Network, FolderCode, Terminal, UploadCloud } from "lucide-react";

const TABS = [
  { id: "Overview", label: "Overview", icon: LayoutDashboard },
  { id: "Live Feed", label: "Live Feed", icon: Radio },
  { id: "Graph", label: "Agent DAG", icon: Network },
  { id: "Files", label: "Artifacts", icon: FolderCode },
  { id: "Logs", label: "Audit Logs", icon: Terminal },
  { id: "Uploads", label: "RAG Context", icon: UploadCloud },
];

export interface AgentEvent {
  node: string;
  messages: string[];
  chunks?: {
    source: string;
    content: string;
    distance: number;
  }[];
  approved?: boolean;
  plan?: any[];
  error?: string;
  event?: string;
  agent?: string;
  similarity?: number;
  distance?: number;
  threshold?: number;
  sources?: string[];
}

const COLORS: Record<string, { text: string; bg: string; border: string }> = {
  supervisor: { text: "text-[#7C3AED]", bg: "bg-[#F3E8FF]", border: "border-[#DDD6FE]" },
  planner: { text: "text-[#0D9488]", bg: "bg-[#CCFBF1]", border: "border-[#99F6E4]" },
  researcher: { text: "text-[#0284C7]", bg: "bg-[#E0F2FE]", border: "border-[#BAE6FD]" },
  coder: { text: "text-[#0000CD]", bg: "bg-[#E8EEFF]", border: "border-[#C5D4FF]" },
  critic: { text: "text-[#D97706]", bg: "bg-[#FEF3C7]", border: "border-[#FDE68A]" },
  system: { text: "text-[#DC2626]", bg: "bg-[#FEE2E2]", border: "border-[#FECACA]" },
  github: { text: "text-[#2D2825]", bg: "bg-[#F5F3EF]", border: "border-[#EBE8E2]" },
};

const ICONS: Record<string, string> = {
  supervisor: "🧠",
  planner: "📋",
  researcher: "🔍",
  coder: "💻",
  critic: "⚖️",
  system: "⚠️",
  github: "🐙",
};

export default function DashboardTabs() {
  const [active, setActive] = useState("Overview");
  const [runId, setRunId] = useState<string | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [contextFiles, setContextFiles] = useState<string[]>([]);

  useEffect(() => {
    loadUploadedFiles();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("contextFiles");
    if (saved) {
      try {
        setContextFiles(JSON.parse(saved));
      } catch {
        localStorage.removeItem("contextFiles");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contextFiles", JSON.stringify(contextFiles));
  }, [contextFiles]);

  const loadUploadedFiles = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploaded-files`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setUploadedFiles(data.files ?? []);
    } catch (err) {
      console.error("Failed loading uploaded files", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Navigation Tabs */}
      <div className="flex border-b border-[#EBE8E2] gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] whitespace-nowrap
                ${
                  isActive
                    ? "border-[#0000CD] text-[#0000CD] bg-[#E8EEFF]/40"
                    : "border-transparent text-[#6B6359] hover:text-[#1F1915] hover:bg-[#F5F3EF]/60"
                }
              `}
            >
              <Icon size={16} className={isActive ? "text-[#0000CD]" : "text-[#8A8279]"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            {/* OVERVIEW: Goal Input + Output Terminal */}
            {active === "Overview" && (
              <div className="space-y-6">
                <GoalRunner
                  runId={runId}
                  setRunId={setRunId}
                  events={events}
                  setEvents={setEvents}
                  status={status}
                  setStatus={setStatus}
                  contextFiles={contextFiles}
                />
                <OutputTerminal events={events} status={status} />
              </div>
            )}

            {/* LIVE FEED */}
            {active === "Live Feed" && (
              <div className="space-y-4">
                <div className="card-editorial px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-base font-medium text-[#1F1915]">Live Agent Feed</h3>
                    <p className="text-xs text-[#6B6359] mt-0.5">
                      Real-time stream of agent thoughts, decisions, and outputs.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {status === "running" && (
                      <span className="badge-blue animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-[#0000CD]" />
                        Running
                      </span>
                    )}
                    {status === "done" && (
                      <span className="badge-safety">
                        ✓ Completed
                      </span>
                    )}
                    {status === "error" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F2] border border-[#F5C2C2] text-[#D84C4C] text-xs font-medium">
                        ✗ Error
                      </span>
                    )}
                    {status === "idle" && (
                      <span className="badge-warm">
                        Idle
                      </span>
                    )}
                    <span className="text-xs text-[#8A8279] font-mono">
                      {events.length} events
                    </span>
                  </div>
                </div>

                <div className="card-editorial p-6">
                  {events.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-[#6B6359] text-sm">
                        No active workflow events yet.
                      </p>
                      <button
                        onClick={() => setActive("Overview")}
                        className="mt-3 text-sm text-[#0000CD] font-medium hover:underline"
                      >
                        Enter a goal on the Overview page →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                      {events.map((evt, i) => {
                        const node = evt.node ?? evt.agent ?? "system";
                        const conf = COLORS[node] ?? { text: "text-[#1F1915]", bg: "bg-[#F5F3EF]", border: "border-[#EBE8E2]" };
                        const icon = ICONS[node] ?? "•";

                        return (
                          <div
                            key={i}
                            className="card-research flex gap-3.5 items-start transition-all hover:shadow-warm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#EBE8E2] flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-sm">
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${conf.bg} ${conf.text} ${conf.border}`}>
                                  {node}
                                </span>
                                {evt.approved && (
                                  <span className="text-xs text-[#2D7A5E] font-medium bg-[#E8F4F0] px-2 py-0.5 rounded border border-[#C2E3D6]">
                                    ✓ Verified
                                  </span>
                                )}
                              </div>
                              {(evt.event ?? evt.messages?.[0]) && (
                                <p className="text-[#2D2825] text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                  {evt.event ?? evt.messages?.[0]}
                                </p>
                              )}
                              {evt.plan && (
                                <div className="mt-3 space-y-2">
                                  {evt.plan.map((task: any) => (
                                    <div
                                      key={task.id}
                                      className="rounded-lg border border-[#EBE8E2] bg-[#FAF9F5] p-3 text-xs"
                                    >
                                      <div className="flex items-center justify-between font-medium">
                                        <span className="text-[#1F1915] font-mono">{task.id}</span>
                                        <span className="uppercase text-[#8A8279] text-[10px] tracking-wider">{task.assigned_to}</span>
                                      </div>
                                      <p className="mt-1 text-[#4D463E]">{task.task}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {evt.error && (
                                <p className="text-[#D84C4C] text-xs mt-1.5 font-medium bg-[#FDF2F2] p-2 rounded border border-[#F5C2C2]">
                                  {evt.error}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {active === "Graph" && <AgentGraph events={events} />}
            {active === "Files" && <FilesPanel />}
            {active === "Logs" && <LogsPanel events={events} />}
            {active === "Uploads" && (
              <UploadPanel
                uploadedFiles={uploadedFiles}
                contextFiles={contextFiles}
                setContextFiles={setContextFiles}
                onRunWithFiles={() => setActive("Overview")}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
