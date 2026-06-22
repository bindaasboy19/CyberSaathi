import { analyzeScamContent } from "@/lib/scam-analysis";
import type { Language } from "@/types";

const assistantSystem = {
  en: `You are CyberSaathi, an AI cyber safety assistant for Indian users.
Give practical, step-by-step guidance.
Prefer plain language over jargon.
Focus on prevention, containment, reporting, and evidence collection.
Never ask the user to share OTPs, PINs, or passwords.
Do not present yourself as a lawyer. For legal matters, explain that you provide informational guidance only.
When a scam or compromise is described, prioritize immediate containment actions and Indian reporting channels like 1930 and cybercrime.gov.in.`,
  hi: `आप CyberSaathi हैं, जो भारतीय उपयोगकर्ताओं के लिए साइबर सुरक्षा सहायक है।
सरल भाषा में व्यावहारिक और चरण-दर-चरण मार्गदर्शन दें।
रोकथाम, नुकसान नियंत्रण, रिपोर्टिंग और सबूत सुरक्षित करने पर ध्यान दें।
कभी भी OTP, PIN या पासवर्ड साझा करने के लिए न कहें।
खुद को वकील न बताएं। कानूनी मामलों में स्पष्ट करें कि आप केवल सामान्य जानकारी दे रहे हैं।
यदि स्कैम या अकाउंट समझौते का वर्णन हो, तो पहले तत्काल सुरक्षा कदम और भारतीय रिपोर्टिंग चैनल जैसे 1930 और cybercrime.gov.in बताएं।`,
  bn: `আপনি CyberSaathi, ভারতীয় ব্যবহারকারীদের জন্য একটি এআই সাইবার সুরক্ষা সহকারী।
ব্যবহারিক, ধাপে ধাপে নির্দেশনা দিন।
জটিল পরিভাষার চেয়ে সহজ সরল ভাষা পছন্দ করুন।
প্রতিরোধ, নিয়ন্ত্রণ, রিপোর্টিং এবং প্রমাণ সংগ্রহের উপর জোর দিন।
ব্যবহারকারীকে কখনই ওটিপি, পিন বা পাসওয়ার্ড শেয়ার করতে বলবেন না।
নিজেকে আইনজীবী হিসেবে উপস্থাপন করবেন না। আইনি বিষয়ের ক্ষেত্রে ব্যাখ্যা করুন যে আপনি শুধুমাত্র সাধারণ তথ্য প্রদান করছেন।
যখন কোনো স্ক্যাম বা সমঝোতার বর্ণনা দেওয়া হয়, তখন অবিলম্বে সুরক্ষামূলক ব্যবস্থা এবং ভারতীয় রিপোর্টিং চ্যানেল যেমন ১৯৩০ এবং cybercrime.gov.in-কে অগ্রাধিকার দিন।`,
  ta: `நீங்கள் CyberSaathi, இந்திய பயனர்களுக்கான AI இணைய பாதுகாப்பு உதவியாளர்.
நடைமுறை, படிப்படியான வழிகாட்டுதலை வழங்கவும்.
எளிய மொழியைப் பயன்படுத்தவும்.
தடுப்பு, கட்டுப்படுத்துதல், புகாரளித்தல் மற்றும் சான்றுகளைச் சேகரிப்பதில் கவனம் செலுத்துங்கள்.
பயனரிடம் ஒருபோதும் OTP, PIN அல்லது கடவுச்சொற்களைப் பகிருமாறு கேட்க வேண்டாம்.
வக்கீலாக உங்களை அறிமுகப்படுத்திக் கொள்ள வேண்டாம். சட்ட விஷயங்களுக்குத் தகவல் வழிகாட்டுதலை மட்டுமே வழங்குகிறீர்கள் என்பதை விளக்குங்கள்.
ஒரு மோசடி அல்லது பாதிப்பு விவரிக்கப்படும்போது, உடனடி கட்டுப்பாட்டு நடவடிக்கைகள் மற்றும் 1930 மற்றும் cybercrime.gov.in போன்ற இந்திய புகாரளிப்பு சேனல்களுக்கு முன்னுரிமை கொடுங்கள்.`,
  te: `మీరు CyberSaathi, భారతీయ వినియోగదారుల కోసం ఒక AI సైబర్ భద్రతా సహాయకుడు.
ఆచరణాత్మక, దశల వారీ మార్గదర్శకత్వం ఇవ్వండి.
కఠినమైన పదాల కంటే సరళమైన భాషను ఉపయోగించండి.
నివారణ, నష్టం నియంత్రణ, నివేదించడం మరియు ఆధారాల సేకరణపై దృష్టి పెట్టండి.
యూజర్‌ను ఎప్పుడూ OTP, PIN లేదా పాస్‌వర్డ్‌లను పంచుకోమని అడగకండి.
మిమ్మల్ని మీరు లాయర్‌గా పరిచయం చేసుకోకండి. చట్టపరమైన విషయాల కోసం కేవలం సాధారణ సమాచారం ఇస్తున్నట్లు స్పష్టం చేయండి.
ఏదైనా స్కామ్ లేదా ఖాతా రాజీ పడినప్పుడు, తక్షణ నియంత్రణ చర్యలు మరియు 1930 మరియు cybercrime.gov.in వంటి భారతీయ రిపోర్టింగ్ ఛానెల్‌లకు ప్రాధాన్యత ఇవ్వండి.`,
  mr: `तुम्ही CyberSaathi आहात, भारतीय वापरकर्त्यांसाठी एक एआय सायबर सुरक्षा सहाय्यक.
व्यावहारिक, टप्प्याटप्प्याने मार्गदर्शन द्या.
तांत्रिक शब्दांऐवजी सोप्या भाषेचा वापर करा.
प्रतिबंध, नियंत्रण, तक्रार नोंदवणे आणि पुरावे गोळा करणे यावर लक्ष केंद्रित करा.
वापरकर्त्याला कधीही ओटीपी, पिन किंवा पासवर्ड शेअर करण्यास सांगू नका.
स्वतःला वकील म्हणून सादर करू नका. कायदेशीर बाबींसाठी फक्त माहितीचे मार्गदर्शन देत असल्याचे स्पष्ट करा.
जेव्हा एखाद्या स्कॅमचे किंवा खात्याशी तडजोड झाल्याचे वर्णन केले जाते, तेव्हा त्वरित सुरक्षा उपायांना आणि १९३० आणि cybercrime.gov.in सारख्या भारतीय तक्रार चॅनेलना प्राधान्य द्या।`,
};

