import { AlertCircle, ShieldAlert, ArrowRight, UserMinus, ShieldCheck } from "lucide-react";

export default function Problem() {
  const scams = [
    {
      title: "UPI QR Code & Refund Fraud",
      context: "Victim receives a QR code to 'receive money' or 'refund' for a transaction, but scanning it actually deducts funds.",
      detection: "CyberSaathi scans the sender's UPI metadata and identifies anomalous requests or fake merchant IDs.",
      law: "BNS Section 318 & 319 (Cheating by Impersonation) & IT Act Sec 66D"
    },
    {
      title: "WhatsApp & Deepfake Impersonation",
      context: "A message claiming to be from a relative or manager requests immediate funds due to a medical emergency.",
      detection: "Speech patterns, voice anomalies, and contact metadata are checked for spoofing indicators.",
      law: "BNS Section 319 (Identity Impersonation) / IT Act Sec 66C"
    },
    {
      title: "Work-From-Home & Task Scams",
      context: "Victims are added to Telegram/WhatsApp groups promising daily returns for simple tasks, leading to major deposits.",
      detection: "URL reputation checks and registry databases flag scam websites and crypto channels.",
      law: "BNS Section 111 (Organized Crime) & IT Act Sec 66D"
    }
  ];

  const steps = [
    {
      title: "The Victim's Vulnerability",
      desc: "An urgent, threatening message arrives (e.g., electricity disconnection, banking account freeze, fake arrest warrant).",
      icon: ShieldAlert,
      color: "border-red-500/20 text-red-400 bg-red-950/10"
    },
    {
      title: "State of Confusion",
      desc: "Panic takes over. The user doesn't know who to contact, misses the 'Golden Hour' (first 2 hours), and proceeds to transfer funds.",
      icon: UserMinus,
      color: "border-orange-500/20 text-orange-400 bg-orange-950/10"
    },
    {
      title: "CyberSaathi Guard",
      desc: "The link, text, or caller voice is run through CyberSaathi. The threat is immediately categorized, and an action playbook is delivered.",
      icon: ShieldCheck,
      color: "border-emerald-500/20 text-emerald-400 bg-emerald-950/10"
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden" id="scam-problem">
      
      {/* Background Gradients */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-red-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/20 text-red-400 text-xs font-mono tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>The Crisis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            India{"'"}s Cybercrime Epidemic
          </h2>
          <p className="text-slate-400 leading-relaxed text-md">
            Generic chatbots fail to comprehend the complex, localized nature of Indian cyber fraud. Scammers exploit urgency, language barriers, and legal confusion.
          </p>
        </div>

        {/* Threat Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scams.map((scam, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl border border-white/[0.06] bg-slate-900/20 backdrop-blur-sm space-y-6 hover:border-slate-800 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-red-400/80 font-mono tracking-widest uppercase">
                  Case_Study_0{index + 1}
                </span>
                <span className="text-xs text-slate-500 font-semibold font-mono">
                  {scam.law}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                {scam.title}
              </h3>
              
              <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                <p>
                  <strong className="text-slate-350">How it unfolds:</strong> {scam.context}
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.04]">
                  <strong className="text-cyan-400 font-medium">CyberSaathi Defense:</strong>
                  <p className="mt-1 text-slate-300">{scam.detection}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Story Timeline */}
        <div className="pt-10 border-t border-white/[0.05]">
          <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-12">
            The Intervention Path
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center lg:items-start lg:text-left space-y-4">
                
                {/* Visual Circle Indicator */}
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${step.color} shadow-lg relative z-20`}>
                  <step.icon className="w-5 h-5" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-md font-bold text-white">
                    {idx + 1}. {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>

                {/* Connector arrow for larger screens */}
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-12px)] w-24 h-[1.5px] border-t border-dashed border-white/10 z-0">
                    <ArrowRight className="w-3 h-3 text-slate-600 absolute right-0 -top-[6.5px]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
