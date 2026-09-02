"use client";

import DashboardTabs from "@/components/agentops/DashboardTabs";
import Hero from "@/components/agentops/Hero";
import MaintenancePage from "@/components/agentops/MaintenancePage";
import SettingsPage from "@/components/agentops/SettingsPage";
import Sidebar from "@/components/agentops/Sidebar";
import ToolsPage from "@/components/agentops/toolspage";
import { useAuthStore } from "@/store/authStore";
import MemoryPage from "@/components/agentops/MemoryPage";
import OrionPanel from "@/components/orion/OrionPanel";
import WorkflowCanvas from "@/components/workflows/WorkflowCanvas";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("Dashboard");
  const { user } = useAuthStore();

  useEffect(() => {
    async function syncAuth() {
      if (useAuthStore.getState().isAuthenticated) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();

        useAuthStore.getState().setAuth(
          {
            id: data.user_id ?? data.id,
            name: data.name ?? "",
            email: data.email,
            role: data.role,
          },
          "session"
        );
      } catch {
        router.replace("/login");
      }
    }
    syncAuth();
  }, [router]);

  return (
    <div className="flex h-screen bg-[#FAF9F5] text-[#1F1915] overflow-hidden">
      <Sidebar active={activePage} setActive={setActivePage} user={user} />
      <main className="flex-1 overflow-y-auto bg-[#FAF9F5]">
        {activePage === "Dashboard" && (
          <div className="max-w-7xl mx-auto">
            <Hero />
            <div className="px-8 py-6">
              <DashboardTabs />
            </div>
          </div>
        )}

        {activePage === "Settings" && (
          <div className="max-w-5xl mx-auto p-8">
            <SettingsPage />
          </div>
        )}

        {activePage === "History" && (
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-[#FFFFFE] border border-[#EBE8E2] rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-medium text-[#1F1915]">Execution History</h2>
              <p className="text-[#6B6359] text-sm mt-1">Previous multi-agent tasks and runs will appear here.</p>
            </div>
          </div>
        )}

        {activePage === "Workflows" && <WorkflowCanvas />}
        {activePage === "Orion" && <OrionPanel />}
        {activePage === "Tools" && <ToolsPage />}

        {activePage === "Memory" && (
          <div className="max-w-5xl mx-auto p-8">
            <MemoryPage />
          </div>
        )}
        
        {activePage === "Maintenance" && <MaintenancePage />}
      </main>
    </div>
  );
}
