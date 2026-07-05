"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, type ReactNode } from "react";
import {
  Home,
  BookOpen,
  Bot,
  Landmark,
  Menu,
  X,
  Gauge,
  Gavel,
  MessageSquareText,
  PenSquare,
  Newspaper,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useLanguage } from "@/components/providers/language-provider";
import { useAuth } from "@/components/providers/auth-provider";
import LandingNavbar from "@/components/landing/landing-navbar";
import LandingFooter from "@/components/landing/landing-footer";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { pick } = useLanguage();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Close the More menu when route changes
  useEffect(() => {
    setShowMoreMenu(false);
  }, [pathname]);

  const bottomNavItems = [
    { href: "/", label: { en: "Home", hi: "होम" }, icon: Home },
    { href: "/learn", label: { en: "Learn", hi: "सीखें" }, icon: BookOpen },
    { href: "/assistant", label: { en: "AI Chat", hi: "चैट" }, icon: Bot },
    { href: "/portals", label: { en: "Govt Links", hi: "सरकारी" }, icon: Landmark },
  ];

  const moreNavItems = [
    { href: "/dashboard", label: { en: "Dashboard", hi: "डैशबोर्ड" }, icon: Gauge, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { href: "/legal", label: { en: "Legal AI", hi: "लीगल एआई" }, icon: Gavel, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
    { href: "/community", label: { en: "Community", hi: "कम्युनिटी" }, icon: MessageSquareText, color: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
    { href: "/blog", label: { en: "Blog", hi: "ब्लॉग" }, icon: PenSquare, color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
    { href: "/news", label: { en: "News", hi: "समाचार" }, icon: Newspaper, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { href: "/report", label: { en: "Report Scam", hi: "रिपोर्ट" }, icon: ShieldAlert, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
    { href: "/help", label: { en: "Help & Support", hi: "सहायता" }, icon: HelpCircle, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  ];

  const handleMoreToggle = () => {
    setShowMoreMenu((prev) => !prev);
  };

  const { user, loading } = useAuth();

  const isAuthPath = ["/login", "/register"].includes(pathname);
  
  const isMarketingLayout = (!user && pathname === "/") || [
    "/about",
    "/technology",
    "/trust",
    "/roadmap",
    "/faq",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
    "/legal/cookies"
  ].includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-xs md:text-sm">
        <div className="flex flex-col items-center gap-3">
          <span className="w-5 h-5 rounded-full border-2 border-slate-500 border-t-white animate-spin" />
          <span className="animate-pulse uppercase tracking-widest text-[10px]">Loading CyberSaathi Core...</span>
        </div>
      </div>
    );
  }

  if (isAuthPath) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f7fb] dark:bg-[#040813] tech-dot-grid px-4 py-8 relative">
        {children}
      </div>
    );
  }

  if (isMarketingLayout) {
    return (
      <div className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
        <LandingNavbar />
        <main className="flex-1 relative z-10 w-full">
          {children}
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f4f7fb] dark:bg-[#040813] tech-dot-grid">
      {/* Emergency Helpline Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white py-2 px-4 text-center text-[11px] sm:text-xs font-extrabold tracking-wide relative z-50 flex items-center justify-center gap-2 shadow-md animate-pulse">
        <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
        <span>
          {pick({
            en: "🚨 Faced Financial Fraud? Call national helpline 1930 immediately to freeze stolen funds.",
            hi: "🚨 वित्तीय धोखाधड़ी का शिकार हुए? चोरी हुआ धन फ्रीज कराने के लिए तुरंत 1930 पर कॉल करें।",
            bn: "🚨 আর্থিক জালিয়াতির শিকার? চুরি যাওয়া টাকা ফ্রিজ করতে অবিলম্বে জাতীয় হেল্পলাইন 1930 কল করুন।",
            ta: "🚨 நிதி மோசடிக்கு ஆளானீர்களா? திருடப்பட்ட நிதியை முடக்க உடனடியாக உதவி எண் 1930 ஐ அழைக்கவும்.",
            te: "🚨 ఆర్థిక మోసానికి గురయ్యారా? దొంగిలించబడిన డబ్బును ఫ్రీజ్ చేయడానికి వెంటనే హెల్ప్‌లైన్ 1930 కి కాల్ చేయండి.",
            mr: "🚨 आर्थिक फसवणूक झाली आहे? चोरीला गेलेले पैसे गोठवण्यासाठी लगेच हेल्पलाइन १९३० वर कॉल करा."
          })}
        </span>
      </div>

      {/* Floating Animated Orbs in the Background */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-float-1 pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-float-2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8 relative z-10 pb-24 lg:pb-6">
        <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Desktop Sidebar Navigation (Hidden on Mobile/Tablet) */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <SidebarNav />
            </div>
          </aside>

          {/* Page Body Column */}
          <div className="space-y-4 flex flex-col min-h-0 min-w-0">
            {/* Topbar Header */}
            <Topbar />

            {/* Scrollable Page Content */}
            <main className="flex-1 min-h-0">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar (Visible on Mobile/Tablet ONLY) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 border-t border-slate-200/60 dark:border-slate-800/60 backdrop-blur-lg px-2 py-2 flex items-center justify-around shadow-[0_-5px_25px_rgba(0,0,0,0.06)] lg:hidden">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-95",
                isActive
                  ? "text-sky-600 dark:text-sky-400 font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] tracking-wide leading-none">{pick(item.label)}</span>
            </Link>
          );
        })}

        {/* More menu toggle button */}
        <button
          onClick={handleMoreToggle}
          className={cn(
            "flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-95",
            showMoreMenu
              ? "text-sky-600 dark:text-sky-400 font-bold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          )}
          type="button"
        >
          {showMoreMenu ? <X className="h-5 w-5 stroke-[2.5px]" /> : <Menu className="h-5 w-5" />}
          <span className="text-[10px] tracking-wide leading-none">
            {pick({ en: "More", hi: "अधिक" })}
          </span>
        </button>
      </nav>

      {/* Slide-Up Bottom Drawer Sheet for 'More' Items (Visible on Mobile/Tablet ONLY) */}
      {showMoreMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity duration-300 lg:hidden" onClick={() => setShowMoreMenu(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 rounded-t-[32px] p-5 shadow-[0_-10px_35px_rgba(0,0,0,0.3)] flex flex-col gap-4 animate-in slide-in-from-bottom duration-300 pb-20 max-w-[600px] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close handle indicator */}
            <div className="h-1.5 w-12 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto cursor-pointer mb-1" onClick={() => setShowMoreMenu(false)} />
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-display text-sm font-extrabold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                {pick({ en: "Explore Modules", hi: "सभी विकल्प खोजें" })}
              </span>
              <button
                className="rounded-full p-1 bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => setShowMoreMenu(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Grid of features */}
            <div className="grid grid-cols-3 gap-4 py-2">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center text-center gap-2 p-2.5 rounded-2xl transition duration-200 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-95",
                      isActive && "ring-2 ring-sky-500/20"
                    )}
                  >
                    <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm", item.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-4">
                      {pick(item.label)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
