"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, ShieldAlert, FileText, RefreshCcw, User, MapPin, IndianRupee } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/utils";
import {
  fetchSupportQueries,
  fetchAllReports,
  fetchAllLegalCases,
} from "@/lib/firebase/firestore";

type SupportQuery = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
};

type ScamReport = {
  id: string;
  userId: string;
  type: string;
  description: string;
  amountLost?: number;
  contactMethod: string;
  location: string;
  evidenceLink?: string;
  status: string;
  createdAt: string;
};

type LegalCase = {
  id: string;
  userId: string;
  problemType: string;
  description: string;
  generatedReport: string;
  status: string;
  createdAt: string;
};

type AdminData = {
  supportQueries: SupportQuery[];
  reports: ScamReport[];
  legalCases: LegalCase[];
};

export function AdminView() {
  const { user } = useAuth();
  const { pick } = useLanguage();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"support" | "scams" | "legal">("support");

  const loadAdminData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [supportQueries, reports, legalCases] = await Promise.all([
        fetchSupportQueries().catch(() => []),
        fetchAllReports().catch(() => []),
        fetchAllLegalCases().catch(() => []),
      ]);

      setData({
        supportQueries,
        reports,
        legalCases,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
        <p className="text-sm text-slate-500 font-semibold">
          {pick({ en: "Loading Administrative Console...", hi: "प्रशासकीय कंसोल लोड हो रहा है..." })}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border border-rose-500/20 bg-rose-500/5 p-6 text-center">
        <CardContent className="space-y-4">
          <p className="text-rose-500 font-bold">{error}</p>
          <Button onClick={() => void loadAdminData()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const supportCount = data?.supportQueries.length ?? 0;
  const scamCount = data?.reports.length ?? 0;
  const legalCount = data?.legalCases.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <span className="inline-block h-3.5 w-3.5 rounded-full bg-rose-600 animate-ping" />
            {pick({ en: "Admin Command Center", hi: "एडमिन कमांड सेंटर" })}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {pick({
              en: "Review system activity, user support tickets, and reported scams.",
              hi: "सिस्टम गतिविधि, उपयोगकर्ता सहायता टिकट और रिपोर्ट किए गए घोटालों की समीक्षा करें।",
            })}
          </p>
        </div>
        <Button variant="secondary" onClick={() => void loadAdminData()} disabled={loading}>
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {pick({ en: "Refresh Logs", hi: "लॉग्स रिफ्रेश करें" })}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          onClick={() => setActiveSubTab("support")}
          className={`cursor-pointer border transition-all ${
            activeSubTab === "support" ? "ring-2 ring-sky-500 border-sky-500" : "hover:border-slate-300 dark:hover:border-slate-800"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Support Queries
            </CardTitle>
            <Mail className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950 dark:text-white">{supportCount}</div>
            <p className="text-xs text-slate-500 mt-1">Unresolved & feedback queries</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setActiveSubTab("scams")}
          className={`cursor-pointer border transition-all ${
            activeSubTab === "scams" ? "ring-2 ring-rose-500 border-rose-500" : "hover:border-slate-300 dark:hover:border-slate-800"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Scam Reports
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950 dark:text-white">{scamCount}</div>
            <p className="text-xs text-slate-500 mt-1">User reported incident logs</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setActiveSubTab("legal")}
          className={`cursor-pointer border transition-all ${
            activeSubTab === "legal" ? "ring-2 ring-indigo-500 border-indigo-500" : "hover:border-slate-300 dark:hover:border-slate-800"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Legal Cases
            </CardTitle>
            <FileText className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950 dark:text-white">{legalCount}</div>
            <p className="text-xs text-slate-500 mt-1">AI-generated complaint drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Contents */}
      {activeSubTab === "support" && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>User Support & Inquiry Tickets</CardTitle>
            <CardDescription>Messages submitted through the Help & Support page contact form.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.supportQueries.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No support queries found.</p>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {data?.supportQueries.map((query) => (
                  <div key={query.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{query.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">({query.email})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="accent">{query.category}</Badge>
                        <span className="text-xs text-slate-400">{formatRelativeDate(query.createdAt)}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-900 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {query.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeSubTab === "scams" && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Reported Cyber Scams Log</CardTitle>
            <CardDescription>Detailed incidents submitted by victims to preserve scam evidence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.reports.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No scam reports submitted.</p>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {data?.reports.map((report) => (
                  <div key={report.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4" />
                        {report.type}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="warning">{report.status}</Badge>
                        <span className="text-xs text-slate-400">{formatRelativeDate(report.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-900">
                      {report.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {report.location}
                      </span>
                      <span className="flex items-center gap-1">
                        Contact method: {report.contactMethod}
                      </span>
                      {report.amountLost !== undefined && (
                        <span className="flex items-center gap-0.5 text-rose-500">
                          <IndianRupee className="h-3 w-3" />
                          {report.amountLost} lost
                        </span>
                      )}
                      {report.evidenceLink && (
                        <a
                          href={report.evidenceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-500 hover:underline"
                        >
                          View Evidence Link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeSubTab === "legal" && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>AI Complaint Draft Records</CardTitle>
            <CardDescription>Legal documents drafted by victims using CyberSaathi Legal AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.legalCases.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No legal complaint drafts saved.</p>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {data?.legalCases.map((legalCase) => (
                  <div key={legalCase.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        {legalCase.problemType}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="accent">{legalCase.status}</Badge>
                        <span className="text-xs text-slate-400">{formatRelativeDate(legalCase.createdAt)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Incident Summary</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-900">
                        {legalCase.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Generated Report Draft</p>
                      <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 overflow-x-auto max-h-60 overflow-y-auto">
                        {legalCase.generatedReport}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
