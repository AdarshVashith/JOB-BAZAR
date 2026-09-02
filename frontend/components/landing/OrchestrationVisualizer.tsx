"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, Cpu, Zap, ShieldCheck, Activity, Compass, Code, BrainCircuit } from "lucide-react";

// ── High-Resolution Vector Brand Logos for AI Models ───────────────

function AnthropicLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.3 19L12 4.5 6.7 19h2.8l1.1-3.2h4.8l1.1 3.2h2.8zm-6-5.5l1.7-5.1 1.7 5.1h-3.4z"
        fill="#DA7756"
      />
      <circle cx="12" cy="12" r="11" stroke="#DA7756" strokeWidth="1.6" strokeOpacity="0.35" />
    </svg>
  );
}

function OpenAILogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M21.5 10.2c-.3-1.4-1.2-2.6-2.5-3.3-.3-.2-.7-.3-1-.4-.3-1.4-1.3-2.5-2.6-3.1-1.3-.6-2.9-.5-4.1.3-.4-.2-.8-.4-1.3-.4-1.4 0-2.8.7-3.6 1.8-.7 1.1-.9 2.5-.4 3.7-.3.1-.7.3-1 .5-1.2.7-2 1.9-2.3 3.3-.3 1.4.1 2.9 1 4 .3.4.7.7 1.1.9.2 1.4 1.1 2.6 2.4 3.3 1.3.7 2.9.7 4.2.1.4.3.9.5 1.4.5 1.5 0 2.9-.8 3.7-2 .8-1.2.9-2.6.4-3.9.3-.1.6-.3.9-.5 1.2-.7 2-1.9 2.3-3.3.4-1.3 0-2.8-.8-3.9zm-8.3 10.3c-.8 0-1.6-.3-2.2-.8l2.6-1.5c.2-.1.3-.3.3-.5v-3.6l3.1 1.8v3.1c-.8.9-2.3 1.5-3.8 1.5zm-6.7-3.8c-.5-.8-.7-1.8-.5-2.7l2.6 1.5c.2.1.4.1.6 0l3.1-1.8v3.6l-2.7 1.6c-1.2-.4-2.3-1.1-3.1-2.2zm-1.1-6.8c.3-.8.9-1.5 1.7-2l2.6 1.5c.2.1.3.3.3.5v3.6L6.9 11.7V8.6c-.6.4-1.1.8-1.5 1.3zm12.3-1.4l-3.1 1.8V8.2l2.7-1.6c1.2.4 2.3 1.1 3.1 2.2.5.8.7 1.8.5 2.7l-2.6-1.5c-.2-.1-.4-.1-.6 0zm2.2 4.7c-.3.8-.9 1.5-1.7 2l-2.6-1.5c-.2-.1-.3-.3-.3-.5V11l3.1 1.8v3.1c.6-.4 1.1-.8 1.5-1.3v-1.4zM9.9 13.7l-1.9-1.1 1.9-1.1 1.9 1.1-1.9 1.1z"
        fill="#10A37F"
      />
    </svg>
  );
}

function GoogleGeminiLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
        fill="url(#geminiGradFull)"
      />
      <defs>
        <linearGradient id="geminiGradFull" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GroqLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#F55036" />
      <path
        d="M16.5 8.5C15.5 7.5 14 7 12 7C8.7 7 6.5 9.2 6.5 12.5C6.5 15.8 8.7 18 12 18C15 18 17 16.2 17 13.5H12V11.5H19C19.2 15.8 16 20 12 20C7.5 20 4.5 16.8 4.5 12.5C4.5 8.2 7.5 5 12 5C14.8 5 16.8 5.8 18.2 7.2L16.5 8.5Z"
        fill="white"
      />
    </svg>
  );
}

function MetaLlamaLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4.5C8.5 4.5 6 6.8 6 10C6 13.2 8.5 15.5 12 15.5C15.5 15.5 18 13.2 18 10C18 6.8 15.5 4.5 12 4.5Z"
        stroke="#0668E1"
        strokeWidth="2.5"
      />
      <circle cx="9.5" cy="9.5" r="1.5" fill="#0668E1" />
      <circle cx="14.5" cy="9.5" r="1.5" fill="#0668E1" />
      <path d="M7 19.5C9 18 15 18 17 19.5" stroke="#0668E1" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function DeepSeekLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 14C4 8.5 8.5 4 14 4C19.5 4 21 8 20 12C19 16 15 19 11 19C7 19 4 17 4 14Z"
        fill="#1D4ED8"
      />
      <path
        d="M13 8C13 8 16 9.5 15 12.5C14 15.5 11 16 9 15"
        stroke="#93C5FD"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="9" r="1.5" fill="white" />
    </svg>
  );
}

