"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, IndianRupee, Briefcase, HeartHandshake, Search, 
  FileText, CheckCircle2, Info, Lock, Scale, Copy, 
  RotateCcw, Check, Sparkles, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { THREAT_SCENARIOS, ThreatScenario } from './cyber-data';

export default function ScamAnalyzerSandbox() {
  const [inputText, setInputText] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<ThreatScenario | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ThreatScenario | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Draft report details form state
  const [victimName, setVictimName] = useState('John Doe');
  const [victimLocation, setVictimLocation] = useState('New Delhi, India');
  const [offenderNumber, setOffenderNumber] = useState('+91 98765 43210');
  const [financialLoss, setFinancialLoss] = useState('5000');

  const logsSequence = [
    'Initializing CyberSaathi AI Scam Analyzer Core...',
    'Parsing syntactic structure and word associations...',
    'Analyzing emotional vulnerability triggers (Urgency, Fear, Greed)...',
    'Cross-referencing domain registries & shortlink reputation databases...',
    'Scanning transaction patterns against NPCI and RBI security guidelines...',
    'Mapping threat signature against Indian Information Technology Act database...',
    'Compiling safety risk matrix and drafting actionable guidance...'
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Detect keywords to map to closest mock scenario, or create generic mock scan
    const text = inputText.toLowerCase();
    let matched: ThreatScenario = THREAT_SCENARIOS[0]; // fallback to sbi-kyc-phishing

    if (text.includes('upi') || text.includes('pin') || text.includes('gpay') || text.includes('phonepe') || text.includes('refund')) {
      matched = THREAT_SCENARIOS[1];
    } else if (text.includes('job') || text.includes('earn') || text.includes('part-time') || text.includes('youtube') || text.includes('commission')) {
      matched = THREAT_SCENARIOS[2];
    } else if (text.includes('customs') || text.includes('london') || text.includes('airport') || text.includes('gift') || text.includes('package')) {
      matched = THREAT_SCENARIOS[3];
    }

    // Run simulated scan
    triggerAnalysis(matched);
  };

  const selectScenario = (sc: ThreatScenario) => {
    setSelectedScenario(sc);
    setInputText(sc.exampleText);
    setAnalysisResult(null);
  };

  const triggerAnalysis = (sc: ThreatScenario) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisLogs([]);

    // Staggered log printing
    logsSequence.forEach((log, index) => {
      setTimeout(() => {
        setAnalysisLogs(prev => [...prev, log]);
      }, (index + 1) * 300);
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(sc);
    }, (logsSequence.length + 1) * 320);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const generateComplaintDraft = () => {
    if (!analysisResult) return '';

    return `To,
The Officer-in-Charge,
Cyber Crime Police Station / Local Police Station,
${victimLocation}.

Subject: Complaint regarding Cyber Fraud under the Information Technology Act & Bharatiya Nyaya Sanhita (BNS).

Respected Sir/Madam,

I, ${victimName}, resident of ${victimLocation}, wish to file a formal complaint regarding a cyber fraud incident that occurred on ${new Date().toLocaleDateString()}.

INCIDENT DETAILS:
1. Suspected Sender/Offender Contact: ${offenderNumber}
2. Estimated Financial Loss/Amount at Risk: INR ${financialLoss}/-
3. Nature of Threat: Impersonation and fraudulent solicitation of funds (Referencing "${analysisResult.title}")

DESCRIPTION OF THE FRAUD:
The suspect initiated contact offering or demanding financial action. The text or communication involved:
"${analysisResult.exampleText}"

LEGAL PROVISIONS & BREACHES IDENTIFIED BY CYBERSAATHI ANALYSIS:
According to the technical evaluation, the suspect has breached:
${analysisResult.itActSections.map(sec => `- ${sec}`).join('\n')}

I request you to kindly register an FIR or a formal complaint, investigate the referenced bank account/phone number, and initiate legal action against the perpetrator to block the transfer and recover the funds.

Evidence screenshots, Transaction IDs, and chat logs are enclosed herewith.

Yours Faithfully,
_______________________
(${victimName})
Contact Number: [Your Phone Number]
Email: [Your Email]`;
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generateComplaintDraft());
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div id="scam-analyzer" className="py-24 bg-slate-950/20 border-t border-white/[0.04] relative">
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none" />
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Cyber Threat Playground
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Scam Analyzer & <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Legal AI Sandbox</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Paste a suspicious email, message, call transcript, or UPI transaction demand below. Our custom legal AI evaluates risk parameters, maps Indian regulatory codes, and helps you structure draft cyber complaints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4">
        
        {/* Left Input Section (Columns: 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Analyze Suspicious Text
            </h3>
            
            {/* Quick Presets */}
            <div className="mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono block mb-2">
                Or Select a Common Indian Cyber Crime Scenario:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {THREAT_SCENARIOS.map((sc) => {
                  const isSelected = selectedScenario?.id === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => selectScenario(sc)}
                      className={`text-left p-3 rounded-xl border text-xs font-medium transition-all duration-205 flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15 text-slate-350'
                      }`}
                    >
                      <div className="p-1 rounded-md bg-white/5 border border-white/10 text-emerald-400 mt-0.5">
                        {sc.category === 'phishing' && <ShieldAlert className="w-3.5 h-3.5" />}
                        {sc.category === 'upi' && <IndianRupee className="w-3.5 h-3.5" />}
                        {sc.category === 'job' && <Briefcase className="w-3.5 h-3.5" />}
                        {sc.category === 'romance' && <HeartHandshake className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold block">{sc.title}</span>
                        <span className="text-slate-500 font-mono text-[10px] uppercase">{sc.category} scam</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label htmlFor="scam-text-input" className="sr-only">Suspicious message text</label>
                <textarea
                  id="scam-text-input"
                  rows={6}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setSelectedScenario(null);
                    setAnalysisResult(null);
                  }}
                  placeholder="Paste SMS content, WhatsApp threat message, or fake investment pitch text here..."
                  className="w-full rounded-xl bg-slate-950 border border-white/5 p-4 text-sm text-slate-205 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setSelectedScenario(null);
                    setAnalysisResult(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing || !inputText.trim()}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-slate-600 text-black font-bold text-xs shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 group transition-all cursor-pointer"
                >
                  {isAnalyzing ? (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-black animate-spin" />
                  ) : (
                    <>
                      <span>Analyze Safety Parameters</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Helpline Informational Panel */}
          <div className="bg-slate-900/40 border border-red-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mt-0.5">
                <AlertTriangle className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base mb-1">Stolen Funds Golden Hour</h4>
                <p className="text-slate-450 text-xs sm:text-sm mb-3 leading-relaxed">
                  If you transferred money to a fraudulent UPI/Bank ID, dial the National Cyber Crime Helpline <strong className="text-red-400">1930</strong> immediately. Reporting within 120 minutes increases freezing likelihood.
                </p>
                <a
                  href="tel:1930"
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider"
                >
                  Dial 1930 Now <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Section (Columns: 7) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl min-h-[460px] p-6 shadow-xl flex flex-col relative overflow-hidden backdrop-blur-md">
            
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-radial-at-tr from-emerald-900/10 via-transparent to-transparent pointer-events-none" />

            <AnimatePresence mode="wait">
              
              {/* State 1: Idle */}
              {!isAnalyzing && !analysisResult && (
                <motion.div
                  key="idle-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">AI Cyber Analyzer Ready</h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-sm font-sans">
                    Select one of the Indian threat presets on the left, or paste your own suspect text to generate an instant safety audit.
                  </p>
                </motion.div>
              )}

              {/* State 2: Analyzing */}
              {isAnalyzing && (
                <motion.div
                  key="analyzing-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-center py-6 font-mono z-10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-bold text-slate-350">SCAN IN PROGRESS...</span>
                  </div>

                  <div className="space-y-2 bg-slate-950 border border-white/5 rounded-xl p-4 text-xs text-slate-400 h-64 overflow-y-auto">
                    {analysisLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-2"
                      >
                        <span className="text-emerald-400 shrink-0">&gt;</span>
                        <span>{log}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* State 3: Result Ready */}
              {!isAnalyzing && analysisResult && (
                <motion.div
                  key="result-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 flex-1 flex flex-col z-10"
                >
                  {/* Result Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        CyberSaathi Diagnostic Audit
                      </span>
                      <h3 className="text-xl font-bold text-white leading-tight">{analysisResult.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        analysisResult.severity === 'critical'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {analysisResult.severity} Threat
                      </span>
                      <div className="mt-1.5 flex items-baseline gap-1 justify-end">
                        <span className="text-xs text-slate-500 font-mono">Risk Index:</span>
                        <span className={`text-xl font-bold font-mono ${
                          analysisResult.riskScore > 90 ? 'text-red-400' : 'text-amber-400'
                        }`}>{analysisResult.riskScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Scans Scroll container */}
                  <div className="space-y-5 flex-1 max-h-[380px] overflow-y-auto pr-1">
                    
                    {/* Emotional Vulnerability Highlight */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Psychological Vulnerability Triggers
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {analysisResult.emotionalTriggers.map((trig, i) => (
                          <li key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-amber-500 font-bold mt-0.5">&#8226;</span>
                            <span>{trig}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deceit Indicators */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-455 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
                        <Info className="w-3.5 h-3.5 text-emerald-400" />
                        Deceptive Signal Diagnostics
                      </h4>
                      <ul className="space-y-1.5">
                        {analysisResult.deceitIndicators.map((ind, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Legal IT Act Sections Mapping */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-455 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
                        <Scale className="w-3.5 h-3.5 text-emerald-400" />
                        Indian IT Act & Penal Code Codes
                      </h4>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                        {analysisResult.itActSections.map((sec, i) => (
                          <p key={i} className="text-xs text-emerald-200 leading-relaxed font-sans">
                            {sec}
                          </p>
                        ))}
                        <p className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-white/5">
                          *These acts represent guidelines based on standard digital prosecution templates in India.
                        </p>
                      </div>
                    </div>

                    {/* Immediate Security Action Checklist */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-455 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        Urgent Action Response Protocol
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.actionSteps.map((step, i) => (
                          <li key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-lg text-xs text-slate-200 flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-[10px] shrink-0 font-bold">
                              {i+1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cyber Legal Counsel Stand */}
                    <div className="bg-white/5 border-l-2 border-emerald-500 p-4 rounded-r-xl">
                      <h4 className="text-xs font-bold text-white mb-1">CyberSaathi Legal Directive:</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {analysisResult.legalAdvice}
                      </p>
                    </div>

                  </div>

                  {/* Actions / Reset */}
                  <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => handleCopy(analysisResult.exampleText)}
                      className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" /> Copied Text
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Threat Text
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/assistant?analyze=${encodeURIComponent(inputText || analysisResult.exampleText)}`}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Unlock Evolved AI & Legal Filing →</span>
                      </Link>
                      <button
                        onClick={() => setAnalysisResult(null)}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </div>

      </div>

      {/* Legal AI Showcase: Complaint Draft Creator */}
      {analysisResult && (
        <motion.div
          id="legal-complaint-draft-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-slate-900/40 border border-white/[0.06] rounded-3xl p-6 lg:p-8 max-w-7xl mx-auto shadow-xl backdrop-blur-md"
        >
          <div className="border-b border-white/5 pb-5 mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-400" />
              CyberSaathi Legal AI Complaint Draft Builder
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Customize variables below to instantly draft a formal petition which you can copy and submit directly to the Cyber Crime Cell or your local police station.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Controls (Columns: 4) */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono block">
                Draft Details Configurator
              </span>
              
              <div>
                <label htmlFor="complaint-victim-name" className="text-xs font-medium text-slate-400 block mb-1.5">Victim Full Name</label>
                <input
                  id="complaint-victim-name"
                  type="text"
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  className="w-full bg-slate-955 border border-white/5 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="complaint-victim-location" className="text-xs font-medium text-slate-400 block mb-1.5">Victim Address / Location</label>
                <input
                  id="complaint-victim-location"
                  type="text"
                  value={victimLocation}
                  onChange={(e) => setVictimLocation(e.target.value)}
                  className="w-full bg-slate-955 border border-white/5 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="complaint-offender-number" className="text-xs font-medium text-slate-400 block mb-1.5">Suspect Phone / Sender ID</label>
                <input
                  id="complaint-offender-number"
                  type="text"
                  value={offenderNumber}
                  onChange={(e) => setOffenderNumber(e.target.value)}
                  className="w-full bg-slate-955 border border-white/5 rounded-xl px-3 py-2 text-sm text-slate-205 placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="complaint-loss-amount" className="text-xs font-medium text-slate-400 block mb-1.5">Financial Amount Compromised (INR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                  <input
                    id="complaint-loss-amount"
                    type="number"
                    value={financialLoss}
                    onChange={(e) => setFinancialLoss(e.target.value)}
                    className="w-full bg-slate-955 border border-white/5 rounded-xl pl-8 pr-3.5 py-2 text-sm text-slate-200 placeholder-slate-705 focus:outline-none focus:border-emerald-500/40 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={handleCopyDraft}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950" /> Copied Complaint Draft
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Complaint to Clipboard
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Form Display (Columns: 8) */}
            <div className="lg:col-span-8 flex flex-col">
              <label htmlFor="complaint-draft-textarea" className="sr-only">Cyber Complaint Draft Preview</label>
              <textarea
                id="complaint-draft-textarea"
                readOnly
                value={generateComplaintDraft()}
                rows={16}
                className="w-full bg-slate-955 border border-white/5 rounded-xl p-5 text-xs text-slate-300 placeholder-slate-800 focus:outline-none font-mono resize-none leading-relaxed"
              />
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
