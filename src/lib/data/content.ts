import type {
  Answer,
  AwarenessCard,
  Comment,
  LawGuide,
  LocalizedString,
  NewsArticle,
  Post,
  Question,
  SafetyQuestion,
  ScenarioGuide,
} from "@/types";

export const assistantSuggestions: LocalizedString[] = [
  {
    en: "I clicked a suspicious UPI link. What should I do now?",
    hi: "मैंने एक संदिग्ध UPI लिंक खोला है। अब क्या करूं?",
  },
  {
    en: "How can I tell if a KYC update message is fake?",
    hi: "KYC अपडेट वाला संदेश नकली है या नहीं, कैसे पहचानूँ?",
  },
  {
    en: "Someone asked for my OTP and bank details. Guide me step by step.",
    hi: "किसी ने मेरा OTP और बैंक जानकारी मांगी है। मुझे चरण-दर-चरण मार्गदर्शन दें।",
  },
];

export const homeMetrics = [
  {
    label: { en: "Guided response flows", hi: "निर्देशित प्रतिक्रिया फ्लो" },
    value: "24x7",
    description: {
      en: "Instant checklists for active scam and account compromise situations.",
      hi: "चल रहे स्कैम और अकाउंट समझौता स्थितियों के लिए तुरंत चेकलिस्ट।",
    },
  },
  {
    label: { en: "Coverage areas", hi: "कवरेज क्षेत्र" },
    value: "8",
    description: {
      en: "Awareness, legal basics, community support, reports, AI, and more.",
      hi: "जागरूकता, कानूनी जानकारी, समुदाय सहायता, रिपोर्ट, एआई और बहुत कुछ।",
    },
  },
  {
    label: { en: "Safety quiz signals", hi: "सुरक्षा क्विज संकेत" },
    value: "5",
    description: {
      en: "A quick score based on real cyber hygiene habits and risky shortcuts.",
      hi: "वास्तविक साइबर आदतों और जोखिम भरे शॉर्टकट पर आधारित त्वरित स्कोर।",
    },
  },
];

export const responseChecklist: LocalizedString[] = [
  {
    en: "Block cards, UPI IDs, or mobile banking access if money exposure is possible.",
    hi: "यदि पैसे का जोखिम हो तो कार्ड, UPI ID या मोबाइल बैंकिंग एक्सेस तुरंत ब्लॉक करें।",
  },
  {
    en: "Capture screenshots, transaction IDs, profile links, and suspicious phone numbers.",
    hi: "स्क्रीनशॉट, ट्रांजैक्शन ID, प्रोफाइल लिंक और संदिग्ध फोन नंबर सहेजें।",
  },
  {
    en: "Report to the Indian cybercrime helpline 1930 and cybercrime.gov.in without delay.",
    hi: "भारतीय साइबरक्राइम हेल्पलाइन 1930 और cybercrime.gov.in पर तुरंत रिपोर्ट करें।",
  },
  {
    en: "Change passwords and enable app-based MFA on email, banking, and social accounts.",
    hi: "ईमेल, बैंकिंग और सोशल अकाउंट पर पासवर्ड बदलें और ऐप आधारित MFA चालू करें।",
  },
];

