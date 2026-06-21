"use client";

import {
  ArrowLeft,
  Award,
  CheckCircle,
  Lock,
  Play,
  Check,
  BookOpen,
  HelpCircle,
  RefreshCw,
  Trophy,
  Loader2,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Shield,
  Wallet,
  Share2,
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import {
  fetchDbCourses,
  fetchDbModules,
  fetchDbLessons,
  fetchDbQuizzes,
  fetchDbUserProgress,
  saveDbUserProgress,
  seedLearningHub,
} from "@/lib/firebase/firestore";
import type { Course, Module, Lesson, Quiz, UserProgress } from "@/types";

// --- Fallback Offline / Demo Data ---
const FALLBACK_COURSES: Course[] = [
  {
    id: "c-security-basics",
    title: { en: "Cybersecurity Fundamentals", hi: "साइबर सुरक्षा बुनियादी बातें" },
    description: { en: "Learn to secure devices, choose passwords, enable MFA, and secure app permissions.", hi: "डिवाइस सुरक्षित करना, सुरक्षित पासवर्ड चुनना, एमएफए चालू करना और ऐप अनुमतियों को सुरक्षित करना सीखें।" },
    track: "beginner",
    icon: "security",
    order: 1
  },
  {
    id: "c-financial-literacy",
    title: { en: "Digital Financial Literacy", hi: "डिजिटल वित्तीय साक्षरता" },
    description: { en: "Learn secure UPI payment methods, verify bank calls, and report financial scams.", hi: "सुरक्षित यूपीआई भुगतान सीखें, बैंक कॉल का सत्यापन करें और वित्तीय घोटालों की रिपोर्ट करें।" },
    track: "intermediate",
    icon: "financial",
    order: 2
  },
  {
    id: "c-privacy-safety",
    title: { en: "Social Media & Privacy Safety", hi: "सोशल मीडिया और गोपनीयता सुरक्षा" },
    description: { en: "Master social account protection, two-step verification, deepfakes, and AI voice scams.", hi: "सोशल मीडिया अकाउंट सुरक्षा, टू-स्टेप वेरिफिकेशन, डीपफेक और एआई वॉयस घोटालों में महारत हासिल करें।" },
    track: "advanced",
    icon: "social",
    order: 3
  }
];

const FALLBACK_MODULES: Module[] = [
  {
    id: "m-passwords",
    courseId: "c-security-basics",
    title: { en: "Password Hygiene & MFA", hi: "पासवर्ड हाइजीन और एमएफए" },
    description: { en: "Core fundamentals of creating secure passwords and second-factor locks.", hi: "सुरक्षित पासवर्ड बनाने और दूसरे कारक ताले के बुनियादी नियम।" },
    order: 1
  },
  {
    id: "m-secure-payments",
    courseId: "c-financial-literacy",
    title: { en: "Secure Digital Payments", hi: "सुरक्षित डिजिटल भुगतान" },
    description: { en: "Learn rules of UPI payments, QR codes, and bank safety.", hi: "यूपीआई भुगतान, क्यूआर कोड और बैंक सुरक्षा के नियम सीखें।" },
    order: 1
  },
  {
    id: "m-identity-safety",
    courseId: "c-privacy-safety",
    title: { en: "Identity Protection & AI", hi: "पहचान सुरक्षा और एआई" },
    description: { en: "Protect your accounts and detect voice clones or deepfakes.", hi: "अपने खातों को सुरक्षित रखें और वॉयस क्लोन या डीपफेक का पता लगाएं।" },
    order: 1
  }
];

const FALLBACK_LESSONS: Lesson[] = [
  {
    id: "l-pwd-power",
    courseId: "c-security-basics",
    moduleId: "m-passwords",
    title: { en: "Password Power & Managers", hi: "मजबूत पासवर्ड और पासवर्ड मैनेजर" },
    order: 1,
    contentType: "video",
    content: {
      en: "### Password Power Basics\n\nSimple passwords can be cracked by hackers in seconds. Dict-attacks look for common phrases and variations.\n\nAlways use audited password managers to generate strong, unique keys. A strong master password kept offline is the key.",
      hi: "### पासवर्ड सुरक्षा के नियम\n\nसाधारण पासवर्ड हैकर्स द्वारा सेकंडों में क्रैक किए जा सकते हैं। डिक्शनरी हमले सामान्य शब्दों और संयोजनों को ढूंढते हैं।\n\nहमेशा मजबूत, रैंडम और अनोखे पासवर्ड बनाने के लिए पासवर्ड मैनेजर का उपयोग करें। ऑफलाइन सुरक्षित मास्टर पासवर्ड ही इसकी चाबी है।"
    },
    videoUrl: "https://www.youtube.com/embed/OP307T12bX0",
    teacher: { en: "Prof. Neha Sharma", hi: "प्रो. नेहा शर्मा" },
    duration: 120
  },
  {
    id: "l-mfa",
    courseId: "c-security-basics",
    moduleId: "m-passwords",
    title: { en: "Two-Factor Authentication (MFA)", hi: "टू-फैक्टर ऑथेंटिकेशन (MFA)" },
    order: 2,
    contentType: "text",
    content: {
      en: "### Multi-Factor Authentication\n\nMFA adds a second security layer that blocks hackers even if they know your password.\n\nSMS OTPs can be intercepted via SIM swapping. Use Authenticator apps like Google Authenticator or Microsoft Authenticator instead. Local codes are generated on-device without internet.",
      hi: "### टू-फैक्टर ऑथेंटिकेशन (MFA)\n\nएमएफए एक अतिरिक्त परत जोड़ता है जो पासवर्ड पता होने पर भी हैकर्स को रोकता है।\n\nएसएमएस ओटीपी सिम स्वैपिंग हमलों के प्रति संवेदनशील हैं। इसके बजाय गूगल ऑथेंटिकेटर जैसे ऐप्स का उपयोग करें। यह बिना इंटरनेट के डिवाइस पर ही कोड बनाते हैं।"
    },
    teacher: { en: "Prof. Neha Sharma", hi: "प्रो. नेहा शर्मा" },
    duration: 90
  },
  {
    id: "l-permissions",
    courseId: "c-security-basics",
    moduleId: "m-passwords",
    title: { en: "Mobile Device Security & Permissions", hi: "मोबाइल सुरक्षा और ऐप अनुमतियाँ" },
    order: 3,
    contentType: "text",
    content: {
      en: "### Audit App Permissions\n\nA simple keyboard or game app should never ask for SMS reading or contact permissions.\n\nSideloading apps from random links bypasses Play Protect security safeguards. Only download from official stores like Google Play or Apple App Store.",
      hi: "### ऐप अनुमतियों की जांच\n\nएक साधारण कीबोर्ड या गेम ऐप को कभी भी एसएमएस पढ़ने या कॉन्टैक्ट देखने की अनुमति नहीं चाहिए।\n\nअज्ञात लिंक से एपीके (APK) लोड करना सभी सुरक्षा जांचों को बायपास कर देता है। केवल आधिकारिक प्ले स्टोर या ऐप स्टोर से ही डाउनलोड करें।"
    },
    teacher: { en: "Prof. Neha Sharma", hi: "प्रो. नेहा शर्मा" },
    duration: 90
  },
  {
    id: "l-upi-safety",
    courseId: "c-financial-literacy",
    moduleId: "m-secure-payments",
    title: { en: "UPI & QR Code Safety", hi: "UPI और QR कोड सुरक्षा" },
    order: 1,
    contentType: "video",
    content: {
      en: "### UPI PIN Safety Rules\n\nUPI PIN is required ONLY to send money. You NEVER enter a PIN to receive money.\n\nScanning a QR code means you are debiting your account. Decline stranger QR codes. If someone claims they are sending a refund via QR code, it is a scam.",
      hi: "### UPI और QR कोड सुरक्षा\n\nयूपीआई पिन की आवश्यकता केवल पैसे भेजने/भुगतान करने के लिए होती है। पैसे प्राप्त करने के लिए कभी भी पिन न डालें।\n\nक्यूआर कोड स्कैन करने का मतलब बैंक से पैसे निकालना है। अजनबियों के क्यूआर कोड स्वीकार न करें। अगर कोई क्यूआर कोड से पैसे भेजने का दावा करे तो वह धोखाधड़ी है।"
    },
    videoUrl: "https://www.youtube.com/embed/OP307T12bX0",
    teacher: { en: "Cdr. R. K. Singh (Retd. Cyber Cell)", hi: "कमोडोर आर. के. सिंह (सेवानिवृत्त साइबर सेल)" },
    duration: 120
  },
  {
    id: "l-kyc-scams",
    courseId: "c-financial-literacy",
    moduleId: "m-secure-payments",
    title: { en: "Spotting KYC & Banking Scams", hi: "KYC और बैंकिंग घोटालों को पहचानना" },
    order: 2,
    contentType: "text",
    content: {
      en: "### KYC SMS Fraud\n\nBanks never request verification over standard calls or ask you to install remote support apps like AnyDesk or TeamViewer.\n\nAlways call the helpline number printed on your physical debit card. Never click links in SMS stating your account is blocked.",
      hi: "### फर्जी केवाईसी अलर्ट\n\nबैंक कभी भी सामान्य मोबाइल कॉल पर केवाईसी या AnyDesk/TeamViewer जैसे ऐप इंस्टॉल करने का अनुरोध नहीं करते।\n\nहमेशा अपने डेबिट/क्रेडिट कार्ड के पीछे छपे नंबर पर कॉल करें। एसएमएस में दिए गए लिंक पर कभी भी भरोसा न करें।"
    },
    teacher: { en: "Cdr. R. K. Singh (Retd. Cyber Cell)", hi: "कमोडोर आर. के. सिंह (सेवानिवृत्त साइबर सेल)" },
    duration: 90
  },
  {
    id: "l-wa-security",
    courseId: "c-privacy-safety",
    moduleId: "m-identity-safety",
    title: { en: "WhatsApp Hijacking Prevention", hi: "व्हाट्सएप हाइजैकिंग से बचाव" },
    order: 1,
    contentType: "text",
    content: {
      en: "### Social Engineering Hijacks\n\nScammers call you pretending to be friends or family, asking for a WhatsApp 6-digit code.\n\nNever share verification codes. Enable 2-Step Verification PIN lock inside WhatsApp settings to prevent unauthorized access.",
      hi: "### व्हाट्सएप सुरक्षा पिन\n\nधोखेबाज कॉल करके आपके व्हाट्सएप का 6-अक्षरों का कोड मांग सकते हैं।\n\nप्रमाणीकरण कोड किसी के साथ साझा न करें। व्हाट्सएप में टू-स्टेप वेरिफिकेशन सेटिंग्स चालू रखें ताकि कोई अन्य लॉगिन न कर सके।"
    },
    teacher: { en: "Prof. Neha Sharma", hi: "प्रो. नेहा शर्मा" },
    duration: 90
  },
  {
    id: "l-deepfakes",
    courseId: "c-privacy-safety",
    moduleId: "m-identity-safety",
    title: { en: "AI Voice Cloning & Deepfakes", hi: "एआई वॉयस क्लोनिंग और डीपफेक" },
    order: 2,
    contentType: "video",
    content: {
      en: "### AI Voice Cloning Scams\n\nScammers record a 3-second sample of your family member's voice and use AI to request urgent funds.\n\nVerify by calling them back on their original number or asking a secret family question that only they would know.",
      hi: "### एआई वॉयस क्लोनिंग घोटाले\n\nहैकर्स केवल 3-सेकंड की वॉयस रिकॉर्डिंग से आपके रिश्तेदार की आवाज क्लोन कर सकते हैं।\n\nसत्यापन के लिए उन्हें उनके पुराने नंबर पर कॉल करें या कोई पारिवारिक गुप्त प्रश्न पूछें जो केवल वे ही जानते हों।"
    },
    videoUrl: "https://www.youtube.com/embed/OP307T12bX0",
    teacher: { en: "Cdr. R. K. Singh (Retd. Cyber Cell)", hi: "कमोडोर आर. के. सिंह (सेवानिवृत्त साइबर सेल)" },
    duration: 90
  }
];

const FALLBACK_QUIZZES: Quiz[] = [
  {
    id: "q-passwords",
    moduleId: "m-passwords",
    questions: [
      {
        id: "qp-1",
        question: { en: "Which of the following practices provides the strongest security for online accounts?", hi: "निम्नलिखित में से कौन सा तरीका खातों के लिए सबसे मजबूत सुरक्षा देता है?" },
        options: [
          { en: "Using the same complex password for all accounts.", hi: "सभी खातों के लिए एक ही जटिल पासवर्ड का उपयोग करना।" },
          { en: "Using unique passwords managed via an Authenticator App/Password Manager.", hi: "पासवर्ड मैनेजर और ऑथेंटिकेटर ऐप के माध्यम से अलग-अलग पासवर्ड का उपयोग करना।" },
          { en: "Writing passwords in a secure notepad file on your computer.", hi: "कंप्यूटर पर एक नोटपैड फ़ाइल में पासवर्ड लिखकर रखना।" }
        ],
        correctOptionIdx: 1,
        explanation: { en: "Unique passwords managed via vaults block 99% of takeover scams.", hi: "पासवर्ड वॉल्ट का उपयोग 99% हैकिंग प्रयासों को रोक देता है।" }
      }
    ]
  },
  {
    id: "q-secure-payments",
    moduleId: "m-secure-payments",
    questions: [
      {
        id: "qp-2",
        question: { en: "What should you do if a buyer sends a QR code claiming scanning it deposits a refund?", hi: "यदि कोई खरीदार चैट पर क्यूआर कोड भेजकर कहता है कि इसे स्कैन करने से पैसे मिलेंगे, तो क्या करेंगे?" },
        options: [
          { en: "Scan the QR code and enter your UPI PIN to accept the funds.", hi: "क्यूआर कोड स्कैन करें और पैसे स्वीकार करने के लिए अपना यूपीआई पिन डालें।" },
          { en: "Refuse to scan. Receiving money never requires scanning or entering a PIN.", hi: "स्कैन करने से मना करें। पैसे पाने के लिए कभी स्कैन करने या पिन डालने की आवश्यकता नहीं होती।" },
          { en: "Scan the code using a secondary payment app to test it.", hi: "इसकी जांच करने के लिए किसी अन्य पेमेंट ऐप से कोड स्कैन करें।" }
        ],
        correctOptionIdx: 1,
        explanation: { en: "QR codes are debit instructions. You never scan to receive money.", hi: "क्यूआर कोड केवल भुगतान भेजने के लिए होते हैं। पैसे पाने के लिए कभी स्कैन न करें।" }
      }
    ]
  },
  {
    id: "q-identity-safety",
    moduleId: "m-identity-safety",
    questions: [
      {
        id: "qp-3",
        question: { en: "What is the safest way to verify if a caller requesting emergency funds is a family member or a clone?", hi: "आपातकालीन पैसे मांगने वाले रिश्तेदार की वॉयस क्लोनिंग से पहचान करने का सबसे सुरक्षित तरीका क्या है?" },
        options: [
          { en: "Transfer the requested funds immediately to avoid any risk.", hi: "बिना किसी देरी के तुरंत पैसे ट्रांसफर कर दें।" },
          { en: "Ask a secret family question or contact them on their original number.", hi: "कोई पारिवारिक गुप्त प्रश्न पूछें या उनके मूल नंबर पर सीधे संपर्क करें।" },
          { en: "Ask them to send a photo of their ID card.", hi: "उनसे उनके पहचान पत्र की फोटो भेजने को कहें।" }
        ],
        correctOptionIdx: 1,
        explanation: { en: "Direct call back to the original number and secret family questions defeat voice cloning.", hi: "मूल नंबर पर सीधे कॉल बैक और गुप्त प्रश्न एआई वॉयस क्लोन को बेनकाब कर देते हैं।" }
      }
    ]
  }
];

export default function LearnPage() {
  const { pick } = useLanguage();
  const { user, configured } = useAuth();

  // Firestore DB states or fallbacks
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userProgressList, setUserProgressList] = useState<Record<string, UserProgress>>({});

  // UI Selection States
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  // Filters & Toggles
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [dbEmpty, setDbEmpty] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Quiz Play States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Read local progress fallback if offline/unconfigured
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

  const saveLocalProgress = (progress: Record<string, UserProgress>) => {
    localStorage.setItem("cybersaathi-local-progress", JSON.stringify(progress));
    setUserProgressList(progress);
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    if (!configured) {
      // Local fallback mode
      setCourses(FALLBACK_COURSES);
      setModules(FALLBACK_MODULES);
      setLessons(FALLBACK_LESSONS);
      setQuizzes(FALLBACK_QUIZZES);
      setUserProgressList(loadLocalProgress());
      setDbEmpty(false);
      setLoading(false);
      return;
    }

    try {
      const dbCourses = await fetchDbCourses();
      if (dbCourses.length === 0) {
        setDbEmpty(true);
        setCourses(FALLBACK_COURSES); // Show fallback while empty
        setModules(FALLBACK_MODULES);
        setLessons(FALLBACK_LESSONS);
        setQuizzes(FALLBACK_QUIZZES);
        setLoading(false);
        return;
      }

      setDbEmpty(false);
      setCourses(dbCourses);

      // Load all modules, lessons and quizzes from db
      const allModulesPromises = dbCourses.map((c) => fetchDbModules(c.id));
      const allLessonsPromises = dbCourses.map((c) => fetchDbLessons(c.id));

      const modulesResults = await Promise.all(allModulesPromises);
      const lessonsResults = await Promise.all(allLessonsPromises);
      const dbQuizzes = await fetchDbQuizzes();

      setModules(modulesResults.flat());
      setLessons(lessonsResults.flat());
      setQuizzes(dbQuizzes);

      // Load user progress
      if (user) {
        const progressMap: Record<string, UserProgress> = {};
        for (const c of dbCourses) {
          const prog = await fetchDbUserProgress(user.uid, c.id);
          if (prog) {
            progressMap[c.id] = prog;
          }
        }
        setUserProgressList(progressMap);
      } else {
        setUserProgressList(loadLocalProgress());
      }
    } catch (err) {
      console.error("Error loading CyberSaathi DB", err);
      setDbError(err instanceof Error ? err.message : String(err));
      // Fallback on error to keep app up
      setCourses(FALLBACK_COURSES);
      setModules(FALLBACK_MODULES);
      setLessons(FALLBACK_LESSONS);
      setQuizzes(FALLBACK_QUIZZES);
      setUserProgressList(loadLocalProgress());
    } finally {
      setLoading(false);
    }
  }, [configured, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Seed Handler
  const handleSeedCatalog = async () => {
    if (!configured) return;
    setSeeding(true);
    try {
      await seedLearningHub();
      await fetchData();
    } catch (err) {
      console.error("Error seeding CyberSaathi Catalog", err);
    } finally {
      setSeeding(false);
    }
  };

  // Filter courses by track
  const filteredCourses = useMemo(() => {
    if (selectedTrack === "all") return courses;
    return courses.filter((c) => c.track === selectedTrack);
  }, [courses, selectedTrack]);

  // Find course details
  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === activeCourseId) || null;
  }, [courses, activeCourseId]);

  // Find current course modules and lessons
  const currentCourseModules = useMemo(() => {
    if (!activeCourseId) return [];
    return modules.filter((m) => m.courseId === activeCourseId).sort((a, b) => a.order - b.order);
  }, [modules, activeCourseId]);

  const currentCourseLessons = useMemo(() => {
    if (!activeCourseId) return [];
    return lessons.filter((l) => l.courseId === activeCourseId).sort((a, b) => a.order - b.order);
  }, [lessons, activeCourseId]);

  const activeLesson = useMemo(() => {
    if (!activeLessonId) return null;
    return lessons.find((l) => l.id === activeLessonId) || null;
  }, [lessons, activeLessonId]);

  const activeQuiz = useMemo(() => {
    if (!activeQuizId) return null;
    return quizzes.find((q) => q.moduleId === activeQuizId) || null;
  }, [quizzes, activeQuizId]);

  // Compute lesson map under modules
  const lessonsByModule = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    for (const m of currentCourseModules) {
      map[m.id] = currentCourseLessons.filter((l) => l.moduleId === m.id);
    }
    return map;
  }, [currentCourseModules, currentCourseLessons]);

  // Expand module sidebar accordion by default
  useEffect(() => {
    if (activeCourseId) {
      const initialExpanded: Record<string, boolean> = {};
      currentCourseModules.forEach((m) => {
        initialExpanded[m.id] = true;
      });
      setExpandedModules(initialExpanded);
    }
  }, [activeCourseId, currentCourseModules]);

  // Get active progress of current course
  const currentCourseProgress = useMemo(() => {
    if (!activeCourseId) return null;
    return (
      userProgressList[activeCourseId] || {
        userId: user?.uid || "guest",
        courseId: activeCourseId,
        completedLessons: [],
        quizScores: {},
        progressPercent: 0,
        unlockedBadge: false,
      }
    );
  }, [userProgressList, activeCourseId, user]);

  // Check if all lessons in a module are completed
  const isModuleLessonsCompleted = (moduleId: string) => {
    const moduleLessons = lessonsByModule[moduleId] || [];
    if (moduleLessons.length === 0) return false;
    return moduleLessons.every((l) => currentCourseProgress?.completedLessons.includes(l.id));
  };

  // Check if entire course is completed
  const checkAndUnlockBadge = (
    completedLessons: string[],
    quizScores: Record<string, number>
  ) => {
    if (!activeCourseId) return false;
    const courseLessons = currentCourseLessons;
    const courseModules = currentCourseModules;

    const allLessonsDone = courseLessons.every((l) => completedLessons.includes(l.id));
    const allQuizzesPassed = courseModules.every((m) => {
      const score = quizScores[m.id];
      return score !== undefined && score >= 80;
    });

    return allLessonsDone && allQuizzesPassed;
  };

  // Toggle Lesson Completion
  const handleToggleLessonComplete = async (lessonId: string) => {
    if (!activeCourseId || !currentCourseProgress) return;

    const isCurrentlyDone = currentCourseProgress.completedLessons.includes(lessonId);
    let nextCompleted = [...currentCourseProgress.completedLessons];

    if (isCurrentlyDone) {
      nextCompleted = nextCompleted.filter((id) => id !== lessonId);
    } else {
      nextCompleted.push(lessonId);
    }

    // Recalculate percent (Lessons + quizzes count)
    const totalItems = currentCourseLessons.length + currentCourseModules.length;
    const completedLessonsCount = nextCompleted.length;
    const completedQuizzesCount = currentCourseModules.filter((m) => {
      const score = currentCourseProgress.quizScores[m.id];
      return score !== undefined && score >= 80;
    }).length;

    const progressPercent = Math.min(
      100,
      Math.round(((completedLessonsCount + completedQuizzesCount) / totalItems) * 100)
    );

    const unlockedBadge = checkAndUnlockBadge(nextCompleted, currentCourseProgress.quizScores);

    const updatedProgress: UserProgress = {
      userId: user?.uid || "guest",
      courseId: activeCourseId,
      completedLessons: nextCompleted,
      quizScores: currentCourseProgress.quizScores,
      progressPercent,
      unlockedBadge,
    };

    // Save
    if (configured && user) {
      try {
        await saveDbUserProgress(updatedProgress);
      } catch (err) {
        console.error("Failed saving to DB, using local fallback", err);
      }
    }
    const local = loadLocalProgress();
    local[activeCourseId] = updatedProgress;
    saveLocalProgress(local);
  };

  // Select Course
  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setActiveQuizId(null);

    // Pick first lesson of course
    const courseLessons = lessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
    if (courseLessons.length > 0) {
      setActiveLessonId(courseLessons[0].id);
    } else {
      setActiveLessonId(null);
    }
    setIsMobileMenuOpen(false);
  };

  // Select Lesson
  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveQuizId(null);
    setIsMobileMenuOpen(false);
  };

  // Select Quiz
  const handleSelectQuiz = (moduleId: string) => {
    setActiveQuizId(moduleId);
    setActiveLessonId(null);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setQuizAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
    setIsMobileMenuOpen(false);
  };

  // Handle Option Select
  const handleOptionSelect = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOptionIdx(idx);
  };

  // Submit Answer
  const handleAnswerSubmit = () => {
    if (selectedOptionIdx === null || !activeQuiz || quizAnswered) return;

    const isCorrect = selectedOptionIdx === activeQuiz.questions[currentQuestionIdx].correctOptionIdx;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
    setQuizAnswered(true);
  };

  // Next Quiz Question or Finish
  const handleNextQuizQuestion = async () => {
    if (!activeQuiz || !currentCourseProgress || !activeCourseId) return;

    if (currentQuestionIdx + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setQuizAnswered(false);
    } else {
      // Finished
      setQuizFinished(true);
      const finalScorePct = Math.round((quizScore / activeQuiz.questions.length) * 100);

      const nextQuizScores = {
        ...currentCourseProgress.quizScores,
        [activeQuiz.moduleId]: finalScorePct,
      };

      // Recalculate progress
      const totalItems = currentCourseLessons.length + currentCourseModules.length;
      const completedLessonsCount = currentCourseProgress.completedLessons.length;
      const completedQuizzesCount = currentCourseModules.filter((m) => {
        const score = nextQuizScores[m.id];
        return score !== undefined && score >= 80;
      }).length;

      const progressPercent = Math.min(
        100,
        Math.round(((completedLessonsCount + completedQuizzesCount) / totalItems) * 100)
      );

      const unlockedBadge = checkAndUnlockBadge(
        currentCourseProgress.completedLessons,
        nextQuizScores
      );

      const updatedProgress: UserProgress = {
        userId: user?.uid || "guest",
        courseId: activeCourseId,
        completedLessons: currentCourseProgress.completedLessons,
        quizScores: nextQuizScores,
        progressPercent,
        unlockedBadge,
      };

      if (configured && user) {
        try {
          await saveDbUserProgress(updatedProgress);
        } catch (err) {
          console.error("Failed saving to DB, using local fallback", err);
        }
      }
      const local = loadLocalProgress();
      local[activeCourseId] = updatedProgress;
      saveLocalProgress(local);
    }
  };

  // Get matching track icon
  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "security":
        return <Shield className="h-6 w-6 text-sky-400" />;
      case "financial":
        return <Wallet className="h-6 w-6 text-emerald-400" />;
      case "social":
        return <Share2 className="h-6 w-6 text-indigo-400" />;
      default:
        return <BookOpen className="h-6 w-6 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
        <p className="text-sm font-semibold text-slate-400">
          {pick({ en: "Loading Cyber Learning Hub...", hi: "साइबर लर्निंग हब लोड हो रहा है..." })}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-6 pb-12">
      {/* Background graphics decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px] dark:bg-sky-500/5" />
      <div className="pointer-events-none absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/5" />

      {!activeCourseId ? (
        // 1. ALL COURSES / TRACKS VIEW
        <div className="space-y-6">
          <SectionHeading
            eyebrow={pick({ en: "Cyber Academy", hi: "साइबर अकादमी" })}
            title={pick({ en: "Structured Cyber Learning Tracks", hi: "संरचित साइबर लर्निंग ट्रैक" })}
            description={pick({
              en: "Develop verified cyber safety skills. Move from fundamentals to advanced financial and identity privacy protection.",
              hi: "प्रमाणित साइबर सुरक्षा कौशल विकसित करें। बुनियादी बातों से लेकर उन्नत वित्तीय और पहचान गोपनीयता सुरक्षा तक सीखें।",
            })}
          />

          {/* Database Setup State Alert for Admins / Developers */}
          {dbError && (
            <Card className="border border-red-500/30 bg-red-500/10 p-5 backdrop-blur-md">
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-red-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  {pick({ en: "Database Connection Warning", hi: "डेटाबेस कनेक्शन चेतावनी" })}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pick({
                    en: `The app could not fetch documents from Cloud Firestore. Falling back to local offline catalog mode. Error details: ${dbError}`,
                    hi: `ऐप क्लाउड फायरस्टोर से दस्तावेज प्राप्त नहीं कर सका। स्थानीय ऑफलाइन कैटलॉग मोड पर वापस आ रहा है। त्रुटि विवरण: ${dbError}`,
                  })}
                </p>
                <div className="text-xs border-t border-red-500/20 pt-2 mt-1 text-slate-400 font-semibold">
                  {pick({
                    en: "Tip: Make sure you have deployed your Firestore rules using 'firebase deploy --only firestore:rules' or copy-pasted 'firestore.rules' into the Rules tab in your Firebase Console.",
                    hi: "सुझाव: सुनिश्चित करें कि आपने 'firebase deploy --only firestore:rules' का उपयोग करके अपने फायरस्टोर नियम तैनात किए हैं या अपने फायरबेस कंसोल में नियम टैब में 'firestore.rules' को कॉपी-पेस्ट किया है।",
                  })}
                </div>
              </div>
            </Card>
          )}

          {dbEmpty && configured && !dbError && (
            <Card className="border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-md">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-bold text-amber-500">
                    {pick({ en: "Catalog Uninitialized", hi: "कैटलॉग अनप्रारंभीकृत" })}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {pick({
                      en: "The Cloud Firestore database has no course records. Seed the catalog to load standard lessons.",
                      hi: "क्लाउड फायरस्टोर डेटाबेस में कोई कोर्स रिकॉर्ड नहीं है। मानक पाठ लोड करने के लिए कैटलॉग सीड करें।",
                    })}
                  </p>
                </div>
                <Button
                  onClick={handleSeedCatalog}
                  disabled={seeding}
                  className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs gap-2 shrink-0"
                >
                  {seeding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {pick({ en: "Seed Learning Catalog", hi: "लर्निंग कैटलॉग सीड करें" })}
                </Button>
              </div>
            </Card>
          )}

          {/* Tracks Filter Badges */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            {[
              { id: "all", label: { en: "All Levels", hi: "सभी स्तर" } },
              { id: "beginner", label: { en: "Beginner Track", hi: "बुनियादी स्तर" } },
              { id: "intermediate", label: { en: "Intermediate Track", hi: "मध्यम स्तर" } },
              { id: "advanced", label: { en: "Advanced Track", hi: "उन्नत स्तर" } },
            ].map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-bold transition duration-200 border",
                  selectedTrack === track.id
                    ? "bg-slate-900 border-slate-800 text-white dark:bg-sky-500 dark:border-sky-400 dark:text-slate-950 shadow-md"
                    : "bg-white/50 border-slate-200 hover:bg-white text-slate-600 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                )}
              >
                {pick(track.label)}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const prog = userProgressList[course.id] || {
                progressPercent: 0,
                unlockedBadge: false,
              };
              const courseLessons = lessons.filter((l) => l.courseId === course.id);
              const completedCount = prog.completedLessons?.length || 0;

              return (
                <Card
                  key={course.id}
                  className="flex flex-col border border-slate-200/80 bg-white/40 shadow-xl backdrop-blur-md dark:border-slate-900/60 dark:bg-slate-950/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-slate-100 p-2.5 dark:bg-slate-900">
                        {getCourseIcon(course.icon)}
                      </div>
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
                        course.track === "beginner" && "bg-sky-500/10 text-sky-600 dark:text-sky-400",
                        course.track === "intermediate" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                        course.track === "advanced" && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      )}>
                        {pick(
                          course.track === "beginner"
                            ? { en: "Beginner", hi: "बुनियादी" }
                            : course.track === "intermediate"
                              ? { en: "Intermediate", hi: "मध्यम" }
                              : { en: "Advanced", hi: "उन्नत" }
                        )}
                      </span>
                    </div>

                    <CardTitle className="mt-4 text-base font-bold text-slate-950 dark:text-white">
                      {pick(course.title)}
                    </CardTitle>
                    <CardDescription className="text-xs leading-5 mt-1.5 min-h-[40px] text-slate-500 dark:text-slate-400">
                      {pick(course.description)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 mt-auto space-y-4">
                    {/* Completion Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <span>
                          {pick({
                            en: `${completedCount} / ${courseLessons.length} Lessons`,
                            hi: `${completedCount} / ${courseLessons.length} पाठ`,
                          })}
                        </span>
                        <span>{prog.progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300"
                          style={{ width: `${prog.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleSelectCourse(course.id)}
                        className="w-full rounded-xl text-xs font-bold gap-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        {prog.progressPercent > 0
                          ? pick({ en: "Resume Course", hi: "कोर्स जारी रखें" })
                          : pick({ en: "Start Learning", hi: "सीखना शुरू करें" })}
                      </Button>

                      {prog.unlockedBadge && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-500" title={pick({ en: "Badge unlocked!", hi: "पदक प्राप्त!" })}>
                          <Trophy className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        // 2. ACTIVE SYLLABUS / WORKSPACE VIEW
        <div className="space-y-4">
          {/* Header Action Row */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveCourseId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {pick({ en: "Back to Tracks", hi: "ट्रैक पर वापस जाएं" })}
            </button>

            <div className="flex items-center gap-3">
              <span className="hidden text-xs font-bold text-slate-400 sm:inline">
                {pick(activeCourse?.title || { en: "", hi: "" })}
              </span>

              {/* Mobile Drawer Trigger */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-xl text-xs gap-1.5 border-slate-300 dark:border-slate-800"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                {pick({ en: "Syllabus", hi: "पाठ्यक्रम" })}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Left Nav: Course syllabus sidebar (responsive) */}
            <aside
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-[280px] border-r border-slate-200 bg-white/95 p-4 shadow-xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950/95 lg:static lg:z-0 lg:w-auto lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="flex flex-col h-full gap-4">
                {/* Mobile drawer header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 lg:hidden">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate pr-2">
                    {pick(activeCourse?.title || { en: "", hi: "" })}
                  </span>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>

                {/* Modules list container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {currentCourseModules.map((mod) => {
                    const isExpanded = !!expandedModules[mod.id];
                    const moduleLessons = lessonsByModule[mod.id] || [];
                    const isModCompleted = isModuleLessonsCompleted(mod.id);
                    const modQuiz = quizzes.find((q) => q.moduleId === mod.id);
                    const quizPassed =
                      (currentCourseProgress?.quizScores[mod.id] || 0) >= 80;

                    return (
                      <div
                        key={mod.id}
                        className="rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-900 dark:bg-slate-950/30 overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedModules((prev) => ({ ...prev, [mod.id]: !prev[mod.id] }))
                          }
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100/40 dark:hover:bg-slate-900/30 transition"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                              {pick(mod.title)}
                            </p>
                            <p className="text-[9px] text-slate-400 truncate mt-0.5">
                              {pick(mod.description)}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-100 dark:border-slate-900 bg-white/20 p-2 space-y-1">
                            {/* Lessons List */}
                            {moduleLessons.map((lesson) => {
                              const isCompleted =
                                currentCourseProgress?.completedLessons.includes(lesson.id) || false;
                              const isSelected = activeLessonId === lesson.id;

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => handleSelectLesson(lesson.id)}
                                  className={cn(
                                    "w-full text-left rounded-lg px-2.5 py-2 text-[10px] font-bold flex items-center gap-2 transition",
                                    isSelected
                                      ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950"
                                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                                  )}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                  )}
                                  <span className="truncate">{pick(lesson.title)}</span>
                                </button>
                              );
                            })}

                            {/* Quiz Row */}
                            {modQuiz && (
                              <button
                                disabled={!isModCompleted}
                                onClick={() => handleSelectQuiz(mod.id)}
                                className={cn(
                                  "w-full text-left rounded-lg px-2.5 py-2 text-[10px] font-bold flex items-center gap-2 transition border border-dashed",
                                  !isModCompleted
                                    ? "opacity-50 cursor-not-allowed border-slate-200 text-slate-400 dark:border-slate-900"
                                    : activeQuizId === mod.id
                                      ? "bg-emerald-500 border-emerald-400 text-white"
                                      : quizPassed
                                        ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                                        : "border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/5"
                                )}
                              >
                                {quizPassed ? (
                                  <Trophy className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                ) : !isModCompleted ? (
                                  <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                ) : (
                                  <HelpCircle className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                                )}
                                <span className="truncate">
                                  {pick({ en: "Module Quiz", hi: "मॉड्यूल प्रश्नोत्तरी" })}
                                </span>
                                {!isModCompleted && (
                                  <span className="ml-auto text-[8px] font-semibold text-slate-400">
                                    {pick({ en: "Locked", hi: "ताला" })}
                                  </span>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Badge Unlock Status widget at sidebar bottom */}
                {currentCourseProgress?.unlockedBadge && (
                  <Card className="border border-emerald-500/30 bg-emerald-500/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Award className="h-7 w-7 text-emerald-500 animate-bounce" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                          {pick({ en: "Badge Unlocked!", hi: "पदक प्राप्त हुआ!" })}
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                          {pick({ en: "CyberSafety Champion", hi: "साइबर सुरक्षा चैंपियन" })}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </aside>

            {/* Right workspace content view */}
            <main className="space-y-4">
              {/* Overlay Backdrop for Mobile menu */}
              {isMobileMenuOpen && (
                <div
                  className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}

              {/* 2A: LESSON VIEW */}
              {activeLessonId && activeLesson && (
                <Card className="border border-slate-200 bg-white/70 shadow-xl backdrop-blur-md dark:border-slate-900 dark:bg-slate-950/70 overflow-hidden rounded-2xl">
                  {/* Meta details */}
                  <div className="bg-slate-100/55 p-5 border-b border-slate-200 dark:bg-slate-900/40 dark:border-slate-900">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[9px] font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                        {pick({ en: activeLesson.contentType, hi: activeLesson.contentType === "video" ? "वीडियो" : "पाठ" })}
                      </span>
                      {activeLesson.duration && (
                        <span className="text-[10px] font-bold text-slate-400">
                          {Math.round(activeLesson.duration / 60)}{" "}
                          {pick({ en: "mins study", hi: "मिनट अध्ययन" })}
                        </span>
                      )}
                      {activeLesson.teacher && (
                        <span className="text-[10px] font-bold text-slate-400 ml-auto">
                          {pick({ en: `Instructor: ${pick(activeLesson.teacher)}`, hi: `शिक्षक: ${pick(activeLesson.teacher)}` })}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-950 dark:text-white mt-2 leading-snug">
                      {pick(activeLesson.title)}
                    </h2>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Embedded Video Screen */}
                    {activeLesson.contentType === "video" && activeLesson.videoUrl && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200/20 bg-slate-950 shadow-2xl">
                        <iframe
                          src={activeLesson.videoUrl}
                          title={pick(activeLesson.title)}
                          className="absolute inset-0 h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Lesson markdown text */}
                    <article className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4">
                      {pick(activeLesson.content)
                        .split("\n\n")
                        .map((para, pIdx) => {
                          if (para.startsWith("###")) {
                            return (
                              <h3 key={pIdx} className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white mt-4 border-l-4 border-sky-400 pl-2">
                                {para.replace("###", "").trim()}
                              </h3>
                            );
                          }
                          return <p key={pIdx}>{para}</p>;
                        })}
                    </article>

                    {/* Bottom Action bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-900 mt-6">
                      <Button
                        onClick={() => handleToggleLessonComplete(activeLesson.id)}
                        variant={
                          currentCourseProgress?.completedLessons.includes(activeLesson.id)
                            ? "secondary"
                            : "primary"
                        }
                        className="rounded-xl text-xs font-bold gap-2"
                      >
                        {currentCourseProgress?.completedLessons.includes(activeLesson.id) ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-500" />
                            {pick({ en: "Completed ✓", hi: "पूर्ण हुआ ✓" })}
                          </>
                        ) : (
                          pick({ en: "Mark as Completed", hi: "पूर्ण मार्क करें" })
                        )}
                      </Button>

                      {/* Navigation helper */}
                      <div className="flex gap-2">
                        {/* Find next item */}
                        {(() => {
                          const courseLessons = currentCourseLessons;
                          const currentIdx = courseLessons.findIndex((l) => l.id === activeLesson.id);
                          const hasNextLesson = currentIdx !== -1 && currentIdx + 1 < courseLessons.length;

                          if (hasNextLesson) {
                            return (
                              <Button
                                onClick={() => handleSelectLesson(courseLessons[currentIdx + 1].id)}
                                className="rounded-xl text-xs font-bold gap-1.5"
                                variant="secondary"
                              >
                                {pick({ en: "Next Lesson", hi: "अगला पाठ" })}
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            );
                          } else {
                            // Suggest quiz of first module
                            const currentMod = currentCourseModules.find((m) => m.id === activeLesson.moduleId);
                            if (currentMod) {
                              const hasQuiz = quizzes.some((q) => q.moduleId === currentMod.id);
                              if (hasQuiz) {
                                return (
                                  <Button
                                    disabled={!isModuleLessonsCompleted(currentMod.id)}
                                    onClick={() => handleSelectQuiz(currentMod.id)}
                                    className="rounded-xl text-xs font-bold gap-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950"
                                  >
                                    {pick({ en: "Unlock Module Quiz", hi: "मॉड्यूल प्रश्नोत्तरी अनलॉक" })}
                                    <Trophy className="h-4 w-4" />
                                  </Button>
                                );
                              }
                            }
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 2B: QUIZ WORKSPACE VIEW */}
              {activeQuizId && activeQuiz && (
                <Card className="border border-slate-200 bg-white/70 shadow-xl backdrop-blur-md dark:border-slate-900 dark:bg-slate-950/70 overflow-hidden rounded-2xl">
                  {/* Quiz Header */}
                  <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 p-5 border-b border-slate-200 dark:border-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[9px] font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                        {pick({ en: "Module Challenge", hi: "मॉड्यूल चुनौती" })}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {pick({ en: "Minimum 80% to Pass", hi: "उत्तीर्ण होने के लिए न्यूनतम 80%" })}
                      </span>
                    </div>
                    <h2 className="text-base font-extrabold text-slate-950 dark:text-white mt-2">
                      {pick(
                        currentCourseModules.find((m) => m.id === activeQuizId)?.title || {
                          en: "Knowledge Check",
                          hi: "ज्ञान जांच",
                        }
                      )}
                    </h2>
                  </div>

                  <CardContent className="p-6">
                    {!quizFinished ? (
                      // QUESTION SCREEN
                      <div className="space-y-6">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                          <span>
                            {pick({
                              en: `Question ${currentQuestionIdx + 1} of ${activeQuiz.questions.length}`,
                              hi: `प्रश्न ${currentQuestionIdx + 1} का ${activeQuiz.questions.length}`,
                            })}
                          </span>
                          <span>
                            {pick({ en: `Correct: ${quizScore}`, hi: `सही उत्तर: ${quizScore}` })}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 w-full bg-slate-100 rounded-full dark:bg-slate-800">
                          <div
                            className="h-1 bg-sky-500 rounded-full transition-all duration-300"
                            style={{
                              width: `${((currentQuestionIdx) / activeQuiz.questions.length) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Question Text */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white leading-snug">
                          {pick(activeQuiz.questions[currentQuestionIdx].question)}
                        </h3>

                        {/* Options Stack */}
                        <div className="space-y-3">
                          {activeQuiz.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                            const isSelected = selectedOptionIdx === oIdx;
                            const isCorrect = oIdx === activeQuiz.questions[currentQuestionIdx].correctOptionIdx;

                            return (
                              <button
                                key={oIdx}
                                disabled={quizAnswered}
                                onClick={() => handleOptionSelect(oIdx)}
                                className={cn(
                                  "w-full text-left rounded-xl p-3 text-xs sm:text-sm font-semibold border transition-all duration-200 flex items-center justify-between",
                                  !quizAnswered
                                    ? isSelected
                                      ? "border-sky-500 bg-sky-500/5 text-sky-600 dark:text-sky-400"
                                      : "border-slate-200 bg-white/40 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900"
                                    : isSelected
                                      ? isCorrect
                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                      : isCorrect
                                        ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                                        : "border-slate-200 bg-slate-50/20 text-slate-400 dark:border-slate-800 dark:bg-slate-900/10"
                                )}
                              >
                                <span>{pick(opt)}</span>
                                {quizAnswered && (
                                  <span>
                                    {isCorrect && (
                                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    )}
                                    {isSelected && !isCorrect && (
                                      <X className="h-4 w-4 text-rose-500" />
                                    )}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Interactive Explanation card */}
                        {quizAnswered && (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50 animate-in fade-in duration-300">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                              {pick({ en: "Explanation", hi: "स्पष्टीकरण" })}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                              {pick(activeQuiz.questions[currentQuestionIdx].explanation)}
                            </p>
                          </div>
                        )}

                        {/* Next action button */}
                        <div className="flex justify-end pt-3">
                          {!quizAnswered ? (
                            <Button
                              onClick={handleAnswerSubmit}
                              disabled={selectedOptionIdx === null}
                              className="rounded-xl text-xs font-bold"
                            >
                              {pick({ en: "Submit Answer", hi: "उत्तर सबमिट करें" })}
                            </Button>
                          ) : (
                            <Button
                              onClick={handleNextQuizQuestion}
                              className="rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950"
                            >
                              {currentQuestionIdx + 1 === activeQuiz.questions.length
                                ? pick({ en: "Finish Quiz", hi: "प्रश्नोत्तरी समाप्त करें" })
                                : pick({ en: "Next Question", hi: "अगला प्रश्न" })}
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      // SCORE / RESULTS SCREEN
                      <div className="flex flex-col items-center justify-center py-8 text-center space-y-5">
                        {Math.round((quizScore / activeQuiz.questions.length) * 100) >= 80 ? (
                          <>
                            <div className="rounded-full bg-emerald-500/10 p-5 border border-emerald-500/20 text-emerald-500 animate-bounce">
                              <Trophy className="h-10 w-10" />
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
                              {pick({ en: "Challenge Passed!", hi: "चुनौती उत्तीर्ण!" })}
                            </h3>
                            <p className="text-xs text-slate-400 max-w-sm">
                              {pick({
                                en: `Fantastic job! You scored ${Math.round((quizScore / activeQuiz.questions.length) * 100)}% and proved your cyber safety awareness.`,
                                hi: `शानदार काम! आपने ${Math.round((quizScore / activeQuiz.questions.length) * 100)}% स्कोर किया और साइबर सुरक्षा जागरूकता सिद्ध की।`,
                              })}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="rounded-full bg-rose-500/10 p-5 border border-rose-500/20 text-rose-500">
                              <X className="h-10 w-10" />
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
                              {pick({ en: "Please Try Again", hi: "कृपया पुनः प्रयास करें" })}
                            </h3>
                            <p className="text-xs text-slate-400 max-w-sm">
                              {pick({
                                en: `You scored ${Math.round((quizScore / activeQuiz.questions.length) * 100)}%. Review the syllabus lessons and retry to secure your badge.`,
                                hi: `आपने ${Math.round((quizScore / activeQuiz.questions.length) * 100)}% स्कोर किया। बैज प्राप्त करने के लिए पाठों को दोहराएं।`,
                              })}
                            </p>
                          </>
                        )}

                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleSelectQuiz(activeQuizId)}
                            className="rounded-xl text-xs font-bold"
                          >
                            {pick({ en: "Retake Quiz", hi: "प्रश्नोत्तरी दोबारा लें" })}
                          </Button>
                          <Button
                            onClick={() => {
                              // Go back to first lesson
                              const moduleLessons = lessonsByModule[activeQuizId] || [];
                              if (moduleLessons.length > 0) {
                                handleSelectLesson(moduleLessons[0].id);
                              }
                            }}
                            variant="secondary"
                            className="rounded-xl text-xs font-bold"
                          >
                            {pick({ en: "Review Syllabus", hi: "पाठ्यक्रम की समीक्षा करें" })}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
