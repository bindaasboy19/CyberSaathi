import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import { toDateString } from "@/lib/utils";
import type {
  Answer,
  ChatMessage,
  ChatThread,
  Comment,
  LegalCase,
  Post,
  Question,
  ScamReport,
  UserProfile,
  Course,
  Module,
  Lesson,
  Quiz,
  UserProgress,
} from "@/types";

function ensureDb() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  return db;
}

export async function fetchQuestions() {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(collection(firestore, "questions"), orderBy("createdAt", "desc"), limit(12)),
  );

  return snapshot.docs.map<Question>((document) => ({
    id: document.id,
    title: document.data().title,
    description: document.data().description,
    category: document.data().category,
    userId: document.data().userId,
    authorName: document.data().authorName,
    votes: document.data().votes ?? 0,
    answerCount: document.data().answerCount ?? 0,
    createdAt: toDateString(document.data().createdAt),
  }));
}

export async function fetchAnswers() {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(collection(firestore, "answers"), orderBy("createdAt", "desc"), limit(50)),
  );

  return snapshot.docs.map<Answer>((document) => ({
    id: document.id,
    questionId: document.data().questionId,
    userId: document.data().userId,
    authorName: document.data().authorName,
    content: document.data().content,
    votes: document.data().votes ?? 0,
    isExpert: Boolean(document.data().isExpert),
    createdAt: toDateString(document.data().createdAt),
  }));
}

export async function createQuestion(question: Omit<Question, "id" | "votes" | "answerCount" | "createdAt">) {
  const firestore = ensureDb();
  const document = await addDoc(collection(firestore, "questions"), {
    ...question,
    votes: 0,
    answerCount: 0,
    createdAt: serverTimestamp(),
  });

  return document.id;
}

export async function createAnswer(answer: Omit<Answer, "id" | "votes" | "createdAt">) {
  const firestore = ensureDb();
  const answerDoc = await addDoc(collection(firestore, "answers"), {
    ...answer,
    votes: 0,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(firestore, "questions", answer.questionId), {
    answerCount: increment(1),
  });

  return answerDoc.id;
}

export async function incrementCounter(
  collectionName: "questions" | "answers" | "posts",
  id: string,
  field: "votes" | "likes",
) {
  const firestore = ensureDb();
  await updateDoc(doc(firestore, collectionName, id), {
    [field]: increment(1),
  });
}

export async function fetchPosts() {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(collection(firestore, "posts"), orderBy("createdAt", "desc"), limit(12)),
  );

  return snapshot.docs.map<Post>((document) => ({
    id: document.id,
    title: document.data().title,
    content: document.data().content,
    authorId: document.data().authorId,
    authorName: document.data().authorName,
    type: document.data().type,
    likes: document.data().likes ?? 0,
    commentCount: document.data().commentCount ?? 0,
    tags: document.data().tags ?? [],
    createdAt: toDateString(document.data().createdAt),
  }));
}

export async function fetchComments() {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(collection(firestore, "comments"), orderBy("createdAt", "desc"), limit(50)),
  );

  return snapshot.docs.map<Comment>((document) => ({
    id: document.id,
    parentId: document.data().parentId,
    userId: document.data().userId,
    authorName: document.data().authorName,
    text: document.data().text,
    createdAt: toDateString(document.data().createdAt),
  }));
}

export async function createPost(post: Omit<Post, "id" | "likes" | "commentCount" | "createdAt">) {
  const firestore = ensureDb();
  const document = await addDoc(collection(firestore, "posts"), {
    ...post,
    likes: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
  });

  return document.id;
}

export async function createComment(comment: Omit<Comment, "id" | "createdAt">) {
  const firestore = ensureDb();
  const document = await addDoc(collection(firestore, "comments"), {
    ...comment,
    createdAt: serverTimestamp(),
  });

  const postRef = doc(firestore, "posts", comment.parentId);
  const postSnapshot = await getDoc(postRef);

  if (postSnapshot.exists()) {
    await updateDoc(postRef, {
      commentCount: increment(1),
    });
  }

  return document.id;
}

