"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Quote, Sparkles, CheckCircle2 } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "AI Orchestra replaced our brittle single-prompt scripts. Splitting research to GPT-4o, coding to Llama, and verification to Claude cut our runtime failure rate by 84%.",
    author: "Dr. Evelyn Vance",
    role: "Lead Systems Architect",
    org: "Synthetix Labs",
    avatar: "EV",
  },
  {
    quote:
      "The Redis-based DAG coordination gives us real-time traceability. We can observe exactly why a supervisor routed a task to Groq vs. Gemini in milliseconds.",
    author: "Marcus Sterling",
    role: "VP of Autonomous Infrastructure",
    org: "QuantEdge Systems",
    avatar: "MS",
  },
  {
    quote:
      "Sandboxed Docker verification before delivering code was the missing piece for production multi-agent systems. It just works.",
    author: "Aria Chen",
    role: "Principal AI Safety Researcher",
    org: "OpenCore Foundation",
    avatar: "AC",
  },
];

export default function SocialProofTestimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-6 sm:px-8 bg-[#FAF9F6] border-b border-[#EBE8E2]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8279]">
            Peer Reviewed
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1F1915]">
            Trusted by Research Teams
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.author}
              className="card-editorial p-6 flex flex-col justify-between space-y-6 hover:shadow-warm-md transition-all"
            >
              <div className="space-y-4">
                <Quote size={20} className="text-[#2B2FE0] opacity-60" />
                <p className="text-sm text-[#4D463E] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#EBE8E2]">
                <div className="w-10 h-10 rounded-full bg-[#E8EEFF] text-[#2B2FE0] flex items-center justify-center font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1F1915]">
                    {t.author}
                  </h4>
                  <p className="text-xs text-[#8A8279]">
                    {t.role} · {t.org}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
