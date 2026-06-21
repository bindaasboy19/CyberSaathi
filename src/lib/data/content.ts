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
    en: "What should I do if I receive a fake video call claiming to be a 'Digital Arrest' by police?",
    hi: "अगर मुझे पुलिस द्वारा 'डिजिटल अरेस्ट' का दावा करने वाला फर्जी वीडियो कॉल आए तो मुझे क्या करना चाहिए?",
  },
  {
    en: "I lost money in a part-time job scam on Telegram. How can I get a refund?",
    hi: "मैंने टेलीग्राम पर पार्ट-टाइम जॉब स्कैम में पैसे खो दिए। मुझे रिफंड कैसे मिल सकता है?",
  },
  {
    en: "I was added to a WhatsApp group promising high returns in stock trading. Is it fraud?",
    hi: "मुझे स्टॉक ट्रेडिंग में भारी मुनाफे का दावा करने वाले व्हाट्सएप ग्रुप में जोड़ा गया है। क्या यह धोखाधड़ी है?",
  },
  {
    en: "Someone used an AI voice clone of my relative to ask for urgent money. What steps to take?",
    hi: "किसी ने पैसे मांगने के लिए मेरे रिश्तेदार की एआई वॉयस क्लोन का इस्तेमाल किया। क्या कदम उठाएं?",
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
      { en: "CyberSaathi gives practical orientation, not formal legal representation.", hi: "CyberSaathi व्यावहारिक दिशा देता है, औपचारिक कानूनी प्रतिनिधित्व नहीं।" },
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
      { en: "Use CyberSaathi's report form to organize details before filing a complaint.", hi: "शिकायत दर्ज करने से पहले विवरण व्यवस्थित करने के लिए CyberSaathi की रिपोर्ट फॉर्म का उपयोग करें।" },
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
    title: "Global Privacy Law Updates: How Regulations Impact Users Worldwide",
    summary: "From Europe's GDPR to newly implemented data frameworks across Asia and the Americas, privacy laws are tightening. New regulations introduce heavy fines for unauthorized data exposure and grant consumers stronger digital rights.",
    source: "Global Tech Digest",
    url: "#",
    publishedAt: "2026-05-28T09:00:00.000Z",
  },
  {
    id: "n-2",
    title: "Rise of AI Voice Cloning Scams Globally: Security Experts Alert Families",
    summary: "Criminal syndicates are using short social media audio snippets to clone voices of family members, calling relatives to request urgent bank transfers. Cybersecurity agencies urge people to verify caller identity using offline checkups.",
    source: "Cybersecurity News Network",
    url: "#",
    publishedAt: "2026-05-27T14:30:00.000Z",
  },
  {
    id: "n-3",
    title: "The Golden Hour: How Quick Reporting Minimizes Cyber Fraud Losses",
    summary: "International financial institutions and law enforcement agencies release data confirming that reporting fraudulent bank transfers within the first hour increases the chances of freezing stolen funds by over 70%.",
    source: "Financial Protection Hub",
    url: "#",
    publishedAt: "2026-05-26T08:15:00.000Z",
  },
  {
    id: "n-4",
    title: "Combating Cyber Harassment: International Digital Rights Standards",
    summary: "As online harassment and digital stalking increase globally, a coalition of digital rights groups has proposed unified legal guidelines to speed up investigations and protect victims across borders.",
    source: "Global Digital Rights",
    url: "#",
    publishedAt: "2026-05-25T11:00:00.000Z",
  },
  {
    id: "n-5",
    title: "App Store Audits: Security Standards Target Intrusive App Permissions",
    summary: "Major mobile application markets are rolling out stricter audits targeting simple utility and game applications that demand unnecessary permissions, such as contact reading, SMS access, or location tracking.",
    source: "Mobile Security Monitor",
    url: "#",
    publishedAt: "2026-05-24T10:20:00.000Z",
  },
  {
    id: "n-6",
    title: "Digital Wallet Safety: Spotting QR Code and Payment Request Fraud",
    summary: "As digital wallet adoption grows, experts warn of scams involving QR codes sent on chat networks claiming to credit cash. Financial authorities remind users that receiving funds never requires entering a passcode.",
    source: "Global FinTech Watch",
    url: "#",
    publishedAt: "2026-05-23T16:45:00.000Z",
  },
  {
    id: "n-7",
    title: "Deepfakes and Digital Identity Theft: Global Initiative Launches to Spot Synthetic Media",
    summary: "Tech firms and research institutions form a global alliance to deploy detection systems against AI-generated deepfakes. Systems look for erratic eye movements, lighting inconsistencies, and audio sync gaps.",
    source: "AI Watch Global",
    url: "#",
    publishedAt: "2026-05-22T13:10:00.000Z",
  },
  {
    id: "n-8",
    title: "Public Wi-Fi Vulnerabilities Highlighted in New Cybersecurity Report",
    summary: "A new security report reveals that over 30% of public Wi-Fi hotspots are vulnerable to Man-in-the-Middle attacks. Security teams recommend using trusted VPNs and secure mobile hotspots in transit.",
    source: "Cybersecurity News Network",
    url: "#",
    publishedAt: "2026-05-21T07:55:00.000Z",
  },
  {
    id: "n-9",
    title: "International Job Scams Target Freelancers Across Major Messaging Platforms",
    summary: "A worldwide phishing campaign is targeting job seekers via Telegram and WhatsApp with fake work-from-home tasks. Victims are initially paid minor fees before being coerced into large investment schemes.",
    source: "Global Fraud Alert",
    url: "#",
    publishedAt: "2026-05-20T12:40:00.000Z",
  },
  {
    id: "n-10",
    title: "Global Increase in WhatsApp Hijacking Prompts Mandatory 2FA Advisory",
    summary: "As verification code intercepts surge, cybersecurity groups advise all messaging app users to enable two-factor verification (2FA) PIN codes. The setup adds a secondary lock that prevents hijack attempts.",
    source: "Security Digest Weekly",
    url: "#",
    publishedAt: "2026-05-19T09:15:00.000Z",
  },
  {
    id: "n-11",
    title: "Global Sextortion Syndicates Targeted by International Law Enforcement",
    summary: "A coordinated joint operation by Interpol and global police divisions has shut down major servers used for cyber blackmail. Agencies reiterate advice: never pay ransom, secure accounts, and report immediately.",
    source: "International Justice News",
    url: "#",
    publishedAt: "2026-05-18T15:25:00.000Z",
  },
  {
    id: "n-12",
    title: "Digital Arrest Fraud: Interpol Warns of Scammers Posing as Law Officials",
    summary: "Interpol issues a red alert warning about cyber extortionists posing as state law enforcement officers via video calls, coercing victims into 'digital arrests'. Officials clarify that online custody does not exist.",
    source: "Global Fraud Alert",
    url: "#",
    publishedAt: "2026-05-17T11:50:00.000Z",
  },
  {
    id: "n-13",
    title: "E-Commerce Fraud Soars: How to Spot Fake Online Shopping Portals",
    summary: "Over 5,000 new counterfeit shopping websites are detected daily. Cybersecurity organizations advise shoppers to inspect domain names closely, check for contact information, and ignore unrealistic discounts.",
    source: "Consumer Trust Watch",
    url: "#",
    publishedAt: "2026-05-16T14:10:00.000Z",
  },
  {
    id: "n-14",
    title: "Protecting Vulnerable Users: Tech Support Scams Target Elders Globally",
    summary: "Global cyber taskforces launch outreach programs to protect senior citizens from fake tech support warnings and automated security calls claiming bank accounts are compromised.",
    source: "Global Tech Digest",
    url: "#",
    publishedAt: "2026-05-15T10:05:00.000Z",
  },
  {
    id: "n-15",
    title: "International Package Delivery Scams Exploit Custom Clearances",
    summary: "Scammers are sending automated messages claiming international parcels are held due to illegal items or unpaid customs fees. Postal services clarify they never request digital payments for delivery settling.",
    source: "International Logistical Security",
    url: "#",
    publishedAt: "2026-05-14T08:30:00.000Z",
  }
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
  {
    id: "sq-6",
    question: {
      en: "What is your action when a caller claims to be a police officer stating your parcel contains drugs and threatens a 'Digital Arrest'?",
      hi: "जब कोई खुद को पुलिस अधिकारी बताकर दावा करे कि आपके पार्सल में ड्रग्स है और 'डिजिटल अरेस्ट' की धमकी दे, तो आप क्या करेंगे?",
    },
    options: [
      {
        label: { en: "I immediately hang up and report to 1930 or cybercrime.gov.in.", hi: "मैं तुरंत फोन काटकर 1930 या cybercrime.gov.in पर रिपोर्ट करता/करती हूँ।" },
        score: 20,
        insight: { en: "Excellent. Law enforcement never makes digital arrests on video calls or demands money.", hi: "शानदार। कानून प्रवर्तन एजेंसियां कभी वीडियो कॉल पर डिजिटल अरेस्ट नहीं करतीं न ही पैसे मांगती हैं।" },
      },
      {
        label: { en: "I join a video call to clear my name.", hi: "मैं खुद को बेगुनाह साबित करने के लिए वीडियो कॉल में शामिल होता/होती हूँ।" },
        score: 5,
        insight: { en: "Scammers use fake police setups to extort money. Avoid video calls.", hi: "स्कैमर्स जबरन वसूली के लिए नकली पुलिस सेटअप का उपयोग करते हैं। वीडियो कॉल से बचें।" },
      },
      {
        label: { en: "I transfer a safety deposit to clear my records.", hi: "मैं अपने रिकॉर्ड साफ करने के लिए सुरक्षा जमा राशि ट्रांसफर करता/करती हूँ।" },
        score: 0,
        insight: { en: "Critical risk. Police never ask for money transfers. Seek immediate family/legal help.", hi: "गंभीर खतरा। पुलिस कभी पैसे ट्रांसफर करने को नहीं कहती। तुरंत मदद लें।" },
      },
    ],
  },
  {
    id: "sq-7",
    question: {
      en: "How do you handle messages offering high-paying part-time jobs for simply liking online videos?",
      hi: "केवल वीडियो लाइक करने के लिए भारी भुगतान वाले पार्ट-टाइम जॉब के संदेशों से आप कैसे निपटते हैं?",
    },
    options: [
      {
        label: { en: "I block and report the sender immediately.", hi: "मैं तुरंत भेजने वाले को ब्लॉक और रिपोर्ट करता/करती हूँ।" },
        score: 20,
        insight: { en: "Perfect. These are prepay task scams designed to drain your savings.", hi: "बिल्कुल सही। ये पैसे जमा कराने वाले टास्क स्कैम होते हैं जो आपकी बचत हड़प लेते हैं।" },
      },
      {
        label: { en: "I do a few free tasks to earn some money and then leave.", hi: "मैं कुछ पैसे कमाने के लिए शुरुआत के मुफ्त टास्क कर लेता/लेती हूँ और फिर छोड़ देता हूँ।" },
        score: 8,
        insight: { en: "Risky. Scammers pay small amounts first to lure you into depositing larger sums.", hi: "जोखिम भरा। स्कैमर्स आपको फंसाने के लिए शुरुआत में छोटे भुगतान करते हैं।" },
      },
      {
        label: { en: "I pay the deposit fee to unlock higher-tier VIP tasks.", hi: "मैं अधिक कमाई वाले वीआईपी टास्क अनलॉक करने के लिए जमा राशि का भुगतान करता/करती हूँ।" },
        score: 2,
        insight: { en: "Severe risk. You will lose all your money and won't be able to withdraw.", hi: "भारी जोखिम। आप अपनी पूरी रकम खो देंगे और उसे कभी निकाल नहीं पाएंगे।" },
      },
    ],
  },
  {
    id: "sq-8",
    question: {
      en: "A support caller asks you to download AnyDesk or TeamViewer to fix an app issue. What do you do?",
      hi: "एक सपोर्ट कॉलर ऐप की समस्या ठीक करने के लिए AnyDesk या TeamViewer डाउनलोड करने को कहे, तो आप क्या करेंगे?",
    },
    options: [
      {
        label: { en: "I refuse. These apps allow full remote control of my device.", hi: "मैं मना कर देता हूँ। ये ऐप मेरे डिवाइस का पूरा रिमोट कंट्रोल दे देते हैं।" },
        score: 20,
        insight: { en: "Excellent security awareness. Never share remote control of your phone.", hi: "शानदार सुरक्षा जागरूकता। अपने फोन का रिमोट कंट्रोल कभी साझा न करें।" },
      },
      {
        label: { en: "I install it but watch my screen closely.", hi: "मैं इंस्टॉल करता हूँ लेकिन अपनी स्क्रीन पर ध्यान रखता हूँ।" },
        score: 5,
        insight: { en: "Scammers can read OTPs and access passwords in seconds. High risk.", hi: "स्कैमर्स सेकंडों में OTP और पासवर्ड देख सकते हैं। यह अत्यधिक जोखिम भरा है।" },
      },
      {
        label: { en: "I install it since they are official support.", hi: "मैं इंस्टॉल कर लेता हूँ क्योंकि वे आधिकारिक सपोर्ट हैं।" },
        score: 0,
        insight: { en: "Critical. Real support agents will never ask you to install screen-sharing software.", hi: "गंभीर। असली सपोर्ट एजेंट कभी स्क्रीन शेयरिंग सॉफ्टवेयर इंस्टॉल करने को नहीं कहेंगे।" },
      },
    ],
  },
  {
    id: "sq-9",
    question: {
      en: "What is your main precaution when connecting to free public Wi-Fi?",
      hi: "मुफ्त सार्वजनिक वाई-फाई से कनेक्ट करते समय आपकी मुख्य सावधानी क्या होती है?",
    },
    options: [
      {
        label: { en: "I avoid financial transactions and use a VPN.", hi: "मैं वित्तीय लेन-देन से बचता हूँ और वीपीएन का उपयोग करता हूँ।" },
        score: 20,
        insight: { en: "Strong protection. Public Wi-Fi is highly vulnerable to interception.", hi: "मजबूत सुरक्षा। सार्वजनिक वाई-फाई पर डेटा चोरी होने का खतरा रहता है।" },
      },
      {
        label: { en: "I use it normally but log out when finished.", hi: "मैं इसे सामान्य रूप से उपयोग करता हूँ लेकिन काम खत्म होने पर लॉगआउट कर देता हूँ।" },
        score: 10,
        insight: { en: "Moderate risk. Intercepted data can still reveal sensitive session tokens.", hi: "मध्यम जोखिम। बीच में रोका गया डेटा आपकी संवेदनशील जानकारी उजागर कर सकता है।" },
      },
      {
        label: { en: "I log in to bank accounts if the connection is fast.", hi: "अगर कनेक्शन तेज है तो मैं बैंक खातों में लॉगिन कर लेता/लेती हूँ।" },
        score: 2,
        insight: { en: "Very risky. Hackers can capture login details using fake network hotspots.", hi: "अत्यधिक जोखिम भरा। हैकर्स फर्जी हॉटस्पॉट बनाकर लॉगिन विवरण चुरा सकते हैं।" },
      },
    ],
  },
  {
    id: "sq-10",
    question: {
      en: "Someone calls and says your relative met with an accident and needs urgent money via UPI. What is your first step?",
      hi: "कोई फोन कर कहे कि आपके रिश्तेदार का एक्सीडेंट हो गया है और तुरंत UPI से पैसे चाहिए। आपका पहला कदम क्या होगा?",
    },
    options: [
      {
        label: { en: "I hang up and call the relative or their immediate family directly.", hi: "मैं फोन काटकर सीधे उस रिश्तेदार या उनके परिवार को कॉल करता हूँ।" },
        score: 20,
        insight: { en: "Great response. Scammers use panic tactics and AI voice clones to extort money.", hi: "बहुत बढ़िया। स्कैमर्स हड़बड़ी का फायदा उठाने के लिए घबराहट और एआई वॉयस क्लोन का उपयोग करते हैं।" },
      },
      {
        label: { en: "I immediately transfer the money as it is an emergency.", hi: "मैं आपातकालीन स्थिति समझकर तुरंत पैसे ट्रांसफर कर देता/देती हूँ।" },
        score: 3,
        insight: { en: "High risk. Always verify independently before sending urgent funds to unknown bank accounts.", hi: "बड़ा जोखिम। किसी भी अज्ञात बैंक खाते में पैसे भेजने से पहले स्वतंत्र रूप से जांच करें।" },
      },
      {
        label: { en: "I ask the caller to send details and try to negotiate.", hi: "मैं कॉलर से और विवरण मांगता हूँ और मोलभाव करने की कोशिश करता हूँ।" },
        score: 8,
        insight: { en: "Risky. Engaging gives scammers more opportunities to manipulate you.", hi: "जोखिम भरा। बातचीत करने से स्कैमर्स को आपको प्रभावित करने का अधिक मौका मिलता है।" },
      },
    ],
  },
  {
    id: "sq-11",
    question: {
      en: "How do you find customer support numbers for banks or courier services?",
      hi: "आप बैंकों या कूरियर सेवाओं के कस्टमर सपोर्ट नंबर कैसे ढूंढते हैं?",
    },
    options: [
      {
        label: { en: "Only from the official app or official website.", hi: "केवल आधिकारिक ऐप या आधिकारिक वेबसाइट से।" },
        score: 20,
        insight: { en: "Perfect. Scammers publish fake support numbers on search engine maps.", hi: "सटीक। स्कैमर्स सर्च इंजन मैप्स पर फर्जी सपोर्ट नंबर प्रकाशित कर देते हैं।" },
      },
      {
        label: { en: "I search on Google and call the first number that appears.", hi: "मैं गूगल पर सर्च करता हूँ और जो पहला नंबर दिखता है उसपर कॉल करता हूँ।" },
        score: 4,
        insight: { en: "Extremely dangerous. Search ads often link to fraudulent numbers.", hi: "बेहद खतरनाक। सर्च विज्ञापनों में अक्सर धोखाधड़ी वाले नंबर होते हैं।" },
      },
      {
        label: { en: "I ask in public online forums or search social media.", hi: "मैं सार्वजनिक ऑनलाइन मंचों पर पूछता हूँ या सोशल मीडिया पर खोजता हूँ।" },
        score: 8,
        insight: { en: "Risky. Scammers monitor social media to drop fake help numbers.", hi: "जोखिम भरा। स्कैमर्स फर्जी मदद नंबर देने के लिए सोशल मीडिया पर नजर रखते हैं।" },
      },
    ],
  },
  {
    id: "sq-12",
    question: {
      en: "What is the best way to secure your Aadhaar details from biometric fraud?",
      hi: "बायोमेट्रिक धोखाधड़ी से अपने आधार विवरण को सुरक्षित रखने का सबसे अच्छा तरीका क्या है?",
    },
    options: [
      {
        label: { en: "I lock my Aadhaar biometrics using mAadhaar or the UIDAI portal.", hi: "मैं mAadhaar या UIDAI पोर्टल से अपने आधार बायोमेट्रिक्स को लॉक रखता हूँ।" },
        score: 20,
        insight: { en: "Top-tier security. This blocks unauthorized Aadhaar-enabled payments (AePS).", hi: "सर्वोच्च सुरक्षा। यह अनधिकृत आधार-सक्षम भुगतान (AePS) को रोकता है।" },
      },
      {
        label: { en: "I share my unmasked Aadhaar card copy with service providers.", hi: "मैं सेवा प्रदाताओं के साथ बिना मास्क की गई आधार कार्ड की प्रति साझा करता हूँ।" },
        score: 6,
        insight: { en: "Risky. Scammers can use unmasked Aadhaar scans to issue fraudulent SIMs.", hi: "जोखिम भरा। स्कैमर्स अनमास्क आधार का उपयोग फर्जी सिम जारी करने के लिए कर सकते हैं।" },
      },
      {
        label: { en: "I do not use biometric locking as I trust the system.", hi: "मैं बायोमेट्रिक लॉक का उपयोग नहीं करता क्योंकि मुझे सिस्टम पर भरोसा है।" },
        score: 10,
        insight: { en: "Leaving biometrics unlocked by default leaves you exposed to AePS cloning scams.", hi: "बायोमेट्रिक्स अनलॉक छोड़ने से आप AePS क्लोनिंग स्कैम के प्रति संवेदनशील रहते हैं।" },
      },
    ],
  },
  {
    id: "sq-13",
    question: {
      en: "You receive a QR code on WhatsApp from someone who wants to buy your item. They ask you to scan it to receive payment. What is your reaction?",
      hi: "आपको व्हाट्सएप पर कोई QR कोड भेजकर कहता है कि भुगतान प्राप्त करने के लिए इसे स्कैन करें। आपकी क्या प्रतिक्रिया होगी?",
    },
    options: [
      {
        label: { en: "I refuse. Scanning QR codes is only for making payments, never receiving.", hi: "मैं मना करता हूँ। क्यूआर कोड केवल भुगतान करने के लिए होता है, प्राप्त करने के लिए नहीं।" },
        score: 20,
        insight: { en: "Excellent. Scammers exploit this misunderstanding to debit your account.", hi: "बहुत बढ़िया। स्कैमर्स इस गलतफहमी का फायदा उठाकर आपके खाते से पैसे निकाल लेते हैं।" },
      },
      {
        label: { en: "I scan it to see if the money reflects in my account.", hi: "मैं यह देखने के लिए स्कैन करता हूँ कि पैसा खाते में आता है या नहीं।" },
        score: 3,
        insight: { en: "Critical error. Entering your PIN after scanning will immediately deduct funds.", hi: "गंभीर गलती। स्कैन करने के बाद पिन डालने से आपके खाते से पैसे कट जाएंगे।" },
      },
      {
        label: { en: "I ask them to explain how it works first.", hi: "मैं उनसे पहले यह समझाने को कहता हूँ कि यह कैसे काम करता है।" },
        score: 8,
        insight: { en: "Risky. Scammers are trained to confuse you with technical jargon.", hi: "जोखिम भरा। स्कैमर्स तकनीकी शब्दावली से आपको भ्रमित करने में माहिर होते हैं।" },
      },
    ],
  },
  {
    id: "sq-14",
    question: {
      en: "How do you protect your mobile SIM card from SIM swap attacks?",
      hi: "आप अपने मोबाइल सिम कार्ड को सिम स्वैप हमलों से कैसे सुरक्षित रखते हैं?",
    },
    options: [
      {
        label: { en: "I set a SIM PIN and contact my operator if signals drop suddenly.", hi: "मैं सिम पिन सेट करता हूँ और सिग्नल गायब होने पर तुरंत ऑपरेटर से संपर्क करता हूँ।" },
        score: 20,
        insight: { en: "Perfect. Monitoring signal loss prevents scammers from hijacking OTPs.", hi: "सटीक। सिग्नल बंद होने की निगरानी करने से स्कैमर्स को ओटीपी हाईजैक करने से रोका जा सकता है।" },
      },
      {
        label: { en: "I wait for a few days to see if the signal returns.", hi: "मैं कुछ दिनों तक इंतजार करता हूँ कि सिग्नल वापस आता है या नहीं।" },
        score: 5,
        insight: { en: "Dangerous. If your SIM is deactivated, scammers can access all your OTPs.", hi: "खतरनाक। यदि आपका सिम बंद हो गया है, तो स्कैमर्स आपके सभी ओटीपी तक पहुंच सकते हैं।" },
      },
      {
        label: { en: "I do not set any PIN or password on my SIM card.", hi: "मैं अपने सिम कार्ड पर कोई पिन या पासवर्ड सेट नहीं करता हूँ।" },
        score: 10,
        insight: { en: "Standard risk. A SIM PIN adds a crucial layer of defense against physical theft and swaps.", hi: "सामान्य जोखिम। सिम पिन शारीरिक चोरी और स्वैप के खिलाफ सुरक्षा की एक महत्वपूर्ण परत है।" },
      },
    ],
  },
  {
    id: "sq-15",
    question: {
      en: "What is your approach to system software updates on your device?",
      hi: "आप अपने डिवाइस पर सिस्टम सॉफ्टवेयर अपडेट को लेकर क्या दृष्टिकोण अपनाते हैं?",
    },
    options: [
      {
        label: { en: "I install them immediately to patch security holes.", hi: "मैं सुरक्षा कमियों को दूर करने के लिए उन्हें तुरंत इंस्टॉल करता हूँ।" },
        score: 20,
        insight: { en: "Best practice. Software updates fix known security vulnerabilities.", hi: "सर्वोत्तम अभ्यास। सॉफ्टवेयर अपडेट ज्ञात सुरक्षा कमजोरियों को ठीक करते हैं।" },
      },
      {
        label: { en: "I delay updates because they take up storage or data.", hi: "मैं अपडेट टाल देता हूँ क्योंकि वे स्टोरेज या डेटा खर्च करते हैं।" },
        score: 10,
        insight: { en: "Vulnerable. Outdated systems are easy targets for exploit kits.", hi: "असुरक्षित। पुराने सिस्टम हैकर्स के लिए आसान निशाना होते हैं।" },
      },
      {
        label: { en: "I sideload security apps from third-party websites.", hi: "मैं थर्ड-पार्टी वेबसाइटों से सुरक्षा ऐप डाउनलोड करके इंस्टॉल करता हूँ।" },
        score: 2,
        insight: { en: "Extremely risky. Sideloaded APK files often contain hidden trojans or keyloggers.", hi: "अत्यधिक जोखिम भरा। अनधिकृत एपीके फाइलों में अक्सर छिपे हुए मैलवेयर होते हैं।" },
      },
    ],
  },
];
