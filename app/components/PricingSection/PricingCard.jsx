import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

export function PricingCard({
  plan,
  price,
  features,
  isRecommended,
  index,
  cta,
  badge,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-10 rounded-[2.5rem] flex flex-col ${
        isRecommended
          ? "bg-slate-900 text-white shadow-2xl scale-105 z-10 border-4 border-blue-600/30"
          : "bg-white text-slate-900 border border-slate-100 shadow-lg"
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl whitespace-nowrap">
          {badge || "Recommended"}
        </div>
      )}
      <div className="mb-8">
        <h3
          className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${isRecommended ? "text-blue-400" : "text-blue-600"}`}
        >
          {plan}
        </h3>
        <div className="flex items-baseline">
          <span className="text-5xl font-bold tracking-tighter">${price}</span>
          <span
            className={`ml-2 text-sm font-medium ${isRecommended ? "text-slate-400" : "text-slate-400"}`}
          >
            /mo
          </span>
        </div>
      </div>
      <div className="space-y-4 mb-10 flex-grow">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${isRecommended ? "bg-blue-600/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}
            >
              <Check size={14} />
            </div>
            <span
              className={isRecommended ? "text-slate-300" : "text-slate-600"}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>
      <button
        className={`w-full py-4 rounded-2xl font-bold transition-all ${
          isRecommended
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-slate-100 hover:bg-slate-200 text-slate-900"
        }`}
      >
        {cta || "Choose Plan"}
      </button>
    </motion.div>
  );
}



