"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Play, ArrowRight, CheckCircle2, ShieldCheck, Terminal } from "lucide-react";

const PROMPT_PRESETS = [
  "Build an automated crypto RSI screener in Python",
  "Extract key metrics from financial PDF and plot chart",
  "Verify AST complexity and unit test an async queue",
];

export default function LiveInteractiveDemo() {
  const [prompt, setPrompt] = useState(PROMPT_PRESETS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  function runSimulation() {
    setIsSimulating(true);
    setSimulatedLogs([]);

    const steps = [
      "🧠 [Conductor] Analyzing goal -> Generated DAG with 3 subtasks",
      "⚡ [Groq 120B] Initialized ultra-fast async runner stream (18ms dispatch)",
      "💻 [Llama 3.3] Synthesizing verified Python program with test assertions",
      "🔬 [Claude 3.5] AST constraint review passed. Verified exit code 0.",
      "✓ [Success] Artifact created: rsi_screener.py · Docker sandbox verified",
    ];

    steps.forEach((st, idx) => {
      setTimeout(() => {
        setSimulatedLogs((prev) => [...prev, st]);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 600);
    });
  }

  return (
    <section className="py-24 px-6 sm:px-8 bg-[#FAF9F6]">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="badge-blue text-xs">
            Interactive Test Sandbox
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1F1915]">
            Experience the Orchestra Live
          </h2>
          <p className="text-sm text-[#4D463E]">
            Pick a prompt or customize your goal below to watch the simulated multi-model conductor in real-time.
          </p>
        </div>

        {/* Live Demo Container */}
        <div className="card-editorial p-6 sm:p-8 space-y-6 shadow-warm-lg">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {PROMPT_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  prompt === p
                    ? "border-[#2B2FE0] bg-[#E8EEFF] text-[#2B2FE0]"
                    : "border-[#EBE8E2] text-[#6B6359] hover:bg-[#FAF9F5]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Prompt Input & Run Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want the AI orchestra to build..."
              className="flex-1 bg-[#FAF9F5] border border-[#DDD9D1] focus:border-[#2B2FE0] focus:ring-2 focus:ring-[#2B2FE0]/15 rounded-xl px-4 py-3 text-sm text-[#1F1915] outline-none"
            />
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="btn-primary-blue py-3 px-6 text-sm font-semibold whitespace-nowrap shadow-sm hover:shadow"
            >
              {isSimulating ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Harmonizing Models…
                </>
              ) : (
                <>
                  <Play size={15} fill="currentColor" /> Run Live Simulation
                </>
              )}
            </button>
          </div>

          {/* Live Simulated Console */}
          <div className="rounded-xl border border-[#3A3634] bg-[#1F1D1B] p-5 font-mono text-xs text-[#F5F3EF] min-h-[160px] space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#3A3634] text-[#8A8279] text-[11px]">
              <span>orchestra ~ live-stream</span>
              <span>{isSimulating ? "Running DAG..." : "Ready"}</span>
            </div>

            {simulatedLogs.length === 0 ? (
              <p className="text-[#8A8279] italic py-8 text-center">
                Click &apos;Run Live Simulation&apos; to watch the multi-agent execution pipeline.
              </p>
            ) : (
              simulatedLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="leading-relaxed"
                >
                  {log}
                </motion.div>
              ))
            )}
          </div>

          {/* Final Launch CTA */}
          <div className="pt-4 border-t border-[#EBE8E2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6B6359] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#2D7A5E]" />
              <span>Full control room with PostgreSQL, Redis, and custom BYOK endpoints.</span>
            </div>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-[#2B2FE0] hover:bg-[#2024C2] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              Open Full Control Room <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
