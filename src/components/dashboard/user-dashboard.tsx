"use client";

import { FileText, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
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
import { fetchLegalCases, fetchReports } from "@/lib/firebase/firestore";
import { formatRelativeDate } from "@/lib/utils";
import type { LegalCase, ScamReport } from "@/types";

export function UserDashboard() {
  const { user, configured } = useAuth();
  const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function hydrate() {
      if (!user || !configured) {
        setLegalCases([]);
        setReports([]);
        return;
      }

      setLoading(true);

      try {
        const [nextCases, nextReports] = await Promise.all([
          fetchLegalCases(user.uid),
          fetchReports(user.uid),
        ]);
        setLegalCases(nextCases);
        setReports(nextReports);
      } catch {
        setLegalCases([]);
        setReports([]);
      } finally {
        setLoading(false);
      }
    }

    void hydrate();
  }, [configured, user]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="User Dashboard"
        title="Cases, reports, and next actions"
        description="A compact view of saved legal drafts and scam report status for signed-in users."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/legal">
              <Button variant="secondary">
                <FileText className="h-4 w-4" />
                Legal AI
              </Button>
            </Link>
            <Link href="/report">
              <Button>
                <ShieldAlert className="h-4 w-4" />
                Report scam
              </Button>
            </Link>
          </div>
        }
      />

      {!user ? (
        <EmptyState
          title="Sign in to view your dashboard"
          description="Your saved legal cases and reports are private to your account."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Saved legal cases</CardTitle>
              <CardDescription>
                Draft complaint records from the Legal AI Assistant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading cases...</p>
              ) : legalCases.length ? (
                <div className="space-y-3">
                  {legalCases.map((item) => (
                    <div
                      className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                      key={item.id}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">
                            {item.problemType}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formatRelativeDate(item.createdAt)}
                          </p>
                        </div>
                        <Badge variant={item.status === "submitted" ? "accent" : "warning"}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No legal drafts yet"
                  description="Use Legal AI to create and save your first complaint draft."
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report status</CardTitle>
              <CardDescription>
                Scam reports saved under your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading reports...</p>
              ) : reports.length ? (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                      key={report.id}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">
                            {report.type}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formatRelativeDate(report.createdAt)}
                          </p>
                        </div>
                        <Badge variant={report.status === "resolved" ? "accent" : "warning"}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {report.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No reports yet"
                  description="Create a structured scam report when you are ready to preserve the incident details."
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
