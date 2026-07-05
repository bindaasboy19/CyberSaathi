"use client";

import { ArrowBigUp, MessageSquareText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Textarea } from "@/components/ui/textarea";
import { mockAnswers, mockQuestions } from "@/lib/data/content";
import {
  createAnswer,
  createQuestion,
  fetchAnswers,
  fetchQuestions,
  incrementCounter,
} from "@/lib/firebase/firestore";
import { createId, formatRelativeDate, markSubmitted, wasSubmittedTooFast } from "@/lib/utils";
import { answerSchema, questionSchema } from "@/lib/validation/schemas";
import type { Answer, Question } from "@/types";

export function CommunityBoard() {
  const { user, profile, configured } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [questionForm, setQuestionForm] = useState({
    title: "",
    description: "",
    category: "General help",
  });
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function hydrate() {
      if (!configured) {
        return;
      }

      setLoading(true);

      try {
        const [questionRows, answerRows] = await Promise.all([fetchQuestions(), fetchAnswers()]);
        setQuestions(questionRows);
        setAnswers(answerRows);
      } catch {
        setError("Using demo community data because Firestore is not connected.");
      } finally {
        setLoading(false);
      }
    }

    void hydrate();
  }, [configured]);

  const groupedAnswers = useMemo(
    () =>
      answers.reduce<Record<string, Answer[]>>((accumulator, answer) => {
        accumulator[answer.questionId] = [...(accumulator[answer.questionId] || []), answer].sort(
          (left, right) => right.votes - left.votes,
        );
        return accumulator;
      }, {}),
    [answers],
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || q.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [questions, searchQuery, activeCategory]);

  async function handleQuestionSubmit() {
    setError(null);

    if (!user || !profile) {
      setError("Please sign in to ask questions in the community.");
      return;
    }

    if (wasSubmittedTooFast("community-question-submit")) {
      setError("Please wait a few seconds before posting again.");
      return;
    }

    const parsed = questionSchema.safeParse(questionForm);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid question.");
      return;
    }

    const nextQuestion: Question = {
      id: createId("question"),
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      userId: user.uid,
      authorName: profile.name,
      votes: 0,
      answerCount: 0,
      createdAt: new Date().toISOString(),
    };

    setQuestions((current) => [nextQuestion, ...current]);
    setQuestionForm({
      title: "",
      description: "",
      category: "General help",
    });
    markSubmitted("community-question-submit");

    if (configured) {
      try {
        const id = await createQuestion({
          title: nextQuestion.title,
          description: nextQuestion.description,
          category: nextQuestion.category,
          userId: nextQuestion.userId,
          authorName: nextQuestion.authorName,
        });

        setQuestions((current) =>
          current.map((question) =>
            question.id === nextQuestion.id ? { ...question, id } : question,
          ),
        );
      } catch {
        setError("Question was added locally, but Firestore sync failed.");
      }
    }
  }

  async function handleAnswerSubmit(questionId: string) {
    setError(null);

    if (!user || !profile) {
      setError("Please sign in to answer questions.");
      return;
    }

    const content = answerDrafts[questionId] ?? "";
    const parsed = answerSchema.safeParse({ content });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid answer.");
      return;
    }

    const nextAnswer: Answer = {
      id: createId("answer"),
      questionId,
      userId: user.uid,
      authorName: profile.name,
      content: parsed.data.content,
      votes: 0,
      isExpert: profile.role === "expert" || profile.role === "admin",
      createdAt: new Date().toISOString(),
    };

    setAnswers((current) => [nextAnswer, ...current]);
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? { ...question, answerCount: question.answerCount + 1 }
          : question,
      ),
    );
    setAnswerDrafts((current) => ({
      ...current,
      [questionId]: "",
    }));

    if (configured) {
      try {
        const id = await createAnswer({
          questionId,
          userId: nextAnswer.userId,
          authorName: nextAnswer.authorName,
          content: nextAnswer.content,
          isExpert: nextAnswer.isExpert,
        });

        setAnswers((current) =>
          current.map((answer) => (answer.id === nextAnswer.id ? { ...answer, id } : answer)),
        );
      } catch {
        setError("Answer was added locally, but Firestore sync failed.");
      }
    }
  }

  async function handleVote(type: "question" | "answer", id: string) {
    if (type === "question") {
      setQuestions((current) =>
        current.map((question) =>
          question.id === id ? { ...question, votes: question.votes + 1 } : question,
        ),
      );

      if (configured) {
        await incrementCounter("questions", id, "votes").catch(() => undefined);
      }
      return;
    }

    setAnswers((current) =>
      current.map((answer) => (answer.id === id ? { ...answer, votes: answer.votes + 1 } : answer)),
    );

    if (configured) {
      await incrementCounter("answers", id, "votes").catch(() => undefined);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Community Q&A"
        title="Ask, answer, and learn from real cybercrime situations"
        description="The community feed is public to read, while asking and answering require authenticated, role-aware participation."
      />

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xs uppercase tracking-wider font-bold text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
            type="button"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_380px]">
        {/* Left Area: Search, Categories, and Feed */}
        <div className="space-y-6">
          {/* Search Feed Card */}
          <Card className="border border-slate-200/80 bg-white/40 dark:border-slate-800/80 dark:bg-slate-950/40 shadow-xl backdrop-blur-md">
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search community discussions or scam patterns..."
                  value={searchQuery}
                  className="rounded-xl"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["All", "General help", "Financial fraud", "Social media", "Account recovery"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-3.5 py-1 text-xs font-bold transition duration-200 border ${
                      activeCategory === category
                        ? "bg-slate-900 border-slate-800 text-white dark:bg-sky-500 dark:border-sky-400 dark:text-slate-950 shadow-md"
                        : "bg-white/50 border-slate-200 hover:bg-white text-slate-600 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discussions List */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="py-8 text-sm text-slate-500 dark:text-slate-400">
                  Loading community feed...
                </CardContent>
              </Card>
            ) : filteredQuestions.length === 0 ? (
              <EmptyState
                title="No discussions found"
                description="Try modifying your search query or select another category."
              />
            ) : (
              filteredQuestions.map((question) => (
                <Card key={question.id} className="border border-slate-200/80 bg-white/40 shadow-lg hover:shadow-xl transition-all duration-300 dark:border-slate-900/50 dark:bg-slate-950/40">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-950 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                          {question.title}
                        </CardTitle>
                        <CardDescription className="mt-1.5 text-xs text-slate-550 dark:text-slate-400">
                          Asked by <strong className="text-slate-700 dark:text-slate-300">{question.authorName}</strong> · {formatRelativeDate(question.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge variant="neutral" className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800">
                        {question.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <p className="text-sm leading-relaxed text-slate-750 dark:text-slate-300">
                      {question.description}
                    </p>
                    <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-900 pt-3">
                      <Button variant="secondary" size="sm" className="rounded-xl text-xs" onClick={() => void handleVote("question", question.id)}>
                        <ArrowBigUp className="mr-1 h-3.5 w-3.5" />
                        {question.votes}
                      </Button>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {question.answerCount} answers
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(groupedAnswers[question.id] || []).map((answer) => (
                        <div
                          key={answer.id}
                          className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40 animate-in fade-in duration-200"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-xs text-slate-950 dark:text-white">
                                {answer.authorName}
                              </p>
                              {answer.isExpert ? <Badge variant="accent" className="text-[9px] px-2 py-0.5">Expert</Badge> : null}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {formatRelativeDate(answer.createdAt)}
                            </p>
                          </div>
                          <p className="mt-2 text-xs leading-6 text-slate-700 dark:text-slate-350">
                            {answer.content}
                          </p>
                          <div className="mt-2.5">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="rounded-xl h-7 text-[10px] px-2.5"
                              onClick={() => void handleVote("answer", answer.id)}
                            >
                              <ArrowBigUp className="mr-1 h-3 w-3" />
                              {answer.votes}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[24px] border border-dashed border-slate-300/80 p-4 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        <MessageSquareText className="h-4 w-4 text-sky-500" />
                        Add an answer
                      </div>
                      <Textarea
                        className="mt-3 min-h-24 text-xs rounded-xl"
                        onChange={(event) =>
                          setAnswerDrafts((current) => ({
                            ...current,
                            [question.id]: event.target.value,
                          }))
                        }
                        placeholder="Share practical guidance, not assumptions."
                        value={answerDrafts[question.id] ?? ""}
                      />
                      <Button className="mt-3 rounded-xl text-xs" onClick={() => void handleAnswerSubmit(question.id)}>
                        Submit answer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Area: Ask form and Expert warnings */}
        <div className="space-y-6">
          <Card className="border border-slate-200/80 bg-white/40 dark:border-slate-800/80 dark:bg-slate-950/40 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-base font-bold">Ask a question</CardTitle>
              <CardDescription className="text-xs">
                Keep it factual: what happened, what looked suspicious, what you already tried.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                onChange={(event) =>
                  setQuestionForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Question title"
                value={questionForm.title}
                className="rounded-xl"
              />
              <Input
                onChange={(event) =>
                  setQuestionForm((current) => ({ ...current, category: event.target.value }))
                }
                placeholder="Category (e.g. Financial fraud)"
                value={questionForm.category}
                className="rounded-xl"
              />
              <Textarea
                onChange={(event) =>
                  setQuestionForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Describe the scam pattern or issue..."
                value={questionForm.description}
                className="min-h-28 rounded-xl"
              />
              <Button className="w-full rounded-xl text-xs" onClick={() => void handleQuestionSubmit()}>
                Post question
              </Button>
              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 text-[11px] leading-5 text-emerald-905 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100">
                Experts and admins are marked so users can distinguish higher-trust answers.
              </div>
            </CardContent>
          </Card>

          {/* Expert Warnings Checklist Card */}
          <Card className="border border-slate-200/80 bg-white/40 dark:border-slate-800/80 dark:bg-slate-950/40 shadow-xl backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Trending Safety Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    title: "UPI PIN Security",
                    rule: "UPI PIN is only required to SEND money. Scanning a QR code or entering a PIN to receive a payment is a scam."
                  },
                  {
                    title: "Digital Arrest Fraud",
                    rule: "Police, CBI, or Custom officers will NEVER video call you on WhatsApp/Telegram or place you under 'digital arrest'."
                  },
                  {
                    title: "Remote Access Rules",
                    rule: "Never download AnyDesk, TeamViewer, or similar apps at the request of support callers; this lets suspects steal OTPs."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white/50 border border-slate-100 rounded-2xl dark:bg-slate-900/30 dark:border-slate-800/50">
                    <p className="text-xs font-bold text-sky-650 dark:text-sky-400">🛡️ {item.title}</p>
                    <p className="text-[11px] text-slate-650 dark:text-slate-400 mt-1 leading-relaxed">{item.rule}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
