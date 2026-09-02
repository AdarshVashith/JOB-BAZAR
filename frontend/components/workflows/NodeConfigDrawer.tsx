"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sliders,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle,
  Code2,
  Globe,
  Brain,
} from "lucide-react";

interface NodeConfigDrawerProps {
  node: any | null;
  onClose: () => void;
  onUpdateParameters: (nodeId: string, parameters: Record<string, any>) => void;
  onDeleteNode: (nodeId: string) => void;
  nodeSchemas: any[];
}

export default function NodeConfigDrawer({
  node,
  onClose,
  onUpdateParameters,
  onDeleteNode,
  nodeSchemas,
}: NodeConfigDrawerProps) {
  const [params, setParams] = useState<Record<string, any>>({});

  useEffect(() => {
    if (node) {
      setParams(node.data?.parameters || {});
    }
  }, [node]);

  if (!node) return null;

  const nodeType = node.data?.type || "http_request";
  const schema = nodeSchemas.find((s) => s.type === nodeType) || {
    name: node.data?.label || "Node Config",
    parameters: [],
  };

  const handleFieldChange = (name: string, value: any) => {
    const updated = { ...params, [name]: value };
    setParams(updated);
    onUpdateParameters(node.id, updated);
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 z-40 bg-[#FFFFFE] border-l border-[#EBE8E2] shadow-warm-xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#EBE8E2] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E8EEFF] text-[#2B2FE0] flex items-center justify-center">
            <Sliders size={15} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#1F1915]">
              {schema.name}
            </h3>
            <p className="text-[10px] text-[#8A8279]">Configure node parameters</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-[#FAF9F6] text-[#8A8279] flex items-center justify-center transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Parameter Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {schema.parameters?.map((param: any) => {
          const value = params[param.name] ?? param.default ?? "";

          return (
            <div key={param.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#4D463E]">
                  {param.label || param.name}
                </label>
                <span className="text-[9px] text-[#8A8279] uppercase font-mono">
                  {param.type}
                </span>
              </div>

              {param.type === "select" ? (
                <select
                  value={value}
                  onChange={(e) => handleFieldChange(param.name, e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#DDD9D1] focus:border-[#2B2FE0] focus:ring-2 focus:ring-[#2B2FE0]/15 rounded-lg px-3 py-2 text-xs text-[#1F1915] outline-none"
                >
                  {param.options?.map((opt: string) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : param.type === "textarea" ? (
                <textarea
                  rows={4}
                  value={value}
                  onChange={(e) => handleFieldChange(param.name, e.target.value)}
                  placeholder={param.placeholder || ""}
                  className="w-full bg-[#FAF9F6] border border-[#DDD9D1] focus:border-[#2B2FE0] focus:ring-2 focus:ring-[#2B2FE0]/15 rounded-lg p-2.5 text-xs text-[#1F1915] font-sans outline-none leading-relaxed"
                />
              ) : param.type === "code" || param.type === "json" ? (
                <textarea
                  rows={6}
                  value={typeof value === "object" ? JSON.stringify(value, null, 2) : value}
                  onChange={(e) => handleFieldChange(param.name, e.target.value)}
                  placeholder={param.placeholder || ""}
                  className="w-full bg-[#1F1915] border border-[#3E3830] text-[#00FF66] font-mono text-[11px] rounded-lg p-2.5 outline-none leading-relaxed"
                />
              ) : (
                <input
                  type={param.type === "number" ? "number" : "text"}
                  value={value}
                  onChange={(e) => handleFieldChange(param.name, e.target.value)}
                  placeholder={param.placeholder || ""}
                  className="w-full bg-[#FAF9F6] border border-[#DDD9D1] focus:border-[#2B2FE0] focus:ring-2 focus:ring-[#2B2FE0]/15 rounded-lg px-3 py-2 text-xs text-[#1F1915] outline-none"
                />
              )}

              {param.description && (
                <p className="text-[10px] text-[#8A8279]">{param.description}</p>
              )}
            </div>
          );
        })}

        {schema.parameters?.length === 0 && (
          <p className="text-xs text-[#8A8279] text-center py-8">
            This node has no configurable parameters.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#EBE8E2] bg-[#FAF9F6] flex items-center justify-between">
        <button
          onClick={() => {
            onDeleteNode(node.id);
            onClose();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
        >
          <Trash2 size={13} />
          <span>Delete Node</span>
        </button>

        <button
          onClick={onClose}
          className="btn-primary-blue py-1.5 px-4 text-xs font-medium"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}
