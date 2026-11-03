import type { Language, RiskLevel, ScamAnalysis } from "@/types";

type Signal = {
  pattern: RegExp;
  weight: number;
  message: {
    en: string;
    hi: string;
  };
};

const signals: Signal[] = [
  {
    pattern: /\b(otp|one[- ]time password|pin|cvv)\b/i,
    weight: 20,
    message: {
      en: "Requests for OTP, PIN, or CVV are classic fraud indicators.",
      hi: "OTP, PIN या CVV की मांग धोखाधड़ी का सामान्य संकेत है।",
    },
  },
  {
    pattern: /\b(kyc|freeze|blocked|suspend|deactivate|urgent|immediately)\b/i,
    weight: 12,
    message: {
      en: "Artificial urgency is being used to reduce careful thinking.",
      hi: "घबराहट पैदा करने के लिए कृत्रिम तात्कालिकता का उपयोग हो रहा है।",
    },
  },
  {
    pattern: /\b(anydesk|teamviewer|remote|screen share|quicksupport)\b/i,
    weight: 18,
    message: {
      en: "Remote-access installation requests are high-risk in scam contexts.",
      hi: "स्कैम के संदर्भ में remote-access इंस्टॉल करने की मांग बहुत जोखिम भरी है।",
    },
  },
  {
    pattern: /\b(cashback|reward|gift|lottery|refund|parcel|courier)\b/i,
    weight: 10,
    message: {
      en: "Unexpected rewards, refunds, or parcel excuses often mask payment fraud.",
      hi: "अचानक इनाम, रिफंड या पार्सल बहाने अक्सर भुगतान धोखाधड़ी छिपाते हैं।",
    },
  },
  {
    pattern: /\b(verify account|collect request|upi pin|bank officer|customer care)\b/i,
    weight: 14,
    message: {
      en: "The content mimics a sensitive banking or payment workflow.",
      hi: "संदेश बैंकिंग या भुगतान से जुड़े संवेदनशील flow की नकल कर रहा है।",
    },
  },
  {
    pattern: /(bit\.ly|tinyurl|shorturl|t\.co|grabify|https?:\/\/\d{1,3}\.)/i,
    weight: 14,
    message: {
      en: "Shortened or unusual links increase phishing risk.",
      hi: "Shortened या असामान्य लिंक फिशिंग का जोखिम बढ़ाते हैं।",
    },
  },
];

function riskLevel(score: number): RiskLevel {
  if (score >= 70) {
    return "High";
  }

  if (score >= 35) {
    return "Medium";
  }

  return "Low";
}

