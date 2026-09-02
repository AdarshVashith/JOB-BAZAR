"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Compass, Terminal, Cpu } from "lucide-react";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF9F6]/85 border-b border-[#EBE8E2] transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#2B2FE0] text-white flex items-center justify-center font-semibold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-[#1F1915]">
              AI Orchestra
            </span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F4F0] text-[#2D7A5E] border border-[#C2E3D6]">
              v2.4 Active
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6B6359]">
          <a href="#visualizer" className="hover:text-[#1F1915] transition-colors flex items-center gap-1.5">
            <Compass size={14} /> Orchestration
          </a>
          <a href="#gallery" className="hover:text-[#1F1915] transition-colors flex items-center gap-1.5">
            <Cpu size={14} /> Telemetry
          </a>
          <a href="#terminal" className="hover:text-[#1F1915] transition-colors flex items-center gap-1.5">
            <Terminal size={14} /> Live Stream
          </a>
          <a href="#how-it-works" className="hover:text-[#1F1915] transition-colors">
            How It Works
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-[#6B6359] hover:text-[#1F1915] px-3 py-2 rounded-lg transition-colors hidden sm:inline-block"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-[#2B2FE0] hover:bg-[#2024C2] text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            Launch Orchestra <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </header>
  );
}
