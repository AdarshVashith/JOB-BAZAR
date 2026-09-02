"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-[#FAF9F6] border-t border-[#EBE8E2] py-12 px-6 sm:px-8 text-xs text-[#8A8279]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#2B2FE0] text-white flex items-center justify-center font-medium shadow-sm">
            <Sparkles size={14} />
          </div>
          <span className="font-semibold text-[#1F1915]">
            AI Orchestra
          </span>
          <span className="text-[#8A8279]">· Multi-Agent Orchestration & Observability</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-[#1F1915] transition-colors">
            Dashboard
          </Link>
          <Link href="/login" className="hover:text-[#1F1915] transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="hover:text-[#1F1915] transition-colors">
            Create Account
          </Link>
        </div>

        <p className="text-[11px] text-[#8A8279]">
          © {new Date().getFullYear()} AI Orchestra Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
