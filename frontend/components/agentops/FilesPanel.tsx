"use client";

import { useEffect, useState } from "react";
import { FolderCode, Download, Eye, Trash2, FileCode, CheckCircle2, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface GeneratedFile {
  name: string;
  size: number;
  url?: string;
  storage_path?: string;
  created_at?: string;
}

export default function FilesPanel() {
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{
    name: string;
    content: string;
  } | null>(null);

  async function fetchFiles() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/generated-files`, {
        credentials: "include",
      });
      const data = await res.json();
      setFiles(Array.isArray(data.files) ? data.files : []);
    } catch (err) {
      console.error(err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  async function openPreview(file: GeneratedFile) {
    try {
      if (!file.url) {
        throw new Error("Missing file URL");
      }
      const res = await fetch(file.url);
      const content = await res.text();
      setPreview({
        name: file.name,
        content,
      });
    } catch (err) {
      console.error(err);
      setPreview({
        name: file.name,
        content: "Could not load file preview.",
      });
    }
  }

  async function deleteFile(filename: string) {
    const confirmed = window.confirm(`Permanently delete ${filename}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API}/generated-files/${filename}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.name !== filename));
        if (preview?.name === filename) setPreview(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="card-editorial p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#EBE8E2] pb-5">
        <div>
          <h3 className="text-lg font-medium text-[#1F1915] font-serif flex items-center gap-2">
            <FolderCode size={20} className="text-[#0000CD]" />
            Generated Artifacts & Verified Code
          </h3>
          <p className="text-xs text-[#6B6359] mt-0.5">
            Sandboxed files, scripts, and datasets created by the multi-agent pipeline.
          </p>
        </div>

        <button
          onClick={fetchFiles}
          className="btn-outline-warm text-xs"
        >
          Refresh Artifacts
        </button>
      </div>

      {loading && (
        <p className="text-center py-12 text-[#8A8279] text-sm animate-pulse">
          Loading generated artifacts…
        </p>
      )}

      {!loading && files.length === 0 && (
        <div className="text-center py-14">
          <p className="text-[#6B6359] text-sm">
            No code artifacts generated yet.
          </p>
          <p className="text-[#8A8279] text-xs mt-1">
            Run a coding goal from Overview to create verified programs.
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex items-center gap-4 rounded-lg border border-[#EBE8E2] bg-[#FAF9F5] px-4 py-3.5 hover:border-[#DDD9D1] hover:bg-[#FFFFFE] transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E8EEFF] text-[#0000CD] flex items-center justify-center flex-shrink-0">
              <FileCode size={16} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1F1915] font-mono truncate">
                {file.name}
              </p>
              <p className="text-xs text-[#8A8279]">
                {(file.size / 1024).toFixed(1)} KB · Verified Python / Script
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openPreview(file)}
                className="btn-outline-warm text-xs py-1.5 px-3"
              >
                <Eye size={13} /> Preview
              </button>

              <a
                href={file.url}
                download={file.name}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-blue text-xs py-1.5 px-3"
              >
                <Download size={13} /> Download
              </a>

              <button
                onClick={() => deleteFile(file.name)}
                className="p-1.5 rounded-md border border-transparent text-[#8A8279] hover:text-[#D84C4C] hover:bg-[#FDF2F2] transition-colors"
                title="Delete file"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1915]/50 backdrop-blur-sm p-4">
          <div className="bg-[#FFFFFE] border border-[#EBE8E2] rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE8E2]">
              <div className="flex items-center gap-2">
                <FileCode size={18} className="text-[#0000CD]" />
                <h4 className="text-sm font-medium text-[#1F1915] font-mono">
                  {preview.name}
                </h4>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="text-[#8A8279] hover:text-[#1F1915] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-[#FAF9F5]">
              <div className="code-block-editorial p-4 text-xs font-mono leading-relaxed">
                <pre>{preview.content}</pre>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#FFFFFE] border-t border-[#EBE8E2] flex justify-end">
              <button
                onClick={() => setPreview(null)}
                className="btn-outline-warm text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
