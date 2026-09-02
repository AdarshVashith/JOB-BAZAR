"use client";

import React, { useState } from "react";
import {
  PlayCircle,
  Webhook,
  Clock,
  Globe,
  Code2,
  Brain,
  GitBranch,
  X,
  Search,
  Plus,
} from "lucide-react";

interface NodePaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (nodeType: string) => void;
  nodeSchemas: any[];
}

const ICON_MAP: Record<string, any> = {
  manual_trigger: PlayCircle,
  webhook_trigger: Webhook,
  cron_trigger: Clock,
  http_request: Globe,
  code_function: Code2,
  llm_agent: Brain,
  condition_if: GitBranch,
};

export default function NodePaletteModal({
  isOpen,
  onClose,
  onSelectNode,
  nodeSchemas,
}: NodePaletteModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Trigger", "Action", "Transform", "AI", "Logic"];

  const filtered = nodeSchemas.filter((n) => {
    const matchCat = activeCategory === "All" || n.category === activeCategory;
    const matchSearch =
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFE] border border-[#EBE8E2] rounded-2xl shadow-warm-xl max-w-xl w-full p-6 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE8E2]">
          <div>
            <h3 className="text-lg font-serif font-medium text-[#1F1915]">
              Add Step to Workflow
            </h3>
            <p className="text-xs text-[#6B6359] mt-0.5">
              Select a trigger, API action, AI reasoning agent, or transform logic.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#FAF9F6] text-[#8A8279] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Input */}
        <div className="pt-4 relative">
          <Search size={15} className="absolute left-3.5 top-7 text-[#8A8279]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes (e.g. HTTP, AI Agent, Webhook)..."
            className="w-full bg-[#FAF9F6] border border-[#DDD9D1] focus:border-[#2B2FE0] focus:ring-2 focus:ring-[#2B2FE0]/15 rounded-xl pl-10 pr-4 py-2 text-xs text-[#1F1915] outline-none"
            autoFocus
          />
        </div>

        {/* Categories Tab */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeCategory === c
                  ? "bg-[#2B2FE0] text-white shadow-sm"
                  : "bg-[#FAF9F6] text-[#6B6359] hover:bg-[#F0EEE6]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Node Grid */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-1">
          {filtered.map((node) => {
            const IconComponent = ICON_MAP[node.type] || Globe;
            return (
              <div
                key={node.type}
                onClick={() => {
                  onSelectNode(node.type);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-[#EBE8E2] hover:border-[#2B2FE0] hover:bg-[#FAF9F6] cursor-pointer transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E8EEFF] text-[#2B2FE0] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <IconComponent size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1F1915]">
                        {node.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#FAF9F6] text-[#8A8279] border border-[#EBE8E2]">
                        {node.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6359] line-clamp-1 mt-0.5">
                      {node.description}
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-[#FAF9F6] group-hover:bg-[#2B2FE0] group-hover:text-white text-[#8A8279] flex items-center justify-center transition-colors">
                  <Plus size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
