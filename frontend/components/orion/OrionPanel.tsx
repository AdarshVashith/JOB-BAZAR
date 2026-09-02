"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, Send, Paperclip, Image as ImageIcon, CheckCircle, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Mode = "paste" | "screen";

interface Message {
  id: string;
  role: "user" | "orion";
  content: string;
  provider?: string;
  timestamp: Date;
}

function renderContent(text: string) {
  const parts = text.split(/(```[\w]*\n[\s\S]*?```)/g);
  return parts.map((part, i) => {
    const codeMatch = part.match(/```([\w]*)\n([\s\S]*?)```/);
    if (codeMatch) {
      return (
        <div
          key={i}
          className="code-block-editorial my-3 rounded-lg overflow-hidden border border-[#3A3634] text-xs font-mono"
        >
          {codeMatch[1] && (
            <div className="bg-[#2A2826] px-3.5 py-1.5 text-[11px] text-[#B5AFA5] border-b border-[#3A3634] flex items-center justify-between">
              <span>{codeMatch[1]}</span>
              <span className="text-[10px] text-[#8A8279]">Code</span>
            </div>
          )}
          <pre className="p-3.5 overflow-x-auto text-[#F5F3EF] leading-relaxed">
            <code>{codeMatch[2]}</code>
          </pre>
        </div>
      );
    }
    // Inline code
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((p, j) => {
          if (p.startsWith("`") && p.endsWith("`")) {
            return (
              <code
                key={j}
                className="bg-[#E8EEFF] text-[#0000CD] px-1.5 py-0.5 rounded text-xs font-mono font-medium"
              >
                {p.slice(1, -1)}
              </code>
            );
          }
          return (
            <span key={j} className="whitespace-pre-wrap">
              {p}
            </span>
          );
        })}
      </span>
    );
  });
}

