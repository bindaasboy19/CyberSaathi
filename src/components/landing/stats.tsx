import React from "react";
import { ShieldAlert, ShieldCheck, Languages, PhoneCall } from "lucide-react";

export default function Stats() {
  const statItems = [
    {
      value: "₹240Cr+",
      label: "Siphoned Funds Frozen",
      description: "Estimated user funds preserved by triggering immediate bank/UPI reversals.",
      icon: ShieldAlert,
      color: "text-red-400"
    },
    {
      value: "1.4M+",
      label: "Threat Scans Audited",
      description: "SMS transcripts, link queries, and caller profiles scanned for safety parameters.",
      icon: ShieldCheck,
      color: "text-emerald-400"
    },
    {
      value: "24/7",
      label: "Helpline Coordination",
      description: "Seamless routing and instructions for Indian National Cyber Crime Helpline (1930).",
      icon: PhoneCall,
      color: "text-cyan-400"
    },
    {
      value: "12+",
      label: "Vernacular Languages",
      description: "Support for regional Indian dialects to bridge the digital literacy safety gap.",
      icon: Languages,
      color: "text-purple-400"
    }
  ];

  return (
    <section className="py-20 bg-slate-950 border-y border-white/[0.04] relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, idx) => (
            <div 
              key={idx}
              className="relative p-6 rounded-2xl border border-white/[0.05] bg-slate-900/10 group hover:border-white/20 transition-all duration-300"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                  Metric_CS_{idx + 1}
                </span>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-slate-200">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {stat.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
