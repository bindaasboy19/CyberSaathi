import type { Language, LegalComplaintDraft } from "@/types";

export type LegalCaseInput = {
  description: string;
  incidentDate?: string;
  transactionDetails?: string;
  amountLost?: string;
  contactMethod?: string;
  platform?: string;
  evidenceNotes?: string;
  language: Language;
};

const problemRules = [
  {
    type: "UPI fraud",
    pattern: /\b(upi|utr|collect request|qr|payment app|phonepe|gpay|paytm|bank transfer)\b/i,
  },
  {
    type: "phishing",
    pattern: /\b(phishing|link|kyc|sms|email|fake website|credential|otp|pin|cvv)\b/i,
  },
  {
    type: "account hacking",
    pattern: /\b(hacked|login|password|account takeover|instagram|whatsapp|facebook|email)\b/i,
  },
  {
    type: "identity theft",
    pattern: /\b(aadhaar|pan|identity|kyc document|loan|sim|id proof)\b/i,
  },
  {
    type: "online harassment",
    pattern: /\b(threat|blackmail|harass|morph|intimate|sextortion|abuse)\b/i,
  },
  {
    type: "malware or remote access",
    pattern: /\b(anydesk|teamviewer|remote access|apk|malware|screen share|quicksupport)\b/i,
  },
];

const baseEvidence = [
  "Screenshots of suspicious messages, emails, profiles, links, or app screens",
  "Phone numbers, email addresses, user IDs, URLs, and profile links used by the suspect",
  "Timeline of events with date, time, and sequence of actions",
  "Device details and app names involved in the incident",
];

const evidenceByType: Record<string, string[]> = {
  "UPI fraud": [
    "UPI transaction ID, UTR, amount, beneficiary name, and payment app screenshot",
    "Bank statement showing the disputed debit",
    "Complaint or service request number from bank or payment app support",
  ],
  phishing: [
    "Full phishing URL and sender details",
    "Screenshots before deleting the SMS, email, or web page",
    "Password reset confirmations or account alert emails, if any",
  ],
  "account hacking": [
    "Login alerts, password reset emails, and device/session history",
    "Screenshots of unauthorized posts, messages, or changed profile details",
    "Recovery request numbers from the affected platform",
  ],
  "identity theft": [
    "Copy of disputed KYC, loan, SIM, or account communication",
    "Credit report entry, lender message, or telecom proof showing misuse",
    "Masked identity document copy used for legitimate verification, if relevant",
  ],
  "online harassment": [
    "Chat logs, threatening messages, profile links, and timestamps",
    "Screenshots showing repeated contact or coercive demands",
    "Any payment demands, account numbers, or blackmail material references",
  ],
  "malware or remote access": [
    "Installed app name, APK source, permissions, and installation time",
    "Bank or account alerts after remote access started",
    "Screenshots or logs from support calls and screen-sharing sessions",
  ],
};

const lawsByType: Record<string, string[]> = {
  "UPI fraud": [
    "IT Act provisions around identity misuse and unauthorized access may be relevant.",
    "IPC provisions on cheating and impersonation may be considered by authorities.",
  ],
  phishing: [
    "IT Act provisions may apply where credentials, identity, or systems are misused.",
    "IPC provisions on cheating and dishonest inducement may be relevant.",
  ],
  "account hacking": [
    "IT Act provisions on unauthorized access and data misuse may be relevant.",
    "Platform terms and police complaint records help establish account takeover.",
  ],
  "identity theft": [
    "IT Act identity misuse provisions and IPC cheating provisions may be relevant.",
    "Financial or telecom disputes may need parallel escalation to the provider.",
  ],
  "online harassment": [
    "IT Act and criminal law provisions may apply depending on threats, images, coercion, or extortion.",
    "If personal safety is at risk, immediate police escalation is appropriate.",
  ],
  "malware or remote access": [
    "Unauthorized access, data theft, and fraud-related provisions may be relevant.",
    "Device forensic evidence can help show how access was gained.",
  ],
  "general cybercrime": [
    "IT Act provisions may apply depending on unauthorized access, identity misuse, or data compromise.",
    "IPC provisions may apply where cheating, impersonation, threats, or extortion are involved.",
  ],
};

export function classifyLegalProblem(description: string) {
  return problemRules.find((rule) => rule.pattern.test(description))?.type ?? "general cybercrime";
}

export function getEvidenceChecklist(problemType: string) {
  return [...baseEvidence, ...(evidenceByType[problemType] ?? [])];
}

