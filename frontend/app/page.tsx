"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import OrchestraHero from "@/components/landing/OrchestraHero";
import OrchestrationVisualizer from "@/components/landing/OrchestrationVisualizer";
import BentoGraphGallery from "@/components/landing/BentoGraphGallery";
import SplitTerminalView from "@/components/landing/SplitTerminalView";
import HowItWorksCarousel from "@/components/landing/HowItWorksCarousel";
import ModelShowcase from "@/components/landing/ModelShowcase";
import SocialProofTestimonials from "@/components/landing/SocialProofTestimonials";
import LiveInteractiveDemo from "@/components/landing/LiveInteractiveDemo";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1F1915] selection:bg-[#E8EEFF] selection:text-[#2B2FE0] font-sans antialiased overflow-x-hidden">
      <LandingNavbar />
      <main>
        <OrchestraHero />
        <OrchestrationVisualizer />
        <BentoGraphGallery />
        <SplitTerminalView />
        <HowItWorksCarousel />
        <ModelShowcase />
        <SocialProofTestimonials />
        <LiveInteractiveDemo />
      </main>
      <LandingFooter />
    </div>
  );
}
