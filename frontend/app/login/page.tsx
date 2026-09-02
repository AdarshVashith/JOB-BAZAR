"use client";

import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Activity,
  CheckCircle2,
  Lock,
  Cpu,
  Zap,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Google and GitHub SVG Icons ────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [workflowCount, setWorkflowCount] = useState(12482);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  // Subtle constellation background canvas on the left panel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || 480);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || 480;
      height = canvas.height = canvas.parentElement?.offsetHeight || 600;
    };
    window.addEventListener("resize", onResize);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const nodes: Node[] = [];
    for (let i = 0; i < 22; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(43, 47, 224, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
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
        ctx.fillStyle = "rgba(43, 47, 224, 0.25)";
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Workflow count animated ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkflowCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Invalid credentials");
        return;
      }

      setAuth(data.user, data.access_token);
      router.push("/dashboard");
    } catch {
      setError("Server unreachable — is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-[#FAF9F6] text-[#1F1915] flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-[#E8EEFF] selection:text-[#2B2FE0]"
    >
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#2B2FE0] text-white flex items-center justify-center font-semibold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-[#1F1915]">
              AI Orchestra
            </span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F4F0] text-[#2D7A5E] border border-[#C2E3D6]">
              Auth Core
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-medium text-[#6B6359] hover:text-[#1F1915] transition-colors hidden sm:inline"
          >
            ← Back to Landing Page
          </Link>
          <Link
            href="/signup"
            className="text-xs font-semibold text-[#2B2FE0] hover:text-[#2024C2] transition-colors"
          >
            Create account →
          </Link>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-5xl w-full mx-auto my-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Hero Panel (Span 7) */}
        <div className="lg:col-span-7 relative space-y-6">
          {/* Subtle Background Constellation Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute -inset-6 pointer-events-none opacity-50 z-0"
          />

          <div className="relative z-10 space-y-5">
            {/* Eyebrow Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EEFF] border border-[#2B2FE0]/20 text-[#2B2FE0] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A5E] animate-pulse" />
              AI Safety & Orchestration
            </div>

            {/* Serif Headline */}
            <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#1F1915] leading-[1.15]">
              Research-grade <br />
              <span className="italic text-[#2B2FE0]">multi-agent execution</span>.
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#4D463E] leading-relaxed max-w-lg">
              Decompose goals into dependency-aware DAGs, retrieve RAG context, run sandboxed code in Docker, and critique outputs with transparent reasoning.
            </p>

            {/* Checkmark Trust Bullets */}
            <div className="space-y-2.5 text-xs text-[#6B6359] pt-2">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#2D7A5E] flex-shrink-0" />
                <span>Isolated, sandboxed container execution (Docker runtime)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#2D7A5E] flex-shrink-0" />
                <span>Full cryptographic audit log & vector memory in PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#2D7A5E] flex-shrink-0" />
                <span>Zero vendor lock-in: BYOK Groq, Anthropic, OpenAI & Ollama</span>
              </div>
            </div>

            {/* Live Status Strip */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="badge-safety text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A5E] animate-pulse" />
                6 Models Synced
              </span>
              <span className="badge-blue text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B2FE0]" />
                Sandbox Ready
              </span>
              <span className="badge-warm text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A8279]" />
                Redis Bus Active
              </span>
            </div>

            {/* Mini Live-Metric Card */}
            <div className="card-editorial p-3.5 max-w-sm flex items-center justify-between shadow-sm bg-[#FFFFFE]/90 backdrop-blur-sm mt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8EEFF] text-[#2B2FE0] flex items-center justify-center">
                  <Activity size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono font-bold text-[#1F1915]">
                      {workflowCount.toLocaleString()}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A5E] animate-pulse" />
                  </div>
                  <p className="text-[10px] text-[#8A8279]">
                    Workflows executed across cluster
                  </p>
                </div>
              </div>
              <span className="badge-safety text-[10px] py-0.5 px-2">99.4% Validated</span>
            </div>
          </div>
        </div>

        {/* Right Form Card (Span 5) */}
        <div className="lg:col-span-5">
          <div className="card-editorial p-7 sm:p-8 shadow-warm-lg bg-[#FFFFFE]">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-medium text-[#1F1915]">
                Sign In
              </h2>
              <p className="text-xs text-[#6B6359] mt-1">
                Enter your credentials to access your control room.
              </p>
            </div>

            {/* Social SSO Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => alert("Connecting to Google OAuth...")}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F5] text-xs font-medium text-[#1F1915] transition-all shadow-sm"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Connecting to GitHub OAuth...")}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#DDD9D1] bg-[#FFFFFE] hover:bg-[#FAF9F5] text-xs font-medium text-[#1F1915] transition-all shadow-sm"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-[#EBE8E2] w-full" />
              <span className="bg-[#FFFFFE] px-3 text-[11px] text-[#8A8279] uppercase font-medium tracking-wider absolute">
                Or with email
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#4D463E] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@orchestra.ai"
                  className="w-full bg-[#FAF9F6] border border-[#DDD9D1] focus:border-[#2B2FE0] focus:ring-2 focus:ring-[#2B2FE0]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#1F1915] placeholder:text-[#B5AFA5] outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#4D463E]">
                    Password
                  </label>
                  <span className="text-[11px] text-[#2B2FE0] hover:underline cursor-pointer">
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9F6] border border-[#DDD9D1] focus:border-[#2B2FE0] focus:ring-2 focus:ring-[#2B2FE0]/15 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-[#1F1915] placeholder:text-[#B5AFA5] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8279] hover:text-[#1F1915]"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[#D84C4C] font-medium bg-[#FDF2F2] p-2.5 rounded-lg border border-[#F5C2C2]"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-blue w-full py-2.5 text-sm font-semibold shadow-sm hover:shadow-warm-md group mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    Sign In to Control Room{" "}
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              {/* Animated Progress Bar under button on loading */}
              {loading && (
                <div className="h-1 bg-[#E8EEFF] rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#2B2FE0] rounded-full animate-pulse w-3/4" />
                </div>
              )}
            </form>

            <div className="mt-6 pt-4 border-t border-[#EBE8E2] text-center">
              <p className="text-xs text-[#6B6359]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#2B2FE0] font-semibold hover:underline"
                >
                  Create researcher account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-[11px] text-[#8A8279] z-10">
        AI Orchestra Multi-Agent Orchestration · Academic Journal Aesthetics
      </footer>
    </motion.div>
  );
}
