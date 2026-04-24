import type { Language, LocalizedString } from "@/types";

export const navCopy = {
  home: { en: "Home", hi: "होम" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  learn: { en: "Learn", hi: "सीखें" },
  assistant: { en: "AI Assistant", hi: "एआई सहायक" },
  legal: { en: "Legal AI", hi: "लीगल एआई" },
  community: { en: "Community", hi: "कम्युनिटी" },
  blog: { en: "Blog", hi: "ब्लॉग" },
  news: { en: "News", hi: "समाचार" },
  report: { en: "Report Scam", hi: "स्कैम रिपोर्ट" },
} satisfies Record<string, LocalizedString>;

export const sharedCopy = {
  brandName: { en: "CyberSaathi", hi: "साइबरसाथी" },
  brandTagline: {
    en: "AI-powered cybercrime awareness and rapid response for India.",
    hi: "भारत के लिए एआई आधारित साइबर जागरूकता और त्वरित सहायता मंच।",
  },
  login: { en: "Login", hi: "लॉगिन" },
  register: { en: "Register", hi: "रजिस्टर" },
  logout: { en: "Logout", hi: "लॉगआउट" },
  english: { en: "English", hi: "अंग्रेजी" },
  hindi: { en: "Hindi", hi: "हिंदी" },
  guestHint: {
    en: "Guest mode works for guidance. Sign in to save your activity.",
    hi: "गेस्ट मोड में मार्गदर्शन मिलता है। गतिविधि सेव करने के लिए साइन इन करें।",
  },
  firebaseMissing: {
    en: "Add Firebase environment keys to enable persistent accounts and data sync.",
    hi: "स्थायी अकाउंट और डेटा सिंक के लिए Firebase की environment keys जोड़ें।",
  },
  aiMissing: {
    en: "Connect an OpenAI or Gemini API key for live AI responses.",
    hi: "लाइव एआई उत्तरों के लिए OpenAI या Gemini API key जोड़ें।",
  },
} satisfies Record<string, LocalizedString>;

export function translate(value: LocalizedString, language: Language) {
  return value[language];
}
