"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, Sparkles, User, ShieldCheck, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import { ChatMessage, SAATHI_AI_RESPONSES } from './cyber-data';

export default function AIShowcase() {
  const msgCounterRef = useRef(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Namaste! I am **Saathi AI**, your digital cyber safety companion. Whether you have been targeted by a suspicious message, want to understand your legal rights under Indian Cyber Laws, or need immediate steps to secure your compromised accounts, I am here to guide you. \n\nSelect a direct prompt below to start, or type a custom question.",
      timestamp: "Just now"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const promptChips = [
    { label: 'Lost Money (Financial Fraud)', key: 'financial_fraud' },
    { label: 'Abuse & Stalking (Cyberbullying)', key: 'cyberbullying' },
    { label: 'Fake WhatsApp Bank Alerts', key: 'kyc_scam' }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${msgCounterRef.current++}`,
      sender: 'user',
      text: text,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Formulate smart responses
    let answer = SAATHI_AI_RESPONSES.default;
    const cleanText = text.toLowerCase();

    if (cleanText.includes('money') || cleanText.includes('fraud') || cleanText.includes('refund') || cleanText.includes('stolen') || cleanText.includes('scam') || cleanText.includes('upi') || cleanText.includes('gpay')) {
      answer = SAATHI_AI_RESPONSES.financial_fraud;
    } else if (cleanText.includes('bully') || cleanText.includes('threat') || cleanText.includes('stalk') || cleanText.includes('harass') || cleanText.includes('abuse') || cleanText.includes('instagram')) {
      answer = SAATHI_AI_RESPONSES.cyberbullying;
    } else if (cleanText.includes('kyc') || cleanText.includes('bank') || cleanText.includes('message') || cleanText.includes('sms') || cleanText.includes('link') || cleanText.includes('whatsapp')) {
      answer = SAATHI_AI_RESPONSES.kyc_scam;
    }

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      const assistantMsg: ChatMessage = {
        id: `a-${msgCounterRef.current++}`,
        sender: 'assistant',
        text: answer,
        timestamp: "Just now"
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1200);
  };

  const handleChipClick = (key: string, label: string) => {
    handleSend(`Can you guide me on what to do regarding: ${label}?`);
  };

  // Convert custom bold markdown and spacing to beautiful JSX
  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Match bold markdown **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-white font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const finalContent = parts.length > 0 ? parts : line;

      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) {
        return (
          <div key={idx} className="ml-2 pl-4 border-l border-emerald-500/30 my-1 text-slate-300 leading-relaxed font-sans text-sm">
            {finalContent}
          </div>
        );
      } else if (line.startsWith('-')) {
        return (
          <div key={idx} className="ml-4 list-disc my-1 text-slate-300 font-sans text-sm flex items-start gap-1.5">
            <span className="text-emerald-400 font-bold">&#8226;</span>
            <span>{finalContent}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="mb-2 leading-relaxed font-sans text-sm text-slate-350">
          {finalContent}
        </p>
      );
    });
  };

  return (
    <div id="ai-assistant-showcase" className="py-24 border-t border-white/[0.04] relative">
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto px-4">
        
        {/* Left Informational Content (Columns: 5) */}
        <div className="lg:col-span-5 space-y-6">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider border border-emerald-500/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Next-Gen AI Safety
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Meet <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Saathi AI</span>: Your Cybersecurity Guardian
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Saathi AI is a specialized security model integrated directly into the CyberSaathi app. Trained on the Indian Information Technology (Amendment) Act, local cyber bureau guidelines, and real criminal incident logs, Saathi AI supports you like an offline cyber legal officer in moments of crisis.
          </p>

          {/* AI Capability Features list */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Empathetic Crisis Support</h4>
                <p className="text-slate-400 text-xs mt-0.5">Designed specifically for Indian victims experiencing immediate stress, offering calming and legally compliant step-by-step procedures.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Regulatory IT Act Mapping</h4>
                <p className="text-slate-400 text-xs mt-0.5">Maps exact sections (Sec 66C, Sec 66D, etc.) of the IT Act so you can document legal basis on complaints instantly.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Zero-Trust Data Security</h4>
                <p className="text-slate-400 text-xs mt-0.5">We strictly never ask for or store passwords, OTPs, card details, or Aadhaar numbers. Safe, anonymous, and reliable.</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <span>Open Full Saathi AI Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Sandbox App UI (Columns: 7) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] relative backdrop-blur-md">
            
            {/* Window Topbar */}
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-black font-extrabold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                    Saathi AI Companion
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider block uppercase">Indian IT Act Specialist</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Message Body Scroller */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/[0.01]">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold ${
                      isUser
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'bg-white/5 border-white/10 text-emerald-400'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-3.5 shadow-sm text-sm ${
                      isUser
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-105'
                        : 'bg-white/5 border border-white/5 text-slate-200'
                    }`}>
                      {formatText(msg.text)}
                      <span className="block text-[10px] text-slate-500 text-right mt-1.5 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="bg-white/[0.02] p-4 border-t border-white/5 space-y-3">
              {/* Preset prompt chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mr-1.5">Quick Cases:</span>
                {promptChips.map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => handleChipClick(chip.key, chip.label)}
                    disabled={isTyping}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] text-slate-350 font-medium border border-white/5 hover:border-white/15 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{chip.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputVal);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isTyping}
                  placeholder="Ask Saathi: 'What do I do if someone is threatening to leak my photos?'"
                  className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputVal.trim()}
                  className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold shadow-md shadow-emerald-500/10 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
