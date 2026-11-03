"use client";

import React, { useState } from 'react';
import { FileText, Palette, Image as ImageIcon } from 'lucide-react';

interface LegalDocsProps {
  initialTab?: 'privacy' | 'terms' | 'cookies' | 'brand';
}

export default function LegalDocs({ initialTab = 'privacy' }: LegalDocsProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies' | 'brand'>(initialTab);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colors = [
    { name: 'Obsidian Dark', hex: '#020617', desc: 'Main dark slate background for premium container frames.' },
    { name: 'Electric Blue', hex: '#2563eb', desc: 'Primary core accent, representing modern security guidance.' },
    { name: 'Emerald Trust', hex: '#10b981', desc: 'Success safety status, used for checklists and verified seals.' },
    { name: 'Crimson Alert', hex: '#f43f5e', desc: 'Vulnerability index indicator, highlighting deceptive texts.' }
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div id="legal-docs-page" className="py-24 border-t border-white/[0.04] relative">
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none" />
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
          <FileText className="w-3.5 h-3.5" /> Documentation Core
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Regulatory & <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Brand Assets</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
          Review our formal privacy safeguards, Terms of Service compliance, cookie management parameters, or explore brand identity packages and logo design guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4">
        
        {/* Left Side menu selectors (Columns: 4) */}
        <div className="lg:col-span-4 space-y-2">
          {[
            { label: '🛡️ Privacy Policy & DPDP', key: 'privacy' },
            { label: '⚖️ Terms of Service', key: 'terms' },
            { label: '🍪 Cookie Policy', key: 'cookies' },
            { label: '🎨 Brand Identity Assets', key: 'brand' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'privacy' | 'terms' | 'cookies' | 'brand')}
              className={`w-full text-left px-5 py-4 rounded-xl text-sm font-semibold transition-all border flex items-center justify-between cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/25 hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side Document Display (Columns: 8) */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-white/[0.06] rounded-3xl p-8 shadow-xl relative overflow-hidden min-h-[480px] backdrop-blur-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400/70 block">LAST MODIFIED: JUNE 27, 2026</span>
                <h3 className="text-2xl font-bold text-white mt-1">Privacy Policy & DPDP Alignment</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                <p>
                  CyberSaathi is committed to safeguarding personal data in complete compliance with the **Digital Personal Data Protection (DPDP) Act, 2023** of the Government of India. This Privacy Policy details the zero-trust mechanics governing our marketing portals and playground modules.
                </p>
                <h4 className="font-bold text-white text-sm">1. Zero-Storage Diagnostics Strategy</h4>
                <p>
                  When you utilize our interactive **Scam Analyzer** or **Saathi AI** models, all input variables (such as copy-pasted SMS texts, transcripts, and financial losses) are stored only inside local React component buffers. We strictly do not record these inputs on our server databases or transmit them to advertising networks.
                </p>
                <h4 className="font-bold text-white text-sm">2. Excluded Vulnerability Tokens</h4>
                <p>
                  Our client-side guardrails filter out sensitive user credentials before any data is sent to AI model engines. We never request, process, or store passwords, Aadhaar card integers, PAN details, bank PINs, or UPI authorizations.
                </p>
                <h4 className="font-bold text-white text-sm">3. Indian Sovereign Server Nodes</h4>
                <p>
                  All database and inference API endpoints utilize cloud storage infrastructure situated strictly within the territorial boundaries of India, fully satisfying the local residency guidelines prescribed by national cyber cells.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400/70 block">LAST MODIFIED: JUNE 27, 2026</span>
                <h3 className="text-2xl font-bold text-white mt-1">Terms of Service</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                <p>
                  By accessing the CyberSaathi marketing website and playground sandboxes, you agree to comply with the terms detailed below. If you do not accept these terms, you are prohibited from utilizing our tools.
                </p>
                <h4 className="font-bold text-white text-sm">1. Educational Companion Scope</h4>
                <p>
                  The diagnostics, risk indices, and cyber complaint templates drafted by CyberSaathi{"'"}s AI engines are offered strictly for **informational, training, and educational purposes**. They do not represent formal, certified legal counseling or advocate advice.
                </p>
                <h4 className="font-bold text-white text-sm">2. Non-Liability on Complaint Filings</h4>
                <p>
                  Filing formal complaints with physical cyber cells or police stations remains the sole responsibility of the victim. CyberSaathi does not guarantee recovery of siphoned funds or prosecutorial action based on its mock complaint templates.
                </p>
                <h4 className="font-bold text-white text-sm">3. Responsible Sandbox Use</h4>
                <p>
                  You agree to use our Scam Analyzer strictly to scan potential cybercrime solicitations directed at you. You are forbidden from pasting toxic inputs, injecting scripts, or attempting to compromise or bypass our LLM safety guardrails.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400/70 block">LAST MODIFIED: JUNE 27, 2026</span>
                <h3 className="text-2xl font-bold text-white mt-1">Cookie Policy</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                <p>
                  We believe in a clean, cookie-less browser experience. Unlike modern SaaS portals that install tracking pixels to build ad-retargeting profiles, CyberSaathi maintains strict client sovereignty.
                </p>
                <h4 className="font-bold text-white text-sm">1. Essential Session Cookies</h4>
                <p>
                  We utilize only transient local storage parameters (such as `localStorage` variables) to manage local React states, including your current active page tab or your temporary Safety IQ Quiz progress. These variables are saved locally and are never transmitted back to servers.
                </p>
                <h4 className="font-bold text-white text-sm">2. Third-Party Tracking Pixels</h4>
                <p>
                  CyberSaathi **strictly does not install** third-party trackers (e.g., Google Analytics, Meta Pixel, Hotjar) on its marketing or sandbox interfaces. Your safety lookup records cannot be compiled by brokers or commercial profiles.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-8">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400/70 block">BRAND MANUAL v1.2</span>
                <h3 className="text-2xl font-bold text-white mt-1">Brand Identity & Assets</h3>
              </div>

              {/* Logo Guideline details */}
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5 leading-tight">
                  <ImageIcon className="w-4 h-4 text-emerald-400" /> Logo Version Layout Guidelines
                </h4>
                <p className="text-slate-405 text-xs sm:text-sm leading-relaxed font-sans">
                  CyberSaathi utilizes distinct logo configurations. For designers replacing branding assets, implement matching filenames in `/public/images/logos/` as described below:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                    <span className="font-mono text-[10px] text-emerald-400 block font-bold mb-1">LOGO_NAVBAR_PRIMARY</span>
                    <h5 className="font-bold text-white text-xs mb-1">Primary Shield (Full Color)</h5>
                    <p className="text-slate-500 text-[11px] leading-relaxed font-sans">Integrated on dark glassmorphic backgrounds. Uses deep electric blue gradients.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                    <span className="font-mono text-[10px] text-teal-400 block font-bold mb-1">LOGO_FOOTER_MONO</span>
                    <h5 className="font-bold text-white text-xs mb-1">Monochrome Outline</h5>
                    <p className="text-slate-500 text-[11px] leading-relaxed font-sans">Used on carbon black light footer elements. Scaled down to single tone white outline.</p>
                  </div>
                </div>
              </div>

              {/* Theme color codes */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5 leading-tight">
                  <Palette className="w-4 h-4 text-teal-400" /> Color Swatch Codes
                </h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
                  Use our official hexadecimal safety palette codes for layouts. Tap any swatch to copy its color values to your clipboard.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {colors.map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => handleCopyColor(col.hex)}
                      className="bg-white/5 border border-white/10 p-3 rounded-xl text-left space-y-2 hover:border-white/20 focus:outline-none transition-all relative overflow-hidden cursor-pointer"
                    >
                      <div 
                        className="w-full h-10 rounded-lg border border-white/10 transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: col.hex }}
                      />
                      <div>
                        <h5 className="font-bold text-white text-xs leading-none">{col.name}</h5>
                        <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                          {copiedColor === col.hex ? '✓ Copied!' : col.hex}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
