"use client";

import React from "react";
import { QrCode, Store, Bell } from "lucide-react";
import { Step } from "./Step";
import { useLanguage } from "@/app/components/Context/LanguageContext";

const stepIcons = [Store, QrCode, Bell];

export function HowItWorksSection() {
  const { lang, t } = useLanguage();
  const s = t.steps;

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">
            {s.label}
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            {s.heading}
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
          {s.items.map((step, i) => (
            <Step
              key={lang + i}
              number={`0${i + 1}`}
              title={step.title}
              description={step.description}
              icon={stepIcons[i]}
              isLast={i === s.items.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



