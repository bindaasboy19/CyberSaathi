import type { Language, LocalizedString } from "@/types";

export const navCopy = {
  home: { en: "Home", hi: "होम", bn: "হোম", ta: "முகப்பு", te: "హోమ్", mr: "होम" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", bn: "ড্যাশবোর্ড", ta: "டாஷ்போர்டு", te: "డాష్‌బోర్డ్", mr: "डॅशबोर्ड" },
  learn: { en: "Learn", hi: "सीखें", bn: "শিখুন", ta: "கற்க", te: "నేర్చుకోండి", mr: "शिका" },
  assistant: { en: "AI Assistant", hi: "एआई सहायक", bn: "এআই সহকারী", ta: "AI உதவி", te: "AI అసిస్టెంట్", mr: "एआय सहाय्यक" },
  legal: { en: "Legal AI", hi: "लीगल एआई", bn: "লিগ্যাল এআই", ta: "சட்ட AI", te: "లీగల్ AI", mr: "लीगल एआय" },
  community: { en: "Community", hi: "कम्युनिटी", bn: "কমিউনিটি", ta: "சமூகம்", te: "కమ్యూనిటీ", mr: "कम्युनिटी" },
  blog: { en: "Blog", hi: "ब्लॉग", bn: "ব্লগ", ta: "வலைப்பதிவு", te: "బ్లాగ్", mr: "ब्लॉग" },
  news: { en: "News", hi: "समाचार", bn: "খবর", ta: "செய்திகள்", te: "వార్తలు", mr: "बातम्या" },
  report: { en: "Report Scam", hi: "स्कैम रिपोर्ट", bn: "স্ক্যাম রিপোর্ট", ta: "மோசடி புகாரளிக்கவும்", te: "స్కామ్ రిపోర్ట్", mr: "स्कॅम रिपोर्ट" },
  portals: { en: "Govt Portals", hi: "सरकारी पोर्टल", bn: "সরকারী পোর্টাল", ta: "அரசு போர்ட்டல்கள்", te: "ప్రభుత్వ పోర్టల్స్", mr: "सरकारी पोर्टल" },
  help: { en: "Help & Support", hi: "सहायता और संपर्क", bn: "সাহায্য ও সহায়তা", ta: "உதவி & ஆதரவு", te: "సహాయం & మద్దతు", mr: "मदत आणि संपर्क" },
} satisfies Record<string, LocalizedString>;

export const sharedCopy = {
  brandName: { en: "CyberSaathi", hi: "साइबरसाथी", bn: "সাইবারসাথী", ta: "சைபர்சாதி", te: "సైబర్ సాథి", mr: "सायबरसाथी" },
  brandTagline: {
    en: "AI-powered cybercrime awareness and rapid response for India.",
    hi: "भारत के लिए एआई आधारित साइबर जागरूकता और त्वरित सहायता मंच।",
    bn: "ভারতের জন্য এআই চালিত সাইবার ক্রাইম সচেতনতা এবং দ্রুত প্রতিক্রিয়া প্ল্যাটফর্ম।",
    ta: "இந்தியாவிற்கான AI-ஆற்றல் கொண்ட இணைய குற்ற விழிப்புணர்வு மற்றும் விரைவான பதிலளிப்பு தளம்.",
    te: "భారతదేశం కోసం AI ఆధారిత సైబర్ క్రైమ్ అవగాహన మరియు వేగవంతమైన ప్రతిస్పందన వేదిక.",
    mr: "भारतासाठी एआय आधारित सायबर गुन्हेगारी जागरूकता आणि त्वरित प्रतिसाद मंच."
  },
  login: { en: "Login", hi: "लॉगिन", bn: "লগইন", ta: "உள்நுழை", te: "లాగిన్", mr: "लॉगिन" },
  register: { en: "Register", hi: "रजिस्टर", bn: "নিবন্ধন", ta: "பதிவு செய்", te: "రిజిస్టర్", mr: "रजिस्टर" },
  logout: { en: "Logout", hi: "लॉगआउट", bn: "লগআউট", ta: "வெளியேறு", te: "లాగౌట్", mr: "लॉगआउट" },
  english: { en: "English", hi: "अंग्रेजी", bn: "ইংরেজি", ta: "ஆங்கிலம்", te: "ఆంగ్లము", mr: "इंग्रजी" },
  hindi: { en: "Hindi", hi: "हिंदी", bn: "হিন্দি", ta: "ஹிந்தி", te: "హిందీ", mr: "हिंदी" },
  guestHint: {
    en: "Guest mode works for guidance. Sign in to save your activity.",
    hi: "गेस्ट मोड में मार्गदर्शन मिलता है। गतिविधि सेव करने के लिए साइन इन करें।",
    bn: "গেস্ট মোড নির্দেশনার জন্য কাজ করে। আপনার কার্যকলাপ সংরক্ষণ করতে সাইন ইন করুন।",
    ta: "விருந்தினர் பயன்முறை வழிகாட்டுதலுக்கு மட்டுமே. உங்கள் செயல்பாட்டைச் சேமிக்க உள்நுழையவும்.",
    te: "గెస్ట్ మోడ్ మార్గదర్శకత్వం కోసం పని చేస్తుంది. మీ కార్యాచరణను సేవ్ చేయడానికి సైన్ ఇన్ చేయండి.",
    mr: "गेस्ट मोड मार्गदर्शनासाठी काम करतो. तुमची क्रियाकलाप जतन करण्यासाठी साइन इन करा."
  },
  firebaseMissing: {
    en: "Add Firebase environment keys to enable persistent accounts and data sync.",
    hi: "स्थायी अकाउंट और डेटा सिंक के लिए Firebase की environment keys जोड़ें।",
    bn: "স্থায়ী অ্যাকাউন্ট এবং ডেটা সিঙ্কের জন্য Firebase এনভায়রনমেন্ট কী যোগ করুন।",
    ta: "நிலையான கணக்குகள் மற்றும் தரவு ஒத்திசைவை இயக்க Firebase சூழல் விசைகளைச் சேர்க்கவும்.",
    te: "శాశ్వత ఖాతాలు మరియు డేటా సమకాలీకరణను ప్రారంభించడానికి Firebase ఎన్విరాన్మెంట్ కీలను జోడించండి.",
    mr: "कायमस्वरूपी खाती आणि डेटा समक्रमण सक्षम करण्यासाठी Firebase पर्यावरण की जोडा."
  },
  aiMissing: {
    en: "Connect an OpenAI or Gemini API key for live AI responses.",
    hi: "लाइव एआई उत्तरों के लिए OpenAI या Gemini API key जोड़ें।",
    bn: "লাইভ এআই উত্তরের জন্য একটি OpenAI বা Gemini API কী সংযুক্ত করুন।",
    ta: "நேரடி AI பதில்களுக்கு OpenAI அல்லது Gemini API விசையை இணைக்கவும்.",
    te: "లైవ్ AI ప్రతిస్పందనల కోసం OpenAI లేదా Gemini API కీని కనెక్ట్ చేయండి.",
    mr: "थेट एआय उत्तरांसाठी OpenAI किंवा Gemini API की कनेक्ट करा."
  },
} satisfies Record<string, LocalizedString>;

export function translate(value: LocalizedString, language: Language) {
  return value[language] ?? value.en;
}