export const awarenessCards: AwarenessCard[] = [
  {
    id: "phishing",
    title: { en: "Phishing & Smishing", hi: "फिशिंग और स्मिशिंग" },
    description: {
      en: "Fake emails, SMS, or calls designed to steal credentials, OTPs, or remote access.",
      hi: "नकली ईमेल, SMS या कॉल जो क्रेडेंशियल, OTP या रिमोट एक्सेस चुराने के लिए बनाए जाते हैं।",
    },
    signals: [
      { en: "Urgent warnings about account closure or KYC expiry", hi: "अकाउंट बंद होने या KYC समाप्त होने की तात्कालिक चेतावनी" },
      { en: "Requests for OTP, UPI PIN, CVV, or remote-access app installation", hi: "OTP, UPI PIN, CVV या रिमोट एक्सेस ऐप इंस्टॉल करने की मांग" },
      { en: "Links that look almost real but have odd spellings or random domains", hi: "ऐसे लिंक जो असली लगते हैं लेकिन डोमेन में गलत स्पेलिंग या अजीब बदलाव होते हैं" },
    ],
    prevention: [
      { en: "Verify through the official app or website, never the message link.", hi: "संदेश के लिंक से नहीं, आधिकारिक ऐप या वेबसाइट से सत्यापन करें।" },
      { en: "Use app-based MFA and password managers to avoid credential reuse.", hi: "क्रेडेंशियल दोहराव से बचने के लिए ऐप-आधारित MFA और पासवर्ड मैनेजर का उपयोग करें।" },
      { en: "Never share OTP, PIN, or screen-share access with support callers.", hi: "किसी सपोर्ट कॉलर को OTP, PIN या स्क्रीन-शेयर एक्सेस कभी न दें।" },
    ],
    emergency: [
      { en: "Reset compromised passwords immediately and end active sessions.", hi: "समझौता हुए पासवर्ड तुरंत बदलें और सक्रिय सत्र समाप्त करें।" },
      { en: "Call your bank or wallet provider and flag suspicious activity.", hi: "अपने बैंक या वॉलेट प्रदाता को कॉल करके संदिग्ध गतिविधि की सूचना दें।" },
    ],
  },
  {
    id: "upi-fraud",
    title: { en: "UPI & Payment Fraud", hi: "UPI और भुगतान धोखाधड़ी" },
    description: {
      en: "Scams involving collect requests, fake refunds, QR codes, and payment app impersonation.",
      hi: "कलेक्ट रिक्वेस्ट, नकली रिफंड, QR कोड और पेमेंट ऐप प्रतिरूपण से जुड़े स्कैम।",
    },
    signals: [
      { en: "A stranger asks you to approve a collect request to receive money", hi: "कोई अजनबी पैसे पाने के लिए collect request approve करने को कहे" },
      { en: "Promises of cashback, parcel release, or prize money after a small payment", hi: "छोटे भुगतान के बाद cashback, पार्सल रिलीज या इनाम की पेशकश" },
      { en: "Support agents asking for screen sharing to solve a refund issue", hi: "रिफंड समस्या हल करने के लिए स्क्रीन शेयरिंग मांगने वाले सपोर्ट एजेंट" },
    ],
    prevention: [
      { en: "Receiving money never requires a UPI PIN or collect approval for unknown requests.", hi: "पैसे प्राप्त करने के लिए UPI PIN या अनजान collect approval की जरूरत नहीं होती।" },
      { en: "Double-check payee names and use only verified helplines from the official app.", hi: "पेयी का नाम दोबारा जांचें और केवल आधिकारिक ऐप से सत्यापित हेल्पलाइन का उपयोग करें।" },
      { en: "Keep daily limits reasonable and enable transaction alerts on all accounts.", hi: "दैनिक सीमा उचित रखें और सभी खातों पर ट्रांजैक्शन अलर्ट चालू करें।" },
    ],
    emergency: [
      { en: "Freeze your bank account or wallet if unauthorized transfers happened.", hi: "अनधिकृत ट्रांसफर होने पर अपना बैंक अकाउंट या वॉलेट फ्रीज करवाएं।" },
      { en: "Preserve UTR numbers, screenshots, and support chat logs for reporting.", hi: "रिपोर्टिंग के लिए UTR नंबर, स्क्रीनशॉट और सपोर्ट चैट लॉग सुरक्षित रखें।" },
    ],
  },
  {
    id: "identity-theft",
    title: { en: "Identity Theft", hi: "पहचान की चोरी" },
    description: {
      en: "Misuse of PAN, Aadhaar, SIM, or leaked personal data for fraud, loans, or social scams.",
      hi: "PAN, Aadhaar, SIM या लीक हुए निजी डेटा का धोखाधड़ी, लोन या सोशल स्कैम के लिए दुरुपयोग।",
    },
    signals: [
      { en: "Unknown loan, KYC, SIM, or wallet activity tied to your identity", hi: "आपकी पहचान से जुड़ी अज्ञात लोन, KYC, SIM या वॉलेट गतिविधि" },
      { en: "Unexpected verification calls about accounts you never opened", hi: "ऐसे खातों के बारे में अप्रत्याशित सत्यापन कॉल जिन्हें आपने कभी नहीं खोला" },
      { en: "Leaked ID proofs shared casually over chat, email, or public forms", hi: "चैट, ईमेल या सार्वजनिक फॉर्म के जरिए लापरवाही से साझा किए गए पहचान दस्तावेज" },
    ],
    prevention: [
      { en: "Mask non-essential details when sharing ID proofs for verification.", hi: "सत्यापन हेतु ID साझा करते समय गैर-आवश्यक विवरण छुपाएं।" },
      { en: "Review credit reports and telecom activity periodically.", hi: "क्रेडिट रिपोर्ट और टेलीकॉम गतिविधि समय-समय पर जांचें।" },
      { en: "Avoid sending full-document scans on unsecured chat platforms.", hi: "असुरक्षित चैट प्लेटफॉर्म पर पूरे दस्तावेज़ की स्कैन कॉपी भेजने से बचें।" },
    ],
    emergency: [
      { en: "Raise disputes with the bank, lender, or telecom provider immediately.", hi: "बैंक, ऋणदाता या टेलीकॉम प्रदाता के साथ तुरंत विवाद दर्ज करें।" },
      { en: "File a police or cybercrime complaint with proof of identity misuse.", hi: "पहचान दुरुपयोग के प्रमाण के साथ पुलिस या साइबरक्राइम शिकायत दर्ज करें।" },
    ],
  },
];

