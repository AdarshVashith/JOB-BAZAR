"use client";

import React, { useState } from "react";
import {
  X,
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface ExecutionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  executions: any[];
}

export default function ExecutionLogModal({
  isOpen,
  onClose,
  executions,
}: ExecutionLogModalProps) {
  const [selectedExec, setSelectedExec] = useState<any | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const current = selectedExec || (executions.length > 0 ? executions[0] : null);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFE] border border-[#EBE8E2] rounded-2xl shadow-warm-xl max-w-4xl w-full p-6 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE8E2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8EEFF] text-[#2B2FE0] flex items-center justify-center">
              <History size={16} />
            </div>
            <div>
              <h3 className="text-base font-serif font-medium text-[#1F1915]">
                Execution Runs & Trace Logs
              </h3>
              <p className="text-xs text-[#6B6359]">
                Step-by-step audit of inputs, outputs, and execution latencies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#FAF9F6] text-[#8A8279] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Split: List on Left, Trace on Right */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 overflow-hidden">
          {/* Runs list (Col 4) */}
          <div className="md:col-span-4 border-r border-[#EBE8E2] pr-3 overflow-y-auto space-y-2">
            <h4 className="text-[11px] font-semibold text-[#8A8279] uppercase tracking-wider mb-2">
              Recent Runs ({executions.length})
            </h4>

            {executions.map((exec) => {
              const isSelected = current?.id === exec.id;
              const isSuccess = exec.status === "success";

              return (
                <div
                  key={exec.id}
                  onClick={() => setSelectedExec(exec)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#2B2FE0] bg-[#E8EEFF]/30 shadow-sm"
                      : "border-[#EBE8E2] hover:bg-[#FAF9F6]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isSuccess ? (
                        <CheckCircle2 size={13} className="text-[#2D7A5E]" />
                      ) : (
                        <AlertCircle size={13} className="text-[#DC2626]" />
                      )}
                      <span className="text-xs font-semibold text-[#1F1915]">
                        {exec.trigger_type || "manual"} run
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8A8279] font-mono">
                      {exec.duration_ms}ms
                    </span>
                  </div>

                  <p className="text-[10px] text-[#8A8279] mt-1 truncate">
                    {new Date(exec.started_at).toLocaleTimeString()} · ID: {exec.id.slice(0, 8)}
                  </p>
                </div>
              );
            })}

            {executions.length === 0 && (
              <p className="text-xs text-[#8A8279] py-8 text-center">
                No executions recorded yet.
              </p>
            )}
          </div>

          {/* Trace Details (Col 8) */}
          <div className="md:col-span-8 overflow-y-auto pl-1 space-y-3">
            {current ? (
              <>
                <div className="flex items-center justify-between bg-[#FAF9F6] p-3 rounded-xl border border-[#EBE8E2]">
                  <div>
                    <span className="text-xs font-semibold text-[#1F1915]">
                      Status:{" "}
                      <span
                        className={`capitalize ${
                          current.status === "success" ? "text-[#2D7A5E]" : "text-[#DC2626]"
                        }`}
                      >
                        {current.status}
                      </span>
                    </span>
                    <p className="text-[11px] text-[#6B6359] mt-0.5">
                      Total Duration: {current.duration_ms}ms · Trigger: {current.trigger_type}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A8279]">
                    {new Date(current.started_at).toLocaleString()}
                  </span>
                </div>

                {current.error && (
                  <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-xs text-[#DC2626]">
                    <strong>Execution Error:</strong> {current.error}
                  </div>
                )}

                {/* Per-Node Results */}
                <h4 className="text-xs font-semibold text-[#1F1915] pt-2">
                  Node-by-Node Execution Trace:
                </h4>

                <div className="space-y-2">
                  {Object.entries(current.node_results || {}).map(([nodeId, res]: [string, any]) => {
                    const isExpanded = expandedNodes[nodeId] ?? true;
                    const isSuccess = res.status === "success";

                    return (
                      <div
                        key={nodeId}
                        className="border border-[#EBE8E2] rounded-xl overflow-hidden bg-[#FFFFFE]"
                      >
                        <div
                          onClick={() => toggleNode(nodeId)}
                          className="p-3 bg-[#FAF9F6] flex items-center justify-between cursor-pointer select-none hover:bg-[#F0EEE6] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {isSuccess ? (
                              <CheckCircle2 size={14} className="text-[#2D7A5E]" />
                            ) : (
                              <AlertCircle size={14} className="text-[#DC2626]" />
                            )}
                            <span className="text-xs font-mono font-medium text-[#1F1915]">
                              Node: {nodeId}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[#8A8279] font-mono">
                              {res.duration_ms || 0}ms
                            </span>
                            {isExpanded ? (
                              <ChevronDown size={14} className="text-[#8A8279]" />
                            ) : (
                              <ChevronRight size={14} className="text-[#8A8279]" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-3 space-y-2 bg-[#FFFFFE] border-t border-[#EBE8E2] text-xs">
                            {res.output && (
                              <div>
                                <span className="text-[10px] font-semibold text-[#8A8279] uppercase">
                                  Output Data:
                                </span>
                                <pre className="mt-1 p-2 bg-[#1F1915] text-[#00FF66] font-mono text-[10px] rounded-lg overflow-x-auto max-h-40">
                                  {JSON.stringify(res.output, null, 2)}
                                </pre>
                              </div>
                            )}

                            {res.error && (
                              <div className="text-[#DC2626] text-xs">
                                <strong>Error:</strong> {res.error}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-xs text-[#8A8279] text-center py-12">
                Select an execution to view per-node telemetry.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
