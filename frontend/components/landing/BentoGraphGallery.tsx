"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Activity, BarChart2, CheckCircle2, DollarSign, Layers, ShieldCheck, Zap } from "lucide-react";

export default function BentoGraphGallery() {
  // ── Animated EKG / Line Chart ──────────────────────────────────────
  const [ekgData, setEkgData] = useState<number[]>([40, 55, 60, 48, 70, 85, 92, 78, 88, 95, 82, 90]);
  const [currentTps, setCurrentTps] = useState(1420);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextVal = Math.floor(Math.random() * 40) + 60;
      setEkgData((prev) => [...prev.slice(1), nextVal]);
      setCurrentTps(Math.floor(Math.random() * 200) + 1350);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Heatmap matrix data
  const HEATMAP_DATA = [
    { model: "Claude 3.5", code: 98, reasoning: 99, rag: 94, speed: 76 },
    { model: "Groq 120B", code: 92, reasoning: 88, rag: 85, speed: 99 },
    { model: "GPT-4o", code: 94, reasoning: 95, rag: 92, speed: 84 },
    { model: "Llama 3.3", code: 96, reasoning: 89, rag: 90, speed: 89 },
  ];

  return (
    <section id="gallery" className="py-24 px-6 sm:px-8 bg-[#FAF9F6] border-b border-[#EBE8E2]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EEFF] text-[#2B2FE0] text-xs font-semibold">
            <Activity size={13} /> Live Observability Telemetry
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1F1915]">
            Telemetry & Graph Gallery
          </h2>
          <p className="text-[#4D463E] text-base leading-relaxed">
            Real-time execution telemetry, model distribution ratios, sandboxed success rates, and token throughput EKG.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* 1. Hero EKG Live Token Line Chart (Col span 2) */}
          <div className="md:col-span-2 card-editorial p-6 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8279]">
                  Live Throughput EKG
                </span>
                <h3 className="text-xl font-medium text-[#1F1915] font-serif mt-1">
                  Tokens Orchestrated / Sec
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-[#2B2FE0]">
                  {currentTps.toLocaleString()}
                </span>
                <span className="text-xs text-[#8A8279] block">tps live</span>
              </div>
            </div>

            {/* SVG Line / EKG Chart */}
            <div className="h-40 w-full relative flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 120">
                <defs>
                  <linearGradient id="ekgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2B2FE0" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2B2FE0" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d={`M 0 120 ${ekgData
                    .map((val, idx) => `L ${(idx / (ekgData.length - 1)) * 400} ${120 - val}`)
                    .join(" ")} L 400 120 Z`}
                  fill="url(#ekgGrad)"
                />
                {/* Glowing line */}
                <path
                  d={`M 0 ${120 - ekgData[0]} ${ekgData
                    .map((val, idx) => `L ${(idx / (ekgData.length - 1)) * 400} ${120 - val}`)
                    .join(" ")}`}
                  fill="none"
                  stroke="#2B2FE0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-[#8A8279] border-t border-[#EBE8E2] pt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2D7A5E] animate-pulse" />
                Redis PubSub Stream Active
              </span>
              <span>120ms Rolling Window</span>
            </div>
          </div>

          {/* 2. Radial Success Rate Gauge (Col span 1) */}
          <div className="card-editorial p-6 flex flex-col items-center justify-between text-center space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8279]">
                Verification Rate
              </span>
              <h3 className="text-base font-medium text-[#1F1915] mt-1">
                AST & Test Success
              </h3>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="#EBE8E2"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="#2D7A5E"
                  strokeWidth="10"
                  strokeDasharray="351.8"
                  strokeDashoffset="21"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-mono font-bold text-[#1F1915]">
                  99.4%
                </span>
                <span className="text-[10px] text-[#2D7A5E] font-medium">Passed</span>
              </div>
            </div>

            <p className="text-xs text-[#6B6359]">
              Docker sandboxes execute generated scripts before delivery.
            </p>
          </div>

          {/* 3. Metric Counter Card (Col span 1) */}
          <div className="card-editorial p-6 flex flex-col justify-between space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8279]">
              Total Orchestrated
            </span>
            <div>
              <h3 className="text-4xl font-serif font-bold text-[#2B2FE0]">
                1.42B+
              </h3>
              <p className="text-xs text-[#6B6359] mt-1">
                Tokens routed across 140k autonomous DAG workflows.
              </p>
            </div>
            <div className="badge-blue text-xs w-fit">
              +38% vs Single LLM
            </div>
          </div>

          {/* 4. Model Contribution Bar Chart (Col span 2) */}
          <div className="md:col-span-2 card-editorial p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8279]">
                  Workload Distribution
                </span>
                <h3 className="text-base font-medium text-[#1F1915]">
                  Task Contribution by Specialist
                </h3>
              </div>
              <span className="badge-warm text-xs">Dynamic Routing</span>
            </div>

            {/* Animated Bars */}
            <div className="space-y-3 pt-2">
              {[
                { name: "Claude 3.5 (Logic & Architect)", pct: 38, color: "bg-[#2B2FE0]" },
                { name: "Groq 120B (Execution Stream)", pct: 28, color: "bg-[#0284C7]" },
                { name: "Llama 3.3 (Sandboxed Coder)", pct: 20, color: "bg-[#8B5CF6]" },
                { name: "GPT-4o (Multimodal Vision)", pct: 14, color: "bg-[#10B981]" },
              ].map((bar) => (
                <div key={bar.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#1F1915]">{bar.name}</span>
                    <span className="font-mono text-[#6B6359]">{bar.pct}%</span>
                  </div>
                  <div className="h-2 bg-[#FAF9F5] border border-[#EBE8E2] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${bar.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Heatmap Grid: Task Type vs Model Performance (Col span 2) */}
          <div className="md:col-span-2 card-editorial p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8279]">
                  Benchmark Matrix
                </span>
                <h3 className="text-base font-medium text-[#1F1915]">
                  Task vs. Model Score Heatmap
                </h3>
              </div>
              <span className="text-xs font-mono text-[#2B2FE0]">Evaluated Daily</span>
            </div>

            {/* Heatmap Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#EBE8E2] text-[#8A8279]">
                    <th className="pb-2 font-medium">Model</th>
                    <th className="pb-2 font-medium text-center">Code</th>
                    <th className="pb-2 font-medium text-center">Logic</th>
                    <th className="pb-2 font-medium text-center">RAG</th>
                    <th className="pb-2 font-medium text-center">Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE8E2]">
                  {HEATMAP_DATA.map((row) => (
                    <tr key={row.model}>
                      <td className="py-2.5 font-medium text-[#1F1915]">{row.model}</td>
                      {[row.code, row.reasoning, row.rag, row.speed].map((score, i) => (
                        <td key={i} className="py-2.5 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded font-mono font-semibold text-[11px] ${
                              score >= 95
                                ? "bg-[#E8EEFF] text-[#2B2FE0]"
                                : score >= 90
                                ? "bg-[#E8F4F0] text-[#2D7A5E]"
                                : "bg-[#F5F3EF] text-[#6B6359]"
                            }`}
                          >
                            {score}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
