import React from "react";
import Link from "next/link";
import { Shield, PhoneCall, ExternalLink, Globe } from "lucide-react";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const links = {
    ecosystem: [
      { name: "Scam Analyzer", href: "/#scam-analyzer" },
      { name: "Legal AI Advisor", href: "/#scam-analyzer" },
      { name: "AI Cyber Assistant", href: "/#ai-assistant-showcase" },
      { name: "Learning Dashboard", href: "/#learning-hub-page" }
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Founder Vision", href: "/about#vision" },
      { name: "Technology Stack", href: "/technology" },
      { name: "Careers", href: "/about#careers" }
    ],
    trust: [
      { name: "Trust Center", href: "/trust" },
      { name: "Privacy Policy", href: "/legal/privacy" },
      { name: "Terms of Service", href: "/legal/terms" },
      { name: "Cookie Policy", href: "/legal/cookies" }
    ]
  };

  return (
    <footer className="bg-slate-950 border-t border-white/[0.05] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-white/[0.05]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-md font-semibold font-mono tracking-wider text-slate-350">
                CYBER<span className="text-white">SAATHI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              CyberSaathi is India{"'"}s leading AI-powered digital safety network. We construct localized intelligence layers to defend individuals, businesses, and communities from emergent cyber fraud.
            </p>
            
            {/* National Helpline Info */}
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/20 max-w-sm flex items-start gap-3">
              <PhoneCall className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">National Helpline</p>
                <p className="text-sm font-bold text-white mt-0.5">Call 1930</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Immediate financial fraud reporting to the Government of India National Cyber Crime Portal.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links Cols */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Ecosystem Tools</h3>
            <ul className="mt-4 space-y-2">
              {links.ecosystem.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Organization</h3>
            <ul className="mt-4 space-y-2">
              {links.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Trust & Legal</h3>
            <ul className="mt-4 space-y-2">
              {links.trust.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-slate-500 text-center md:text-left">
            <span>&copy; {currentYear} CyberSaathi Foundation. All rights reserved.</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Made for India
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
