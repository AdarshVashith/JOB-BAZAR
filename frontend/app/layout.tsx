import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentOps — Multi-Agent Safety & Task Orchestration",
  description: "Thoughtful multi-agent planning, research, verified code generation, and execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F5] text-[#1F1915] antialiased selection:bg-[#E8EEFF] selection:text-[#0000CD]">
        {children}
      </body>
    </html>
  );
}