export const lawGuides: LawGuide[] = [
  {
    id: "it-act",
    title: { en: "IT Act Essentials", hi: "आईटी एक्ट की मूल बातें" },
    summary: {
      en: "The Information Technology Act covers unauthorized access, data misuse, identity fraud, and online deception.",
      hi: "सूचना प्रौद्योगिकी अधिनियम अनधिकृत एक्सेस, डेटा दुरुपयोग, पहचान धोखाधड़ी और ऑनलाइन छल को कवर करता है।",
    },
    sections: [
      { en: "Sections commonly referenced in cyber incidents include unauthorized access and identity misuse.", hi: "साइबर घटनाओं में अक्सर अनधिकृत एक्सेस और पहचान दुरुपयोग से जुड़ी धाराएं देखी जाती हैं।" },
      { en: "Electronic records, screenshots, transaction IDs, and device logs strengthen your complaint.", hi: "इलेक्ट्रॉनिक रिकॉर्ड, स्क्रीनशॉट, ट्रांजैक्शन ID और डिवाइस लॉग आपकी शिकायत को मजबूत बनाते हैं।" },
      { en: "CyberSathi gives practical orientation, not formal legal representation.", hi: "CyberSathi व्यावहारिक दिशा देता है, औपचारिक कानूनी प्रतिनिधित्व नहीं।" },
    ],
    nextSteps: [
      { en: "Preserve evidence before deleting messages or formatting devices.", hi: "संदेश हटाने या डिवाइस फ़ॉर्मेट करने से पहले सबूत सुरक्षित रखें।" },
      { en: "Escalate to cybercrime.gov.in and your nearest police station when money, identity, or safety is at risk.", hi: "यदि पैसे, पहचान या सुरक्षा का जोखिम हो तो cybercrime.gov.in और नजदीकी पुलिस स्टेशन पर शिकायत दर्ज करें।" },
    ],
  },
  {
    id: "ipc-support",
    title: { en: "IPC Support Provisions", hi: "IPC की सहायक धाराएँ" },
    summary: {
      en: "Fraud, cheating, intimidation, and impersonation can also trigger Indian Penal Code provisions alongside cyber laws.",
      hi: "धोखाधड़ी, छल, धमकी और प्रतिरूपण पर साइबर कानूनों के साथ भारतीय दंड संहिता की धाराएँ भी लागू हो सकती हैं।",
    },
    sections: [
      { en: "Police complaints should focus on facts: what happened, when, how much was lost, and what evidence exists.", hi: "पुलिस शिकायत में तथ्य मुख्य हों: क्या हुआ, कब हुआ, कितना नुकसान हुआ और क्या सबूत हैं।" },
      { en: "A concise incident timeline is often more useful than a long emotional description.", hi: "लंबे भावनात्मक विवरण की तुलना में संक्षिप्त घटना-समयरेखा अधिक उपयोगी होती है।" },
      { en: "If vulnerable people were targeted, mention age, disability, or coercion clearly.", hi: "यदि कमजोर व्यक्तियों को निशाना बनाया गया हो, तो उम्र, विकलांगता या दबाव को स्पष्ट रूप से लिखें।" },
    ],
    nextSteps: [
      { en: "Use CyberSathi's report form to organize details before filing a complaint.", hi: "शिकायत दर्ज करने से पहले विवरण व्यवस्थित करने के लिए CyberSathi की रिपोर्ट फॉर्म का उपयोग करें।" },
      { en: "If the scam is ongoing, mention continuing risk in every report channel.", hi: "यदि स्कैम जारी है, तो हर रिपोर्ट चैनल में लगातार जोखिम का उल्लेख करें।" },
    ],
  },
];

