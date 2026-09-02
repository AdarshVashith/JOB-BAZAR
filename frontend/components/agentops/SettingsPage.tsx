"use client";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import {
  User,
  Key,
  Sliders,
  CreditCard,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

const TABS = ["Profile", "Plan", "API Keys", "Preferences"];
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        on ? "bg-[#0000CD]" : "bg-[#DDD9D1]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [prefs, setPrefs] = useState({
    webSearch: true,
    caching: false,
    smartSuggestion: true,
  });
  const [ragVal, setRagVal] = useState(1.5);
  const [model, setModel] = useState("openai/gpt-oss-120b");
  const [apiKeys, setApiKeys] = useState({
    groq_key: "",
    serpapi_key: "",
    github_token: "",
  });
  const [showKeys, setShowKeys] = useState(false);
  const { user, updateUser } = useAuthStore();

  // Profile
  const [name, setName] = useState(user?.name ?? "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/apikeys`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.keys) {
          setApiKeys({
            groq_key: data.keys.groq_key || "",
            serpapi_key: data.keys.serpapi_key || "",
            github_token: data.keys.github_token || "",
          });
        }
      })
      .catch(console.error);

    fetch(`${API}/preferences`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) {
          setModel(data.preferences.model || "openai/gpt-oss-120b");
          setPrefs({
            webSearch: data.preferences.web_search,
            caching: data.preferences.smart_cache,
            smartSuggestion: data.preferences.smart_suggestion,
          });
          setRagVal(data.preferences.rag_threshold || 1.5);
        }
      })
      .catch(console.error);
  }, []);

  const savePreferences = async () => {
    try {
      const res = await fetch(`${API}/preferences`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          web_search: prefs.webSearch,
          smart_cache: prefs.caching,
          smart_suggestion: prefs.smartSuggestion,
          rag_threshold: ragVal,
        }),
      });
      if (res.ok) alert("Preferences saved successfully");
    } catch {
      alert("Failed to save preferences");
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) return;
    setProfileLoading(true);
    setProfileMsg("");
    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg("Profile updated");
        updateUser({ name: data.name });
      } else {
        setProfileMsg(data.detail ?? "Error saving profile");
      }
    } catch {
      setProfileMsg("Network error");
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async () => {
    if (!currentPw || !newPw) {
      setPwMsg("Please fill both password fields");
      return;
    }
    setPwLoading(true);
    setPwMsg("");
    try {
      const res = await fetch(`${API}/auth/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          current_password: currentPw,
          new_password: newPw,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg("Password changed. Signing out…");
        setTimeout(() => signOut(), 1500);
      } else {
        setPwMsg(data.detail ?? "Failed to update password");
      }
    } catch {
      setPwMsg("Network error");
    } finally {
      setPwLoading(false);
    }
  };

  const saveKeys = async () => {
    try {
      const res = await fetch(`${API}/apikeys`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiKeys),
      });
      if (res.ok) alert("API keys securely encrypted & saved");
    } catch {
      alert("Failed to save API keys");
    }
  };

  const signOut = async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    useAuthStore.getState().logout();
    window.location.href = "/login";
  };

  return (
    <div className="space-y-6">
      {/* Header & User Summary */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1F1915]">
            Workspace Settings & Access Keys
          </h1>
          <p className="text-sm text-[#6B6359] mt-0.5">
            Manage your researcher identity, custom LLM providers, and execution parameters.
          </p>
        </div>

        <button
          onClick={signOut}
          className="btn-outline-warm text-xs hover:border-[#D84C4C] hover:text-[#D84C4C]"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>

      {/* Profile Bar */}
      <div className="card-editorial p-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#0000CD] text-white flex items-center justify-center font-medium text-lg shadow-sm">
            {name?.[0]?.toUpperCase() || "R"}
          </div>
          <div>
            <p className="text-sm font-medium text-[#1F1915]">{name || "Researcher"}</p>
            <p className="text-xs text-[#8A8279]">{user?.email}</p>
          </div>
        </div>
        <span className="badge-safety text-xs">
          <Shield size={12} /> Researcher Verified
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EBE8E2] gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-[1px] ${
              activeTab === tab
                ? "border-[#0000CD] text-[#0000CD]"
                : "border-transparent text-[#6B6359] hover:text-[#1F1915]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === "Profile" && (
        <div className="card-editorial p-6 space-y-6">
          <div className="space-y-4 max-w-md">
            <h3 className="text-base font-medium text-[#1F1915]">Personal Details</h3>
            <div>
              <label className="block text-xs font-medium text-[#6B6359] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] rounded-lg px-3.5 py-2 text-sm text-[#1F1915] outline-none"
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={profileLoading}
              className="btn-primary-blue text-xs"
            >
              Save Profile
            </button>
            {profileMsg && <p className="text-xs text-[#2D7A5E]">{profileMsg}</p>}
          </div>

          <hr className="border-[#EBE8E2]" />

          <div className="space-y-4 max-w-md">
            <h3 className="text-base font-medium text-[#1F1915]">Change Password</h3>
            <div>
              <label className="block text-xs font-medium text-[#6B6359] mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] rounded-lg px-3.5 py-2 text-sm text-[#1F1915] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6359] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] rounded-lg px-3.5 py-2 text-sm text-[#1F1915] outline-none"
              />
            </div>

            <button
              onClick={changePassword}
              disabled={pwLoading}
              className="btn-outline-warm text-xs"
            >
              Update Password
            </button>
            {pwMsg && <p className="text-xs text-[#2D7A5E]">{pwMsg}</p>}
          </div>
        </div>
      )}

      {/* ── API KEYS TAB ── */}
      {activeTab === "API Keys" && (
        <div className="card-editorial p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-[#1F1915]">Provider Credentials</h3>
              <p className="text-xs text-[#6B6359] mt-0.5">
                Keys are encrypted in Postgres and only decrypted during agent execution.
              </p>
            </div>
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="btn-outline-warm text-xs py-1 px-2.5"
            >
              {showKeys ? <EyeOff size={13} /> : <Eye size={13} />}
              {showKeys ? "Hide Keys" : "Reveal Keys"}
            </button>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-[#6B6359] mb-1.5">
                Groq API Key (High Speed LLM)
              </label>
              <input
                type={showKeys ? "text" : "password"}
                value={apiKeys.groq_key}
                onChange={(e) =>
                  setApiKeys((k) => ({ ...k, groq_key: e.target.value }))
                }
                placeholder="gsk_..."
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] rounded-lg px-3.5 py-2 text-sm font-mono text-[#1F1915] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6359] mb-1.5">
                SerpAPI Key (Web Search Fallback)
              </label>
              <input
                type={showKeys ? "text" : "password"}
                value={apiKeys.serpapi_key}
                onChange={(e) =>
                  setApiKeys((k) => ({ ...k, serpapi_key: e.target.value }))
                }
                placeholder="Optional"
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] rounded-lg px-3.5 py-2 text-sm font-mono text-[#1F1915] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6359] mb-1.5">
                GitHub Personal Access Token (Repo Ingestion)
              </label>
              <input
                type={showKeys ? "text" : "password"}
                value={apiKeys.github_token}
                onChange={(e) =>
                  setApiKeys((k) => ({ ...k, github_token: e.target.value }))
                }
                placeholder="ghp_..."
                className="w-full bg-[#FFFFFE] border border-[#DDD9D1] focus:border-[#0000CD] rounded-lg px-3.5 py-2 text-sm font-mono text-[#1F1915] outline-none"
              />
            </div>

            <button onClick={saveKeys} className="btn-primary-blue text-xs">
              Save API Keys
            </button>
          </div>
        </div>
      )}

      {/* ── PREFERENCES TAB ── */}
      {activeTab === "Preferences" && (
        <div className="card-editorial p-6 space-y-6">
          <div className="space-y-4 max-w-lg">
            <h3 className="text-base font-medium text-[#1F1915]">LLM Engine Routing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "openai/gpt-oss-120b", name: "Groq 120B (Primary)" },
                { id: "qwen/qwen3.8-27b", name: "Qwen 27B (Fallback)" },
                { id: "openai/gpt-oss-20b", name: "Groq 20B (Fast)" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                    model === m.id
                      ? "border-[#0000CD] bg-[#E8EEFF] text-[#0000CD]"
                      : "border-[#EBE8E2] bg-[#FAF9F5] text-[#6B6359] hover:bg-[#FFFFFE]"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            <hr className="border-[#EBE8E2] my-4" />

            <h3 className="text-base font-medium text-[#1F1915]">Orchestration Features</h3>
            <div className="space-y-3">
              {[
                {
                  key: "webSearch",
                  label: "Live Web Search",
                  desc: "Permit Researcher agent to query DuckDuckGo & SerpAPI",
                },
                {
                  key: "caching",
                  label: "Semantic DAG Caching",
                  desc: "Cache intermediate agent results in Redis",
                },
                {
                  key: "smartSuggestion",
                  label: "Auto-Refinement",
                  desc: "Critic agent suggestions automatically applied",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2 border-b border-[#EBE8E2]"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1F1915]">{item.label}</p>
                    <p className="text-xs text-[#8A8279]">{item.desc}</p>
                  </div>
                  <Toggle
                    on={prefs[item.key as keyof typeof prefs]}
                    onChange={(v) =>
                      setPrefs((p) => ({ ...p, [item.key]: v }))
                    }
                  />
                </div>
              ))}
            </div>

            <button onClick={savePreferences} className="btn-primary-blue text-xs mt-2">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── PLAN TAB ── */}
      {activeTab === "Plan" && (
        <div className="card-editorial p-6 space-y-4 max-w-lg">
          <h3 className="text-base font-medium text-[#1F1915]">Research Tier</h3>
          <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#EBE8E2]">
            <span className="badge-safety text-xs mb-2">Self-Hosted Community</span>
            <h4 className="text-lg font-serif font-medium text-[#1F1915] mt-1">Unlimited Local Workflows</h4>
            <p className="text-xs text-[#6B6359] mt-1">
              Local PostgreSQL storage, Redis stream bus, and custom BYOK Groq / Ollama endpoints.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