interface ModelNode {
  id: string;
  name: string;
  role: string;
  color: string;
  angle: number; // in degrees
  distance: number; // in px
  tooltipPlacement: "top" | "bottom" | "left" | "right";
  logo: React.ComponentType<{ className?: string }>;
  stats: {
    latency: string;
    tokensPerSec: string;
    currentTask: string;
    specialization: string;
    context: string;
  };
}

const MODEL_NODES: ModelNode[] = [
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    role: "Architect & Synthesis",
    color: "#DA7756",
    angle: 0,
    distance: 175,
    tooltipPlacement: "left",
    logo: AnthropicLogo,
    stats: {
      latency: "142ms",
      tokensPerSec: "78 t/s",
      currentTask: "Synthesizing AST & DAG logic",
      specialization: "Complex reasoning & code architecture",
      context: "200k tokens",
    },
  },
  {
    id: "groq",
    name: "Groq LPU 120B",
    role: "Ultra-Fast Execution",
    color: "#F55036",
    angle: 60,
    distance: 175,
    tooltipPlacement: "top",
    logo: GroqLogo,
    stats: {
      latency: "28ms",
      tokensPerSec: "840 t/s",
      currentTask: "Live stream inference loop",
      specialization: "Low-latency dispatch & execution",
      context: "128k tokens",
    },
  },
  {
    id: "gpt4o",
    name: "GPT-4o",
    role: "Multimodal Research",
    color: "#10A37F",
    angle: 120,
    distance: 175,
    tooltipPlacement: "top",
    logo: OpenAILogo,
    stats: {
      latency: "190ms",
      tokensPerSec: "94 t/s",
      currentTask: "OCR analysis & vision grounding",
      specialization: "Multimodal & web data extraction",
      context: "128k tokens",
    },
  },
  {
    id: "llama",
    name: "Llama 3.3 70B",
    role: "Sandboxed Coder",
    color: "#0668E1",
    angle: 180,
    distance: 175,
    tooltipPlacement: "right",
    logo: MetaLlamaLogo,
    stats: {
      latency: "84ms",
      tokensPerSec: "340 t/s",
      currentTask: "Generating Python scripts & tests",
      specialization: "Docker safe containerized code",
      context: "128k tokens",
    },
  },
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    role: "Long-Context RAG",
    color: "#9B72CB",
    angle: 240,
    distance: 175,
    tooltipPlacement: "bottom",
    logo: GoogleGeminiLogo,
    stats: {
      latency: "175ms",
      tokensPerSec: "110 t/s",
      currentTask: "Retrieving 1M token RAG corpus",
      specialization: "Massive context document retrieval",
      context: "2M tokens",
    },
  },
  {
    id: "deepseek",
    name: "DeepSeek R1",
    role: "Formal Math & Critic",
    color: "#1D4ED8",
    angle: 300,
    distance: 175,
    tooltipPlacement: "bottom",
    logo: DeepSeekLogo,
    stats: {
      latency: "210ms",
      tokensPerSec: "62 t/s",
      currentTask: "Logical constraint verification",
      specialization: "Mathematical verification & critic",
      context: "64k tokens",
    },
  },
];