export const scenarioGuides: ScenarioGuide[] = [
  {
    id: "upi-loss",
    title: { en: "What to do if money left your account", hi: "अगर आपके खाते से पैसे निकल गए हों तो क्या करें" },
    scenario: {
      en: "You approved a collect request, shared a PIN, or completed a transaction after a scam call.",
      hi: "आपने collect request approve की, PIN साझा किया, या स्कैम कॉल के बाद ट्रांजैक्शन किया।",
    },
    steps: [
      { en: "Call the bank or payment app first and ask for an immediate block or freeze.", hi: "पहले बैंक या पेमेंट ऐप को कॉल करें और तुरंत block या freeze की मांग करें।" },
      { en: "Collect UTR, beneficiary, screenshots, and the exact timeline of events.", hi: "UTR, beneficiary, स्क्रीनशॉट और घटनाओं की सटीक समयरेखा इकट्ठा करें।" },
      { en: "File 1930 and cybercrime.gov.in complaints as fast as possible for recovery chances.", hi: "रिकवरी की संभावना के लिए जल्द से जल्द 1930 और cybercrime.gov.in पर शिकायत करें।" },
    ],
  },
  {
    id: "social-hijack",
    title: { en: "What to do if your social account is hijacked", hi: "यदि आपका सोशल अकाउंट हैक हो जाए तो क्या करें" },
    scenario: {
      en: "Someone changed your password, added new devices, or is messaging your contacts as you.",
      hi: "किसी ने आपका पासवर्ड बदल दिया, नए डिवाइस जोड़ दिए, या आपके नाम से दूसरों को संदेश भेज रहा है।",
    },
    steps: [
      { en: "Recover access using the official recovery workflow and log out all other devices.", hi: "आधिकारिक रिकवरी प्रक्रिया से अकाउंट वापस लें और बाकी सभी डिवाइस लॉगआउट करें।" },
      { en: "Warn close contacts not to trust recent requests for money, OTPs, or gift cards.", hi: "करीबी संपर्कों को चेतावनी दें कि पैसे, OTP या गिफ्ट कार्ड की हाल की मांगों पर भरोसा न करें।" },
      { en: "Review email security too, because compromised inboxes often enable account takeovers.", hi: "ईमेल सुरक्षा भी जांचें, क्योंकि समझौता हुआ इनबॉक्स अक्सर अकाउंट टेकओवर सक्षम करता है।" },
    ],
  },
];

