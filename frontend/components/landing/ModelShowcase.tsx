"use client";

import { motion } from "framer-motion";

// ── Vector Brand Logos ─────────────────────────────────────────────

function AnthropicLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.3 19L12 4.5 6.7 19h2.8l1.1-3.2h4.8l1.1 3.2h2.8zm-6-5.5l1.7-5.1 1.7 5.1h-3.4z"
        fill="#DA7756"
      />
      <circle cx="12" cy="12" r="11" stroke="#DA7756" strokeWidth="1.5" strokeOpacity="0.3" />
    </svg>
  );
}

function OpenAILogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M21.5 10.2c-.3-1.4-1.2-2.6-2.5-3.3-.3-.2-.7-.3-1-.4-.3-1.4-1.3-2.5-2.6-3.1-1.3-.6-2.9-.5-4.1.3-.4-.2-.8-.4-1.3-.4-1.4 0-2.8.7-3.6 1.8-.7 1.1-.9 2.5-.4 3.7-.3.1-.7.3-1 .5-1.2.7-2 1.9-2.3 3.3-.3 1.4.1 2.9 1 4 .3.4.7.7 1.1.9.2 1.4 1.1 2.6 2.4 3.3 1.3.7 2.9.7 4.2.1.4.3.9.5 1.4.5 1.5 0 2.9-.8 3.7-2 .8-1.2.9-2.6.4-3.9.3-.1.6-.3.9-.5 1.2-.7 2-1.9 2.3-3.3.4-1.3 0-2.8-.8-3.9zm-8.3 10.3c-.8 0-1.6-.3-2.2-.8l2.6-1.5c.2-.1.3-.3.3-.5v-3.6l3.1 1.8v3.1c-.8.9-2.3 1.5-3.8 1.5zm-6.7-3.8c-.5-.8-.7-1.8-.5-2.7l2.6 1.5c.2.1.4.1.6 0l3.1-1.8v3.6l-2.7 1.6c-1.2-.4-2.3-1.1-3.1-2.2zm-1.1-6.8c.3-.8.9-1.5 1.7-2l2.6 1.5c.2.1.3.3.3.5v3.6L6.9 11.7V8.6c-.6.4-1.1.8-1.5 1.3zm12.3-1.4l-3.1 1.8V8.2l2.7-1.6c1.2.4 2.3 1.1 3.1 2.2.5.8.7 1.8.5 2.7l-2.6-1.5c-.2-.1-.4-.1-.6 0zm2.2 4.7c-.3.8-.9 1.5-1.7 2l-2.6-1.5c-.2-.1-.3-.3-.3-.5V11l3.1 1.8v3.1c.6-.4 1.1-.8 1.5-1.3v-1.4zM9.9 13.7l-1.9-1.1 1.9-1.1 1.9 1.1-1.9 1.1z"
        fill="#10A37F"
      />
    </svg>
  );
}

function GoogleGeminiLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
        fill="url(#geminiStripGrad)"
      />
      <defs>
        <linearGradient id="geminiStripGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GroqLogo({ className = "w-5 h-5" }: { className?: string }) {
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

function MetaLlamaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4.5C8.5 4.5 6 6.8 6 10C6 13.2 8.5 15.5 12 15.5C15.5 15.5 18 13.2 18 10C18 6.8 15.5 4.5 12 4.5Z"
        stroke="#0668E1"
        strokeWidth="2.4"
      />
      <circle cx="9.5" cy="9.5" r="1.5" fill="#0668E1" />
      <circle cx="14.5" cy="9.5" r="1.5" fill="#0668E1" />
      <path d="M7 19.5C9 18 15 18 17 19.5" stroke="#0668E1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DeepSeekLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 14C4 8.5 8.5 4 14 4C19.5 4 21 8 20 12C19 16 15 19 11 19C7 19 4 17 4 14Z"
        fill="#1D4ED8"
      />
      <path
        d="M13 8C13 8 16 9.5 15 12.5C14 15.5 11 16 9 15"
        stroke="#93C5FD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="9" r="1.5" fill="white" />
    </svg>
  );
}

function MistralLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="5" height="5" rx="1" fill="#F97316" />
      <rect x="16" y="4" width="5" height="5" rx="1" fill="#F97316" />
      <rect x="3" y="10" width="18" height="5" rx="1" fill="#EA580C" />
      <rect x="3" y="16" width="5" height="5" rx="1" fill="#C2410C" />
      <rect x="10" y="16" width="5" height="5" rx="1" fill="#C2410C" />
      <rect x="16" y="16" width="5" height="5" rx="1" fill="#C2410C" />
    </svg>
  );
}

function OllamaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1F1915" />
      <path
        d="M7 8V16M17 8V16M12 6V18M9 11H15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="9" r="1" fill="#60A5FA" />
      <circle cx="14" cy="9" r="1" fill="#60A5FA" />
    </svg>
  );
}

const MODELS = [
  {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    context: "200k tokens",
    score: "99.2% Logic",
    logo: AnthropicLogo,
  },
  {
    name: "Groq Llama 120B",
    provider: "Groq LPUs",
    context: "128k tokens",
    score: "840 t/s",
    logo: GroqLogo,
  },
  {
    name: "GPT-4o",
    provider: "OpenAI",
    context: "128k tokens",
    score: "94.5% Vision",
    logo: OpenAILogo,
  },
  {
    name: "Gemini 1.5 Pro",
    provider: "Google DeepMind",
    context: "2M tokens",
    score: "98.1% RAG",
    logo: GoogleGeminiLogo,
  },
  {
    name: "Llama 3.3 70B",
    provider: "Meta AI",
    context: "128k tokens",
    score: "96.4% Python",
    logo: MetaLlamaLogo,
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    context: "64k tokens",
    score: "97.8% Math",
    logo: DeepSeekLogo,
  },
  {
    name: "Mistral Large",
    provider: "Mistral AI",
    context: "128k tokens",
    score: "93.0% Speed",
    logo: MistralLogo,
  },
  {
    name: "Ollama Local",
    provider: "Self-Hosted",
    context: "Custom",
    score: "100% Private",
    logo: OllamaLogo,
  },
];

export default function ModelShowcase() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-[#EBE8E2] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8279]">
          Integrated Model Orchestra
        </p>
      </div>

      {/* Infinite Scrolling Strip */}
      <div className="relative w-full flex overflow-x-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-4 flex-shrink-0"
        >
          {[...MODELS, ...MODELS].map((m, i) => {
            const LogoComp = m.logo;
            return (
              <div
                key={i}
                className="flex-shrink-0 w-72 p-4 rounded-xl bg-[#FFFFFE] border border-[#EBE8E2] shadow-sm hover:shadow-warm-md hover:border-[#2B2FE0] transition-all group flex items-center gap-3.5"
              >
                {/* Brand Logo Avatar */}
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#EBE8E2] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <LogoComp className="w-6 h-6 object-contain" />
                </div>

                {/* Model Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-[#1F1915] truncate">
                      {m.name}
                    </span>
                    <span className="badge-blue text-[9px] py-0 px-1.5 flex-shrink-0">
                      {m.score}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#8A8279]">
                    <span className="truncate">{m.provider}</span>
                    <span className="font-mono flex-shrink-0">{m.context}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