export default function OrchestrationVisualizer() {
  const [selectedNode, setSelectedNode] = useState<ModelNode | null>(MODEL_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<ModelNode | null>(null);

  return (
    <section id="visualizer" className="py-24 px-6 sm:px-8 bg-[#FAF9F6] border-b border-[#EBE8E2]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EEFF] text-[#2B2FE0] text-xs font-semibold">
            <Compass size={13} /> Live Conductor Core
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1F1915]">
            The Orchestration Matrix
          </h2>
          <p className="text-[#4D463E] text-base leading-relaxed">
            The Conductor Supervisor dynamically delegates subtasks to specialist models across a high-speed Redis message bus. Hover over any model logo to inspect real-time telemetry.
          </p>
        </div>

        {/* Visualizer Stage Container */}
        <div className="relative min-h-[640px] w-full rounded-2xl bg-[#FFFFFE] border border-[#EBE8E2] shadow-warm-lg p-8 flex flex-col items-center justify-center">
          {/* Subtle Concentric Orbital Rings */}
          <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-[#DDD9D1]/70 pointer-events-none" />
          <div className="absolute w-[470px] h-[470px] rounded-full border border-[#EBE8E2]/50 pointer-events-none" />

          {/* SVG Animated Connector Beams */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2B2FE0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2B2FE0" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {MODEL_NODES.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              return (
                <g key={node.id}>
                  {/* Base connector line */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${Math.cos(rad) * node.distance}px)`}
                    y2={`calc(50% + ${Math.sin(rad) * node.distance}px)`}
                    stroke="#EBE8E2"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Glowing active line */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${Math.cos(rad) * node.distance}px)`}
                    y2={`calc(50% + ${Math.sin(rad) * node.distance}px)`}
                    stroke="url(#beamGradient)"
                    strokeWidth="2.5"
                    opacity={hoveredNode?.id === node.id || selectedNode?.id === node.id ? "1" : "0.3"}
                  />
                </g>
              );
            })}
          </svg>

          {/* Central Conductor Core Node */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 w-28 h-28 rounded-3xl bg-[#2B2FE0] text-white flex flex-col items-center justify-center p-3 shadow-warm-lg cursor-pointer border-2 border-white ring-4 ring-[#2B2FE0]/15"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center mb-1">
              <BrainCircuit size={24} className="text-white" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              CONDUCTOR
            </span>
            <span className="text-[9px] text-[#E8EEFF] opacity-80">Supervisor Core</span>
          </motion.div>

          {/* Orbiting Specialist Model Nodes */}
          {MODEL_NODES.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const isHovered = hoveredNode?.id === node.id;
            const isSelected = selectedNode?.id === node.id;
            const LogoComponent = node.logo;

            // Compute smart tooltip positioning classes based on node placement
            const tooltipPositionClass =
              node.tooltipPlacement === "bottom"
                ? "top-full left-1/2 -translate-x-1/2 mt-3"
                : node.tooltipPlacement === "top"
                ? "bottom-full left-1/2 -translate-x-1/2 mb-3"
                : node.tooltipPlacement === "left"
                ? "right-full top-1/2 -translate-y-1/2 mr-3"
                : "left-full top-1/2 -translate-y-1/2 ml-3";

            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${Math.cos(rad) * node.distance}px - 36px)`,
                  top: `calc(50% + ${Math.sin(rad) * node.distance}px - 36px)`,
                }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node)}
                className="z-30 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.18 }}
                  whileTap={{ scale: 0.94 }}
                  className={`w-[72px] h-[72px] rounded-2xl bg-[#FFFFFE] border-2 flex items-center justify-center shadow-warm transition-all ${
                    isSelected
                      ? "border-[#2B2FE0] ring-4 ring-[#2B2FE0]/15 shadow-warm-lg"
                      : "border-[#EBE8E2] hover:border-[#2B2FE0]"
                  }`}
                >
                  {/* Large Official Model Logo */}
                  <LogoComponent className="w-10 h-10 object-contain transition-transform group-hover:scale-105" />
                </motion.div>

                {/* Smart Placed Live Tooltip Card on Hover */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute ${tooltipPositionClass} w-64 p-4 rounded-xl bg-[#FFFFFE] border border-[#DDD9D1] shadow-2xl z-50 text-left pointer-events-none`}
                  >
                    <div className="flex items-center gap-2.5 pb-2 border-b border-[#EBE8E2]">
                      <LogoComponent className="w-5 h-5" />
                      <div>
                        <span className="text-xs font-semibold text-[#1F1915] block">
                          {node.name}
                        </span>
                        <span className="text-[10px] text-[#8A8279]">
                          {node.role}
                        </span>
                      </div>
                      <span className="badge-safety text-[9px] ml-auto">Active</span>
                    </div>
                    <div className="mt-2.5 space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#6B6359]">
                        <span>Latency:</span>
                        <span className="font-mono font-semibold text-[#1F1915]">
                          {node.stats.latency}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#6B6359]">
                        <span>Throughput:</span>
                        <span className="font-mono font-semibold text-[#2B2FE0]">
                          {node.stats.tokensPerSec}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#6B6359]">
                        <span>Context:</span>
                        <span className="font-mono text-[#1F1915]">
                          {node.stats.context}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4D463E] pt-1.5 border-t border-[#EBE8E2]">
                        <span className="font-semibold text-[#2B2FE0]">Task:</span>{" "}
                        {node.stats.currentTask}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* Active Model Live Spec Banner in Footer */}
          {selectedNode && (
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#FAF9F6]/95 backdrop-blur-sm rounded-xl p-3.5 border border-[#EBE8E2] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                {(() => {
                  const ActiveLogo = selectedNode.logo;
                  return <ActiveLogo className="w-5 h-5" />;
                })()}
                <span className="font-semibold text-[#1F1915]">
                  {selectedNode.name}
                </span>
                <span className="text-[#8A8279]">({selectedNode.role})</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#4D463E]">
                <span>
                  <strong>Specialization:</strong> {selectedNode.stats.specialization}
                </span>
                <span className="hidden md:inline">
                  <strong>Task:</strong> {selectedNode.stats.currentTask}
                </span>
              </div>
              <div className="badge-blue text-[11px]">
                {selectedNode.stats.tokensPerSec}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
