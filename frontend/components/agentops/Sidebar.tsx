"use client";
import type { User } from "@/store/authStore";
import {
  Bot,
  Database,
  History,
  LayoutDashboard,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Shield,
  Wrench,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "History", icon: History },
  { label: "Orion", icon: Bot },
  { label: "Tools", icon: Wrench },
  { label: "Memory", icon: Database },
  { label: "Settings", icon: Settings },
  { label: "Maintenance", icon: Newspaper },
];

interface Props {
  active: string;
  setActive: (value: string) => void;
  user: User | null;
}

export default function Sidebar({ active, setActive, user }: Props) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative
        ${collapsed ? "w-20" : "w-64"}
        flex
        flex-col
        border-r
        border-[#EBE8E2]
        bg-[#FFFFFE]
        transition-all
        duration-300
        overflow-hidden
        z-20
      `}
    >
      {/* HEADER */}
      <div className="border-b border-[#EBE8E2] px-4 py-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0000CD] flex items-center justify-center text-white font-medium shadow-sm">
                <Sparkles size={16} />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-[#1F1915]">
                  AgentOps
                </h1>
                <p className="text-[11px] font-medium tracking-wide uppercase text-[#8A8279]">
                  Safety & Research
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              h-8
              w-8
              flex
              items-center
              justify-center
              rounded-lg
              text-[#8A8279]
              hover:text-[#1F1915]
              hover:bg-[#F5F3EF]
              transition-all
            "
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-[#8A8279]">
            Platform
          </div>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label;

          return (
            <button
              key={item.label}
              title={collapsed ? item.label : ""}
              onClick={() => setActive(item.label)}
              className={`
                w-full
                flex
                items-center
                ${collapsed ? "justify-center" : "gap-3"}
                rounded-lg
                px-3
                py-2.5
                text-left
                transition-all
                text-sm
                font-medium
                ${
                  isActive
                    ? `
                      bg-[#E8EEFF]
                      text-[#0000CD]
                      shadow-sm
                    `
                    : `
                      text-[#6B6359]
                      hover:bg-[#F5F3EF]
                      hover:text-[#1F1915]
                    `
                }
              `}
            >
              <Icon
                size={18}
                className={isActive ? "text-[#0000CD]" : "text-[#8A8279]"}
              />

              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* USER & ADMIN SECTION */}
      <div className="p-3 border-t border-[#EBE8E2] space-y-2">
        {user?.role === "admin" && (
          <button
            title={collapsed ? "Admin Console" : ""}
            onClick={() => router.push("/admin")}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2.5
              rounded-lg
              px-3
              py-2
              border
              border-[#0000CD]/30
              bg-[#E8EEFF]/80
              text-[#0000CD]
              hover:bg-[#E8EEFF]
              text-xs
              font-medium
              transition-all
            "
          >
            <Shield size={15} />
            {!collapsed && <span>Admin Console</span>}
          </button>
        )}

        {!collapsed && user && (
          <div className="px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#EBE8E2] flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-[#1F1915] truncate">
                {user.name || "Researcher"}
              </p>
              <p className="text-[11px] text-[#8A8279] truncate">{user.email}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#3D8B6E]" title="Connected" />
          </div>
        )}
      </div>
    </aside>
  );
}