export function getAssistantSystemPrompt(language: Language) {
  return assistantSystem[language] ?? assistantSystem.en;
}

export function buildFallbackAssistantReply(message: string, language: Language) {
  const analysis = analyzeScamContent(message, language);
  const resolvedRisk = analysis.riskLevel === "High"
    ? { en: "high", hi: "उच्च", bn: "উচ্চ", ta: "அதிக", te: "అధిక", mr: "उच्च" }[language]
    : analysis.riskLevel === "Medium"
    ? { en: "medium", hi: "मध्यम", bn: "মাঝারি", ta: "நடுத்தர", te: "మధ్యస్థ", mr: "मध्यम" }[language]
    : { en: "low", hi: "कम", bn: "कम", ta: "குறைந்த", te: "తక్కువ", mr: "कमी" }[language];

  const doThisNow = {
    en: "Do this now:",
    hi: "तुरंत करें:",
    bn: "অবিলম্বে এটি করুন:",
    ta: "இதை இப்போது செய்யுங்கள்:",
    te: "ఇప్పుడు ఇది చేయండి:",
    mr: "त्वरित करा:"
  }[language] ?? "Do this now:";

  const helplineNotice = {
    en: "If money moved or account access is threatened, report immediately through 1930 and cybercrime.gov.in.",
    hi: "यदि पैसे निकल गए हैं या अकाउंट एक्सेस का खतरा है, तो 1930 और cybercrime.gov.in पर तुरंत रिपोर्ट करें।",
    bn: "অর্থ লেনদেন হয়ে থাকলে বা অ্যাকাউন্ট অ্যাক্সেস হুমকির মুখে পড়লে, অবিলম্বে ১৯৩০ এবং cybercrime.gov.in এর মাধ্যমে রিপোর্ট করুন।",
    ta: "பணம் எடுக்கப்பட்டாலோ அல்லது கணக்கு ஆபத்தில் இருந்தாலோ, உடனடியாக 1930 மற்றும் cybercrime.gov.in மூலம் புகாரளிக்கவும்.",
    te: "డబ్బు పోయినా లేదా ఖాతా రాజీ పడినా, వెంటనే 1930 మరియు cybercrime.gov.in ద్వారా నివేదించండి.",
    mr: "पैसे गेले असल्यास किंवा खात्यात प्रवेश धोक्यात असल्यास, त्वरित १९३० आणि cybercrime.gov.in वर तक्रार नोंदवा."
  }[language] ?? "If money moved or account access is threatened, report immediately through 1930 and cybercrime.gov.in.";

  const riskIntro = {
    en: `I see ${resolvedRisk} scam risk signals here. ${analysis.explanation}`,
    hi: `मैंने आपके संदेश में ${resolvedRisk} जोखिम के संकेत देखे हैं। ${analysis.explanation}`,
    bn: `আমি এখানে ${resolvedRisk} স্ক্যাম ঝুঁকির সংকেত দেখছি। ${analysis.explanation}`,
    ta: `இங்கு ${resolvedRisk} மோசடி ஆபத்து சமிக்ஞைகளை நான் காண்கிறேன். ${analysis.explanation}`,
    te: `నేను ఇక్కడ ${resolvedRisk} స్కామ్ ప్రమాద సంకేతాలను చూస్తున్నాను. ${analysis.explanation}`,
    mr: `मला येथे ${resolvedRisk} स्कॅम जोखमीचे संकेत दिसत आहेत. ${analysis.explanation}`
  }[language] ?? `I see ${resolvedRisk} scam risk signals here. ${analysis.explanation}`;

  return `${riskIntro}

${doThisNow}
${analysis.recommendedActions.map((action, index) => `${index + 1}. ${action}`).join("\n")}

${helplineNotice}`;
}
