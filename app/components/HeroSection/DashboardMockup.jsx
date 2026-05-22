import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useLanguage } from "@/app/components/Context/LanguageContext";

export function DashboardMockup() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden aspect-video w-full max-w-3xl mx-auto">
        {/* Top Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-2 w-32 bg-slate-200 rounded-full" />
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-4 hidden md:block">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-8 rounded-lg ${i === 1 ? "bg-blue-50 border border-blue-100" : "bg-slate-50"}`}
              />
            ))}
          </div>

          {/* Main Grid */}
          <div className="col-span-12 md:col-span-9 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl h-32 border border-slate-100">
              <div className="flex justify-between items-start">
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="h-3 w-3 bg-blue-600 rounded-sm" />
                </div>
              </div>
              <div className="mt-4 h-8 w-24 bg-slate-300 rounded" />
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl h-32 border border-slate-100">
              <div className="flex justify-between items-start">
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="h-3 w-3 bg-indigo-600 rounded-sm" />
                </div>
              </div>
              <div className="mt-4 h-8 w-24 bg-slate-300 rounded" />
            </div>
            <div className="col-span-2 bg-slate-50 p-4 rounded-2xl h-48 border border-slate-100">
              <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                    <div className="h-3 w-full bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating element */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden lg:block"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Check size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                {h.orderBadge}
              </p>
              <p className="text-sm font-bold text-slate-900">
                {h.orderDetail}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}



