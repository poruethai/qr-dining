"use client";

import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/app/components/Context/LanguageContext";

export function CTASection() {
  const { t } = useLanguage();
  const c = t.cta;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-blue-600 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden"
        >
          {/* Decorative background circles */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] bg-white/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] bg-blue-400/20 rounded-full blur-[80px]" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-white mb-8">
              {c.heading}
            </h2>
            <p className="text-blue-100 text-xl mb-12 max-w-xl mx-auto">
              {c.subtext}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                className="w-full sm:w-auto bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
                onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/login");
                  }}
              >
                {c.btn1}
              </button>
              <button 
                className="w-full sm:w-auto bg-blue-700 text-white border border-blue-500/50 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all"
                onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = "mailto:poruethaikitikam@gmail.com";
                    }}
              >
                {c.btn2}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



