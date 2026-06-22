"use client";

import { FileText, ShieldAlert, BookOpen, Trophy, ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { AdminView } from "@/components/dashboard/admin-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  fetchLegalCases,
  fetchReports,
  fetchDbCourses,
  fetchAllDbUserProgress,
} from "@/lib/firebase/firestore";
import { formatRelativeDate } from "@/lib/utils";
import type { LegalCase, ScamReport, Course, UserProgress } from "@/types";

const FALLBACK_COURSES: Course[] = [
  {
    id: "c-security-basics",
    title: { en: "Cybersecurity Fundamentals", hi: "साइबर सुरक्षा बुनियादी बातें" },
    description: { en: "", hi: "" },
    track: "beginner",
    icon: "security",
    order: 1,
  },
  {
    id: "c-financial-literacy",
    title: { en: "Digital Financial Literacy", hi: "डिजिटल वित्तीय साक्षरता" },
    description: { en: "", hi: "" },
    track: "intermediate",
    icon: "financial",
    order: 2,
  },
  {
    id: "c-privacy-safety",
    title: { en: "Social Media & Privacy Safety", hi: "सोशल मीडिया और गोपनीयता सुरक्षा" },
    description: { en: "", hi: "" },
    track: "advanced",
    icon: "social",
    order: 3,
  }
];

