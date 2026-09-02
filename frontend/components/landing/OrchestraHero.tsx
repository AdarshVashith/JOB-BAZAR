"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, ShieldCheck, Sparkles, Activity, Volume2, VolumeX, Maximize2 } from "lucide-react";

export default function OrchestraHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // ── Particle / Constellation Network Canvas ────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || 600;
    };
    window.addEventListener("resize", onResize);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label?: string;
      color: string;
    }

    const models = ["Claude", "Groq", "GPT-4o", "Llama", "Gemini", "DeepSeek", "Mistral"];
    const nodes: Node[] = [];
    const count = 36;

    for (let i = 0; i < count; i++) {
      const isNamed = i < models.length;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: isNamed ? 4.5 : Math.random() * 2 + 1.5,
        label: isNamed ? models[i] : undefined,
        color: isNamed ? "#2B2FE0" : "#8A8279",
      });
    }

    let animId: number;
    let pulsePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulsePhase += 0.02;

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(43, 47, 224, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Animated pulsing packet on some lines
            if ((i + j) % 5 === 0) {
              const t = (Math.sin(pulsePhase + i) + 1) / 2;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = "#2B2FE0";
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        if (node.label) {
          ctx.font = "10px Inter, sans-serif";
          ctx.fillStyle = "#4D463E";
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-[#EBE8E2] pt-16 pb-20 px-6 sm:px-8">
      {/* Interactive Constellation Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-40"
      />

      <div className="relative max-w-6xl mx-auto text-center space-y-8 z-10">
        {/* Eyebrow Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFFFFE] border border-[#DDD9D1] shadow-sm text-xs font-medium text-[#1F1915]"
        >
          <span className="w-2 h-2 rounded-full bg-[#2D7A5E] animate-pulse" />
          <span className="font-semibold text-[#2B2FE0]">AI Orchestra Engine v2.4</span>
          <span className="text-[#8A8279]">·</span>
          <span className="text-[#6B6359]">Multi-Model Live Coordination</span>
        </motion.div>

        {/* Serif Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-[#1F1915] leading-[1.1] max-w-4xl mx-auto"
        >
          Conduct AI Models Like a <span className="italic font-serif text-[#2B2FE0]">Symphony Orchestra</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="text-base sm:text-lg text-[#4D463E] max-w-2xl mx-auto leading-relaxed"
        >
          No single model solves everything. AI Orchestra harmonizes specialist agents—pairing ultra-fast execution with deep reasoning, verifiable code generation, and rigorous peer critique.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-[#2B2FE0] hover:bg-[#2024C2] text-white text-sm font-semibold shadow-warm-md hover:shadow-warm-lg transition-all flex items-center gap-2 group"
          >
            <span>Start Orchestrating Free</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <a
            href="#visualizer"
            className="btn-outline-warm px-6 py-3.5 text-sm rounded-xl"
          >
            <span>Explore Live Conductor</span>
          </a>
        </motion.div>

        {/* Floating Product Frame (Browser-Chrome Frame with Simulated Live Video/Demo) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-10 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-[#EBE8E2] bg-[#FFFFFE] shadow-2xl overflow-hidden text-left relative group">
            {/* Browser Chrome Header */}
            <div className="bg-[#FAF9F5] border-b border-[#EBE8E2] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E5695D]" />
                <div className="w-3 h-3 rounded-full bg-[#E5B55D]" />
                <div className="w-3 h-3 rounded-full bg-[#5DC97A]" />
                <span className="ml-3 text-xs font-mono text-[#8A8279] bg-[#FFFFFE] px-3 py-1 rounded-md border border-[#EBE8E2]">
                  https://orchestra.agentops.ai/live-dag
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8A8279]">
                <span className="w-2 h-2 rounded-full bg-[#2D7A5E] animate-pulse" />
                <span>6 Models Active</span>
              </div>
            </div>

            {/* Live Interactive Dashboard Simulation */}
            <div className="p-6 bg-[#FAF9F6] grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Active Conductor Card */}
              <div className="p-4 rounded-xl bg-[#FFFFFE] border border-[#EBE8E2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2FE0] flex items-center gap-1.5">
                    <Sparkles size={13} /> Conductor
                  </span>
                  <span className="badge-safety text-[10px]">Verified</span>
                </div>
                <p className="text-xs text-[#1F1915] font-mono leading-relaxed">
                  &gt; Goal: Synthesize real-time weather analytics engine with caching.
                </p>
                <div className="h-1.5 bg-[#E8EEFF] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2B2FE0] rounded-full w-4/5 animate-pulse" />
                </div>
              </div>

              {/* Realtime Stream Node */}
              <div className="p-4 rounded-xl bg-[#FFFFFE] border border-[#EBE8E2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0D9488]">
                    Claude 3.5 + Groq
                  </span>
                  <span className="badge-warm text-[10px]">840 t/s</span>
                </div>
                <p className="text-xs text-[#4D463E] font-mono leading-relaxed">
                  &gt; Coder: async def fetch_weather() generated & sandboxed in Docker.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#2D7A5E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A5E]" />
                  <span>Syntax AST Validated</span>
                </div>
              </div>

              {/* Live Critic Evaluation */}
              <div className="p-4 rounded-xl bg-[#FFFFFE] border border-[#EBE8E2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D97706]">
                    Critic & Memory
                  </span>
                  <span className="badge-safety text-[10px]">Score 9.8/10</span>
                </div>
                <p className="text-xs text-[#4D463E] font-mono leading-relaxed">
                  &gt; Peer review approved. Output committed to Chroma vector memory.
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#8A8279]">
                  <span>Latency: 114ms</span>
                  <span>Tokens: 1,840</span>
                </div>
              </div>
            </div>

            {/* Interactive Loom-Style Overlay */}
            <div className="absolute inset-0 bg-[#1F1915]/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-full bg-[#2B2FE0] text-white text-xs font-semibold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Play size={14} fill="currentColor" /> Open Interactive Workspace
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
