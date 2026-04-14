"use client";

import { FileWarning, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Textarea } from "@/components/ui/textarea";
import { responseChecklist } from "@/lib/data/content";
import { createReport, fetchReports } from "@/lib/firebase/firestore";
import { formatRelativeDate, pickText } from "@/lib/utils";
import { reportSchema } from "@/lib/validation/schemas";
import type { ScamReport } from "@/types";
import { useLanguage } from "@/components/providers/language-provider";

export function ReportModule() {
  const { user, profile, configured } = useAuth();
  const { language } = useLanguage();
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [form, setForm] = useState({
    type: "",
    description: "",
    amountLost: "",
    contactMethod: "",
    location: "",
    evidenceLink: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function hydrate() {
      if (!user || !configured) {
        setReports([]);
        return;
      }

      try {
        const items = await fetchReports(user.uid);
        setReports(items);
      } catch {
        setReports([]);
      }
    }

    void hydrate();
  }, [configured, user]);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    if (!user || !profile) {
      setError("Please sign in to store scam reports in your account.");
      return;
    }

    const parsed = reportSchema.safeParse(form);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid report.");
      return;
    }

    const nextReport: ScamReport = {
      id: `report-${crypto.randomUUID()}`,
      userId: user.uid,
      type: parsed.data.type,
      description: parsed.data.description,
      amountLost: parsed.data.amountLost,
      contactMethod: parsed.data.contactMethod,
      location: parsed.data.location,
      evidenceLink: parsed.data.evidenceLink,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setReports((current) => [nextReport, ...current]);
    setForm({
      type: "",
      description: "",
      amountLost: "",
      contactMethod: "",
      location: "",
      evidenceLink: "",
    });
    setSuccess("Report recorded. Use the checklist below to continue your real-world response.");

    if (configured) {
      try {
        const id = await createReport({
          userId: nextReport.userId,
          type: nextReport.type,
          description: nextReport.description,
          amountLost: nextReport.amountLost,
          contactMethod: nextReport.contactMethod,
          location: nextReport.location,
          evidenceLink: nextReport.evidenceLink,
        });

        setReports((current) =>
          current.map((report) => (report.id === nextReport.id ? { ...report, id } : report)),
        );
      } catch {
        setError("Report saved locally, but Firestore sync failed.");
      }
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Structured Reporting"
        title="Capture the incident before details disappear"
        description="This module organizes your scam evidence, transaction context, and response status in the `reports` collection."
      />
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Report a scam</CardTitle>
            <CardDescription>
              Keep the description concise and factual so it can feed police, bank, or portal reports later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              placeholder="Type of incident"
              value={form.type}
            />
            <Textarea
              className="min-h-36"
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="What happened, when, and which platform or payment method was involved?"
              value={form.description}
            />
            <Input
              onChange={(event) =>
                setForm((current) => ({ ...current, amountLost: event.target.value }))
              }
              placeholder="Amount lost (optional)"
              value={form.amountLost}
            />
            <Input
              onChange={(event) =>
                setForm((current) => ({ ...current, contactMethod: event.target.value }))
              }
              placeholder="How the scammer contacted you"
              value={form.contactMethod}
            />
            <Input
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
              placeholder="City / State"
              value={form.location}
            />
            <Input
              onChange={(event) =>
                setForm((current) => ({ ...current, evidenceLink: event.target.value }))
              }
              placeholder="Evidence link (optional)"
              value={form.evidenceLink}
            />
            <Button className="w-full" onClick={() => void handleSubmit()}>
              <ShieldAlert className="h-4 w-4" />
              Save report
            </Button>
            {error ? <p className="text-sm text-rose-500">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-600 dark:text-emerald-300">{success}</p> : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Immediate response checklist</CardTitle>
              <CardDescription>
                Use this sequence while the incident is still active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {responseChecklist.map((step) => (
                <div
                  key={step.en}
                  className="rounded-[24px] border border-amber-200/70 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100"
                >
                  {pickText(step, language)}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your saved reports</CardTitle>
              <CardDescription>
                Only the signed-in user can read these entries under the Firestore security rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-[24px] border border-slate-200/80 p-4 dark:border-slate-800"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-950 dark:text-white">{report.type}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formatRelativeDate(report.createdAt)} · {report.location}
                          </p>
                        </div>
                        <Badge variant="warning">{report.status}</Badge>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                        {report.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No saved reports yet"
                  description={
                    user
                      ? "Create your first report to keep an incident timeline ready for escalation."
                      : "Sign in to store structured report history in Firestore."
                  }
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3 p-5">
              <FileWarning className="mt-1 h-5 w-5 text-sky-500" />
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                CyberSathi helps structure the incident, but you should still use official reporting channels such as 1930 and cybercrime.gov.in for urgent escalation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