function recommendedActions(level: RiskLevel, language: Language) {
  const languageActions = {
    en: {
      base: [
        "Do not click links, call back, or approve requests from the message.",
        "Verify the issue inside the official app or website you already trust.",
        "Capture the message, sender, and any linked account details as evidence.",
      ],
      medium: [
        "Change the affected password and sign out of active sessions if you interacted with it.",
        "Alert your bank, wallet, or platform support through official channels.",
      ],
      high: [
        "Call 1930 immediately if money or account access is at risk.",
        "Freeze payment instruments and file a complaint on cybercrime.gov.in.",
      ],
    },
    hi: {
      base: [
        "संदेश के लिंक न खोलें, कॉल बैक न करें, और किसी request को approve न करें।",
        "समस्या को केवल उस आधिकारिक ऐप या वेबसाइट में सत्यापित करें जिस पर आप पहले से भरोसा करते हैं।",
        "संदेश, प्रेषक और जुड़े अकाउंट विवरण को सबूत के रूप में सुरक्षित रखें।",
      ],
      medium: [
        "यदि आपने इससे बातचीत की है, तो पासवर्ड बदलें और सक्रिय सत्र समाप्त करें।",
        "आधिकारिक चैनल से अपने बैंक, वॉलेट या प्लेटफॉर्म सपोर्ट को सूचित करें।",
      ],
      high: [
        "यदि पैसे या अकाउंट एक्सेस का जोखिम है तो तुरंत 1930 पर कॉल करें।",
        "पेमेंट साधनों को फ्रीज करवाएं और cybercrime.gov.in पर शिकायत दर्ज करें।",
      ],
    },
    bn: {
      base: [
        "লিংকে क्लिक করবেন না, কল ব্যাক করবেন না বা কোনো অনুরোধ অনুমোদন করবেন না।",
        "আপনি ইতিমধ্যেই বিশ্বাস করেন এমন অফিসিয়াল অ্যাপ বা ওয়েবসাইটের ভেতরে সমস্যাটি যাচাই করুন।",
        "মেসেজ, প্রেরক এবং যেকোনো লিঙ্ক করা অ্যাকাউন্টের বিবরণ প্রমাণ হিসেবে সংরক্ষণ করুন।",
      ],
      medium: [
        "আপনি यदि এটিতে ইন্টারঅ্যাক্ট করে থাকেন তবে প্রভাবিত পাসওয়ার্ড পরিবর্তন করুন आणि সেশনগুলি সাইন আউট করুন।",
        "অফিসিয়াল চ্যানেলের মাধ্যমে আপনার ব্যাঙ্ক, ওয়ালেট বা প্ল্যাটফর্ম সমর্থনকে সতর্ক করুন।",
      ],
      high: [
        "অর্থ বা অ্যাকাউন্ট অ্যাক্সেস ঝুঁকিতে থাকলে অবিলম্বে 1930 নম্বरे কল করুন।",
        "পেমেন্ট মাধ্যমগুলি ব্লক করুন এবং cybercrime.gov.in-এ একটি অভিযোগ দায়ের করুন।",
      ],
    },
    ta: {
      base: [
        "இணைப்புகளைக் கிளிக் செய்ய வேண்டாம், திரும்ப அழைக்க வேண்டாம் அல்லது கோரிக்கைகளை அங்கீகரிக்க வேண்டாம்.",
        "நீங்கள் ஏற்கனவே நம்பும் அதிகாரப்பூர்வ பயன்பாடு அல்லது இணையதளத்தில் சிக்கலைச் சரிபார்க்கவும்.",
        "செய்தி, அனுப்புநர் மற்றும் இணைக்கப்பட்ட கணக்கு விவரங்களை ஆதாரமாகச் சேமிக்கவும்.",
      ],
      medium: [
        "கடவுச்சொல்லை மாற்றி, பிற சாதனங்களிலிருந்து வெளியேறவும்.",
        "அதிகாரப்பூர்வ சேனல்கள் மூலம் உங்கள் வங்கி அல்லது வாலட் ஆதரவைத் தொடர்பு கொள்ளவும்.",
      ],
      high: [
        "பணம் அல்லது கணக்கு ஆபத்தில் இருந்தால் உடனடியாக 1930 ஐ அழைக்கவும்.",
        "கணக்கை முடக்கி, cybercrime.gov.in இல் புகார் செய்யவும்.",
      ],
    },
    te: {
      base: [
        "లింక్‌లను క్లిక్ చేయవద్దు, కాల్ బ్యాక్ చేయవద్దు లేదా అభ్యర్థనలను ఆమోదించవద్దు.",
        "అధికారిక యాప్ లేదా వెబ్‌సైట్‌లో సమస్యను ధృవీకరించండి.",
        "మెసేజ్, పంపినవారి వివరాలు మరియు లింక్ చేయబడిన ఖాతా వివరాలను ఆధారాలుగా సేవ్ చేయండి.",
      ],
      medium: [
        "పాస్‌వర్డ్‌ను మార్చండి మరియు ఇతర పరికరాల నుండి లాగౌట్ చేయండి.",
        "అధికారిక ఛానెల్‌ల ద్వారా మీ బ్యాంక్ లేదా వాలెట్ సపోర్ట్‌ను సంसंప్రదించండి.",
      ],
      high: [
        "డబ్బు లేదా ఖాతా ప్రమాదంలో ఉంటే వెంటనే 1930 కి కాల్ చేయండి.",
        "ఖాతాను బ్లాక్ చేయండి మరియు cybercrime.gov.in లో ఫిర్యాदु చేయండి.",
      ],
    },
    mr: {
      base: [
        "लिंक्सवर क्लिक करू नका, कॉल बॅक करू नका किंवा विनंत्या मंजूर करू नका.",
        "अधिकृत ॲप किंवा वेबसाइटवर समस्येची पडताळणी करा.",
        "पुरावा म्हणून संदेश, पाठवणारा आणि लिंक्ड खाते तपशील जतन करा.",
      ],
      medium: [
        "पासवर्ड बदला आणि इतर उपकरणांमधून लॉगआउट करा.",
        "अधिकृत चॅनेलद्वारे आपल्या बँक किंवा वॉलेट सपोर्टला कळवा.",
      ],
      high: [
        "पैसे किंवा खाते धोक्यात असल्यास त्वरित 1930 वर कॉल करा.",
        "खाते ब्लॉक करा आणि cybercrime.gov.in वर तक्रार नोंदवा.",
      ],
    },
  };

  const actions = languageActions[language] ?? languageActions.en;

  if (level === "High") {
    return [...actions.base, ...actions.medium, ...actions.high];
  }

  if (level === "Medium") {
    return [...actions.base, ...actions.medium];
  }

  return actions.base;
}

export function analyzeScamContent(content: string, language: Language): ScamAnalysis {
  const matched = signals.filter((signal) => signal.pattern.test(content));
  const score = Math.min(
    96,
    matched.reduce((total, signal) => total + signal.weight, 8),
  );
  const level = riskLevel(score);
  const matchedLabels = matched.map((signal) => (signal.message as Record<string, string | undefined>)[language] ?? signal.message.en);
  
  const explanation =
    matched.length > 0
      ? matchedLabels.join(" ")
      : (({
          en: "Clear scam indicators are limited, but unknown messages still deserve caution.",
          hi: "स्पष्ट स्कैम संकेत सीमित हैं, लेकिन अज्ञात संदेशों पर सावधानी रखना जरूरी है।",
          bn: "স্পষ্ট স্ক্যামের লক্ষণগুলি সীমিত, তবে অজানা বার্তাগুলির ক্ষেত্রে সতর্ক থাকা উচিত।",
          ta: "தெளிவான மோசடி குறிகாட்டிகள் குறைவாக உள்ளன, இருப்பினும் அறியப்படாத செய்திகள் எச்சரிக்கைக்கு தகுதியானவை.",
          te: "స్పష్టమైన స్కామ్ సంకేతాలు పరిమితంగా ఉన్నాయి, అయినప్పటికీ తెలియని సందేశాలపై జాగ్రत्ता వహించడం అవసరం.",
          mr: "स्पष्ट स्कॅमचे संकेत मर्यादित आहेत, तरीही अज्ञात संदेशांबाबत खबरदारी घेणे आवश्यक आहे।"
        } as Record<string, string>)[language] ?? "Clear scam indicators are limited, but unknown messages still deserve caution.");

  return {
    probability: score,
    riskLevel: level,
    matchedSignals: matchedLabels,
    explanation,
    recommendedActions: recommendedActions(level, language),
  };
}