export function UserDashboard() {
  const { user, profile, configured } = useAuth();
  const { pick } = useLanguage();
  const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgressList, setUserProgressList] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");

  // Load progress from localStorage fallback if offline/unconfigured
  const loadLocalProgress = (): Record<string, UserProgress> => {
    if (typeof window === "undefined") return {};
    const local = localStorage.getItem("cybersaathi-local-progress");
    if (local) {
      try {
        return JSON.parse(local) as Record<string, UserProgress>;
      } catch {
        return {};
      }
    }
    return {};
  };

  useEffect(() => {
    async function hydrate() {
      if (!user) {
        setLegalCases([]);
        setReports([]);
        setCourses([]);
        setUserProgressList({});
        return;
      }

      setLoading(true);

      // Initialize with fallbacks first
      setCourses(FALLBACK_COURSES);
      setUserProgressList(loadLocalProgress());

      if (!configured) {
        setLoading(false);
        return;
      }

      try {
        const [nextCases, nextReports, dbCourses, allProgress] = await Promise.all([
          fetchLegalCases(user.uid).catch(() => []),
          fetchReports(user.uid).catch(() => []),
          fetchDbCourses().catch(() => FALLBACK_COURSES),
          fetchAllDbUserProgress(user.uid).catch(() => []),
        ]);

        setLegalCases(nextCases);
        setReports(nextReports);
        
        if (dbCourses && dbCourses.length > 0) {
          setCourses(dbCourses);
        }

        if (allProgress && allProgress.length > 0) {
          const progressMap: Record<string, UserProgress> = {};
          allProgress.forEach((p) => {
            progressMap[p.courseId] = p;
          });
          setUserProgressList(progressMap);
        }
      } catch (err) {
        console.error("Error hydrating dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    void hydrate();
  }, [configured, user]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow={pick({ en: "User Dashboard", hi: "यूज़र डैशबोर्ड" })}
        title={pick({ en: "Cases, Reports, and Learning", hi: "मामले, रिपोर्ट और शिक्षा प्रगति" })}
        description={pick({
          en: "A comprehensive view of your cybersecurity cases, reports, and course progress.",
          hi: "आपकी साइबर सुरक्षा मामलों, रिपोर्टों और कोर्स सीखने की प्रगति का एक विस्तृत दृश्य।",
        })}
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/learn">
              <Button variant="secondary" className="rounded-xl text-xs gap-1.5 border-slate-300 dark:border-slate-800">
                <BookOpen className="h-4 w-4" />
                {pick({ en: "Classroom", hi: "क्लासरूम" })}
              </Button>
            </Link>
            <Link href="/legal">
              <Button variant="secondary" className="rounded-xl text-xs gap-1.5">
                <FileText className="h-4 w-4" />
                {pick({ en: "Legal AI", hi: "लीगल एआई" })}
              </Button>
            </Link>
            <Link href="/report">
              <Button className="rounded-xl text-xs gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                {pick({ en: "Report Scam", hi: "घोटाले की रिपोर्ट" })}
              </Button>
            </Link>
          </div>
        }
      />

      {!user ? (
        <EmptyState
          title={pick({ en: "Sign in to view your dashboard", hi: "डैशबोर्ड देखने के लिए साइन इन करें" })}
          description={pick({
            en: "Your saved legal cases, scam reports, and course progress are private to your account.",
            hi: "आपकी सहेजी गई शिकायतें, घोटाले की रिपोर्ट और कोर्स प्रगति आपके खाते में सुरक्षित हैं।",
          })}
        />
      ) : (
        <div className="space-y-6">
          {profile?.role === "admin" && (
            <div className="flex space-x-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900/60 max-w-md">
              <button
                onClick={() => setActiveTab("user")}
                className={`w-full rounded-lg py-2.5 text-xs font-bold leading-5 transition-all ${
                  activeTab === "user"
                    ? "bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {pick({ en: "My Dashboard", hi: "मेरा डैशबोर्ड" })}
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`w-full rounded-lg py-2.5 text-xs font-bold leading-5 transition-all ${
                  activeTab === "admin"
                    ? "bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {pick({ en: "Admin Command Center", hi: "एडमिन कमांड सेंटर" })}
              </button>
            </div>
          )}

          {activeTab === "admin" && profile?.role === "admin" ? (
            <AdminView />
          ) : (
            <div className="space-y-6">
              {/* Cyber Learning Hub Progress Section */}
              <Card className="border border-slate-200/80 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-900/60 dark:bg-slate-950/60 overflow-hidden">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-sky-500 animate-pulse" />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {pick({ en: "My Learning Progress", hi: "मेरी शिक्षा की प्रगति" })}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="grid gap-4 md:grid-cols-3">
                    {courses.map((course) => {
                      const prog = userProgressList[course.id] || {
                        progressPercent: 0,
                        unlockedBadge: false,
                      };
                      return (
                        <div
                          key={course.id}
                          className="rounded-xl border border-slate-100 bg-white/40 p-4 dark:border-slate-900 dark:bg-slate-950/30 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-wide text-sky-500">
                                {course.track || "course"}
                              </span>
                              {prog.unlockedBadge && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                  <Trophy className="h-3 w-3" />
                                  {pick({ en: "Passed", hi: "सफल" })}
                                </span>
                              )}
                            </div>
                            <h4 className="mt-2 text-xs font-bold text-slate-950 dark:text-white leading-snug">
                              {pick(course.title)}
                            </h4>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                              <span>{pick({ en: "Completion", hi: "पूर्णता" })}</span>
                              <span>{prog.progressPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className="h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300"
                                style={{ width: `${prog.progressPercent}%` }}
                              />
                            </div>

                            <Link href="/learn" className="block pt-1">
                              <button className="w-full inline-flex items-center justify-center gap-1 text-[10px] font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
                                {pick({ en: "Enter Classroom", hi: "क्लासरूम में प्रवेश करें" })}
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 xl:grid-cols-2">
                {/* Legal cases card */}
                <Card className="border border-slate-200/80 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-900/60 dark:bg-slate-950/60">
                  <CardHeader>
                    <CardTitle>{pick({ en: "Saved Legal Cases", hi: "सहेजे गए कानूनी मामले" })}</CardTitle>
                    <CardDescription>
                      {pick({
                        en: "Draft complaint records from the Legal AI Assistant.",
                        hi: "लीगल एआई सहायक द्वारा बनाए गए ड्राफ्ट शिकायत पत्र।",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">Loading cases...</p>
                    ) : legalCases.length ? (
                      <div className="space-y-3">
                        {legalCases.map((item) => (
                          <div
                            className="rounded-lg border border-slate-200 p-4 dark:border-slate-800 bg-white/20 dark:bg-slate-900/20"
                            key={item.id}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="font-bold text-xs text-slate-950 dark:text-white">
                                  {item.problemType}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {formatRelativeDate(item.createdAt)}
                                </p>
                              </div>
                              <Badge variant={item.status === "submitted" ? "accent" : "warning"}>
                                {item.status}
                              </Badge>
                            </div>
                            <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title={pick({ en: "No legal drafts yet", hi: "अभी तक कोई लीगल ड्राफ्ट नहीं है" })}
                        description={pick({
                          en: "Use Legal AI to create and save your first complaint draft.",
                          hi: "अपनी पहली ड्राफ्ट शिकायत बनाने के लिए लीगल एआई का उपयोग करें।",
                        })}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Scam reports status card */}
                <Card className="border border-slate-200/80 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-900/60 dark:bg-slate-950/60">
                  <CardHeader>
                    <CardTitle>{pick({ en: "Report Status", hi: "रिपोर्ट की स्थिति" })}</CardTitle>
                    <CardDescription>
                      {pick({
                        en: "Scam reports saved under your account.",
                        hi: "आपके खाते के अंतर्गत सहेजी गई घोटाले की रिपोर्ट।",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">Loading reports...</p>
                    ) : reports.length ? (
                      <div className="space-y-3">
                        {reports.map((report) => (
                          <div
                            className="rounded-lg border border-slate-200 p-4 dark:border-slate-800 bg-white/20 dark:bg-slate-900/20"
                            key={report.id}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="font-bold text-xs text-slate-950 dark:text-white">
                                  {report.type}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {formatRelativeDate(report.createdAt)}
                                </p>
                              </div>
                              <Badge variant={report.status === "resolved" ? "accent" : "warning"}>
                                {report.status}
                              </Badge>
                            </div>
                            <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                              {report.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title={pick({ en: "No reports yet", hi: "अभी तक कोई रिपोर्ट नहीं है" })}
                        description={pick({
                          en: "Create a structured scam report when you are ready to preserve the incident details.",
                          hi: "घटना के विवरण को सुरक्षित करने के लिए घोटाले की रिपोर्ट दर्ज करें।",
                        })}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
