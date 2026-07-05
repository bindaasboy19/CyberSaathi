import React from "react";
import { Quote, HeartHandshake, ShieldCheck, EyeOff, Scale } from "lucide-react";

export default function Founder() {
  const values = [
    {
      title: "Radical Transparency",
      desc: "Our model constraints, limitations, and security parameters are fully open to public audit. We declare when we use AI and when we query government registries.",
      icon: Scale
    },
    {
      title: "Data Isolation Sandbox",
      desc: "We believe privacy is absolute. CyberSaathi does not monetize or cache chat logs, caller IDs, or text queries. All inputs are wiped post-threat evaluation.",
      icon: EyeOff
    },
    {
      title: "Restorative Guidance",
      desc: "Our priority is recovery. We do not stop at flagging threats; we construct custom recovery scripts, bank dispute briefs, and connect victims directly with emergency assistance.",
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-24 bg-slate-950/20 border-t border-white/[0.04] relative" id="founder-vision">
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Top Split Layout: Vision Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Founder{"'"}s Call</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Democratizing Cyber Safety in the Digital Age
            </h2>

            <p className="text-sm text-slate-405 leading-relaxed">
              As digital payment and internet penetration accelerate across India, cybercriminals exploit the gap between user confidence and technological sophistication. Our mission is to bridge this gap.
            </p>
            <p className="text-sm text-slate-405 leading-relaxed">
              CyberSaathi is built as a non-commercial public utility to serve every Indian citizen. By providing real-time, multilingual, and legal-grounded defense support, we aim to eliminate the panic that follows financial and social cyber exploitation.
            </p>
          </div>

          {/* Right Column: Graphic Quote Block */}
          <div className="lg:col-span-6">
            <div className="relative p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-slate-900/20 backdrop-blur-xl">
              <Quote className="w-10 h-10 text-cyan-500/20 absolute -top-4 -left-4" />
              
              <div className="space-y-6">
                <blockquote className="text-sm md:text-base text-slate-200 italic leading-relaxed font-medium">
                  &ldquo;Digital progression cannot succeed without digital trust. CyberSaathi does not exist to replace official portals, but to act as the immediate safety advisor during a {"user's"} most vulnerable moments.&rdquo;
                </blockquote>
                
                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                  {/* Placeholder Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[1px] shrink-0">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
                      CS
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">CyberSaathi Core Team</p>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                      Social Impact Initiatives
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Values Grid */}
        <div className="pt-12 border-t border-white/[0.05] space-y-12">
          <h3 className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Core Operational Pillars
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/[0.04] bg-slate-900/10 hover:border-slate-800 transition-colors space-y-4">
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center text-cyan-400 border border-white/5">
                  <val.icon className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-md font-bold text-white">{val.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
