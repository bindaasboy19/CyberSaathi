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
