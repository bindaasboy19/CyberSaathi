import React from 'react';
import { 
  Landmark, Info, EyeOff, CheckCircle2, AlertTriangle, Scale, FileCheck 
} from 'lucide-react';

export default function Trust() {
  const safetyCards = [
    {
      title: 'Digital Personal Data Protection (DPDP)',
      desc: 'We are completely compliant with India\'s DPDP Act, 2023. CyberSaathi does not retain chat histories or upload personal transaction screenshots to training models.',
      icon: <Landmark className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Zero-Credential Retention',
      desc: 'Our interactive playgrounds and analyzers run completely on sandbox nodes. We never ask for or store UPI PINs, Aadhaar numbers, OTPs, or financial secrets.',
      icon: <EyeOff className="w-5 h-5 text-teal-400" />
    },
    {
      title: 'Responsible AI & Model Limits',
      desc: 'While our legal AI is highly accurate in referencing IT Act codes, it is an informational companion and NOT a substitute for formal, physically registered legal counsel.',
      icon: <Info className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <div id="trust-center" className="py-24 border-t border-white/[0.04] relative bg-slate-950/20">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
          <FileCheck className="w-3.5 h-3.5" /> Integrity First
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          The CyberSaathi <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Trust Center</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          We believe in complete technological transparency and legal ethics. Explore our responsible AI disclosures, privacy compliance rules, open source credits, and vulnerability disclosures.
        </p>
      </div>

      {/* Safety pillars grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20 px-4">
        {safetyCards.map((card) => (
          <div 
            key={card.title}
            className="bg-slate-900/40 border border-white/[0.06] rounded-2xl p-6 lg:p-8 space-y-4 hover:border-white/15 transition-all duration-250 backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              {card.icon}
            </div>
            <h4 className="font-bold text-white text-base leading-tight">{card.title}</h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* DPDP and India Sovereign Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900/40 border border-white/[0.06] rounded-3xl p-8 lg:p-10 max-w-7xl mx-auto mb-20 relative overflow-hidden shadow-xl backdrop-blur-md px-4 sm:px-8">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-radial-at-bl from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Left Side (Columns: 5) */}
        <div className="lg:col-span-5 space-y-4 z-10">
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 block uppercase">Data Privacy Directive</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">Sovereign Data Protection & Client Security</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
            Under India{"'"}s historical Digital Personal Data Protection (DPDP) Act of 2023, citizens own absolute control over their digital identifiers. Traditional technology portals leverage conversational queries to build sales advertising pools.
          </p>
          <div className="pt-3 border-t border-white/5">
            <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">✓ Storage Location:</span>
            <p className="text-slate-400 text-xs font-sans">All CyberSaathi servers and LLM nodes operate securely on Indian-sovereign server centers ensuring zero off-shore relaying.</p>
          </div>
        </div>

        {/* Right Side (Columns: 7) */}
        <div className="lg:col-span-7 space-y-3 z-10 mt-8 lg:mt-0">
          <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-4">OUR DEPLOYED COMPLIANCE RULES</h4>
          
          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex gap-3 hover:border-white/10 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-white text-xs sm:text-sm leading-tight">Consent-Driven Audits</h5>
              <p className="text-slate-400 text-xs leading-relaxed font-sans mt-1">We do not employ cookie tracking models to build user profiling databases. You remain 100% anonymous across all scanning activities.</p>
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex gap-3 hover:border-white/10 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-white text-xs sm:text-sm leading-tight">The Right to Erasure</h5>
              <p className="text-slate-400 text-xs leading-relaxed font-sans mt-1">Since no conversation histories are logged on CyberSaathi marketing databases, there is zero residual risk of breach exposure.</p>
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex gap-3 hover:border-white/10 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-white text-xs sm:text-sm leading-tight">Encryption-in-Transit</h5>
              <p className="text-slate-400 text-xs leading-relaxed font-sans mt-1">All communications with regional incident-classification engines use highly secure HTTPS TLS 1.3 tunnels.</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Limitations & Open Source Credits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
        
        {/* Model Limitations */}
        <div className="bg-slate-900/40 border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-4 hover:border-white/15 transition-all backdrop-blur-md">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <AlertTriangle className="w-5 h-5 text-red-450 animate-pulse" />
            <h4 className="text-base text-white font-bold">AI Limitations & Boundaries</h4>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
            Our AI Scam Analyzer and Saathi Companion models use sophisticated, fine-tuned parameters to run diagnostics and reference relevant Indian penal codes. However, these systems do not represent formal physical legal advocacy. 
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
            They are designed as educational safety guides and mock petition-drafting templates. For formal prosecution and recovery, victims must submit filings to the physical Cyber Crime Cell or authorized advocates.
          </p>
        </div>

        {/* Open Source Credits */}
        <div className="bg-slate-900/40 border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-4 hover:border-white/15 transition-all backdrop-blur-md">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h4 className="text-base text-white font-bold">Open Source & Disclosures</h4>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
            CyberSaathi is built on an open, transparent foundation. We heavily leverage open source frameworks, including Next.js, React 19, Tailwind CSS, Lucide Icons, and community vector-embedding pipelines.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
            We follow a **Responsible Disclosure Policy**. If you detect any vulnerability or security loophole across our apps, email details securely to <strong className="text-emerald-400 font-semibold">security@cybersaathi.com</strong>. We commit to auditing and fixing disclosures within 48 hours.
          </p>
        </div>

      </div>

    </div>
  );
}
