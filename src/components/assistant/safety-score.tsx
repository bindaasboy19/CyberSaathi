"use client";

import { RotateCcw, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { safetyQuestions } from "@/lib/data/content";

export function SafetyScore() {
  const { pick } = useLanguage();
  const [setIndex, setSetIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Get the 5 questions for the current set (Set 0: 0-4, Set 1: 5-9, Set 2: 10-14)
  const activeQuestions = useMemo(() => {
    const startIndex = setIndex * 5;
    return safetyQuestions.slice(startIndex, startIndex + 5);
  }, [setIndex]);

  // Calculate score based on answers of active questions
  const totalScore = useMemo(() => {
    return activeQuestions.reduce((total, question) => {
      const answerIndex = answers[question.id];
      if (answerIndex === undefined) {
        return total;
      }
      return total + question.options[answerIndex].score;
    }, 0);
  }, [activeQuestions, answers]);

  const improvementHints = useMemo(() => {
    return activeQuestions
      .map((question) => {
        const answerIndex = answers[question.id];
        if (answerIndex === undefined) {
          return null;
        }
        // Only show improvement tips for options that scored less than the maximum (20 points)
        if (question.options[answerIndex].score < 20) {
          return question.options[answerIndex].insight;
        }
        return null;
      })
      .filter((hint): hint is typeof safetyQuestions[0]["options"][0]["insight"] => hint !== null)
      .map((hint) => pick(hint));
  }, [activeQuestions, answers, pick]);

  const handleOptionSelect = (optionIndex: number) => {
    const currentQuestion = activeQuestions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));

    // Auto advance or finish after a brief timeout for better UX
    setTimeout(() => {
      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 400);
  };

  const handleNextSet = () => {
    setSetIndex((prev) => (prev + 1) % 3);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
  };

  const currentQuestion = activeQuestions[currentQuestionIndex];

  return (
    <Card className="overflow-hidden border border-slate-200/80 bg-white/70 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <CardHeader className="border-b border-slate-200/50 bg-slate-50/50 px-5 py-4 dark:border-slate-800/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sky-500 animate-pulse" />
          <CardTitle className="text-lg font-bold">
            {pick({ en: "Cyber Safety Self-Check", hi: "साइबर सुरक्षा स्व-जांच" })}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          {pick({
            en: "Test your digital habits across password rules, financial safety, and emergency response.",
            hi: "पासवर्ड नियम, वित्तीय सुरक्षा और आपातकालीन प्रतिक्रिया पर अपनी डिजिटल आदतों का परीक्षण करें।",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        {!quizCompleted ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>
                  {pick({ en: `Question ${currentQuestionIndex + 1} of 5`, hi: `प्रश्न ${currentQuestionIndex + 1} का 5` })}
                </span>
                <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-sky-600 dark:text-sky-400">
                  {pick({ en: `Quiz Set ${setIndex + 1}/3`, hi: `क्विज सेट ${setIndex + 1}/3` })}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            {currentQuestion && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-sky-500/10 text-xs font-bold text-sky-600 dark:text-sky-400">
                    ?
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-6">
                    {pick(currentQuestion.question)}
                  </h3>
                </div>

                <div className="grid gap-3 pt-2">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answers[currentQuestion.id] === index;

                    return (
                      <button
                        key={index}
                        className={`w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.99] flex items-center justify-between ${
                          isSelected
                            ? "border-sky-500 bg-sky-500/10 text-sky-950 dark:text-sky-300"
                            : "border-slate-200/80 bg-white/50 text-slate-700 hover:border-sky-300 hover:bg-sky-50/30 dark:border-slate-800/80 dark:bg-slate-900/30 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/30"
                        }`}
                        onClick={() => handleOptionSelect(index)}
                        type="button"
                      >
                        <span className="pr-4 leading-6">{pick(option.label)}</span>
                        {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-400 space-y-5">
            {/* Score view */}
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-900/20">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {pick({ en: "Your Safety Score", hi: "आपका सुरक्षा स्कोर" })}
                  </p>
                  <p className="mt-1 font-display text-4xl font-extrabold text-slate-950 dark:text-white">
                    {totalScore}/100
                  </p>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {pick({ en: "Complete!", hi: "पूर्ण!" })}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <ProgressBar value={totalScore} />
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 font-medium">
                  {totalScore >= 80
                    ? pick({
                        en: "Excellent! Your safety habits are highly secure. Maintain this caution in stressful situations.",
                        hi: "उत्कृष्ट! आपकी सुरक्षा आदतें बहुत मजबूत हैं। तनावपूर्ण स्थितियों में भी इसी सतर्कता को बनाए रखें।",
                      })
                    : totalScore >= 50
                      ? pick({
                          en: "Good base, but some shortcuts are exposing you. Tighten these gaps to stay completely safe.",
                          hi: "अच्छा आधार है, लेकिन कुछ लापरवाही आपको खतरे में डाल सकती है। पूरी तरह सुरक्षित रहने के लिए इन कमियों को दूर करें।",
                        })
                      : pick({
                          en: "High risk! Your digital safety habits have serious vulnerability gaps. Start implementing the suggestions below immediately.",
                          hi: "उच्च जोखिम! आपकी डिजिटल सुरक्षा आदतों में गंभीर कमियां हैं। तुरंत नीचे दिए गए सुझावों को लागू करना शुरू करें।",
                        })}
                </p>
              </div>
            </div>

            {/* Improvement suggestions */}
            {improvementHints.length > 0 ? (
              <div className="rounded-[28px] border border-amber-200/50 bg-amber-50/40 p-5 dark:border-amber-900/30 dark:bg-amber-950/10">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <p className="font-bold text-sm">
                    {pick({ en: "Key Suggestions to Improve", hi: "सुधार के लिए मुख्य सुझाव" })}
                  </p>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {improvementHints.map((hint, idx) => (
                    <li key={idx} className="marker:text-amber-500 pl-1">
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-[28px] border border-emerald-200/50 bg-emerald-50/40 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/10 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  {pick({
                    en: "Incredible! You didn't leave any vulnerability gaps in this quiz set.",
                    hi: "अविश्वसनीय! आपने इस क्विज सेट में कोई सुरक्षा कमी नहीं छोड़ी।",
                  })}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="w-full rounded-2xl flex items-center justify-center gap-2"
                onClick={handleNextSet}
              >
                <ArrowRight className="h-4 w-4" />
                {pick({ en: "Try Next Quiz Set", hi: "अगला क्विज सेट खेलें" })}
              </Button>
              <Button
                variant="secondary"
                className="w-full rounded-2xl flex items-center justify-center gap-2"
                onClick={handleResetQuiz}
              >
                <RotateCcw className="h-4 w-4" />
                {pick({ en: "Reset This Quiz", hi: "इस क्विज को रीसेट करें" })}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
