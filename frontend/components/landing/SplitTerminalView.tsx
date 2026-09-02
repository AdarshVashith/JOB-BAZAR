"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Terminal, Code, CheckCircle2, Play, RefreshCw, FileText } from "lucide-react";

const TERMINAL_STEPS = [
  { agent: "SUPERVISOR", text: "Decomposing goal: 'Build async high-frequency crypto RSI indicator'" },
  { agent: "PLANNER", text: "Generated DAG plan (3 subtasks: Data Ingestion -> RSI Vectorization -> Backtester)" },
  { agent: "RESEARCHER", text: "Retrieved formulas: Relative Strength Index calculation standard 14-period SMA" },
  { agent: "CODER", text: "Generating async Python pipeline using numpy and httpx..." },
  { agent: "CODER", text: "Executing in Docker container: exit code 0, all 4 test assertions passed" },
  { agent: "CRITIC", text: "Verified: No race conditions, complexity O(n), syntax AST passed. Ready for deploy." },
];

const CODE_PREVIEW = `import numpy as np
import httpx
import asyncio

async def compute_rsi(prices: list[float], period: int = 14) -> float:
    """Computes RSI for real-time asset stream."""
    deltas = np.diff(prices)
    seed = deltas[:period]
    up = seed[seed >= 0].sum() / period
    down = -seed[seed < 0].sum() / period
    
    if down == 0:
        return 100.0
    
    rs = up / down
    rsi = 100.0 - (100.0 / (1.0 + rs))
    return float(np.round(rsi, 2))

# Verified by AI Orchestra Sandbox
if __name__ == "__main__":
    sample = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.10, 45.42]
    res = asyncio.run(compute_rsi(sample, period=4))
    print(f"RSI Indicator Result: {res}")  # Output: 70.53 (Overbought)`;

export default function SplitTerminalView() {
  const [activeTab, setActiveTab] = useState<"split" | "code" | "logs">("split");
  const [typedLines, setTypedLines] = useState<typeof TERMINAL_STEPS>([]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex < TERMINAL_STEPS.length) {
      const timer = setTimeout(() => {
        setTypedLines((prev) => [...prev, TERMINAL_STEPS[stepIndex]]);
        setStepIndex((i) => i + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => {
        setTypedLines([]);
        setStepIndex(0);
      }, 6000);
      return () => clearTimeout(resetTimer);
    }
  }, [stepIndex]);

  return (
    <section id="terminal" className="py-24 px-6 sm:px-8 bg-[#FAF9F6] border-b border-[#EBE8E2]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EEFF] text-[#2B2FE0] text-xs font-semibold mb-3">
              <Terminal size={13} /> Live Execution Stream
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1F1915]">
              Realtime Synthesis in Action
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#FFFFFE] border border-[#DDD9D1] rounded-xl p-1 gap-1 self-start shadow-sm">
            {[
              { id: "split", label: "Synchronized Split View" },
              { id: "code", label: "Rendered Artifact" },
              { id: "logs", label: "Audit Trace" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#2B2FE0] text-white shadow-sm"
                    : "text-[#6B6359] hover:text-[#1F1915]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split View Container */}
        <div className="rounded-2xl border border-[#3A3634] bg-[#1F1D1B] overflow-hidden shadow-2xl">
          {/* Top Titlebar */}
          <div className="bg-[#2A2826] border-b border-[#3A3634] px-4 py-3 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5695D]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5B55D]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#5DC97A]" />
              <span className="ml-3 text-xs font-mono text-[#B5AFA5]">
                orchestra ~ /dag/run_9824
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#8A8279]">
              <span className="flex items-center gap-1 text-[#2D7A5E]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A5E] animate-pulse" />
                Live Stream
              </span>
            </div>
          </div>

          {/* Side by Side Split Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#3A3634] min-h-[380px]">
            {/* Left: Terminal Output */}
            <div className="p-6 font-mono text-xs text-[#F5F3EF] space-y-3 overflow-y-auto max-h-[420px]">
              <p className="text-[#8A8279] text-[11px]">&gt; Initializing multi-agent orchestration session...</p>
              {typedLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="leading-relaxed"
                >
                  <span className={`font-semibold mr-2 ${
                    line.agent === "SUPERVISOR"
                      ? "text-[#7C3AED]"
                      : line.agent === "PLANNER"
                      ? "text-[#0D9488]"
                      : line.agent === "RESEARCHER"
                      ? "text-[#0284C7]"
                      : line.agent === "CODER"
                      ? "text-[#2B2FE0]"
                      : "text-[#D97706]"
                  }`}>
                    [{line.agent.toLowerCase()}]
                  </span>
                  <span>{line.text}</span>
                </motion.div>
              ))}

              {stepIndex < TERMINAL_STEPS.length && (
                <div className="flex items-center gap-2 pt-2 text-[#8A8279]">
                  <span className="w-2 h-3.5 bg-[#2B2FE0] animate-pulse inline-block" />
                  <span>orchestrating next agent node...</span>
                </div>
              )}
            </div>

            {/* Right: Rendered Output Code */}
            <div className="p-6 bg-[#161514] font-mono text-xs overflow-x-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#3A3634] mb-4 text-[#8A8279]">
                  <span className="text-[#F5F3EF] font-semibold flex items-center gap-1.5">
                    <Code size={14} className="text-[#2B2FE0]" /> rsi_calculator.py
                  </span>
                  <span className="badge-safety text-[10px]">Passed 4/4 Tests</span>
                </div>
                <pre className="text-[#F5F3EF] leading-relaxed text-xs overflow-x-auto">
                  <code>{CODE_PREVIEW}</code>
                </pre>
              </div>

              <div className="mt-4 pt-3 border-t border-[#3A3634] flex items-center justify-between text-[11px] text-[#8A8279]">
                <span>Docker Sandbox: alpine-python3.12</span>
                <span className="text-[#2D7A5E] font-semibold">Exit Code 0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
