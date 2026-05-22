"use client";

import React from "react";
import {
  LayoutDashboard,
  QrCode,
  ChefHat,
  Image as ImageIcon,
  Store,
  Bell,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { useLanguage } from "@/app/components/Context/LanguageContext";

const icons = [LayoutDashboard, QrCode, ChefHat, ImageIcon, Store, Bell];

export function FeatureSection() {
  const { lang, t } = useLanguage();
  const f = t.features;

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">
            {f.label}
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            {f.heading}
          </h3>
          <p className="text-lg text-slate-500">{f.subtext}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {f.items.map((feature, i) => (
            <FeatureCard
              key={lang + i}
              icon={icons[i]}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



