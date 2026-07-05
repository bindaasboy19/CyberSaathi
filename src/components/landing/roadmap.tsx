import React from "react";
import { Milestone } from "lucide-react";

export default function Roadmap() {
  const phases = [
    {
      phase: "Phase 1: Foundation",
      status: "COMPLETED",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "Core AI Safety Matrix",
      desc: "Bootstrapping localized NLP scam classifiers. Release of Scam Analyzer Sandbox & Legal AI database."
    },
    {
      phase: "Phase 2: Integration",
      status: "IN PROGRESS",
      statusColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      title: "WhatsApp & Telegram Safety Bots",
      desc: "Deploying direct API channels. Users can forward suspicious messages/audios directly on WhatsApp for triage."
    },
    {
      phase: "Phase 3: Legal Scale",
      status: "Q3 2026",
      statusColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: "BNS 2023 API Gateway",
      desc: "Expanding Legal AI translation layer to support vernacular regional scripts for legal drafting and reporting."
    },
    {
      phase: "Phase 4: Ecosystem",
      status: "Q4 2026",
      statusColor: "text-slate-400 bg-slate-800/40 border-slate-700/30",
      title: "Helpline Integration Triage",
      desc: "Developing secure handshake systems for reporting direct mock alerts to banks and police portals."
    }
  ];

  return (
    <section className="py-24 bg-slate-950/20 border-t border-white/[0.04] relative" id="roadmap-preview">
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono tracking-wider">
            <Milestone className="w-3.5 h-3.5" />
            <span>Development Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Ecosystem Roadmap
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            We are building iteratively. Explore our progression from localized sandbox triaging to comprehensive national ecosystem channels.
          </p>
        </div>

        {/* Timeline Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {phases.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl border border-white/[0.04] bg-slate-900/10 hover:border-slate-800 transition-all flex flex-col justify-between h-64 relative"
            >
              {/* Connector line overlay */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.02] -z-10" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                    Step_0{idx + 1}
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-405 leading-relaxed">{item.desc}</p>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-500 font-mono uppercase tracking-widest pt-4 border-t border-white/5 mt-auto">
                {item.phase}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
