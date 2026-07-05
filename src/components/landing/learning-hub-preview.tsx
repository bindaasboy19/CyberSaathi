"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, HelpCircle, Award, CheckCircle, XCircle, 
  RotateCcw, ArrowRight, Smartphone 
} from 'lucide-react';
import { QUIZ_QUESTIONS } from './cyber-data';

export default function LearningHubPreview() {
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Audience category state
  const [activeAudience, setActiveAudience] = useState<'seniors' | 'children' | 'women' | 'merchants'>('seniors');

  const audiences = {
    seniors: {
      title: 'Senior Citizens Safety Guide',
      subtitle: 'Defending our elders from digital manipulation and emotional triggers.',
      risk: 'High risk of pension scams, fake KYC calls, medical insurance fraud, and technical support scams.',
      guides: [
        'Never trust callers demanding OTPs or threatening to block your bank account immediately.',
        'Always consult with children or trusted relatives before initiating any online financial transfer.',
        'Official government agents or bank officials will never demand money in gift cards or crypto.'
      ]
    },
    children: {
      title: 'Youth & Children Safety Protocol',
      subtitle: 'Fostering safe digital playgrounds for children and teenagers.',
      risk: 'High vulnerability to cyberbullying, gaming skin scams, identity harvesting, and online grooming.',
      guides: [
        'Never share photos, home address, school details, or passwords with virtual gaming friends.',
        'If someone online threatens or bullies you, do not hide it. Talk to parents or teachers immediately.',
        'Enable Google SafeSearch, use private profiles, and do not click unsolicited link invitations.'
      ]
    },
    women: {
      title: 'Women Online Protection Safeguards',
      subtitle: 'Ensuring absolute privacy, security, and digital safety parameters.',
      risk: 'High risk of online harassment, deepfake blackmail, identity impersonation, and stalking.',
      guides: [
        'Lock social media profiles and do not accept friend requests from unknown/anonymous profiles.',
        'Use Two-Factor Authentication (2FA) on Instagram, Facebook, and WhatsApp to prevent account hijacking.',
        'File anonymous reports for cyber harassment directly under the secure portal on cybercrime.gov.in.'
      ]
    },
    merchants: {
      title: 'UPI Merchants & Business Defence',
      subtitle: 'Securing daily UPI settlements and digital business registers.',
      risk: 'Vulnerable to "Fake Screen payment confirmation apps", reverse-charge merchant UPI fraud, and invoice scams.',
      guides: [
        'Always verify incoming UPI credits through official bank statement notifications or Soundbox voice alerts.',
        'Do not trust customer screenshots showing "Transfer Successful" as they can be easily manipulated.',
        'Install official banking applications only from Google Play Store or Apple App Store.'
      ]
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getRiskTitle = (finalScore: number) => {
    const ratio = finalScore / QUIZ_QUESTIONS.length;
    if (ratio === 1) return 'Digital Sentinel (Safe)';
    if (ratio >= 0.6) return 'Cyber Literate (Cautious)';
    return 'Vulnerable Profile (High Risk)';
  };

  const getRiskColor = (finalScore: number) => {
    const ratio = finalScore / QUIZ_QUESTIONS.length;
    if (ratio === 1) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (ratio >= 0.6) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-red-400 border-red-500/20 bg-red-500/5';
  };

  return (
    <div id="learning-hub-page" className="py-24 border-t border-white/[0.04] relative bg-slate-950/20">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider border border-emerald-500/20 inline-flex items-center gap-1.5 mb-4">
          <BookOpen className="w-3.5 h-3.5" /> Cyber Safety Academy
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Empowering India with <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Digital Hygiene</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Cyber hygiene is the fundamental shield against online fraud. Explore dedicated vulnerability guides curated for various audiences, and test your defensive preparedness using our interactive IQ Quiz.
        </p>
      </div>

      {/* Section 1: Audience Guides (Seniors, Children, Women, Businesses) */}
      <div className="mb-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 border-b border-white/5 pb-6">
          {(Object.keys(audiences) as Array<keyof typeof audiences>).map((audKey) => (
            <button
              key={audKey}
              onClick={() => setActiveAudience(audKey)}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeAudience === audKey
                  ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5'
                  : 'bg-white/5 border border-white/10 text-slate-450 hover:text-white hover:bg-white/10 hover:border-white/25'
              }`}
            >
              {audKey === 'seniors' && '👵 Senior Citizens'}
              {audKey === 'children' && '🧒 Children & Teens'}
              {audKey === 'women' && '👩 Women Security'}
              {audKey === 'merchants' && '🏪 UPI Merchants'}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-8 lg:p-10 relative overflow-hidden shadow-xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Left Block (Columns: 5) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 block uppercase">Target Defendee Profile</span>
            <h3 className="text-2xl font-bold text-white leading-tight">{audiences[activeAudience].title}</h3>
            <p className="text-emerald-250/80 text-sm leading-relaxed italic font-sans">
              &ldquo;{audiences[activeAudience].subtitle}&rdquo;
            </p>
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-1">Vulnerability Threat Vectors:</span>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{audiences[activeAudience].risk}</p>
              </div>
              <div className="pt-1">
                <Link
                  href={`/learn?course=${
                    activeAudience === 'seniors'
                      ? 'c-financial-literacy'
                      : activeAudience === 'children'
                      ? 'c-security-basics'
                      : activeAudience === 'women'
                      ? 'c-privacy-safety'
                      : 'c-financial-literacy'
                  }`}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Start Interactive Classroom Course</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Block (Columns: 7) */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-4">Critical Defense Actions</h4>
            <div className="space-y-3">
              {audiences[activeAudience].guides.map((guide, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start gap-3.5 group hover:border-white/10 transition-colors">
                  <div className="w-6.5 h-6.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-[11px] font-bold shrink-0 mt-0.5">
                    {idx+1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-sans">{guide}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Cyber Safety IQ Quiz */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
          
          <div className="border-b border-white/5 pb-5 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Test Your Safety IQ</h3>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase">INDIAN CYBER THREAT EVALUATION</span>
              </div>
            </div>
            {!quizFinished && (
              <span className="text-xs text-slate-300 font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Question */}
                <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans">
                  {QUIZ_QUESTIONS[currentQuestionIndex].question}
                </h4>

                {/* Options List */}
                <div className="space-y-2.5">
                  {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    let optionStyle = 'bg-white/5 border-white/10 text-slate-350 hover:border-white/20 hover:bg-white/10';

                    if (isAnswered) {
                      const isCorrect = idx === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex;
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300';
                      } else if (isSelected) {
                        optionStyle = 'bg-red-500/10 border-red-500/40 text-red-305';
                      } else {
                        optionStyle = 'bg-white/[0.01] border-white/5 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
                    }

                    return (
                      <button
                        key={idx}
                        id={`quiz-option-${idx}`}
                        disabled={isAnswered}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 focus:outline-none cursor-pointer ${optionStyle}`}
                      >
                        <span className="w-5.5 h-5.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-bold font-mono text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Feedback Explanation */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3"
                  >
                    {selectedOption === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex ? (
                      <CheckCircle className="w-5.5 h-5.5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5.5 h-5.5 text-red-550 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 font-mono mb-1">
                        {selectedOption === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex ? 'Correct Response' : 'Incorrect Response'}
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {QUIZ_QUESTIONS[currentQuestionIndex].explanation}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-end pt-4 border-t border-white/5">
                  {!isAnswered ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-slate-500 text-black font-bold text-xs transition-colors shadow-md focus:outline-none cursor-pointer"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all flex items-center gap-1.5 focus:outline-none group cursor-pointer"
                    >
                      <span>{currentQuestionIndex + 1 === QUIZ_QUESTIONS.length ? 'Finish Quiz' : 'Next Question'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Quiz Finished Scorecard */
              <motion.div
                key="scorecard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">Assessment Complete</span>
                  <h4 className="text-2xl font-bold text-white mt-1">Your Cyber Safety Score</h4>
                </div>

                <div className="inline-flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-2xl min-w-44 shadow-lg">
                  <span className="text-5xl font-extrabold font-mono text-white leading-none">
                    {score}<span className="text-xl text-slate-550">/{QUIZ_QUESTIONS.length}</span>
                  </span>
                  <span className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(score)}`}>
                    {getRiskTitle(score)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-sans text-center">
                  {score === QUIZ_QUESTIONS.length 
                    ? 'Excellent! You have pristine digital safety habits and robust awareness under Indian Cyber Law directives.'
                    : 'You have decent awareness, but some critical gaps remain. We strongly recommend spending 10 minutes reading our target defendee guides above to prevent standard UPI and bank OTP fraud.'}
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-3">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Re-test Awareness
                  </button>
                  <a
                    href="/register"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors focus:outline-none"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Install Saathi Guard
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
