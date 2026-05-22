"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Play } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";
import { useLanguage } from "@/app/components/Context/LanguageContext";

export function HeroSection() {
  const { lang, t } = useLanguage();
  const h = t.hero;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            {/* <AnimatePresence mode="wait">
              <motion.div
                key={lang + "-badge"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-sm border border-blue-100"
              >
                <span>{h.badge}</span>
                <ChevronRight size={14} />
              </motion.div>
            </AnimatePresence> */}

            {/* Headline */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lang + "-headline"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
                  {h.headline1}{" "}
                  <span className="text-blue-600">{h.headline2}</span>{" "}
                  {h.headline3}
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                  {h.subtext}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2">
                <span>{h.cta1}</span>
                <ChevronRight size={20} />
              </button>
              <button className="w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-center space-x-2 group">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Play size={14} fill="currentColor" />
                </div>
                <span>{h.cta2}</span>
              </button>
            </div>
          </motion.div>

          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}



