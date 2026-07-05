import { Check, X, Cpu } from "lucide-react";

export default function Comparison() {
  const comparisonData = [
    {
      feature: "Indian Legal Context",
      saathi: "Fully mapped to BNS 2023 (Bharatiya Nyaya Sanhita) & IT Act 2000 provisions.",
      generic: "Vague, outdated general references to global or US laws (e.g. wire fraud).",
      supported: true
    },
    {
      feature: "Scam Database Sync",
      saathi: "Synchronized with active UPI registry, fraudulent sites, and phishing databases.",
      generic: "Static training data cutoff. Zero ability to check live links or active bank fraud IDs.",
      supported: true
    },
    {
      feature: "Actionable Triaging",
      saathi: "Provides instant, step-by-step 'Golden Hour' steps, bank contacts, and police report guidelines.",
      generic: "Wordy explanations without practical, region-specific emergency directions.",
      supported: true
    },
    {
      feature: "Dialect & Audio Analysis",
      saathi: "Analyzes regional Hindi dialects and WhatsApp voice clips for deepfake/spoof indicators.",
      generic: "Mainly text-focused. Low resolution check on voice or Indian phonetics.",
      supported: true
    },
    {
      feature: "100% Privacy Sandbox",
      saathi: "Zero tracking. Logs are strictly sandboxed. Chats are excluded from general model training.",
      generic: "Chats are siphoned to general LLM training datasets, risking leak of sensitive personal hack details.",
      supported: true
    }
  ];

  return (
    <section className="py-24 bg-slate-950/20 border-t border-white/[0.04] relative" id="why-cybersaathi">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-cyan-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture Separation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why Not Simply ChatGPT?
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
            Generic AI models are designed for general productivity. CyberSaathi is custom-engineered to intercept and triage cybercrime threats under the Indian safety landscape.
          </p>
        </div>

        {/* Matrix Comparison Table */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-white/[0.08] bg-slate-900/10 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-950/90 border-b border-white/[0.08] text-xs font-mono text-slate-400 uppercase tracking-wider">
                  <th className="p-5 md:p-6 font-semibold">Security Feature</th>
                  <th className="p-5 md:p-6 font-semibold text-cyan-400">CyberSaathi Platform</th>
                  <th className="p-5 md:p-6 font-semibold text-slate-500">Generic AI Models</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/[0.05] text-xs md:text-sm">
                {comparisonData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    
                    {/* Feature Title */}
                    <td className="p-5 md:p-6 font-bold text-white leading-relaxed max-w-[200px]">
                      {item.feature}
                    </td>

                    {/* CyberSaathi Advantage */}
                    <td className="p-5 md:p-6 text-slate-205 bg-cyan-950/[0.05] leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item.saathi}</span>
                      </div>
                    </td>

                    {/* Generic AI Limit */}
                    <td className="p-5 md:p-6 text-slate-400 leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-red-500/70 shrink-0 mt-0.5" />
                        <span>{item.generic}</span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