export const mockQuestions: Question[] = [
  {
    id: "q-1",
    title: "How should I report a fake bank KYC call in India?",
    description:
      "The caller claimed my account would be frozen and asked me to install a remote support app. I disconnected before sharing anything.",
    category: "Banking scam",
    userId: "demo-user",
    authorName: "Aditi",
    votes: 18,
    answerCount: 2,
    createdAt: "2026-04-09T08:10:00.000Z",
  },
  {
    id: "q-2",
    title: "Is a collect request the same as receiving money on UPI?",
    description:
      "A buyer says he will send payment, but I received a request asking me to approve with my UPI PIN.",
    category: "UPI fraud",
    userId: "demo-user-2",
    authorName: "Rohit",
    votes: 24,
    answerCount: 1,
    createdAt: "2026-04-08T11:40:00.000Z",
  },
];

export const mockAnswers: Answer[] = [
  {
    id: "a-1",
    questionId: "q-1",
    userId: "expert-1",
    authorName: "Neha S.",
    content:
      "Do not call the number back. Save the phone number, call time, and any messages. Report it to 1930 and through cybercrime.gov.in. If you installed anything, uninstall it and rotate passwords.",
    votes: 11,
    isExpert: true,
    createdAt: "2026-04-09T09:00:00.000Z",
  },
  {
    id: "a-2",
    questionId: "q-1",
    userId: "user-3",
    authorName: "Pranav",
    content:
      "Also check whether the caller sent a shortened URL. Banks generally ask you to open the official app yourself, not download a helper app.",
    votes: 4,
    isExpert: false,
    createdAt: "2026-04-09T10:15:00.000Z",
  },
  {
    id: "a-3",
    questionId: "q-2",
    userId: "expert-2",
    authorName: "Cyber Mentor",
    content:
      "No. To receive money, you usually share your UPI ID or scan QR in the official app. Approving a collect request with your PIN can send money out of your account.",
    votes: 16,
    isExpert: true,
    createdAt: "2026-04-08T12:00:00.000Z",
  },
];

export const mockPosts: Post[] = [
  {
    id: "p-1",
    title: "How a fake courier message turned into a payment scam",
    content:
      "The message claimed my parcel was stuck. It redirected to a clone page and asked for a tiny re-delivery fee. The bigger warning sign was the pressure to pay instantly and the non-standard domain.",
    authorId: "demo-author",
    authorName: "Simran",
    type: "case",
    likes: 27,
    commentCount: 2,
    tags: ["phishing", "delivery", "awareness"],
    createdAt: "2026-04-07T07:20:00.000Z",
  },
  {
    id: "p-2",
    title: "Five habits that drastically reduce account takeover risk",
    content:
      "Separate email security from every other account, use app-based MFA, reject remote support installations, and review password reuse. Small hygiene improvements prevent large incidents later.",
    authorId: "mentor-1",
    authorName: "Cyber Coach",
    type: "blog",
    likes: 33,
    commentCount: 1,
    tags: ["mfa", "passwords", "prevention"],
    createdAt: "2026-04-05T16:45:00.000Z",
  },
];

export const mockComments: Comment[] = [
  {
    id: "c-1",
    parentId: "p-1",
    userId: "reader-1",
    authorName: "Harsh",
    text: "The small fee trick is so common now. Thanks for explaining the domain warning sign.",
    createdAt: "2026-04-07T08:00:00.000Z",
  },
  {
    id: "c-2",
    parentId: "p-1",
    userId: "reader-2",
    authorName: "Komal",
    text: "I got a similar courier SMS. The fake support number was the giveaway for me.",
    createdAt: "2026-04-07T08:30:00.000Z",
  },
  {
    id: "c-3",
    parentId: "p-2",
    userId: "reader-3",
    authorName: "Tushar",
    text: "Separating email security is underrated advice.",
    createdAt: "2026-04-05T18:10:00.000Z",
  },
];

