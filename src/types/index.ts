export type Language = "en" | "hi";
export type UserRole = "user" | "expert" | "admin";
export type MessageRole = "user" | "assistant";
export type PostType = "blog" | "case";
export type ReportStatus = "pending" | "under-review" | "resolved";
export type RiskLevel = "Low" | "Medium" | "High";

export type LocalizedString = {
  en: string;
  hi: string;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage: Language;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  userId: string;
  title: string;
  language: Language;
  messages: ChatMessage[];
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
};

export type Question = {
  id: string;
  title: string;
  description: string;
  category: string;
  userId: string;
  authorName: string;
  votes: number;
  answerCount: number;
  createdAt: string;
};

export type Answer = {
  id: string;
  questionId: string;
  userId: string;
  authorName: string;
  content: string;
  votes: number;
  isExpert: boolean;
  createdAt: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  type: PostType;
  likes: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
};

export type Comment = {
  id: string;
  parentId: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: string;
};

export type ScamReport = {
  id: string;
  userId: string;
  type: string;
  description: string;
  amountLost?: number;
  contactMethod: string;
  location: string;
  evidenceLink?: string;
  status: ReportStatus;
  createdAt: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
};

export type AwarenessCard = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  signals: LocalizedString[];
  prevention: LocalizedString[];
  emergency: LocalizedString[];
};

export type LawGuide = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  sections: LocalizedString[];
  nextSteps: LocalizedString[];
};

export type ScenarioGuide = {
  id: string;
  title: LocalizedString;
  scenario: LocalizedString;
  steps: LocalizedString[];
};

export type SafetyQuestion = {
  id: string;
  question: LocalizedString;
  options: {
    label: LocalizedString;
    score: number;
    insight: LocalizedString;
  }[];
};

export type ScamAnalysis = {
  probability: number;
  riskLevel: RiskLevel;
  matchedSignals: string[];
  explanation: string;
  recommendedActions: string[];
};
