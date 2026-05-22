"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, QrCode } from "lucide-react";
import { useLanguage } from "@/app/components/Context/LanguageContext";

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center bg-slate-100 rounded-full p-1 gap-0.5">
      <button
        onClick={() => setLang("en")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 ${
          lang === "en"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <span>EN</span>
      </button>
      <button
        onClick={() => setLang("th")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 ${
          lang === "th"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <span>TH</span>
      </button>
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const nav = t.nav;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: nav.home, href: "#" },
    { name: nav.features, href: "#features" },
    { name: nav.pricing, href: "#pricing" },
    { name: nav.about, href: "#about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <QrCode className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-900 uppercase">
              QRDINING
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold tracking-widest text-slate-600 hover:text-blue-600 transition-colors uppercase"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageToggle />
            <button 
                onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/login");
                }}
                className="text-xs font-bold tracking-widest text-slate-600 hover:text-blue-600 px-4 py-2 uppercase cursor-pointer"
            >
              {nav.login}
            </button>
            <button className="bg-blue-600 text-white text-xs font-bold tracking-widest px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 uppercase">
              {nav.getStarted}
            </button>
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-sm font-bold tracking-widest text-slate-600 hover:text-blue-600 uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                <button 
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/login");
                    }}
                    className="text-sm font-bold tracking-widest text-slate-600 uppercase py-2 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {nav.login}
                </button>
                <button className="bg-blue-600 text-white text-sm font-bold tracking-widest px-6 py-3 rounded-xl hover:bg-blue-700 uppercase">
                  {nav.getStarted}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}



