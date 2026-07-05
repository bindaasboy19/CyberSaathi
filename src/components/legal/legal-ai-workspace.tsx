"use client";

import {
  Clipboard,
  Download,
  FileText,
  Gavel,
  LoaderCircle,
  Save,
  Send,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
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
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Textarea } from "@/components/ui/textarea";
import { createLegalCase, fetchLegalCases } from "@/lib/firebase/firestore";
import { createId, formatRelativeDate } from "@/lib/utils";
import type { LegalCase, LegalComplaintDraft } from "@/types";

type Tab = "chat" | "complaint" | "evidence";

type LegalResponse = {
  reply: string;
  draft: LegalComplaintDraft;
  source: string;
  error?: string;
};

const tabs: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
  { id: "chat", label: "Chat Assistant", icon: Gavel },
  { id: "complaint", label: "Generate Complaint", icon: FileText },
  { id: "evidence", label: "Evidence Checklist", icon: ShieldCheck },
];

const defaultEvidence = [
  "Screenshots of messages, calls, links, profiles, and payment screens",
  "Transaction IDs, UTR, account numbers, or wallet reference IDs",
  "Bank statements or platform support acknowledgement numbers",
  "A clear timeline with dates, times, and sequence of actions",
];

export function LegalAIWorkspace() {
  const { language } = useLanguage();
  const { user, configured } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    description: "",
    incidentDate: "",
    transactionDetails: "",
    amountLost: "",
    contactMethod: "",
    platform: "",
    evidenceNotes: "",
  });
  const [response, setResponse] = useState<LegalResponse | null>(null);
  const [savedCases, setSavedCases] = useState<LegalCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const description = params.get("description");
    const problemType = params.get("problemType");

    if (description) {
      setForm((current) => ({
        ...current,
        description,
        platform: problemType || current.platform,
      }));
      return;
    }

    const rawContext = window.localStorage.getItem("cybersathi-assistant-context");

    if (!rawContext) {
      return;
    }

    try {
      const parsed = JSON.parse(rawContext) as {
        lastUserMessage?: string;
        lastAssistantReply?: string;
      };

      if (parsed.lastUserMessage) {
        setForm((current) => ({
          ...current,
          description: current.description || parsed.lastUserMessage || "",
          evidenceNotes: current.evidenceNotes || parsed.lastAssistantReply?.slice(0, 600) || "",
        }));
      }
    } catch {
      window.localStorage.removeItem("cybersathi-assistant-context");
    }
  }, []);

  useEffect(() => {
    async function hydrateCases() {
      if (!user || !configured) {
        setSavedCases([]);
        return;
      }

      try {
        setSavedCases(await fetchLegalCases(user.uid));
      } catch {
        setSavedCases([]);
      }
    }

    void hydrateCases();
  }, [configured, user]);

  const reportHref = useMemo(() => {
    if (!response?.draft) {
      return "/report";
    }

    const params = new URLSearchParams({
      type: response.draft.problemType,
      description: response.draft.incidentSummary,
      amountLost: form.amountLost,
      contactMethod: form.contactMethod || form.platform || "Online",
      caseId: "legal-draft",
    });

    return `/report?${params.toString()}`;
  }, [form.amountLost, form.contactMethod, form.platform, response]);

  async function generateGuidance(mode: "chat" | "draft") {
    setNotice(null);
    setError(null);

    if (!form.description.trim()) {
      setError("Describe the incident before asking for legal guidance.");
      return;
    }

    setLoading(true);

    try {
      const apiResponse = await fetch("/api/legal-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          mode,
          language,
        }),
      });

      const data = (await apiResponse.json()) as LegalResponse;

      if (!apiResponse.ok) {
        throw new Error(data.error || "Unable to generate legal guidance.");
      }

      setResponse(data);
      setActiveTab(mode === "draft" ? "complaint" : "chat");
      setNotice(
        data.source === "fallback"
          ? "Using built-in legal guidance because live AI is unavailable."
          : `Guidance generated via ${data.source}.`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate legal guidance.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveCase() {
    setNotice(null);
    setError(null);

    if (!user) {
      setError("Please sign in to save legal cases.");
      return;
    }

    if (!response?.draft) {
      setError("Generate a complaint draft before saving the case.");
      return;
    }

    setSaving(true);

    const nextCase: LegalCase = {
      id: createId("legal"),
      userId: user.uid,
      problemType: response.draft.problemType,
      description: form.description,
      generatedReport: response.draft.complaintText,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    setSavedCases((current) => [nextCase, ...current]);

    if (configured) {
      try {
        const id = await createLegalCase({
          userId: nextCase.userId,
          problemType: nextCase.problemType,
          description: nextCase.description,
          generatedReport: nextCase.generatedReport,
          status: nextCase.status,
        });

        setSavedCases((current) =>
          current.map((item) => (item.id === nextCase.id ? { ...item, id } : item)),
        );
      } catch {
        setError("Case was saved locally, but Firestore sync failed.");
      }
    }

    setNotice("Legal case draft saved.");
    setSaving(false);
  }

  async function copyComplaint() {
    if (!response?.draft?.complaintText) {
      setError("Generate a complaint draft before copying.");
      return;
    }

    setError(null);
    setNotice(null);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(response.draft.complaintText);
        setNotice("Complaint draft copied.");
      } else {
        throw new Error("Clipboard API not supported or permissions blocked.");
      }
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = response.draft.complaintText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          setNotice("Complaint draft copied (fallback method).");
        } else {
          throw new Error("execCommand copy failed");
        }
      } catch {
        setError("Failed to copy automatically. Please select and copy the text manually from the field below.");
      }
    }
  }

  async function downloadPdf() {
    if (!response?.draft) {
      setError("Generate a complaint draft before downloading.");
      return;
    }

    setError(null);
    setNotice(null);

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF();
      const lines = pdf.splitTextToSize(response.draft.complaintText, 180);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("CyberSaathi Complaint Draft", 15, 18);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("AI guidance only. Review before filing.", 15, 26);
      pdf.text(lines, 15, 38);
      pdf.save(`cybersaathi-${response.draft.problemType.replace(/\s+/g, "-")}.pdf`);
      setNotice("PDF downloaded successfully.");
    } catch (pdfError) {
      setError(
        pdfError instanceof Error
          ? `Failed to generate PDF: ${pdfError.message}`
          : "Failed to generate PDF. Please try copying the text instead."
      );
    }
  }

  const evidenceList = response?.draft.evidenceList ?? defaultEvidence;

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Legal AI Assistant"
        title="Turn a cybercrime incident into a filing-ready action plan"
        description="This guided assistant classifies the issue, builds evidence checklists, and prepares a complaint draft for official channels."
      />

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
        This is an AI-based guidance tool, not a licensed lawyer. It can help you organize facts and next steps, but it cannot guarantee legal outcomes.
      </div>

      <div className="grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
        <Card className="flex flex-col border border-slate-200/80 bg-white/50 dark:border-slate-800/80 dark:bg-slate-950/40 shadow-xl backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base font-bold">Incident Intake Wizard</CardTitle>
              <Badge variant="accent">Step {step} of 5</Badge>
            </div>
            
            {/* Timeline Progress Bar */}
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? "bg-sky-500" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-5">
            {step === 1 && (
              <div className="space-y-3 animate-in fade-in duration-205">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 1: Describe the incident *
                </label>
                <Textarea
                  className="min-h-40"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Example: I received a call claiming to be from FedEx courier. They told me a parcel in my name contained illegal items and threatened me with digital arrest..."
                  value={form.description}
                />
                <p className="text-[11px] text-slate-400">
                  Be as detailed as possible. Start from how you were first contacted and what the suspect told you.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 animate-in fade-in duration-205">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 2: Core Variables
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Date & Time of Incident</label>
                    <Input
                      onChange={(event) =>
                        setForm((current) => ({ ...current, incidentDate: event.target.value }))
                      }
                      placeholder="e.g., 2026-06-28 14:30"
                      value={form.incidentDate}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Platform/App Involved</label>
                    <Input
                      onChange={(event) =>
                        setForm((current) => ({ ...current, platform: event.target.value }))
                      }
                      placeholder="e.g., WhatsApp, Telegram, GPay"
                      value={form.platform}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Amount Lost (INR), if any</label>
                    <Input
                      onChange={(event) =>
                        setForm((current) => ({ ...current, amountLost: event.target.value }))
                      }
                      placeholder="e.g., ₹50,000"
                      value={form.amountLost}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 animate-in fade-in duration-205">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 3: Suspect Metadata & technical details
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">How did they contact you?</label>
                    <Input
                      onChange={(event) =>
                        setForm((current) => ({ ...current, contactMethod: event.target.value }))
                      }
                      placeholder="e.g., SMS, Voice Call, Instagram Direct Message"
                      value={form.contactMethod}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">UTR / Transaction IDs / Account Numbers</label>
                    <Input
                      onChange={(event) =>
                        setForm((current) => ({ ...current, transactionDetails: event.target.value }))
                      }
                      placeholder="UTR number, Suspect UPI ID, Bank Name"
                      value={form.transactionDetails}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 animate-in fade-in duration-205">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 4: Evidence & Notes
                </label>
                <Textarea
                  className="min-h-36"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, evidenceNotes: event.target.value }))
                  }
                  placeholder="Describe evidence: Screenshots of chats, bank SMS alerts, caller ID logs..."
                  value={form.evidenceNotes}
                />
                <p className="text-[11px] text-slate-400">
                  Briefly mention what screenshots or files you have saved. These are critical for the evidence checklist.
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3 animate-in fade-in duration-205">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 5: Review & Submit
                </label>
                <div className="space-y-2 rounded-2xl bg-slate-105/50 p-4 dark:bg-slate-950/20 text-xs leading-5 border border-slate-200/55 dark:border-slate-800/60 max-h-80 overflow-y-auto">
                  <p><strong>Description:</strong> {form.description || "N/A"}</p>
                  <p><strong>Incident Date:</strong> {form.incidentDate || "N/A"}</p>
                  <p><strong>Platform:</strong> {form.platform || "N/A"}</p>
                  <p><strong>Amount Lost:</strong> {form.amountLost || "N/A"}</p>
                  <p><strong>Contact Method:</strong> {form.contactMethod || "N/A"}</p>
                  <p><strong>Technical/UTR Details:</strong> {form.transactionDetails || "N/A"}</p>
                  <p><strong>Evidence Notes:</strong> {form.evidenceNotes || "N/A"}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <Button disabled={loading} onClick={() => void generateGuidance("chat")}>
                    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Ask Legal AI
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={() => void generateGuidance("draft")}
                    variant="secondary"
                  >
                    <FileText className="h-4 w-4" />
                    Draft complaint
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between border-t border-slate-150 dark:border-slate-850 pt-4 mt-2">
              <Button
                disabled={step === 1 || loading}
                onClick={() => setStep((s) => s - 1)}
                variant="secondary"
                size="sm"
                className="rounded-xl text-xs"
              >
                Back
              </Button>
              
              {step < 5 ? (
                <Button
                  onClick={() => {
                    if (step === 1 && !form.description.trim()) {
                      setError("Describe the incident before continuing.");
                      return;
                    }
                    setError(null);
                    setStep((s) => s + 1);
                  }}
                  size="sm"
                  className="rounded-xl text-xs"
                >
                  Continue
                </Button>
              ) : null}
            </div>

            {error ? <p className="text-xs text-rose-500 font-semibold">{error}</p> : null}
            {notice ? <p className="text-xs text-emerald-600 dark:text-emerald-300 font-semibold">{notice}</p> : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  className={`inline-flex min-w-fit items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-slate-200 bg-white/80 text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "chat" ? (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>Problem understanding mode</CardTitle>
                    <CardDescription>
                      Classification, immediate actions, reporting steps, and follow-up questions.
                    </CardDescription>
                  </div>
                  {response?.draft ? <Badge variant="accent">{response.draft.problemType}</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {response ? (
                  <>
                    <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200">
                      {response.reply}
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <GuidanceList title="Immediate actions" items={response.draft.immediateActions} />
                      <GuidanceList title="Reporting steps" items={response.draft.reportingSteps} />
                      <GuidanceList title="Safety precautions" items={response.draft.safetyPrecautions} />
                      <GuidanceList title="Follow-up questions" items={response.draft.followUpQuestions} />
                    </div>
                  </>
                ) : (
                  <EmptyState
                    title="Describe the issue to begin"
                    description="The assistant will classify the cybercrime type and build the next steps from your facts."
                  />
                )}
              </CardContent>
            </Card>
          ) : null}

          {activeTab === "complaint" ? (
            <Card>
              <CardHeader>
                <CardTitle>Smart complaint draft</CardTitle>
                <CardDescription>
                  Use this as a structured starting point for cybercrime.gov.in, bank escalation, or police/FIR guidance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {response?.draft ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <SummaryTile label="Problem type" value={response.draft.problemType} />
                      <SummaryTile label="Date/time" value={response.draft.dateTime} />
                      <SummaryTile label="Transaction details" value={response.draft.transactionDetails} />
                      <SummaryTile label="Portal" value="https://cybercrime.gov.in" />
                    </div>
                    <Textarea
                      className="min-h-[420px] font-mono text-xs"
                      readOnly
                      value={response.draft.complaintText}
                    />
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => void copyComplaint()} variant="secondary">
                        <Clipboard className="h-4 w-4" />
                        Copy
                      </Button>
                      <Button onClick={() => void downloadPdf()} variant="secondary">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button disabled={saving} onClick={() => void saveCase()}>
                        <Save className="h-4 w-4" />
                        Save case
                      </Button>
                      <Link href={reportHref}>
                        <Button variant="secondary">
                          <ShieldCheck className="h-4 w-4" />
                          Use in report
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    title="No complaint draft yet"
                    description="Fill the incident details and select Draft complaint to generate a filing-ready structure."
                  />
                )}
              </CardContent>
            </Card>
          ) : null}

          {activeTab === "evidence" ? (
            <Card>
              <CardHeader>
                <CardTitle>Evidence checklist</CardTitle>
                <CardDescription>
                  Keep originals where possible and avoid deleting messages before filing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <GuidanceList title="Collect these items" items={evidenceList} />
                {response?.draft ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <GuidanceList title="Relevant law awareness" items={response.draft.relevantLaws} />
                    <GuidanceList title="User rights" items={response.draft.userRights} />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Saved legal cases</CardTitle>
              <CardDescription>
                Drafts are stored in the `legal_cases` collection for signed-in users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedCases.length ? (
                <div className="space-y-3">
                  {savedCases.map((item) => (
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
                  title="No saved legal cases"
                  description={
                    user
                      ? "Generate and save a complaint draft to see it here."
                      : "Sign in to save legal case drafts to Firestore."
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function GuidanceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            className="rounded-lg border border-slate-200 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
