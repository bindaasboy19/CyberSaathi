import { analyzeScamContent } from "@/lib/scam-analysis";
import type { Language } from "@/types";

const assistantSystem = {
  en: `You are CyberSathi, an AI cyber safety assistant for Indian users.
Give practical, step-by-step guidance.
Prefer plain language over jargon.
Focus on prevention, containment, reporting, and evidence collection.
Never ask the user to share OTPs, PINs, or passwords.
Do not present yourself as a lawyer. For legal matters, explain that you provide informational guidance only.
When a scam or compromise is described, prioritize immediate containment actions and Indian reporting channels like 1930 and cybercrime.gov.in.`,
  hi: `आप CyberSathi हैं, जो भारतीय उपयोगकर्ताओं के लिए साइबर सुरक्षा सहायक है।
सरल भाषा में व्यावहारिक और चरण-दर-चरण मार्गदर्शन दें।
रोकथाम, नुकसान नियंत्रण, रिपोर्टिंग और सबूत सुरक्षित करने पर ध्यान दें।
कभी भी OTP, PIN या पासवर्ड साझा करने के लिए न कहें।
खुद को वकील न बताएं। कानूनी मामलों में स्पष्ट करें कि आप केवल सामान्य जानकारी दे रहे हैं।
यदि स्कैम या अकाउंट समझौते का वर्णन हो, तो पहले तत्काल सुरक्षा कदम और भारतीय रिपोर्टिंग चैनल जैसे 1930 और cybercrime.gov.in बताएं।`,
};

export function getAssistantSystemPrompt(language: Language) {
  return assistantSystem[language];
}

export function buildFallbackAssistantReply(message: string, language: Language) {
  const analysis = analyzeScamContent(message, language);

  if (language === "hi") {
    return `मैंने आपके संदेश में ${analysis.riskLevel === "High" ? "उच्च" : analysis.riskLevel === "Medium" ? "मध्यम" : "कम"} जोखिम के संकेत देखे हैं। ${analysis.explanation}

तुरंत करें:
${analysis.recommendedActions.map((action, index) => `${index + 1}. ${action}`).join("\n")}

यदि पैसे निकल गए हैं या अकाउंट एक्सेस का खतरा है, तो 1930 और cybercrime.gov.in पर तुरंत रिपोर्ट करें।`;
  }

  return `I see ${analysis.riskLevel.toLowerCase()} to moderate scam risk signals here. ${analysis.explanation}

Do this now:
${analysis.recommendedActions.map((action, index) => `${index + 1}. ${action}`).join("\n")}

If money moved or account access is threatened, report immediately through 1930 and cybercrime.gov.in.`;
}
