"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Signup failed");
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
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F1915] flex flex-col justify-between p-6 sm:p-10 font-sans">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0000CD] text-white flex items-center justify-center font-semibold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles size={16} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-[#1F1915]">
            AI Orchestra
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-medium text-[#6B6359] hover:text-[#1F1915] transition-colors"
          >
            ← Back to Landing Page
          </Link>
          <Link
            href="/login"
            className="text-xs font-medium text-[#0000CD] hover:text-[#000099] transition-colors"
          >
            Sign in instead →
          </Link>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-4xl w-full mx-auto my-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Information */}
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EEFF] text-[#0000CD] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0000CD]" />
            Researcher Account Creation
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1F1915] leading-tight">
            Create your local intelligence workspace.
          </h1>
          <p className="text-sm text-[#4D463E] leading-relaxed">
            Gain full control over agent graphs, local memory vectors, custom LLM routing, and sandboxed code execution.
          </p>

          <div className="pt-4 space-y-2.5 text-xs text-[#6B6359]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#2D7A5E]" />
              <span>Full LangGraph workflow orchestration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#2D7A5E]" />
              <span>Persistent memory and BYOK Groq / Ollama support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#2D7A5E]" />
              <span>Local PostgreSQL & Redis telemetry bus</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="card-editorial p-8">
          <h2 className="text-xl font-serif font-medium text-[#1F1915] mb-1">
            Sign Up
          </h2>
          <p className="text-xs text-[#6B6359] mb-6">
            Initialize your local credentials.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4D463E] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Ada Lovelace"
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] focus:ring-2 focus:ring-[#0000CD]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#1F1915] placeholder:text-[#B5AFA5] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4D463E] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@agentops.ai"
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] focus:ring-2 focus:ring-[#0000CD]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#1F1915] placeholder:text-[#B5AFA5] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4D463E] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] focus:ring-2 focus:ring-[#0000CD]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#1F1915] placeholder:text-[#B5AFA5] outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-[#D84C4C] font-medium bg-[#FDF2F2] p-2.5 rounded border border-[#F5C2C2]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-blue w-full py-2.5 text-sm font-medium shadow-sm hover:shadow mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EBE8E2] text-center">
            <p className="text-xs text-[#6B6359]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0000CD] font-medium hover:underline">
                Sign in to your control room
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-[11px] text-[#8A8279]">
        AgentOps Multi-Agent Orchestration · Academic Journal Aesthetics
      </footer>
    </div>
  );
}
