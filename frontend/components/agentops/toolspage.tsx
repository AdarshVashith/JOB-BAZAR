"use client";
import { motion } from "framer-motion";
import {
  Activity,
  FileImage,
  FileSpreadsheet,
  FileText,
  Mic,
  Search,
  UploadCloud,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const tools = [
  {
    name: "CSV & Tabular Analyzer",
    desc: "Extract statistics, distributions, and summarize structured schemas.",
    icon: FileSpreadsheet,
    badge: "Active",
    badgeColor: "badge-safety",
  },
  {
    name: "Vision OCR Extractor",
    desc: "Tesseract & vision OCR to extract text from screenshots and logs.",
    icon: FileImage,
    badge: "Active",
    badgeColor: "badge-safety",
  },
  {
    name: "PDF Semantic Parser",
    desc: "Academic paper layout extraction with table and formula parsing.",
    icon: FileText,
    badge: "In Staging",
    badgeColor: "badge-blue",
  },
  {
    name: "Audio Transcriber",
    desc: "Whisper speech-to-text transcription for voice commands and memos.",
    icon: Mic,
    badge: "Roadmap",
    badgeColor: "badge-warm",
  },
];

export default function ToolsPage() {
  const [pipeline, setPipeline] = useState({
    upload: "waiting",
    extract: "waiting",
    chunk: "waiting",
    embed: "waiting",
    index: "waiting",
    retrieve: "waiting",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTool, setActiveTool] = useState<"csv" | "ocr" | null>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stats, setStats] = useState({
    documents: 0,
    chunks: 0,
    requests: 0,
  });

  async function loadStats() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tools/stats`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadStats();
    loadJobs();
  }, []);

  const [jobs, setJobs] = useState<
    {
      file: string;
      status: string;
      chunks: number;
    }[]
  >([]);

  async function loadJobs() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools/jobs`, {
        credentials: "include",
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleFile(file: File) {
    setSelectedFile(file);
    setUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const isCsv = file.name.endsWith(".csv");
    const isImage = file.type.startsWith("image/");
    const endpoint = isCsv ? "/tools/csv" : isImage ? "/tools/ocr" : "/upload";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Processing failed");

      const data = await res.json();
      setResult(data);
      loadStats();
      loadJobs();
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-[#FAF9F5] text-[#1F1915]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-medium text-[#1F1915]">
          Multimodal Tools & Processing Engines
        </h2>
        <p className="text-sm text-[#6B6359] mt-1">
          Specialized ingestion utilities for CSV analytics, OCR image reading, and RAG chunk generation.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: "Indexed Documents",
            value: stats.documents || 0,
            icon: Database,
          },
          {
            title: "Semantic Chunks",
            value: stats.chunks || 0,
            icon: Layers,
          },
          {
            title: "API Ingestion Calls",
            value: stats.requests || 12,
            icon: Cpu,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="card-editorial p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-[#8A8279] uppercase tracking-wider font-medium">
                  {item.title}
                </p>
                <h3 className="text-2xl font-medium text-[#1F1915] font-serif mt-1.5">
                  {item.value}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#E8EEFF] text-[#0000CD] flex items-center justify-center">
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Zone & Interactive Runner */}
      <div className="card-editorial p-8 space-y-6">
        <h3 className="text-lg font-medium text-[#1F1915]">
          Interactive Document & CSV Processor
        </h3>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={`
            border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
            ${
              dragging
                ? "border-[#0000CD] bg-[#E8EEFF]/40"
                : "border-[#DDD9D1] bg-[#FAF9F5] hover:border-[#0000CD]/60 hover:bg-[#FFFFFE]"
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          <div className="w-12 h-12 rounded-xl bg-[#E8EEFF] text-[#0000CD] flex items-center justify-center mx-auto mb-3 shadow-sm">
            <UploadCloud size={24} />
          </div>

          <h4 className="text-base font-medium text-[#1F1915]">
            Drop CSV or Image for Instant Extraction
          </h4>
          <p className="text-xs text-[#6B6359] mt-1">
            CSV files will be parsed for columns & stats. Images will be processed with local OCR.
          </p>

          {selectedFile && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFE] border border-[#EBE8E2] text-xs font-medium text-[#1F1915]">
              <span>📄 {selectedFile.name}</span>
            </div>
          )}

          {uploading && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="h-1.5 bg-[#EBE8E2] rounded-full overflow-hidden">
                <div className="h-full bg-[#0000CD] animate-pulse w-2/3" />
              </div>
              <p className="text-xs text-[#8A8279] mt-1.5">Processing tokens & schema…</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 rounded-lg bg-[#E8F4F0] border border-[#C2E3D6] text-xs text-[#2D7A5E] text-left max-w-lg mx-auto">
              <p className="font-semibold">{result.message || "Processed successfully"}</p>
              {result.preview && <p className="mt-1 text-[#4D463E] font-mono">{result.preview}</p>}
            </div>
          )}

          {error && (
            <p className="mt-3 text-xs text-[#D84C4C] font-medium">{error}</p>
          )}

          <div className="mt-4">
            <button className="btn-primary-blue text-xs">
              Select Local File
            </button>
          </div>
        </div>
      </div>

      {/* Available Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.name} className="card-research hover:shadow-warm transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF9F5] border border-[#EBE8E2] flex items-center justify-center text-[#0000CD]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#1F1915]">{t.name}</h4>
                    <span className={`${t.badgeColor} text-[10px] mt-1`}>
                      {t.badge}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#6B6359] leading-relaxed mt-3">
                {t.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
