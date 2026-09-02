"use client";

import React from "react";
import {
  X,
  GitBranch,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
} from "lucide-react";

interface WorkflowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: any[];
  currentWorkflowId: string | null;
  onSelectWorkflow: (id: string) => void;
  onNewWorkflow: () => void;
  onDeleteWorkflow: (id: string) => void;
}

export default function WorkflowListModal({
  isOpen,
  onClose,
  workflows,
  currentWorkflowId,
  onSelectWorkflow,
  onNewWorkflow,
  onDeleteWorkflow,
}: WorkflowListModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFE] border border-[#EBE8E2] rounded-2xl shadow-warm-xl max-w-2xl w-full p-6 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE8E2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8EEFF] text-[#2B2FE0] flex items-center justify-center">
              <GitBranch size={16} />
            </div>
            <div>
              <h3 className="text-base font-serif font-medium text-[#1F1915]">
                My Saved Workflows
              </h3>
              <p className="text-xs text-[#6B6359]">
                Switch between your automation pipelines or create a new one.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onNewWorkflow();
                onClose();
              }}
              className="btn-primary-blue py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={13} />
              <span>New Pipeline</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-[#FAF9F6] text-[#8A8279] flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Workflow List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {workflows.map((wf) => {
            const isSelected = currentWorkflowId === wf.id;

            return (
              <div
                key={wf.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? "border-[#2B2FE0] bg-[#E8EEFF]/30 shadow-sm"
                    : "border-[#EBE8E2] hover:border-[#DDD9D1] hover:bg-[#FAF9F6]"
                }`}
              >
                <div
                  onClick={() => {
                    onSelectWorkflow(wf.id);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#1F1915] group-hover:text-[#2B2FE0] transition-colors">
                      {wf.name}
                    </h4>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2B2FE0] text-white">
                        Active on Canvas
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#8A8279]">
                    <span>{wf.node_count || 0} Steps / Nodes</span>
                    <span>•</span>
                    <span>
                      Updated {wf.updated_at ? new Date(wf.updated_at).toLocaleDateString() : "Recently"}
                    </span>
                    {wf.webhook_slug && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-[#2D7A5E]">
                          Webhook: {wf.webhook_slug}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => {
                      onSelectWorkflow(wf.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F6] text-xs font-medium text-[#1F1915] flex items-center gap-1 shadow-sm transition-all"
                  >
                    <FolderOpen size={13} />
                    <span>Open</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete workflow "${wf.name}"?`)) {
                        onDeleteWorkflow(wf.id);
                      }
                    }}
                    className="w-7 h-7 rounded-lg hover:bg-[#FEE2E2] text-[#8A8279] hover:text-[#DC2626] flex items-center justify-center transition-colors"
                    title="Delete workflow"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          {workflows.length === 0 && (
            <div className="text-center py-12">
              <GitBranch size={32} className="mx-auto text-[#8A8279]/50 mb-2" />
              <p className="text-sm font-medium text-[#1F1915]">No workflows created yet</p>
              <p className="text-xs text-[#8A8279] mt-0.5 mb-4">
                Create a new pipeline or load one from the templates.
              </p>
              <button
                onClick={() => {
                  onNewWorkflow();
                  onClose();
                }}
                className="btn-primary-blue py-1.5 px-4 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Plus size={13} />
                <span>Create First Workflow</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
