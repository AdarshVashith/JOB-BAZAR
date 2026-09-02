"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, ArrowRight, Layers, Cpu, ShieldCheck, CheckCircle2 } from "lucide-react";

const STAGES = [
  {
    step: "01",
    title: "Compose",
    subtitle: "Objective Decomposition",
    desc: "Input a complex goal in plain English. The Conductor analyzes the requirement and generates an execution DAG with explicit dependency checkpoints.",
    badge: "DAG Generation",
    icon: Sparkles,
    metrics: "24ms Compilation Time",
  },
  {
    step: "02",
    title: "Distribute",
    subtitle: "Specialist Capability Mapping",
    desc: "Subtasks are dispatched to optimal models: ultra-fast Groq for streams, Claude for complex logic, GPT-4o for multimodal OCR, and Gemini for 2M token context.",
    badge: "Smart Dispatch",
    icon: Cpu,
    metrics: "Sub-50ms Routing",
  },
  {
    step: "03",
    title: "Collaborate",
    subtitle: "Realtime Redis Event Bus",
    desc: "Specialist agents communicate asynchronously. Researcher findings ground the Coder, and Critic agents inspect intermediate AST trees before code executes.",
    badge: "Peer Review",
    icon: Layers,
    metrics: "Zero Race Conditions",
  },
  {
    step: "04",
    title: "Synthesize",
    subtitle: "Sandboxed Verification",
    desc: "Generated code is run in isolated Docker containers with automated test assertions. Only 100% verified outputs are indexed into vector memory and delivered.",
    badge: "Docker Isolation",
    icon: ShieldCheck,
    metrics: "100% Verifiable",
  },
];

export default function HowItWorksCarousel() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 px-6 sm:px-8 bg-[#FAF9F6] border-b border-[#EBE8E2]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EEFF] text-[#2B2FE0] text-xs font-semibold">
            <Layers size={13} /> The 4-Stage Symphony
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1F1915]">
            How the Orchestra Works
          </h2>
          <p className="text-[#4D463E] text-base leading-relaxed">
            From natural language prompt to verified execution artifact, watch the synchronized workflow step-by-step.
          </p>
        </div>

        {/* Carousel / Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map((st, i) => {
            const Icon = st.icon;
            const isActive = activeStep === i;

            return (
              <div
                key={st.step}
                onClick={() => setActiveStep(i)}
                className={`card-editorial p-6 flex flex-col justify-between cursor-pointer transition-all ${
                  isActive
                    ? "border-[#2B2FE0] shadow-warm-lg ring-2 ring-[#2B2FE0]/15"
                    : "hover:border-[#DDD9D1]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#2B2FE0]">
                      {st.step}
                    </span>
                    <span className="badge-blue text-[10px]">
                      {st.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#E8EEFF] text-[#2B2FE0] flex items-center justify-center">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-[#1F1915] font-serif">
                      {st.title}
                    </h3>
                    <p className="text-xs font-medium text-[#8A8279] mt-0.5">
                      {st.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#4D463E] leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EBE8E2] flex items-center justify-between text-[11px] text-[#2D7A5E] font-medium">
                  <span>{st.metrics}</span>
                  <CheckCircle2 size={13} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sync Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {STAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`h-2 rounded-full transition-all ${
                activeStep === i ? "w-8 bg-[#2B2FE0]" : "w-2 bg-[#DDD9D1]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