export default function OrionPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("paste");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenshotB64, setScreenshotB64] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const b64 = result.split(",")[1];
      setScreenshotB64(b64);
      setScreenshotPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const clearScreenshot = () => {
    setScreenshotB64(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text && !screenshotB64) return;
    if (loading) return;

    const userMsgId = Date.now().toString();
    const orionMsgId = (Date.now() + 1).toString();

    const userContent = text || "(analyzing attached screenshot)";

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        content: userContent,
        timestamp: new Date(),
      },
      {
        id: orionMsgId,
        role: "orion",
        content: "",
        timestamp: new Date(),
      },
    ]);

    setInput("");
    setLoading(true);
    setStatus("Thinking...");

    const capturedB64 = screenshotB64;
    clearScreenshot();

    try {
      let finalQuestion = text;

      if (capturedB64) {
        setStatus("Processing screenshot locally...");
        const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const ocrRes = await fetch(`${API_URL}/assistant/screenshot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            image_b64: capturedB64,
            prompt: text || "Extract and summarize this error or problem",
          }),
        });

        if (ocrRes.ok) {
          const ocrData = await ocrRes.json();
          finalQuestion = `[Screenshot context: ${ocrData.extracted_text}]\n\nQuestion: ${text || "What is happening here and how do I fix it?"}`;
        }
      }

      setStatus("Formulating response...");
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

      const res = await fetch(`${API_URL}/assistant/ask/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: finalQuestion,
          session_id: "web-session",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const textChunk = parsed.chunk ?? parsed.token ?? parsed.content ?? parsed.text;

                if (textChunk) {
                  accumulated += textChunk;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === orionMsgId
                        ? {
                            ...m,
                            content: accumulated,
                            provider: parsed.provider ?? m.provider,
                          }
                        : m
                    )
                  );
                } else if (parsed.status) {
                  setStatus(parsed.status);
                }
              } catch {
                if (data && data !== "[DONE]") {
                  accumulated += data;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === orionMsgId ? { ...m, content: accumulated } : m
                    )
                  );
                }
              }
            }
          }
        }
      }

      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === orionMsgId
              ? {
                  ...m,
                  content: "Hello! I am Orion, your multi-agent dialogue assistant. How can I assist your orchestration today?",
                }
              : m
          )
        );
      }

      setStatus("");
    } catch (err: any) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === orionMsgId
            ? {
                ...m,
                content: `Error: ${err.message || "Could not reach assistant"}.`,
              }
            : m
        )
      );
      setStatus("");
    } finally {
      setLoading(false);
    }
  }, [input, screenshotB64, loading]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAF9F5] text-[#1F1915]">
      {/* Editorial Top Navigation */}
      <header className="h-14 border-b border-[#EBE8E2] bg-[#FFFFFE] px-6 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#2B2FE0] flex items-center justify-center text-white shadow-sm">
            <Sparkles size={15} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#1F1915] flex items-center gap-2">
              Orion Dialogue Assistant
              <span className="badge-safety text-[10px] py-0.5 px-2">Local Brain First</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B6359] font-medium hidden sm:inline flex items-center gap-1.5">
            <span className="text-[#2B2FE0] font-semibold">Brain:</span> Local Engine (Primary) · Cloud API (Heavy Tasks)
          </span>
          <div className="w-2 h-2 rounded-full bg-[#2D7A5E] animate-pulse" title="Autonomous Dual-Tier Engine Ready" />
        </div>
      </header>

      {/* Messages Stream - Centered 720px */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-[720px] mx-auto space-y-5">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-16 space-y-4 max-w-lg mx-auto"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8EEFF] text-[#0000CD] flex items-center justify-center mx-auto shadow-sm">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-serif font-medium text-[#1F1915]">
                How can I assist your research?
              </h3>
              <p className="text-sm text-[#6B6359] leading-relaxed">
                Paste technical code, describe architectural problems, or upload console screenshots. All context is safely verified and structured.
              </p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "user" ? (
                  /* User Message: #FFFFFE, border #EBE8E2, max-width 75% */
                  <div className="max-w-[75%] rounded-2xl p-4 text-[15px] leading-relaxed bg-[#FFFFFE] border border-[#EBE8E2] text-[#1F1915] shadow-sm">
                    {msg.content}
                  </div>
                ) : (
                  /* Claude/Orion Message: #F5F3ED, max-width 85%, editorial styling */
                  <div className="max-w-[85%] rounded-2xl p-5 text-[15px] leading-relaxed bg-[#F5F3ED] text-[#2D2825]">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#0000CD] flex items-center justify-center text-white">
                        <Sparkles size={13} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#0000CD]">
                        Orion
                      </span>
                      {msg.provider && (
                        <span className="text-[10px] text-[#8A8279]">
                          via {msg.provider}
                        </span>
                      )}
                    </div>
                    <div>
                      {msg.content ? (
                        renderContent(msg.content)
                      ) : (
                        <span className="text-[#8A8279] italic text-xs">
                          Reasoning through response…
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming status */}
          {status && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 text-[#0000CD] text-xs bg-[#E8EEFF] px-3 py-1.5 rounded-full border border-[#0000CD]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0000CD] animate-pulse" />
                {status}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Screenshot preview */}
      <AnimatePresence>
        {screenshotPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#EBE8E2] bg-[#FFFFFE] px-6 py-3"
          >
            <div className="max-w-[720px] mx-auto flex items-center gap-3">
              <img
                src={screenshotPreview}
                alt="Screenshot"
                className="h-12 w-auto rounded border border-[#DDD9D1] object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#1F1915]">
                  Screenshot Attached
                </p>
                <p className="text-[11px] text-[#8A8279]">
                  Extracted locally prior to LLM synthesis
                </p>
              </div>
              <button
                onClick={clearScreenshot}
                className="btn-outline-warm text-xs py-1 px-2.5"
              >
                ✕ Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Composer - Fixed Bottom, Max 720px Centered */}
      <div className="border-t border-[#EBE8E2] bg-[#FAF9F5] px-4 py-4 flex-shrink-0">
        <div className="max-w-[720px] mx-auto">
          {/* Mode switch pills */}
          <div className="flex gap-2 mb-2.5">
            {(["paste", "screen"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                  mode === m
                    ? "border-[#0000CD] text-[#0000CD] bg-[#E8EEFF]"
                    : "border-[#EBE8E2] text-[#6B6359] bg-[#FFFFFE] hover:bg-[#F5F3EF]"
                }`}
              >
                {m === "paste" ? "💬 Dialogue" : "📷 Upload Screenshot"}
              </button>
            ))}
          </div>

          {/* Screenshot upload trigger */}
          {mode === "screen" && !screenshotB64 && (
            <div className="mb-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleScreenshotUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-[#0000CD]/40 bg-[#FFFFFE] rounded-lg py-2.5 text-xs text-[#6B6359] hover:text-[#0000CD] hover:border-[#0000CD] transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon size={14} />
                Click to attach image or screenshot
              </button>
            </div>
          )}

          {/* Text Input & Send Button */}
          <div className="relative flex items-center">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                mode === "screen" && screenshotB64
                  ? "Ask about the screenshot… (Press Enter to send)"
                  : "Message Orion… (Press Enter to send, Shift+Enter for newline)"
              }
              rows={2}
              className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] focus:ring-2 focus:ring-[#0000CD]/15 rounded-xl px-4 py-3 pr-14 text-sm text-[#1F1915] placeholder:text-[#B5AFA5] outline-none resize-none leading-relaxed transition-all shadow-sm"
            />
            <button
              onClick={send}
              disabled={loading || (!input.trim() && !screenshotB64)}
              className="absolute right-3 bottom-3 w-9 h-9 rounded-lg bg-[#0000CD] hover:bg-[#000099] disabled:bg-[#DDD9D1] disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-sm"
              title="Send Message"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 text-[11px] text-[#8A8279]">
            <span>🔒 Confidential session · Sandboxed execution</span>
            <span>Anthropic Safety Guidelines Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
