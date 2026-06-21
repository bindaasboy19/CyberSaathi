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

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Ask a question</CardTitle>
            <CardDescription>
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
            />
            <Input
              onChange={(event) =>
                setQuestionForm((current) => ({ ...current, category: event.target.value }))
              }
              placeholder="Category"
              value={questionForm.category}
            />
            <Textarea
              onChange={(event) =>
                setQuestionForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Describe the scam pattern or issue..."
              value={questionForm.description}
            />
            <Button className="w-full" onClick={() => void handleQuestionSubmit()}>
              Post question
            </Button>
            <div className="rounded-[24px] border border-emerald-200/70 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100">
              Experts and admins are marked so users can distinguish higher-trust answers.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-sm text-slate-500 dark:text-slate-400">
                Loading community feed...
              </CardContent>
            </Card>
          ) : questions.length === 0 ? (
            <EmptyState
              title="No questions yet"
              description="Be the first to ask the community for scam-prevention or response guidance."
            />
          ) : (
            questions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{question.title}</CardTitle>
                      <CardDescription className="mt-2">
                        Asked by {question.authorName} · {formatRelativeDate(question.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="neutral">{question.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                    {question.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={() => void handleVote("question", question.id)}>
                      <ArrowBigUp className="h-4 w-4" />
                      {question.votes}
                    </Button>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {question.answerCount} answers
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(groupedAnswers[question.id] || []).map((answer) => (
                      <div
                        key={answer.id}
                        className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-950 dark:text-white">
                              {answer.authorName}
                            </p>
                            {answer.isExpert ? <Badge variant="accent">Expert</Badge> : null}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatRelativeDate(answer.createdAt)}
                          </p>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                          {answer.content}
                        </p>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => void handleVote("answer", answer.id)}
                          >
                            <ArrowBigUp className="h-4 w-4" />
                            {answer.votes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[24px] border border-dashed border-slate-300/80 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <MessageSquareText className="h-4 w-4" />
                      Add an answer
                    </div>
                    <Textarea
                      className="mt-3 min-h-28"
                      onChange={(event) =>
                        setAnswerDrafts((current) => ({
                          ...current,
                          [question.id]: event.target.value,
                        }))
                      }
                      placeholder="Share practical guidance, not assumptions."
                      value={answerDrafts[question.id] ?? ""}
                    />
                    <Button className="mt-3" onClick={() => void handleAnswerSubmit(question.id)}>
                      Submit answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
