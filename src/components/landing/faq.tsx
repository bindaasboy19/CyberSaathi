"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { FAQ_ITEMS } from './cyber-data';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setActiveIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 border-t border-white/[0.04] relative bg-slate-950/20">
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
          <HelpCircle className="w-3.5 h-3.5" /> Support Center
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Questions</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Got questions regarding CyberSaathi metrics, data storage practices, legal templates, or emergency incident lines? Find rapid explanations compiled by our legal safety cell below.
        </p>
      </div>

      {/* Accordion container */}
      <div className="max-w-4xl mx-auto space-y-4 px-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div 
              key={idx}
              className="bg-slate-900/40 border border-white/[0.06] overflow-hidden transition-all duration-250 hover:border-white/15 rounded-2xl backdrop-blur-md"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 font-sans text-white font-bold text-sm sm:text-base focus:outline-none cursor-pointer"
              >
                <span>{item.q}</span>
                <span className="p-1 rounded-md bg-white/5 border border-white/10 text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4.5 h-4.5 text-emerald-400" /> : <ChevronDown className="w-4.5 h-4.5" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/5 bg-white/[0.01]"
                  >
                    <p className="p-6 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Direct Contact Banner */}
      <div className="mt-16 bg-slate-900/40 border border-emerald-500/20 rounded-3xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md mx-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
            <AlertCircle className="w-6.5 h-6.5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Still have questions?</h4>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 font-sans">Our technical and legal help desk is active 24/7. Reach out via email or call our direct cells.</p>
          </div>
        </div>
        <a
          href="mailto:help@cybersaathi.com"
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-md text-center whitespace-nowrap"
        >
          Email Help Desk
        </a>
      </div>

    </section>
  );
}
