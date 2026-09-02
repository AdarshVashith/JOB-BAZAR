"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  PlayCircle,
  Webhook,
  Clock,
  Globe,
  Code2,
  Brain,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  manual_trigger: PlayCircle,
  webhook_trigger: Webhook,
  cron_trigger: Clock,
  http_request: Globe,
  code_function: Code2,
  llm_agent: Brain,
  condition_if: GitBranch,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  Trigger: { bg: "bg-[#E8F4F0]", text: "text-[#2D7A5E]", border: "border-[#C2E3D6]", badge: "bg-[#2D7A5E]" },
  Action: { bg: "bg-[#E8EEFF]", text: "text-[#2B2FE0]", border: "border-[#C5D4FF]", badge: "bg-[#2B2FE0]" },
  Transform: { bg: "bg-[#F3E8FF]", text: "text-[#7C3AED]", border: "border-[#DDD6FE]", badge: "bg-[#7C3AED]" },
  AI: { bg: "bg-[#FEF3C7]", text: "text-[#B45309]", border: "border-[#FDE68A]", badge: "bg-[#D97706]" },
  Logic: { bg: "bg-[#FEE2E2]", text: "text-[#B91C1C]", border: "border-[#FECACA]", badge: "bg-[#DC2626]" },
};

export const WorkflowNodeComponent = memo(({ id, data, selected }: NodeProps<any>) => {
  const nodeType = data.type || "http_request";
  const category = data.category || "Action";
  const name = data.name || data.label || "Workflow Node";
  const parameters = data.parameters || {};
  const status = data.executionStatus; // 'running' | 'success' | 'error' | undefined

  const IconComponent = ICON_MAP[nodeType] || Sparkles;
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Action;

  // Render parameters summary subtitle
  let subtitle = "";
  if (nodeType === "http_request") {
    subtitle = `${parameters.method || "GET"} ${parameters.url || "https://..."}`;
  } else if (nodeType === "llm_agent") {
    subtitle = (parameters.prompt || "AI Prompt Template").slice(0, 32) + "...";
  } else if (nodeType === "code_function") {
    subtitle = "Python Custom Script";
  } else if (nodeType === "webhook_trigger") {
    subtitle = "HTTP Webhook Listener";
  } else if (nodeType === "cron_trigger") {
    subtitle = parameters.cron_expression || "Scheduled Trigger";
  } else if (nodeType === "condition_if") {
    subtitle = `If ${parameters.field || "ok"} ${parameters.operator || "is_truthy"}`;
  }

  return (
    <div
      className={`
        relative w-64 rounded-xl border bg-[#FFFFFE] shadow-warm-md transition-all duration-200
        ${selected ? "ring-2 ring-[#2B2FE0] border-[#2B2FE0] shadow-warm-lg" : "border-[#EBE8E2] hover:border-[#DDD9D1]"}
        ${status === "running" ? "ring-2 ring-[#2B2FE0] animate-pulse" : ""}
        ${status === "success" ? "border-[#2D7A5E] ring-1 ring-[#2D7A5E]/40" : ""}
        ${status === "error" ? "border-[#DC2626] ring-1 ring-[#DC2626]/40" : ""}
      `}
    >
      {/* Target handle for input connections (if not trigger) */}
      {category !== "Trigger" && (
        <Handle
          type="target"
          position={Position.Left}
          id="main"
          className="!w-3 !h-3 !bg-[#2B2FE0] !border-2 !border-white shadow-sm"
        />
      )}

      {/* Node Header */}
      <div className="p-3 border-b border-[#F5F2EB] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
            <IconComponent size={15} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#1F1915] leading-tight truncate max-w-[130px]">
              {name}
            </h4>
            <span className="text-[10px] text-[#8A8279] uppercase font-medium tracking-wider">
              {category}
            </span>
          </div>
        </div>

        {/* Status indicator badge */}
        <div>
          {status === "running" && (
            <Loader2 size={14} className="text-[#2B2FE0] animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 size={14} className="text-[#2D7A5E]" />
          )}
          {status === "error" && (
            <AlertCircle size={14} className="text-[#DC2626]" />
          )}
          {!status && (
            <span className={`w-2 h-2 rounded-full ${colors.badge} inline-block opacity-60`} />
          )}
        </div>
      </div>

      {/* Node Body / Subtitle */}
      <div className="p-3 bg-[#FAF9F6] rounded-b-xl">
        <p className="text-[11px] text-[#6B6359] font-mono truncate">
          {subtitle || "Click to configure parameters"}
        </p>
      </div>

      {/* Source handles for output connections */}
      {nodeType === "condition_if" ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            style={{ top: "35%" }}
            className="!w-3 !h-3 !bg-[#2D7A5E] !border-2 !border-white shadow-sm"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            style={{ top: "65%" }}
            className="!w-3 !h-3 !bg-[#DC2626] !border-2 !border-white shadow-sm"
          />
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          id="main"
          className="!w-3 !h-3 !bg-[#2B2FE0] !border-2 !border-white shadow-sm"
        />
      )}
    </div>
  );
});

WorkflowNodeComponent.displayName = "WorkflowNodeComponent";