function buildTransactionLine(input: LegalCaseInput) {
  const pieces = [
    input.amountLost ? `Amount involved: ${input.amountLost}` : null,
    input.transactionDetails ? `Transaction details: ${input.transactionDetails}` : null,
    input.platform ? `Platform/app: ${input.platform}` : null,
    input.contactMethod ? `Contact method: ${input.contactMethod}` : null,
  ].filter(Boolean);

  return pieces.length ? pieces.join("; ") : "Transaction details are not available yet.";
}

export function buildLegalComplaintDraft(input: LegalCaseInput): LegalComplaintDraft {
  const problemType = classifyLegalProblem(input.description);
  const evidenceList = getEvidenceChecklist(problemType);
  const dateTime = input.incidentDate?.trim() || "Date/time to be confirmed by complainant";
  const transactionDetails = buildTransactionLine(input);
  const evidenceNotes = input.evidenceNotes
    ? ` Additional evidence notes: ${input.evidenceNotes}`
    : "";
  const incidentSummary = `${input.description}${evidenceNotes}`;

  const complaintText = `To,
The Cyber Crime Cell / Police Station,

Subject: Complaint regarding ${problemType}

I request registration and investigation of a cybercrime incident. The incident appears to involve ${problemType}. Incident summary: ${incidentSummary}

Date/time of incident: ${dateTime}
Transaction/account details: ${transactionDetails}

Evidence available: ${evidenceList.join("; ")}.

I request urgent assistance to preserve evidence, trace the involved accounts/devices/phone numbers, and guide recovery or blocking steps where applicable. I understand that this draft is prepared using an AI guidance tool and may be reviewed by the complainant before filing.

Complainant name:
Mobile number:
Email:
Address:
Signature:`;

  return {
    problemType,
    incidentSummary,
    dateTime,
    transactionDetails,
    evidenceList,
    complaintText,
    immediateActions: [
      "Block or freeze affected bank account, card, UPI ID, wallet, or compromised account immediately.",
      "Change passwords and revoke active sessions on email, banking, and social accounts.",
      "Preserve screenshots, transaction IDs, call logs, links, and chat history before deleting anything.",
      "Call 1930 quickly if money was lost or a transaction is still traceable.",
    ],
    reportingSteps: [
      "File a complaint at https://cybercrime.gov.in with the incident summary and evidence.",
      "Use the 1930 helpline for urgent financial fraud reporting.",
      "Inform the bank, wallet, platform, or telecom provider through official support channels.",
      "Visit the nearest police station or cyber cell for FIR guidance if money, identity, safety, or extortion is involved.",
    ],
    safetyPrecautions: [
      "Do not contact the suspect again from your main number.",
      "Do not share OTP, UPI PIN, passwords, screen access, or device control with anyone.",
      "Keep original evidence files and screenshots unchanged where possible.",
      "Monitor bank statements, credit reports, and account login alerts for follow-up misuse.",
    ],
    relevantLaws: lawsByType[problemType] ?? lawsByType["general cybercrime"],
    userRights: [
      "You can preserve evidence and file an online complaint through the national cybercrime portal.",
      "You can request the bank or platform to block suspicious transactions or accounts through official channels.",
      "You can ask police or the cyber cell for FIR or complaint acknowledgement guidance based on the facts.",
      "You may consult a licensed lawyer for formal legal advice or court-related strategy.",
    ],
    followUpQuestions: [
      "When did the incident happen, including approximate time?",
      "Was any money lost, and do you have UTR or transaction IDs?",
      "Which phone number, profile, email, app, website, or account was used by the suspect?",
      "Have you already contacted the bank, platform, 1930, or cybercrime.gov.in?",
    ],
  };
}

export function buildLegalFallbackReply(input: LegalCaseInput) {
  const draft = buildLegalComplaintDraft(input);

  if (input.language === "hi") {
    return `यह ${draft.problemType} जैसा मामला लग रहा है। मैं लाइसेंस प्राप्त वकील नहीं हूं, लेकिन आप तुरंत ये कदम लें: ${draft.immediateActions.join(" ")} शिकायत के लिए cybercrime.gov.in, 1930, बैंक/प्लेटफॉर्म सपोर्ट और जरूरत पड़ने पर नजदीकी पुलिस स्टेशन का उपयोग करें।`;
  }

  return `This looks like ${draft.problemType}. I am not a licensed lawyer, but your next practical steps are: ${draft.immediateActions.join(" ")} For filing, use cybercrime.gov.in, 1930, official bank/platform support, and your nearest police station or cyber cell where needed.`;
}
