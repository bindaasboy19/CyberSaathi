"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ChevronDown, Menu, X, BrainCircuit, Landmark, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/auth-provider";
import { getInitials } from "@/lib/utils";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      name: "Scam Analyzer",
      description: "Scan suspicious links, emails, and texts.",
      href: "/#scam-analyzer",
      icon: Shield,
    },
    {
      name: "Legal AI Advisor",
      description: "Indian Penal Code & IT Act guidance.",
      href: "/#scam-analyzer",
      icon: Landmark,
    },
    {
      name: "AI Cyber Assistant",
      description: "Conversational safety & recovery expert.",
      href: "/#ai-assistant-showcase",
      icon: BrainCircuit,
    },
    {
      name: "Learning Hub",
      description: "Interactive safety drills and rewards.",
      href: "/#learning-hub-page",
      icon: GraduationCap,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-white/[0.08] bg-slate-950/85 backdrop-blur-md shadow-lg" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  CYBER<span className="text-cyan-400">SAATHI</span>
                </span>
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest -mt-1 font-semibold">
                  Safety Ecosystem
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            
            {/* Features Dropdown Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("features")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white py-2 transition-colors cursor-pointer focus:outline-none">
                <span>Ecosystem</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "features" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "features" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-80 rounded-2xl border border-white/[0.08] bg-slate-950/95 backdrop-blur-md p-4 shadow-2xl z-50"
                  >
                    <div className="grid gap-2">
                      {features.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-cyan-400 shrink-0">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{item.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              About Us
            </Link>
            
            <Link href="/technology" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Technology
            </Link>

            <Link href="/trust" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Trust Center
            </Link>

            <Link href="/roadmap" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Roadmap
            </Link>

            <Link href="/faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              FAQ
            </Link>

            <Link href="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Right CTA Options */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg shadow-[0_4px_20px_rgba(6,182,212,0.25)] transition-all transform hover:-translate-y-0.5"
                >
                  Go to Dashboard
                </Link>
                <div
                  title={`${profile?.name || "User"}`}
                  className="flex h-8 w-8 select-none items-center justify-center rounded-xl bg-slate-800 text-xs font-bold text-white border border-white/10"
                >
                  {getInitials(profile?.name || "CS")}
                </div>
                <button
                  onClick={() => void logout()}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg shadow-[0_4px_20px_rgba(6,182,212,0.25)] transition-all transform hover:-translate-y-0.5"
                >
                  Launch CyberSaathi
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/[0.08] bg-slate-950/98 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Ecosystem Tools</p>
                {features.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04]"
                  >
                    <item.icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-1">
                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Information</p>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04]"
                >
                  About Us
                </Link>
                <Link
                  href="/technology"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04]"
                >
                  Technology
                </Link>
                <Link
                  href="/trust"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04]"
                >
                  Trust Center
                </Link>
                <Link
                  href="/roadmap"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04]"
                >
                  Roadmap
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04]"
                >
                  FAQ
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04]"
                >
                  Contact
                </Link>
              </div>

              <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center h-11 w-full rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        void logout();
                      }}
                      className="flex justify-center items-center h-11 w-full rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.05]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center h-11 w-full rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.05]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center h-11 w-full rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400"
                    >
                      Launch CyberSaathi
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
