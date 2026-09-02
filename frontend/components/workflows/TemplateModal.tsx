"use client";

import React from "react";
import {
  X,
  LayoutTemplate,
  PlayCircle,
  Brain,
  Webhook,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: any[];
  onSelectTemplate: (template: any) => void;
}

export default function TemplateModal({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
}: TemplateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFE] border border-[#EBE8E2] rounded-2xl shadow-warm-xl max-w-2xl w-full p-6 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE8E2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8EEFF] text-[#2B2FE0] flex items-center justify-center">
              <LayoutTemplate size={16} />
            </div>
            <div>
              <h3 className="text-base font-serif font-medium text-[#1F1915]">
                Pipeline Templates
              </h3>
              <p className="text-xs text-[#6B6359]">
                Choose a battle-tested automation pipeline to load onto your canvas.
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

        {/* Template List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {templates.map((tpl, i) => (
            <div
              key={i}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="p-4 rounded-xl border border-[#EBE8E2] hover:border-[#2B2FE0] hover:bg-[#FAF9F6] cursor-pointer transition-all group shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[#1F1915] group-hover:text-[#2B2FE0] transition-colors">
                    {tpl.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF9F6] text-[#6B6359] border border-[#EBE8E2]">
                    {tpl.nodes.length} Steps
                  </span>
                </div>
                <p className="text-xs text-[#6B6359] font-mono">
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2B2FE0] group-hover:translate-x-0.5 transition-transform">
                <span>Load</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