export async function createReport(
  report: Omit<ScamReport, "id" | "status" | "createdAt">,
) {
  const firestore = ensureDb();
  const document = await addDoc(collection(firestore, "reports"), {
    ...report,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return document.id;
}

export async function fetchReports(userId: string) {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(
      collection(firestore, "reports"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(20),
    ),
  );

  return snapshot.docs.map<ScamReport>((document) => ({
    id: document.id,
    userId: document.data().userId,
    type: document.data().type,
    description: document.data().description,
    amountLost: document.data().amountLost,
    contactMethod: document.data().contactMethod,
    location: document.data().location,
    evidenceLink: document.data().evidenceLink,
    status: document.data().status ?? "pending",
    createdAt: toDateString(document.data().createdAt),
  }));
}

export async function createLegalCase(
  legalCase: Omit<LegalCase, "id" | "createdAt">,
) {
  const firestore = ensureDb();
  const document = await addDoc(collection(firestore, "legal_cases"), {
    ...legalCase,
    createdAt: serverTimestamp(),
  });

  return document.id;
}

export async function fetchLegalCases(userId: string) {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(
      collection(firestore, "legal_cases"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(20),
    ),
  );

  return snapshot.docs.map<LegalCase>((document) => ({
    id: document.id,
    userId: document.data().userId,
    problemType: document.data().problemType,
    description: document.data().description,
    generatedReport: document.data().generatedReport,
    status: document.data().status ?? "draft",
    createdAt: toDateString(document.data().createdAt),
  }));
}

export async function upsertChatThread(thread: {
  id: string;
  userId: string;
  title: string;
  language: string;
  messages: ChatMessage[];
}) {
  const firestore = ensureDb();
  const ref = doc(firestore, "chat_history", thread.id);
  const existing = await getDoc(ref);

  await setDoc(
    ref,
    {
      userId: thread.userId,
      title: thread.title,
      language: thread.language,
      lastMessage: thread.messages.at(-1)?.content ?? "",
      messages: thread.messages,
      createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function fetchChatThreads(userId: string) {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(
      collection(firestore, "chat_history"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc"),
      limit(6),
    ),
  );

  return snapshot.docs.map<ChatThread>((document) => ({
    id: document.id,
    userId: document.data().userId,
    title: document.data().title,
    language: document.data().language ?? "en",
    messages: document.data().messages ?? [],
    lastMessage: document.data().lastMessage ?? "",
    createdAt: toDateString(document.data().createdAt),
    updatedAt: toDateString(document.data().updatedAt),
  }));
}

export async function fetchUserProfile(userId: string) {
  const firestore = ensureDb();
  const snapshot = await getDoc(doc(firestore, "users", userId));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid: snapshot.id,
    name: data.name,
    email: data.email,
    role: data.role ?? "user",
    preferredLanguage: data.preferredLanguage ?? "en",
    createdAt: toDateString(data.createdAt),
  } satisfies UserProfile;
}

// --- Cyber Learning Hub Operations ---

export async function fetchDbCourses() {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(collection(firestore, "courses"), orderBy("order", "asc"))
  );
  return snapshot.docs.map<Course>((document) => {
    const data = document.data();
    return {
      id: document.id,
      title: data.title || { en: "", hi: "" },
      description: data.description || { en: "", hi: "" },
      track: data.track || "beginner",
      icon: data.icon || "security",
      order: data.order ?? 0,
    };
  });
}

export async function fetchDbModules(courseId: string) {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(
      collection(firestore, "modules"),
      where("courseId", "==", courseId),
      orderBy("order", "asc")
    )
  );
  return snapshot.docs.map<Module>((document) => {
    const data = document.data();
    return {
      id: document.id,
      courseId: data.courseId,
      title: data.title || { en: "", hi: "" },
      description: data.description || { en: "", hi: "" },
      order: data.order ?? 0,
    };
  });
}

export async function fetchDbLessons(courseId: string) {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(
      collection(firestore, "lessons"),
      where("courseId", "==", courseId),
      orderBy("order", "asc")
    )
  );
  return snapshot.docs.map<Lesson>((document) => {
    const data = document.data();
    return {
      id: document.id,
      courseId: data.courseId,
      moduleId: data.moduleId,
      title: data.title || { en: "", hi: "" },
      order: data.order ?? 0,
      contentType: data.contentType || "text",
      content: data.content || { en: "", hi: "" },
      videoUrl: data.videoUrl,
      imageUrl: data.imageUrl,
      teacher: data.teacher,
      duration: data.duration,
    };
  });
}

export async function fetchDbQuizzes() {
  const firestore = ensureDb();
  const snapshot = await getDocs(collection(firestore, "quizzes"));
  return snapshot.docs.map<Quiz>((document) => {
    const data = document.data();
    return {
      id: document.id,
      moduleId: data.moduleId,
      questions: data.questions || [],
    };
  });
}

export async function fetchDbUserProgress(userId: string, courseId: string) {
  const firestore = ensureDb();
  const docRef = doc(firestore, "user_progress", `${userId}_${courseId}`);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    userId: data.userId,
    courseId: data.courseId,
    completedLessons: data.completedLessons || [],
    quizScores: data.quizScores || {},
    progressPercent: data.progressPercent ?? 0,
    unlockedBadge: data.unlockedBadge ?? false,
    lastUpdated: toDateString(data.lastUpdated),
  } satisfies UserProgress;
}

