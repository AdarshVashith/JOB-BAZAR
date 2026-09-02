"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, ArrowRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface UploadedFile {
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  selected: boolean;
}

interface Props {
  uploadedFiles: string[];
  contextFiles: string[];
  setContextFiles: (files: string[]) => void;
  onRunWithFiles: () => void;
}

export default function UploadPanel({
  uploadedFiles,
  contextFiles,
  setContextFiles,
  onRunWithFiles,
}: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const restored = uploadedFiles
        .filter((name) => !existing.has(name))
        .map((name) => ({
          name,
          size: 0,
          status: "done" as const,
          selected: false,
        }));
      return [...prev, ...restored];
    });
  }, [uploadedFiles]);

  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const arr = Array.from(fileList);
    setFiles((prev) => [
      ...prev,
      ...arr.map((f) => ({
        name: f.name,
        size: f.size,
        status: "uploading" as const,
        selected: false,
      })),
    ]);

    for (const file of arr) {
      const form = new FormData();
      form.append("file", file);
      try {
        await fetch(`${API}/upload`, {
          method: "POST",
          body: form,
          credentials: "include",
        });
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: "done" } : f,
          ),
        );
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: "error" } : f,
          ),
        );
      }
    }
  }

  function toggleSelect(name: string) {
    setFiles((prev) =>
      prev.map((f) => (f.name === name ? { ...f, selected: !f.selected } : f)),
    );
  }

  function useAsContext() {
    const selected = files
      .filter((f) => f.selected && f.status === "done")
      .map((f) => f.name);
    setContextFiles(selected);
    onRunWithFiles();
  }

  const selectedCount = files.filter(
    (f) => f.selected && f.status === "done",
  ).length;
  const doneCount = files.filter((f) => f.status === "done").length;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`
          card-editorial p-10 text-center cursor-pointer border-2 border-dashed transition-all
          ${
            dragging
              ? "border-[#0000CD] bg-[#E8EEFF]/40 shadow-warm-md"
              : "border-[#DDD9D1] bg-[#FFFFFE] hover:border-[#0000CD]/60 hover:bg-[#FAF9F5]"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-xl bg-[#E8EEFF] text-[#0000CD] flex items-center justify-center mx-auto mb-3.5 shadow-sm">
          <UploadCloud size={24} />
        </div>
        <h3 className="text-base font-medium text-[#1F1915]">
          Upload research papers, technical specs, or datasets
        </h3>
        <p className="text-sm text-[#6B6359] mt-1 max-w-md mx-auto">
          Drag and drop files here, or click to browse. Documents are automatically chunked and indexed into the Chroma RAG vector store.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8A8279]">
          <span className="badge-warm text-[11px]">PDF</span>
          <span className="badge-warm text-[11px]">TXT</span>
          <span className="badge-warm text-[11px]">MARKDOWN</span>
          <span className="badge-warm text-[11px]">PYTHON / CODE</span>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="card-editorial p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-base font-medium text-[#1F1915]">Indexed Knowledge Context</h3>
              <p className="text-xs text-[#6B6359] mt-0.5">
                {doneCount} documents indexed · {contextFiles.length} active in workflow
              </p>
            </div>
            {selectedCount > 0 ? (
              <button
                onClick={useAsContext}
                className="btn-primary-blue text-sm"
              >
                Use {selectedCount} Selected as Context <ArrowRight size={14} />
              </button>
            ) : doneCount > 0 ? (
              <p className="text-xs text-[#8A8279] italic">
                Select documents below to attach to agent tasks
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => f.status === "done" && toggleSelect(f.name)}
                className={`flex items-center gap-3.5 rounded-lg border p-3.5 transition-all
                  ${f.status === "done" ? "cursor-pointer" : "cursor-default opacity-60"}
                  ${
                    f.selected
                      ? "border-[#0000CD] bg-[#E8EEFF]/40 shadow-sm"
                      : "border-[#EBE8E2] bg-[#FAF9F5] hover:border-[#DDD9D1] hover:bg-[#FFFFFE]"
                  }`}
              >
                {/* Custom Checkbox */}
                <div
                  className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors
                  ${f.selected ? "border-[#0000CD] bg-[#0000CD]" : "border-[#DDD9D1] bg-[#FFFFFE]"}`}
                >
                  {f.selected && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>

                <div className="w-8 h-8 rounded bg-[#FFFFFE] border border-[#EBE8E2] flex items-center justify-center text-sm flex-shrink-0">
                  <FileText size={16} className="text-[#0000CD]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F1915] truncate">
                    {f.name}
                  </p>
                  <p className="text-xs text-[#8A8279]">
                    {f.size > 0 ? `${(f.size / 1024).toFixed(1)} KB` : "Indexed document"}
                  </p>
                </div>

                <span className="flex-shrink-0">
                  {f.status === "done" ? (
                    <span className="badge-safety text-xs">
                      <CheckCircle2 size={12} /> Ready
                    </span>
                  ) : f.status === "error" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDF2F2] text-[#D84C4C] border border-[#F5C2C2]">
                      <AlertCircle size={12} /> Failed
                    </span>
                  ) : (
                    <span className="badge-blue text-xs">
                      Indexing…
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Active Context Banner */}
          {contextFiles.length > 0 && (
            <div className="mt-5 rounded-lg border border-[#C2E3D6] bg-[#E8F4F0] p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#2D7A5E] flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  {contextFiles.length} file{contextFiles.length > 1 ? "s" : ""} currently attached to agent workflow
                </p>
                <p className="text-xs text-[#4D463E] truncate mt-0.5 max-w-xl">
                  {contextFiles.join(", ")}
                </p>
              </div>
              <button
                onClick={() => {
                  setContextFiles([]);
                  localStorage.removeItem("contextFiles");
                }}
                className="text-xs font-medium text-[#D84C4C] hover:underline px-2 py-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Editorial Steps Guide */}
      <div className="card-editorial p-6">
        <h4 className="text-xs font-medium text-[#8A8279] uppercase tracking-wider mb-4">
          RAG Retrieval Pipeline
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              step: "01",
              title: "Multimodal Ingestion",
              desc: "Upload PDFs, Markdown notes, or codebases. Text is extracted and partitioned into semantic chunks.",
            },
            {
              step: "02",
              title: "Chroma Vector Indexing",
              desc: "Chunks are embedded with sentence transformers and indexed for high-precision semantic retrieval.",
            },
            {
              step: "03",
              title: "Context Injection",
              desc: "Researcher and Planner agents retrieve top-k grounding passages during DAG task decomposition.",
            },
          ].map((s) => (
            <div key={s.step} className="p-4 rounded-lg bg-[#FAF9F5] border border-[#EBE8E2]">
              <span className="text-xs font-mono font-bold text-[#0000CD] block mb-1">{s.step}</span>
              <p className="text-sm font-medium text-[#1F1915] mb-1">{s.title}</p>
              <p className="text-xs text-[#6B6359] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
