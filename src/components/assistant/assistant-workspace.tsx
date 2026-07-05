"use client";

import { Bot, LoaderCircle, Save, Send, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { ScamAnalyzer } from "@/components/assistant/scam-analyzer";
import { SafetyScore } from "@/components/assistant/safety-score";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { Textarea } from "@/components/ui/textarea";
import { assistantSuggestions } from "@/lib/data/content";
import { fetchChatThreads, upsertChatThread } from "@/lib/firebase/firestore";
import { sharedCopy } from "@/lib/i18n";
import { createId, formatRelativeDate } from "@/lib/utils";
import type { ChatMessage, Language } from "@/types";

function buildWelcomeMessage(language: Language): ChatMessage {
  const welcomeText: Record<Language, string> = {
    en: "Namaste! I am Saathi AI, your digital cyber safety companion. Tell me what happened or what looks suspicious, and I'll help you with containment, evidence collection, BNS 2023 legal guidance, and Indian reporting channels (1930 & cybercrime.gov.in).",
    hi: "नमस्ते! मैं Saathi AI हूँ, आपका डिजिटल साइबर सुरक्षा साथी। मुझे बताइए कि क्या हुआ या क्या संदिग्ध लग रहा है, और मैं आपको नुकसान नियंत्रण, साक्ष्य संग्रह, BNS 2023 कानूनी मार्गदर्शन और भारतीय रिपोर्टिंग चैनलों (1930 और cybercrime.gov.in) में मदद करूँगा।",
    bn: "নমস্কার! আমি Saathi AI, আপনার ডিজিটাল সাইবার নিরাপত্তা সহযোগী। কী ঘটেছে বা কী সন্দেহজনক লাগছে তা আমাকে বলুন, এবং আমি আপনাকে ভারতে সাইবার অপরাধ প্রতিরোধ, নিয়ন্ত্রণ, প্রমাণ এবং অভিযোগ জানানোর পদক্ষেপগুলিতে সহায়তা করব।",
    ta: "வணக்கம்! நான் Saathi AI, உங்கள் டிஜிட்டல் இணைய பாதுகாப்பு உதவியாளர். என்ன நடந்தது அல்லது எது சந்தேகத்திற்குரியதாக இருக்கிறது என்று எனக்குச் சொல்லுங்கள், இந்தியாவில் தடுப்பு, கட்டுப்பாடு, சான்றுகள் மற்றும் புகார் அளிக்கும் படிகளுக்கு நான் உங்களுக்கு உதவுவேன்.",
    te: "నమస్తే! నేను Saathi AI, మీ డిజటల్ సైబర్ భద్రతా సహాయకుడు. ఏం జరిగిందో లేదా ఏది అనుమానాస్పదంగా ఉందో నాకు చెప్పండి, మరియు భారతదేశంలో నివారణ, నియంత్రణ, సాక్ష్యాధారాలు మరియు ఫిర్యాదు చేయడానికి నేను మీకు సహాయం చేస్తాను.",
    mr: "नमस्ते! मी Saathi AI आहे, तुमचा डिजिटल सायबर सुरक्षा सहाय्यक. काय घडले किंवा काय संशयास्पद वाटते ते मला सांगा, आणि मी तुम्हाला प्रतिबंध, नियंत्रण, पुरावे आणि तक्रार करण्याच्या पायऱ्यांवर मदत करेन।"
  };

  return {
    id: createId("message"),
    role: "assistant",
    content: welcomeText[language] ?? welcomeText.en,
    createdAt: new Date().toISOString(),
  };
}

export function AssistantWorkspace() {
  const { language, pick } = useLanguage();
  const { user, configured } = useAuth();
  const [threadId] = useState(() => createId("thread"));
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    buildWelcomeMessage(language),
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentThreads, setRecentThreads] = useState<
    Array<{ id: string; title: string; updatedAt: string }>
  >([]);

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0].role === "assistant"
        ? [buildWelcomeMessage(language)]
        : current,
    );
  }, [language]);

  useEffect(() => {
    async function loadThreads() {
      if (!user || !configured) {
        setRecentThreads([]);
        return;
      }

      try {
        const threads = await fetchChatThreads(user.uid);
        setRecentThreads(
          threads.map((thread) => ({
            id: thread.id,
            title: thread.title,
            updatedAt: thread.updatedAt,
          })),
        );
      } catch {
        setRecentThreads([]);
      }
    }

    void loadThreads();
  }, [configured, user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("query") || params.get("analyze");
      if (query && query.trim()) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        // Delay slightly to allow initialization to finish
        setTimeout(() => {
          void handleSend(query);
        }, 100);
      }
    }
  }, []);

  const recentLabel = useMemo(
    () => assistantSuggestions.map((item) => pick(item)),
    [pick],
  );

  async function saveThread(nextMessages: ChatMessage[]) {
    if (!user || !configured) {
      return;
    }

    try {
      await upsertChatThread({
        id: threadId,
        userId: user.uid,
        title: nextMessages.find((message) => message.role === "user")?.content.slice(0, 64) || "CyberSaathi chat",
        language,
        messages: nextMessages,
      });

      const threads = await fetchChatThreads(user.uid);
      setRecentThreads(
        threads.map((thread) => ({
          id: thread.id,
          title: thread.title,
          updatedAt: thread.updatedAt,
        })),
      );
    } catch {
      setStatus("Unable to save chat history right now.");
    }
  }

  async function handleSend(forcedInput?: string) {
    const textToSend = (forcedInput || input).trim();
    if (!textToSend) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId("message"),
      role: "user",
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          language,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
        source?: string;
        reason?: string;
      };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Unable to get assistant response.");
      }

      const assistantMessage: ChatMessage = {
        id: createId("message"),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
      };

      const updatedMessages = [...nextMessages, assistantMessage];
      setMessages(updatedMessages);
      window.localStorage.setItem(
        "cybersathi-assistant-context",
        JSON.stringify({
          lastUserMessage: userMessage.content,
          lastAssistantReply: assistantMessage.content,
          updatedAt: new Date().toISOString(),
        }),
      );
      await saveThread(updatedMessages);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to get assistant response.");
    } finally {
      setLoading(false);
    }
  }

  const renderMessageContent = (message: ChatMessage) => {
    if (message.role === "user") {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }

    const content = message.content;
    const lowerContent = content.toLowerCase();

    // Contextual triggers
    const isFinancial = lowerContent.includes("upi") || lowerContent.includes("money") || lowerContent.includes("bank") || lowerContent.includes("fraud") || lowerContent.includes("scam") || lowerContent.includes("₹");
    const isLegal = lowerContent.includes("complaint") || lowerContent.includes("police") || lowerContent.includes("fir") || lowerContent.includes("bns") || lowerContent.includes("act");

    return (
      <div className="space-y-3 font-sans">
        <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-100">{content}</p>
        
        {isFinancial && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-250 flex items-start gap-2.5 max-w-lg mt-3 shadow-sm animate-in fade-in duration-200">
            <span className="text-amber-500 font-bold shrink-0 mt-0.5">⚠️ Ecosystem Tip:</span>
            <div className="space-y-2">
              <p className="leading-relaxed">For immediate UPI or bank account freezing, dial the National Cyber Crime Helpline <strong className="text-red-650 dark:text-red-400 font-extrabold text-sm">1930</strong> instantly. You can also generate a custom complaint draft in our Legal workspace.</p>
              <div className="flex gap-3">
                <Link href={`/legal?description=${encodeURIComponent(content)}&problemType=financial`} className="text-sky-650 dark:text-sky-400 font-bold hover:underline">
                  Draft Complaint in Legal AI →
                </Link>
              </div>
            </div>
          </div>
        )}

        {!isFinancial && isLegal && (
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-800 dark:text-sky-200 flex items-start gap-2.5 max-w-lg mt-3 shadow-sm animate-in fade-in duration-200">
            <span className="text-sky-550 font-bold shrink-0 mt-0.5">⚖️ Legal Link:</span>
            <div className="space-y-2">
              <p className="leading-relaxed">Build a fully structured petition using our specialized step-by-step Legal Assistant wizard.</p>
              <Link href={`/legal?description=${encodeURIComponent(content)}`} className="text-sky-650 dark:text-sky-400 font-bold hover:underline">
                Open Legal AI Assistant →
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_420px]">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Saathi AI"
          title="Intelligent cyber safety assistant"
          description="Chat in guest mode for instant guidance, then sign in to persist conversations in Firestore."
        />
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200/80 bg-white/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                    Saathi AI Companion
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Prevention, response, and BNS 2023 guidelines for Indian users
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Guest chat enabled
                </Badge>
                <Badge variant={user ? "accent" : "warning"}>
                  {user ? "History sync on" : "Sign in to save"}
                </Badge>
              </div>
            </div>
          </div>
          <CardContent className="space-y-5 p-5">
            <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-[26px] px-4 py-3 text-sm leading-7 shadow-sm ${
                      message.role === "user"
                        ? "bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950"
                        : "border border-slate-200/80 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
                    }`}
                  >
                    {renderMessageContent(message)}
                    <p
                      className={`mt-2 text-[11px] ${
                        message.role === "user"
                          ? "text-white/70 dark:text-slate-900/80"
                          : "text-slate-400"
                      }`}
                    >
                      {formatRelativeDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {recentLabel.map((suggestion) => (
                <button
                  key={suggestion}
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                  onClick={() => void handleSend(suggestion)}
                  type="button"
                >
                  <Sparkles className="mr-2 inline h-3.5 w-3.5 text-sky-500" />
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="space-y-4 rounded-[24px] border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <Textarea
                className="min-h-28"
                onChange={(event) => setInput(event.target.value)}
                placeholder="Describe the suspicious message, transaction, app behavior, or incident timeline..."
                value={input}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user ? "Logged in: this conversation can be saved." : pick(sharedCopy.guestHint)}
                </p>
                <div className="flex gap-3">
                  {user ? (
                    <Button
                      variant="secondary"
                      onClick={() => void saveThread(messages)}
                    >
                      <Save className="h-4 w-4" />
                      Save now
                    </Button>
                  ) : null}
                  <Button disabled={loading} onClick={() => void handleSend()}>
                    {loading ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
              {status ? (
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                  {status}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent saved chats</CardTitle>
            <CardDescription>
              Logged-in users get chat history persistence in the `chat_history` Firestore collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentThreads.length > 0 ? (
              <div className="space-y-3">
                {recentThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="rounded-[22px] border border-slate-200/80 px-4 py-3 dark:border-slate-800"
                  >
                    <p className="font-medium text-slate-950 dark:text-white">{thread.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Updated {formatRelativeDate(thread.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No saved threads yet"
                description={
                  user
                    ? "Start chatting and your recent conversations will show up here."
                    : "Sign in with Firebase Auth to store and revisit assistant conversations."
                }
              />
            )}
          </CardContent>
        </Card>
        <ScamAnalyzer />
        <SafetyScore />
      </div>
    </div>
  );
}