export const fallbackNews: NewsArticle[] = [
  {
    id: "n-1",
    title: "Banks increase alerts around remote access and UPI support scams",
    summary:
      "Security advisories continue to warn Indian users against giving screen-sharing or OTP access to fake customer-care callers.",
    source: "CyberSathi Digest",
    url: "https://cybersathi.example/news/remote-access-upi",
    publishedAt: "2026-04-10T07:30:00.000Z",
  },
  {
    id: "n-2",
    title: "Public awareness campaigns focus on quick reporting through 1930",
    summary:
      "Victim-support messaging increasingly emphasizes speed, evidence capture, and immediate bank escalation after fraudulent transfers.",
    source: "CyberSathi Digest",
    url: "https://cybersathi.example/news/1930-awareness",
    publishedAt: "2026-04-09T11:45:00.000Z",
  },
  {
    id: "n-3",
    title: "Identity misuse complaints show the importance of document masking",
    summary:
      "Experts recommend sharing only the minimum required KYC information and masking non-essential fields during verification workflows.",
    source: "CyberSathi Digest",
    url: "https://cybersathi.example/news/identity-masking",
    publishedAt: "2026-04-08T14:15:00.000Z",
  },
];

export const safetyQuestions: SafetyQuestion[] = [
  {
    id: "sq-1",
    question: {
      en: "What do you usually do when an SMS asks you to urgently update KYC?",
      hi: "जब SMS तुरंत KYC अपडेट करने को कहता है, तो आप आमतौर पर क्या करते हैं?",
    },
    options: [
      {
        label: { en: "I open the official app or website myself.", hi: "मैं आधिकारिक ऐप या वेबसाइट खुद खोलता/खोलती हूँ।" },
        score: 20,
        insight: { en: "Strong habit. You avoid message-link traps.", hi: "बहुत अच्छी आदत। आप message-link traps से बचते हैं।" },
      },
      {
        label: { en: "I click the message link if it looks normal.", hi: "यदि संदेश सामान्य लगे तो मैं लिंक खोल देता/देती हूँ।" },
        score: 8,
        insight: { en: "This creates unnecessary phishing risk.", hi: "इससे फिशिंग का अनावश्यक जोखिम बनता है।" },
      },
      {
        label: { en: "I call the number in the message.", hi: "मैं संदेश में दिए नंबर पर कॉल करता/करती हूँ।" },
        score: 2,
        insight: { en: "High-risk shortcut. Use official support channels only.", hi: "यह उच्च-जोखिम वाला तरीका है। केवल आधिकारिक सपोर्ट चैनल उपयोग करें।" },
      },
    ],
  },
  {
    id: "sq-2",
    question: {
      en: "How do you protect important accounts like email and banking?",
      hi: "ईमेल और बैंकिंग जैसे महत्वपूर्ण अकाउंट को आप कैसे सुरक्षित रखते हैं?",
    },
    options: [
      {
        label: { en: "Unique passwords plus app-based MFA.", hi: "अलग-अलग पासवर्ड और ऐप-आधारित MFA।" },
        score: 20,
        insight: { en: "Excellent foundation against takeover attempts.", hi: "अकाउंट टेकओवर के खिलाफ शानदार सुरक्षा आधार।" },
      },
      {
        label: { en: "Same password pattern with SMS OTP.", hi: "एक जैसा पासवर्ड पैटर्न और SMS OTP।" },
        score: 10,
        insight: { en: "Better than nothing, but reuse is dangerous.", hi: "कुछ न होने से बेहतर है, पर पासवर्ड दोहराना खतरनाक है।" },
      },
      {
        label: { en: "Mostly passwords only.", hi: "अधिकतर सिर्फ पासवर्ड।" },
        score: 4,
        insight: { en: "Adding MFA would dramatically improve resilience.", hi: "MFA जोड़ने से सुरक्षा काफी मजबूत होगी।" },
      },
    ],
  },
  {
    id: "sq-3",
    question: {
      en: "What happens when an unknown buyer sends a UPI collect request?",
      hi: "जब कोई अनजान खरीदार UPI collect request भेजता है, तो आप क्या करते हैं?",
    },
    options: [
      {
        label: { en: "I reject it and verify the flow in the payment app.", hi: "मैं इसे reject करता/करती हूँ और payment app में flow verify करता/करती हूँ।" },
        score: 20,
        insight: { en: "Excellent. You know receiving money does not need a PIN.", hi: "बहुत बढ़िया। आप जानते हैं कि पैसे पाने के लिए PIN नहीं चाहिए।" },
      },
      {
        label: { en: "I approve if the buyer sounds genuine.", hi: "यदि खरीदार सही लगे तो approve कर देता/देती हूँ।" },
        score: 5,
        insight: { en: "Trust-based payment decisions are risky.", hi: "भरोसे पर आधारित भुगतान निर्णय जोखिम भरे हैं।" },
      },
      {
        label: { en: "I am not sure what collect requests mean.", hi: "मुझे collect request का मतलब साफ नहीं है।" },
        score: 8,
        insight: { en: "You need a quick UPI fraud refresher.", hi: "आपको UPI धोखाधड़ी पर एक त्वरित पुनरावृत्ति की जरूरत है।" },
      },
    ],
  },
  {
    id: "sq-4",
    question: {
      en: "How do you share ID proofs when verification is unavoidable?",
      hi: "जब सत्यापन जरूरी हो, तो आप पहचान दस्तावेज कैसे साझा करते हैं?",
    },
    options: [
      {
        label: { en: "Only through verified channels and with masked details when possible.", hi: "केवल सत्यापित चैनलों से और जहाँ संभव हो masked details के साथ।" },
        score: 20,
        insight: { en: "That reduces identity misuse risk.", hi: "इससे पहचान दुरुपयोग का जोखिम कम होता है।" },
      },
      {
        label: { en: "I send full scans on chat if the request feels normal.", hi: "यदि अनुरोध सामान्य लगे तो मैं चैट पर पूरी स्कैन कॉपी भेज देता/देती हूँ।" },
        score: 6,
        insight: { en: "This can expose you to identity theft.", hi: "इससे पहचान चोरी का खतरा बढ़ता है।" },
      },
      {
        label: { en: "I often forward the same document wherever asked.", hi: "मैं अक्सर वही दस्तावेज़ जहाँ माँगा जाए, भेज देता/देती हूँ।" },
        score: 2,
        insight: { en: "That habit is very risky and needs correction.", hi: "यह आदत बहुत जोखिम भरी है और इसे बदलने की जरूरत है।" },
      },
    ],
  },
  {
    id: "sq-5",
    question: {
      en: "If you suspect compromise, how quickly do you respond?",
      hi: "यदि आपको समझौते का संदेह हो, तो आप कितनी जल्दी प्रतिक्रिया देते हैं?",
    },
    options: [
      {
        label: { en: "Immediately: block access, save evidence, report fast.", hi: "तुरंत: एक्सेस ब्लॉक, सबूत सुरक्षित, और तेजी से रिपोर्ट।" },
        score: 20,
        insight: { en: "Fast reporting improves containment and recovery chances.", hi: "तेजी से रिपोर्ट करने से नियंत्रण और रिकवरी की संभावना बढ़ती है।" },
      },
      {
        label: { en: "I wait to see if the issue repeats.", hi: "मैं देखता/देखती हूँ कि समस्या फिर होती है या नहीं।" },
        score: 5,
        insight: { en: "Delay often makes fraud recovery harder.", hi: "देरी से धोखाधड़ी की रिकवरी कठिन हो जाती है।" },
      },
      {
        label: { en: "I mainly delete the message and move on.", hi: "मैं मुख्यतः संदेश हटाकर आगे बढ़ जाता/जाती हूँ।" },
        score: 3,
        insight: { en: "Deleting evidence can weaken later complaints.", hi: "सबूत हटाने से बाद की शिकायत कमजोर पड़ सकती है।" },
      },
    ],
  },
];
