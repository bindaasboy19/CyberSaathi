"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white py-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
            <Mail className="w-3.5 h-3.5" /> Contact Safety Cell
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Get in Touch <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">With Us</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Have questions, feedback, or need collaboration? Write to the CyberSaathi support and development cell.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info Cards (Columns: 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900/40 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md">
              <h3 className="font-bold text-lg text-white mb-6">Contact Channels</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">General & Support Helpdesk</h4>
                    <a href="mailto:support@cybersaathi.com" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors mt-1 block">
                      support@cybersaathi.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">National Helpline Coordination</h4>
                    <p className="text-xs text-slate-405 mt-1">
                      Direct coordination for national reporting.
                    </p>
                    <a href="tel:1930" className="text-xs text-emerald-400 hover:text-emerald-305 transition-colors font-bold mt-1.5 inline-block">
                      Call 1930 (Helpline)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Sovereign Data Center</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      CyberSaathi Technology Hub,<br />
                      Sovereign Server Facility, New Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Warning Alert Panel */}
            <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold text-sm text-white">Emergency Warning</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    If you are currently experiencing active online extortion or cyber blackmail, do NOT delete any chats, screenshots, or profiles. Preserve all digital evidence immediately.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form (Columns: 7) */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-white/[0.06] rounded-3xl p-8 backdrop-blur-md relative shadow-xl">
            <h3 className="font-bold text-lg text-white mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="text-xs font-semibold text-slate-400 block mb-2">Your Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-xs font-semibold text-slate-400 block mb-2">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-400 block mb-2">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Reason for writing"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="text-xs font-semibold text-slate-400 block mb-2">Message *</label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you?"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                {submitted && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-pulse">
                    <CheckCircle2 className="w-4 h-4" /> Message Sent Successfully!
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !message}
                  className="ml-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-black animate-spin" />
                  ) : (
                    <>
                      <span>Send Secure Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