export async function fetchAllDbUserProgress(userId: string) {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(
      collection(firestore, "user_progress"),
      where("userId", "==", userId)
    )
  );
  return snapshot.docs.map<UserProgress>((document) => {
    const data = document.data();
    return {
      userId: data.userId,
      courseId: data.courseId,
      completedLessons: data.completedLessons || [],
      quizScores: data.quizScores || {},
      progressPercent: data.progressPercent ?? 0,
      unlockedBadge: data.unlockedBadge ?? false,
      lastUpdated: toDateString(data.lastUpdated),
    };
  });
}

export async function saveDbUserProgress(progress: Omit<UserProgress, "lastUpdated">) {
  const firestore = ensureDb();
  const docRef = doc(firestore, "user_progress", `${progress.userId}_${progress.courseId}`);
  await setDoc(docRef, {
    ...progress,
    lastUpdated: serverTimestamp(),
  }, { merge: true });
}

export async function seedLearningHub() {
  const firestore = ensureDb();

  const courses: Course[] = [
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

  const modules: Module[] = [
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

  const lessons: Lesson[] = [
    {
      id: "l-pwd-power",
      courseId: "c-security-basics",
      moduleId: "m-passwords",
      title: { en: "Password Power & Managers", hi: "मजबूत पासवर्ड और पासवर्ड मैनेजर" },
      order: 1,
      contentType: "video",
      content: {
        en: `### Password Power Basics\nSimple passwords can be cracked by hackers in seconds. Long passphrases are easy to remember but mathematically hard to crack.\nAlways use audited password managers to generate strong, unique keys.`,
        hi: `### पासवर्ड सुरक्षा के नियम\nसाधारण पासवर्ड हैकर्स द्वारा सेकंडों में क्रैक किए जा सकते हैं। लंबे पासफ़्रेज़ याद रखने में आसान होते हैं लेकिन क्रैक करने में कठिन।\nहमेशा मजबूत, रैंडम और अनोखे पासवर्ड बनाने के लिए पासवर्ड मैनेजर का उपयोग करें।`
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
        en: `### Multi-Factor Authentication\nMFA adds a second security layer that blocks hackers even if they know your password.\nSMS OTPs can be intercepted via SIM swapping. Use Authenticator apps like Google Authenticator instead.`,
        hi: `### टू-फैक्टर ऑथेंटिकेशन (MFA)\nएमएफए एक अतिरिक्त परत जोड़ता है जो पासवर्ड पता होने पर भी हैकर्स को रोकता है।\nएसएमएस ओटीपी सिम स्वैपिंग हमलों के प्रति संवेदनशील हैं। इसके बजाय गूगल ऑथेंटिकेटर जैसे ऐप्स का उपयोग करें।`
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
        en: `### Audit App Permissions\nA simple keyboard or game app should never ask for SMS reading or contact permissions.\nSideloading apps from random links bypasses Play Protect security safeguards.`,
        hi: `### ऐप अनुमतियों की जांच\nएक साधारण कीबोर्ड या गेम ऐप को कभी भी एसएमएस पढ़ने या कॉन्टैक्ट देखने की अनुमति नहीं चाहिए।\nअज्ञान लिंक से एपीके (APK) लोड करना सभी सुरक्षा जांचों को बायपास कर देता है।`
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
        en: `### UPI PIN Safety Rules\nUPI PIN is required ONLY to send money. You NEVER enter a PIN to receive money.\nScanning a QR code means you are debiting your account. Decline stranger QR codes.`,
        hi: `### UPI और QR कोड सुरक्षा\nयूपीआई पिन की आवश्यकता केवल पैसे भेजने/भुगतान करने के लिए होती है। पैसे प्राप्त करने के लिए कभी भी पिन न डालें।\nक्यूआर कोड स्कैन करने का मतलब बैंक से पैसे निकालना है। अजनबियों के क्यूआर कोड स्वीकार न करें।`
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
        en: `### KYC SMS Fraud\nBanks never request verification over standard calls or ask you to install AnyDesk or TeamViewer.\nAlways call the helpline number printed on your physical debit card.`,
        hi: `### फर्जी केवाईसी अलर्ट\nबैंक कभी भी सामान्य मोबाइल कॉल पर केवाईसी या AnyDesk/TeamViewer जैसे ऐप इंस्टॉल करने का अनुरोध नहीं करते।\nहमेशा अपने डेबिट/क्रेडिट कार्ड के पीछे छपे नंबर पर कॉल करें।`
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
        en: `### Social Engineering Hijacks\nScammers call you pretending to be friends or family, asking for a WhatsApp 6-digit code.\nNever share verification codes. Enable 2-Step Verification PIN lock inside WhatsApp settings.`,
        hi: `### व्हाट्सएप सुरक्षा पिन\nधोखेबाज कॉल करके आपके व्हाट्सएप का 6-अक्षरों का कोड मांग सकते हैं।\nप्रमाणीकरण कोड किसी के साथ साझा न करें। व्हाट्सएप में टू-स्टेप वेरिफिकेशन सेटिंग्स चालू रखें।`
      },
      teacher: { en: "Prof. Neha Sharma", hi: "प्रो. नेहा शर्मा" },
      duration: 90
    },
    {
      id: "l-deepfakes",
      courseId: "c-privacy-safety",
      moduleId: "m-identity-safety",
      title: { en: "AI Voice Cloning & Deepfakes", hi: "एॉई वॉयस क्लोनिंग और डीपफेक" },
      order: 2,
      contentType: "video",
      content: {
        en: `### AI Voice Cloning Scams\nScammers record a 3-second sample of your family member's voice and use AI to request urgent funds.\nVerify by calling them back on their original number or asking a secret family question.`,
        hi: `### एआई वॉयस क्लोनिंग घोटाले\nहैकर्स केवल 3-सेकंड की वॉयस रिकॉर्डिंग से आपके रिश्तेदार की आवाज क्लोन कर सकते हैं।\nसत्यापन के लिए उन्हें उनके पुराने नंबर पर कॉल करें या कोई पारिवारिक गुप्त प्रश्न पूछें।`
      },
      videoUrl: "https://www.youtube.com/embed/OP307T12bX0",
      teacher: { en: "Cdr. R. K. Singh (Retd. Cyber Cell)", hi: "कमोडोर आर. के. सिंह (सेवानिवृत्त साइबर सेल)" },
      duration: 90
    }
  ];

  const quizzes: Quiz[] = [
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

  for (const course of courses) {
    await setDoc(doc(firestore, "courses", course.id), course);
  }
  for (const mod of modules) {
    await setDoc(doc(firestore, "modules", mod.id), mod);
  }
  for (const lesson of lessons) {
    await setDoc(doc(firestore, "lessons", lesson.id), lesson);
  }
  for (const quiz of quizzes) {
    await setDoc(doc(firestore, "quizzes", quiz.id), quiz);
  }
}

export async function createSupportQuery(queryData: {
  name: string;
  email: string;
  category: string;
  message: string;
}) {
  const firestore = ensureDb();
  const document = await addDoc(collection(firestore, "support_queries"), {
    ...queryData,
    createdAt: serverTimestamp(),
  });
  return document.id;
}

export async function fetchSupportQueries() {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(collection(firestore, "support_queries"), orderBy("createdAt", "desc"), limit(100))
  );
  return snapshot.docs.map((document) => ({
    id: document.id,
    name: document.data().name || "",
    email: document.data().email || "",
    category: document.data().category || "",
    message: document.data().message || "",
    createdAt: toDateString(document.data().createdAt),
  }));
}

export async function fetchAllReports() {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(collection(firestore, "reports"), orderBy("createdAt", "desc"), limit(100))
  );
  return snapshot.docs.map<ScamReport>((document) => ({
    id: document.id,
    userId: document.data().userId,
    type: document.data().type,
    description: document.data().description,
    amountLost: document.data().amountLost,
    contactMethod: document.data().contactMethod,
    location: document.data().location,
    evidenceLink: document.data().evidenceLink,
    status: document.data().status ?? "pending",
    createdAt: toDateString(document.data().createdAt),
  }));
}

export async function fetchAllLegalCases() {
  const firestore = ensureDb();
  const snapshot = await getDocs(
    query(collection(firestore, "legal_cases"), orderBy("createdAt", "desc"), limit(100))
  );
  return snapshot.docs.map<LegalCase>((document) => ({
    id: document.id,
    userId: document.data().userId,
    problemType: document.data().problemType,
    description: document.data().description,
    generatedReport: document.data().generatedReport,
    status: document.data().status ?? "draft",
    createdAt: toDateString(document.data().createdAt),
  }));
}
