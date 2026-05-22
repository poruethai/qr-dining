"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { PricingCard } from "./PricingCard";
import { useLanguage } from "@/app/components/Context/LanguageContext";

const priceValues = ["0", ["9", "7"], ["29", "24"]];

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const { lang, t } = useLanguage();
  const p = t.pricing;

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">
            {p.label}
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-8">
            {p.heading}
          </h3>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span
              className={`text-sm font-bold transition-colors ${billingPeriod === "monthly" ? "text-slate-900" : "text-slate-400"}`}
            >
              {p.monthly}
            </span>
            <button
              onClick={() =>
                setBillingPeriod(
                  billingPeriod === "monthly" ? "yearly" : "monthly",
                )
              }
              className={`w-14 h-8 rounded-full relative p-1 transition-colors ${
                billingPeriod === "yearly"
                  ? "bg-blue-600"
                  : "bg-slate-200 hover:bg-slate-300"
              }`}
            >
              <motion.div
                animate={{ x: billingPeriod === "monthly" ? 0 : 24 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </button>
            <span
              className={`text-sm font-bold transition-colors ${billingPeriod === "yearly" ? "text-slate-900" : "text-slate-400"}`}
            >
              {p.yearly}{" "}
              <span className="text-blue-600 text-[10px] ml-1 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                {p.save}
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {p.plans.map((plan, i) => {
            const rawPrice = priceValues[i];
            const price = Array.isArray(rawPrice)
              ? billingPeriod === "monthly"
                ? rawPrice[0]
                : rawPrice[1]
              : rawPrice;
            return (
              <PricingCard
                key={lang + i}
                plan={plan.plan}
                price={price}
                features={plan.features}
                isRecommended={i === 1}
                index={i}
                cta={p.cta}
                badge={p.badge}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}



