"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShieldCheck, Cpu, Database, Network, Zap } from "lucide-react";

const statuses = [
  { label: "Infrastructure", value: "Verified", icon: ShieldCheck, color: "safety" },
  { label: "Redis Bus", value: "Connected", icon: Network, color: "safety" },
  { label: "RAG Pipeline", value: "Active", icon: Database, color: "blue" },
  { label: "WebSocket", value: "Live Stream", icon: Zap, color: "blue" },
  { label: "LLM Engine", value: "Groq (120B)", icon: Cpu, color: "warm" },
];

export default function Hero() {
  const [activeStatus, setActiveStatus] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatus((prev) => (prev + 1) % statuses.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-[#EBE8E2] bg-[#FAF9F5] px-8 py-10">
      {/* Subtle Warm & Blue Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8EEFF]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EEFF] border border-[#0000CD]/20 text-[#0000CD] text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0000CD]" />
          AI Safety & Agent Orchestration
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl md:text-4xl font-medium tracking-tight text-[#1F1915] font-serif leading-tight"
        >
          Thoughtful Multi-Agent Orchestration
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mt-3 text-[#4D463E] text-base leading-relaxed max-w-2xl"
        >
          Decompose complex goals into dependency-aware DAGs. Specialist agents plan,
          research, write sandboxed code, and critique outputs with transparent observability.
        </motion.p>

        {/* System telemetry pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2.5 mt-6"
        >
          {statuses.map((status, index) => {
            const Icon = status.icon;
            const isSelected = activeStatus === index;

            return (
              <div
                key={status.label}
                className={`
                  flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${
                    status.color === "safety"
                      ? "bg-[#E8F4F0] border-[#C2E3D6] text-[#2D7A5E]"
                      : status.color === "blue"
                      ? "bg-[#E8EEFF] border-[#C5D4FF] text-[#0000CD]"
                      : "bg-[#FFFFFE] border-[#EBE8E2] text-[#4D463E] shadow-sm"
                  }
                  ${isSelected ? "ring-2 ring-[#0000CD]/30 shadow-sm" : ""}
                `}
              >
                <Icon size={14} />
                <span className="opacity-75">{status.label}:</span>
                <span className="font-semibold">{status.value}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
