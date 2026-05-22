"use client";

import React from "react";
import { QrCode } from "lucide-react";
import { useLanguage } from "@/app/components/Context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer
      id="about"
      className="pt-24 pb-12 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <QrCode className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tighter text-slate-900 uppercase">
                QRDINE
              </span>
            </div>
            <p className="text-slate-500 mb-6">{f.tagline}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">
              {f.product}
            </h4>
            <ul className="space-y-4 text-slate-500">
              {f.productLinks.map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">
              {f.company}
            </h4>
            <ul className="space-y-4 text-slate-500">
              {f.companyLinks.map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">
              {f.resources}
            </h4>
            <ul className="space-y-4 text-slate-500">
              {f.resourceLinks.map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 space-y-4 md:space-y-0">
          <p>
            © {new Date().getFullYear()} {f.copyright}
          </p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-slate-600 transition-colors">
              {f.privacy}
            </a>
            <a href="#" className="hover:text-slate-600 transition-colors">
              {f.terms}
            </a>
            <a href="#" className="hover:text-slate-600 transition-colors">
              {f.cookies}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}



