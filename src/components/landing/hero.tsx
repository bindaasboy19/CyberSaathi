"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Terminal, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [inputText, setInputText] = useState("");
  const [scanState, setScanState] = useState<"idle" | "typing" | "scanning" | "result">("typing");
  
  const queryText = "Help! I received an SMS saying my electricity connection will be cut off in 1 hour because of unpaid bills. It says to call 98765-XXXXX immediately. Is this real?";

  useEffect(() => {
    let index = 0;
    let timer: NodeJS.Timeout;

    const runSimulation = () => {
      // Step 1: Type query
      setScanState("typing");
      setInputText("");
      index = 0;
      
      const type = () => {
        if (index < queryText.length) {
          setInputText((prev) => prev + queryText.charAt(index));
          index++;
          timer = setTimeout(type, 30);
        } else {
          // Step 2: Transition to scanning after typing
          timer = setTimeout(() => {
            setScanState("scanning");
            // Step 3: Transition to result after 3 seconds
            timer = setTimeout(() => {
              setScanState("result");
              // Loop again after 7 seconds of showing results
              timer = setTimeout(runSimulation, 7000);
            }, 3000);
          }, 1000);
        }
      };

      type();
    };

    runSimulation();

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden py-20 lg:py-28 bg-slate-950">
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />
      
      {/* Aurora glowing backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "-5s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left column: Headings and CTAs */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>India{"'"}s AI-Powered Cyber Safety Net</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Defending India from <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400">
              Cyber Scams & Fraud
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-455 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            CyberSaathi is a localized safety engine. We immediately scan links, analyze SMS threats, translate legal remedies, and guide fraud victims under the Bharatiya Nyaya Sanhita (BNS) framework.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-[0_4px_30px_rgba(6,182,212,0.25)] transition-all transform hover:-translate-y-0.5 w-full sm:w-auto justify-center cursor-pointer"
            >
              <span>Launch CyberSaathi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="#scam-analyzer"
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-xl transition-all w-full sm:w-auto justify-center cursor-pointer"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Test Scam Analyzer</span>
            </Link>
          </div>

          {/* Simple Trust indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-cyan-400" /> Government Guideline Grounded</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Secure & Private</span>
          </div>

        </div>

        {/* Right column: Interactive AI console simulator */}
        <div className="lg:col-span-5 w-full max-w-lg mx-auto">
          
          <div className="relative w-full rounded-2xl border border-white/[0.08] bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
            
            {/* Terminal Top Navigation */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-white/[0.05] text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>AI_SIMULATION_SANDBOX v1.0.4</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs md:text-sm space-y-5 h-80 overflow-y-auto no-scrollbar">
              
              {/* User input query block */}
              <div>
                <span className="text-cyan-400 font-bold mr-1.5">&gt;</span>
                <span className="text-slate-300">{inputText}</span>
                {scanState === "typing" && <span className="inline-block w-1.5 h-4 bg-cyan-400 animate-pulse ml-0.5" />}
              </div>

              {/* Scanning status indicator */}
              {scanState === "scanning" && (
                <div className="space-y-2 p-3.5 rounded-lg border border-cyan-500/20 bg-cyan-950/10">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Search className="w-4 h-4 animate-spin" />
                    <span className="font-bold">Analyzing threat indicators...</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-sky-400 h-full" style={{ width: "70%" }} />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Matching pattern matrices & scam reporting registry database
                  </p>
                </div>
              )}

              {/* Simulation Result block */}
              {scanState === "result" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3.5 p-4 rounded-xl border border-red-500/20 bg-red-950/15"
                >
                  <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                    <div className="flex items-center gap-2 text-red-400">
                      <Shield className="w-4.5 h-4.5" />
                      <span className="font-bold uppercase">Scam Detected</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300">
                      98% RISK
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-300">
                    <p>
                      <strong className="text-red-400">Threat Model:</strong> Fake Utilities Service Bill Scam
                    </p>
                    <p>
                      <strong className="text-cyan-400">Action Plan:</strong>
                    </p>
                    <ul className="list-disc list-inside pl-1.5 space-y-1 text-slate-400">
                      <li>Do NOT call the mobile number.</li>
                      <li>Official electricity boards NEVER request instant payments via personal phone numbers.</li>
                      <li>Contact official state customer care helpline (1912).</li>
                    </ul>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono">
                      BNS Section 318 & 319 (Cheating by Impersonation) / IT Act Section 66D
                    </p>
                  </div>
                </motion.div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
