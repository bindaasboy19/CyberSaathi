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
  const actions = {
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
  }[language];

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
  const explanation =
    matched.length > 0
      ? matched.map((signal) => signal.message[language]).join(" ")
      : language === "hi"
        ? "स्पष्ट स्कैम संकेत सीमित हैं, लेकिन अज्ञात संदेशों पर सावधानी रखना जरूरी है।"
        : "Clear scam indicators are limited, but unknown messages still deserve caution.";

  return {
    probability: score,
    riskLevel: level,
    matchedSignals: matched.map((signal) => signal.message[language]),
    explanation,
    recommendedActions: recommendedActions(level, language),
  };
}
