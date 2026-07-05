export interface ThreatScenario {
  id: string;
  title: string;
  category: 'phishing' | 'upi' | 'identity' | 'job' | 'romance';
  icon: string;
  exampleText: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  emotionalTriggers: string[];
  deceitIndicators: string[];
  itActSections: string[];
  actionSteps: string[];
  legalAdvice: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StatusComponent {
  name: string;
  status: 'operational' | 'degraded' | 'maintenance' | 'offline';
  uptime: string;
  latency: string;
}

export const THREAT_SCENARIOS: ThreatScenario[] = [
  {
    id: 'sbi-kyc-phishing',
    title: 'Suspicious Bank KYC SMS',
    category: 'phishing',
    icon: 'ShieldAlert',
    exampleText: 'Dear Customer, Your SBI account has been suspended due to pending PAN/KYC verification. To reactivate, click here immediately to log in and upload documents: https://sbi-netbanking-verify.in/secure. Failing to do so within 2 hours will result in permanent closure.',
    severity: 'high',
    riskScore: 92,
    emotionalTriggers: [
      'Fear & Panic (Account suspended)',
      'Artificial Urgency (2-hour deadline)',
      'False Authority (Impersonating SBI Bank)'
    ],
    deceitIndicators: [
      'Non-official URL structure (ends with .in/secure instead of official bank domain)',
      'Use of threat of severe consequences (permanent account closure)',
      'Requesting sensitive credentials on an external landing page'
    ],
    itActSections: [
      'Section 66D of Information Technology Act (Cheating by personation using computer resource)',
      'Section 66C of IT Act (Identity theft by using other person\'s electronic signature/password)',
      'Section 318 & 319 of Bharatiya Nyaya Sanhita (BNS) (Cheating and cheating by impersonation)'
    ],
    actionSteps: [
      'DO NOT click the link or provide any login credentials/OTP.',
      'Report the sender ID and SMS copy to national cyber crime portal (cybercrime.gov.in).',
      'Contact your official bank branch or call the customer care number listed on the physical back of your debit card.',
      'If you already entered details, instantly freeze your account and debit card via official net banking or official bank app.'
    ],
    legalAdvice: 'Official banking institutions in India will NEVER send SMS messages demanding urgent document uploads via unofficial short-links. Under Indian law, banks must follow specific RBI guidelines for KYC renewals, none of which involve immediate remote account termination without formal prior notice.'
  },
  {
    id: 'upi-refund-scam',
    title: 'UPI Reverse Payment / Refund Fraud',
    category: 'upi',
    icon: 'IndianRupee',
    exampleText: 'Hey! I accidentally sent ₹5,000 to your Google Pay number instead of my brother\'s. I am a poor student and desperately need this back for my tuition. I have sent a UPI Money Refund Request. Just click on it in your GPay app, enter your UPI PIN, and the transaction will reverse immediately. Please help!',
    severity: 'critical',
    riskScore: 98,
    emotionalTriggers: [
      'Guilt & Sympathy (Accidental transfer, poor student tuition fee)',
      'Urgency & Emotional pressure ("desperately need this back")',
      'Confusion of technology mechanics (exploiting refund claims)'
    ],
    deceitIndicators: [
      'Asking to ENTER a UPI PIN to receive money (UPI PIN is ONLY required for SENDING or AUTHORIZING payments, never for receiving)',
      'Use of a "Pay Request / Debit Request" disguised as a credit transfer',
      'High-pressure communication bypassing formal bank reversals'
    ],
    itActSections: [
      'Section 66D of IT Act (Punishment for cheating by personation)',
      'Section 318 of BNS (Cheating and dishonesty)'
    ],
    actionSteps: [
      'NEVER enter your UPI PIN on any request claiming to be a refund or incoming payment.',
      'Verify your actual account balance first on your UPI app to check if you actually received any extra ₹5,000 (99% of the time, no money was ever sent to you).',
      'Decline the incoming pay request inside the UPI application and report/block the sender inside the app.',
      'If scammed, immediately call 1930 (National Cyber Crime Helpline) within the golden hour (first 2 hours) to freeze the fraudulent transfer.'
    ],
    legalAdvice: 'According to NPCI guidelines, money cannot be "pulled" back automatically by a stranger. Any merchant or individual asking you to enter your PIN to verify a payment credit is committing UPI fraud. Report this number to 1930 immediately to trigger the legal refund retrieval mechanics.'
  },
  {
    id: 'whatsapp-parttime-job',
    title: 'Part-Time WhatsApp Job Offer',
    category: 'job',
    icon: 'Briefcase',
    exampleText: 'Hello, I am HR manager from Google Ads India. We are recruiting part-time employees. You can work from home on your phone. Just like and subscribe to YouTube videos we send. Earn ₹1,500 for 1 hour, and up to ₹15,000/day. No experience needed. Click this link to start on WhatsApp: http://wa.me/919988776655?text=I-am-interested',
    severity: 'high',
    riskScore: 85,
    emotionalTriggers: [
      'Greed (Extreme pay for zero skill or effort)',
      'Familiarity (Leveraging Google Ads brand trust)',
      'Low barrier to entry (No interview, standard social tasks)'
    ],
    deceitIndicators: [
      'Using a standard personal phone number instead of a verified corporate domain or official business account',
      'Absurd compensation metrics (₹15,000 daily for YouTube likes is economically impossible)',
      'Vague redirect links prompting conversational chat instead of standard HR recruitment portals'
    ],
    itActSections: [
      'Section 66D of IT Act (Identity fraud and computer cheating)',
      'Section 318 & 319 of BNS (Cheating by impersonation)'
    ],
    actionSteps: [
      'Ignore the message, block the number, and report it as spam on WhatsApp.',
      'Never send "processing fees", "security deposit", or "VIP membership upgrade fee" to withdraw earnings. This is a task-completion pyramid scam.',
      'Do not share your bank account statement, Aadhaar, or PAN with unverified individuals offering quick money.',
      'Report the fraudulent transaction and details to cybercrime.gov.in.'
    ],
    legalAdvice: 'Employment fraud involving social media task marketing has spiked by 400% in India. Legally, any employer demanding you deposit money to "unlock" higher-paying tasks is violating labor guidelines and committing criminal fraud under the IT Act.'
  },
  {
    id: 'romance-customs-fraud',
    title: 'Impersonation Customs Clearance Scam',
    category: 'romance',
    icon: 'HeartHandshake',
    exampleText: 'Dear, I have sent you a surprise package from London containing an iPhone 15, gold jewelry, and £5,000 cash for your birthday. However, I got a call from Delhi Indira Gandhi International Airport Customs. They say the package is seized for custom duty of ₹45,000. You must pay this fee immediately to account number 1122334455 or they will arrest us both for illegal smuggling.',
    severity: 'critical',
    riskScore: 95,
    emotionalTriggers: [
      'Sympathy & Affection (Cultivating online romance or friendship)',
      'Sudden Threat of Prosecution (Arrest for illegal smuggling)',
      'Urgency (Immediate payment requested to personal bank account)'
    ],
    deceitIndicators: [
      'Customs officials calling from normal mobile numbers',
      'Demanding payment of government custom duties to a PERSONAL bank account instead of official ICEGATE portal',
      'Blackmail using photos of fake cargo tracking slips and threatening arrest'
    ],
    itActSections: [
      'Section 66D of IT Act (Computer-assisted cheating)',
      'Section 308 of BNS (Extortion / blackmail)',
      'Section 319 of BNS (Impersonating a customs official)'
    ],
    actionSteps: [
      'Block the person immediately. It is a 100% fake identity and parcel scam.',
      'Indian Customs Department NEVER demands duty fees via personal mobile chats, nor does it accept payments into individual bank accounts.',
      'Do not pay a single rupee. Any subsequent caller claiming to be an "Air Customs Officer" threatening arrest is an imposter.',
      'File an online cyber complaint immediately at cybercrime.gov.in attaching chat screenshots and bank account details provided by the fraudster.'
    ],
    legalAdvice: 'Under CBI and CBIC (Central Board of Indirect Taxes and Customs) rules, official duty collection is strictly tracked and deposited only through authorized bank portals. Threats of arrest for courier seizure are a classic extortion technique. Under Section 308 of BNS, this is punishable by up to 3 years of imprisonment.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'You receive an urgent phone call from someone claiming to be your bank manager. They ask for your 6-digit OTP to block an unauthorized transaction of ₹25,000 on your card. What should you do?',
    options: [
      'Provide the OTP immediately to stop the transaction.',
      'Hang up, block the number, and check your official net-banking app.',
      'Give them a fake OTP to test if they are real.',
      'Ask them to call back in 15 minutes while you think.'
    ],
    correctIndex: 1,
    explanation: 'Banks, RBI, or security officials will NEVER call and request an OTP. Sharing an OTP gives fraudsters full access to authorize payments. Your safest response is to hang up immediately.'
  },
  {
    id: 2,
    question: 'Under Indian Cyber Law (Information Technology Act), which section deals with "punishment for identity theft" such as using someone else\'s password, UPI PIN, or digital signature?',
    options: [
      'Section 43 (Damage to computer system)',
      'Section 66C (Identity theft)',
      'Section 67 (Publishing obscene material)',
      'Section 72 (Breach of confidentiality)'
    ],
    correctIndex: 1,
    explanation: 'Section 66C of the IT Act explicitly prescribes up to 3 years of imprisonment and a fine of up to ₹1 Lakh for dishonest or fraudulent use of another person\'s identity, including passwords and PINs.'
  },
  {
    id: 3,
    question: 'A friend WhatsApps you saying they are in an emergency and requests you to tap a link to approve a Google Pay transfer to help them. You tap the link and GPay asks for your UPI PIN. What does this mean?',
    options: [
      'You are receiving money from your friend.',
      'You are registering a complaint with GPay.',
      'You are authorizing money to be DEBITED from your account.',
      'It is just a standard system security check.'
    ],
    correctIndex: 2,
    explanation: 'Entering your UPI PIN ALWAYS means money is leaving your account. You NEVER need to enter a UPI PIN or scan a QR code to receive money. This is a common payment request scam.'
  }
];

export const SAATHI_AI_RESPONSES: Record<string, string> = {
  default: `I am **Saathi AI**, CyberSaathi's Cyber Safety Companion. I am here to help you navigate digital threats. 

If you are experiencing a cybercrime, remember:
1. **Report it immediately**: Call the National Helpline **1930** or log on to **cybercrime.gov.in**.
2. **Preserve evidence**: Take screenshots of chats, transactions, URLs, and profiles. Do not delete them.
3. **Freeze accounts**: If financial information was compromised, contact your bank to freeze cards and UPI instantly.

How else can I assist you with safety practices or legal recourse today?`,

  cyberbullying: `Cyberbullying and online harassment are serious offenses under Indian law. If you or someone you know is being targeted, please follow these steps:

1. **Document and Preserve**: Screenshot all abusive messages, comments, profiles, and emails. Keep the URLs of the profiles.
2. **Do Not Retaliate**: Avoid responding or engaging, as perpetrators often seek a reaction.
3. **Block and Report**: Use the in-platform block and report features on Instagram, WhatsApp, Facebook, etc.
4. **Legal Recourse**: 
   - Under **Section 66E of the IT Act** (Violation of privacy) and **Section 354D of the IPC / Section 78 of BNS** (Stalking), the perpetrator can be prosecuted.
   - For women and children, cybercrime.gov.in allows **anonymous reporting** of cyber harassment.
   - You can also write a complaint to the National Commission for Women (NCW).`,

  financial_fraud: `If you have lost money to a UPI, credit card, net-banking, or KYC scam, every minute counts:

1. **The Golden Hour Rule**: If you call the National Cyber Crime Helpline **1930** within **2 hours** of the fraud, law enforcement has a high chance of blocking the funds in the receiver's account before they withdraw it.
2. **Contact Bank**: Immediately lock your cards, UPI, and bank account using your bank's official emergency toll-free number or mobile app.
3. **Draft Complaint**: Register a complaint on **cybercrime.gov.in**. Keep details ready: Transaction ID, date, bank name, fraudster's mobile number/UPI ID, and SMS screenshot.
4. **Legal Provisions**: This falls under **Section 66D of the IT Act** (Cheating by personation) and **Section 318 of BNS** (Cheating). You are entitled to file an FIR at your local Cyber Police Station.`,

  kyc_scam: `KYC update scams are extremely common in India. Fraudsters impersonate SBI, HDFC, Paytm, or BSNL officers.

**Key Safety Rules**:
1. **Verify Sender**: Official bank messages come with a verified sender ID (e.g., 'SBI-SMS', 'HDFC-BK') and never from normal 10-digit mobile numbers or WhatsApp profiles.
2. **No Urgency**: Banks will never threaten to block your account in 2 hours via a simple SMS.
3. **No Shortlinks**: Never log into netbanking using links in SMS like 'sbi-net-kyc.xyz'. Always type the official URL manually (e.g., 'onlinesbi.sbi').
4. **Legal Stand**: Under RBI regulations, you are fully protected from liability if you report third-party bank breaches immediately. If you entered details, contact your bank to freeze credentials instantly.`
};

export const FAQ_ITEMS = [
  {
    q: 'What is CyberSaathi?',
    a: 'CyberSaathi is a comprehensive Cyber Safety Ecosystem designed to empower, educate, and assist Indian citizens and organizations. By combining AI technology, legal expertise under the IT Act, and accessible community resources, we act as your companion ("Saathi") to prevent cybercrimes and provide structured guidance if you are victimized.'
  },
  {
    q: 'Is CyberSaathi a government agency?',
    a: 'No, CyberSaathi is a private startup/initiative focused on cyber safety awareness, legal guidance, and technology-driven safety tools. However, we guide users on how to officially report cybercrimes directly to the National Cyber Crime Portal (cybercrime.gov.in) operated by the Ministry of Home Affairs, Government of India.'
  },
  {
    q: 'How does the Scam Analyzer work?',
    a: 'The Scam Analyzer leverages specific semantic models trained on real cyber crime case reports, Indian IT Act clauses, and common psychological triggers (urgency, greed, fear). When you paste a suspicious message or call transcript, it evaluates the risk score, highlights deception indicators, outlines the relevant legal statutes, and provides an immediate safety checklist.'
  },
  {
    q: 'What is the "Golden Hour" in financial cyber fraud?',
    a: 'The "Golden Hour" refers to the first 2 hours immediately following a fraudulent financial transaction (UPI transfer, card swipe, OTP theft). If reported to the helpline 1930 within this window, cyber cells can communicate directly with payment gateways to freeze the stolen funds before they are routed or cashed out by fraudsters.'
  },
  {
    q: 'Is my data safe when using CyberSaathi?',
    a: 'Absolutely. CyberSaathi adheres to strict privacy-by-design principles. We do not store financial credentials or private user-identifiable information. Our interactive playpens run entirely in sandboxed environments, and our models do not train on your private conversation inputs. We are committed to data sovereignty under the Indian Digital Personal Data Protection (DPDP) Act.'
  }
];

export const ROADMAP_STEPS = [
  {
    phase: 'Phase 1: Foundation (Q3 2026)',
    title: 'Awareness & Playpens',
    desc: 'Launch of the CyberSaathi marketing hub, interactive Scam Analyzer simulators, multilingual cyber hygiene guides, and immediate helpline routing.'
  },
  {
    phase: 'Phase 2: Intelligence (Q4 2026)',
    title: 'Legal AI Drafting Engine',
    desc: 'Deploying an advanced AI legal drafter that helps victims structure a formal cyber complaint with correct IT Act sections to submit directly to police or court.'
  },
  {
    phase: 'Phase 3: Ecosystem (Q1 2027)',
    title: 'Saathi Mobile App & API',
    desc: 'Releasing the CyberSaathi iOS & Android application featuring real-time SMS spam scanning, call risk indicators, and direct regional cyber cell integration.'
  },
  {
    phase: 'Phase 4: Sovereign Scaling (Q2 2027)',
    title: 'State & Language Integration',
    desc: 'Partnering with state police departments and regional organizations to localize Saathi AI in 12 major Indian languages and connect local support cells.'
  }
];

export const STATUS_COMPONENTS: StatusComponent[] = [
  { name: 'Saathi AI Engine', status: 'operational', uptime: '99.94%', latency: '240ms' },
  { name: 'Scam Analyzer Service', status: 'operational', uptime: '99.98%', latency: '180ms' },
  { name: 'IT Act Legal Vector DB', status: 'operational', uptime: '100%', latency: '45ms' },
  { name: 'National Incident Routing API', status: 'operational', uptime: '99.91%', latency: '350ms' },
  { name: 'Customer Support Portal', status: 'operational', uptime: '99.95%', latency: '120ms' }
];
