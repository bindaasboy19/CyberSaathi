import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-slate-950/20 relative overflow-hidden border-t border-white/[0.04]">
      {/* Background aurora lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Threat Detection</span>
        </div>

        {/* Taglines */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Regain Digital Confidence. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400">
              Deploy CyberSaathi Today.
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Equip yourself, your family, or your community with automated fraud protection. Free access to basic threat checks. Fully compliant with BNS 2023 legal guidelines.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-[0_4px_30px_rgba(6,182,212,0.25)] transition-all transform hover:-translate-y-0.5 w-full cursor-pointer"
          >
            <span>Launch CyberSaathi App</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-cyan-400" /> Sandboxed Execution</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Verification logs secure</span>
        </div>

      </div>
    </section>
  );
}
