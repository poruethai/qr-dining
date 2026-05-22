"use client";

import React from "react";
import { LanguageProvider } from "@/app/components/Context/LanguageContext";
import { Navbar } from "@/app/components/Navbar/Navbar";
import { HeroSection } from "@/app/components/HeroSection/HeroSection";
import { Feature } from "framer-motion";
import { FeatureSection } from "@/app/components/FeaturesSection/FeatureSection";
import { HowItWorksSection } from "@/app/components/HowItWorkSection/HowItworksection";
import { PricingSection } from "@/app/components/PricingSection/PricingSection";
import { CTASection } from "@/app/components/CTASection/CTASection";
import { Footer } from "@/app/components/Footer/Footer";

export default function LandingPage() {
  return ( 
    <LanguageProvider>
      <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
        <Navbar />
        <HeroSection />
        <FeatureSection />
        <HowItWorksSection /> 
        {/* <PricingSection /> */}
        <CTASection />
        <Footer />
        <style jsx global>{`
          html { scroll-behavior: smooth; }
          body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        `}</style>
      </div>
    </LanguageProvider>
  );
}



