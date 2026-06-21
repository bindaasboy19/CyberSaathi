"use client";

import { ExternalLink, Search, ShieldCheck, Landmark, Globe, AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

type Portal = {
  id: string;
  name: { en: string; hi: string };
  ministry: { en: string; hi: string };
  url: string;
  category: "cybercrime" | "telecom" | "financial" | "digital-services";
  description: { en: string; hi: string };
  features: { en: string[]; hi: string[] };
};

const portalsData: Portal[] = [
  {
    id: "ncrp",
    name: {
      en: "National Cyber Crime Reporting Portal",
      hi: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल",
    },
    ministry: {
      en: "Ministry of Home Affairs (MHA)",
      hi: "गृह मंत्रालय (MHA)",
    },
    url: "https://cybercrime.gov.in",
    category: "cybercrime",
    description: {
      en: "The primary national portal to report cybercrimes online, with a focus on financial fraud, identity theft, and crimes targeting women and children.",
      hi: "ऑनलाइन साइबर अपराधों की रिपोर्ट करने का प्राथमिक राष्ट्रीय पोर्टल, जिसमें मुख्य रूप से वित्तीय धोखाधड़ी, पहचान की चोरी और महिलाओं एवं बच्चों को लक्षित करने वाले अपराध शामिल हैं।",
    },
    features: {
      en: [
        "Report anonymous complaints regarding online abuses",
        "Report financial fraud immediately to trigger bank freezes",
        "Track complaint status online",
      ],
      hi: [
        "ऑनलाइन दुर्व्यवहार के संबंध में गुमनाम शिकायतें दर्ज करें",
        "बैंक खातों को फ्रीज कराने के लिए वित्तीय धोखाधड़ी की तुरंत रिपोर्ट करें",
        "अपनी शिकायत की स्थिति ऑनलाइन ट्रैक करें",
      ],
    },
  },
  {
    id: "cert",
    name: {
      en: "CERT-In (Indian Computer Emergency Response Team)",
      hi: "सर्ट-इन (भारतीय कंप्यूटर आपातकालीन प्रतिक्रिया टीम)",
    },
    ministry: {
      en: "Ministry of Electronics & Information Technology (MeitY)",
      hi: "इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय (MeitY)",
    },
    url: "https://www.cert-in.org.in",
    category: "cybercrime",
    description: {
      en: "The national nodal agency for responding to computer security incidents, blocking malicious content, issuing threat advisories, and analyzing phishing links.",
      hi: "कंप्यूटर सुरक्षा घटनाओं पर प्रतिक्रिया देने, दुर्भावनापूर्ण सामग्री को ब्लॉक करने, सुरक्षा चेतावनियाँ जारी करने और फिशिंग लिंक का विश्लेषण करने के लिए राष्ट्रीय नोडल एजेंसी।",
    },
    features: {
      en: [
        "Report malware, ransomware, or security vulnerabilities",
        "Check official warnings on active security threats",
        "Submit suspicious software or links for security inspection",
      ],
      hi: [
        "मैलवेयर, रैंसमवेयर या सुरक्षा कमजोरियों की रिपोर्ट करें",
        "सक्रिय सुरक्षा खतरों पर आधिकारिक चेतावनियाँ देखें",
        "सुरक्षा जांच के लिए संदिग्ध सॉफ़्टवेयर या लिंक सबमिट करें",
      ],
    },
  },
  {
    id: "sanchar",
    name: {
      en: "Sanchar Saathi Portal",
      hi: "संचार साथी पोर्टल",
    },
    ministry: {
      en: "Department of Telecommunications (DoT)",
      hi: "दूरसंचार विभाग (DoT)",
    },
    url: "https://sancharsaathi.gov.in",
    category: "telecom",
    description: {
      en: "A citizen-centric initiative that empowers mobile subscribers to trace stolen devices, verify mobile connections registered in their name, and block spam SIMs.",
      hi: "एक नागरिक-केंद्रित पहल जो मोबाइल ग्राहकों को चोरी हुए उपकरणों को खोजने, उनके नाम पर पंजीकृत मोबाइल कनेक्शनों को सत्यापित करने और स्पैम सिम को ब्लॉक करने में सक्षम बनाती है।",
    },
    features: {
      en: [
        "CEIR (Central Equipment Identity Register) to block lost/stolen mobile phones",
        "TAFCOP to see connections registered on your ID card",
        "Identify and block unauthorized SIM connections",
      ],
      hi: [
        "खोए/चोरी हुए मोबाइल फोन को ब्लॉक करने के लिए CEIR सेवा",
        "आपके आईडी कार्ड पर पंजीकृत कनेक्शन देखने के लिए TAFCOP सेवा",
        "अनधिकृत सिम कनेक्शनों की पहचान करें और उन्हें ब्लॉक करें",
      ],
    },
  },
  {
    id: "chakshu",
    name: {
      en: "Chakshu Facility (Sanchar Saathi)",
      hi: "चक्षु सुविधा (संचार साथी)",
    },
    ministry: {
      en: "Department of Telecommunications (DoT)",
      hi: "दूरसंचार विभाग (DoT)",
    },
    url: "https://sancharsaathi.gov.in/sancharsaathi/",
    category: "telecom",
    description: {
      en: "A specialized platform dedicated entirely to reporting suspected fraud communications received over Calls, SMS, or WhatsApp (such as fake KYC alerts, lottery claims, or impersonations).",
      hi: "कॉल, एसएमएस या व्हाट्सएप पर प्राप्त संदिग्ध धोखाधड़ी वाले संदेशों (जैसे फर्जी केवाईसी अलर्ट, लॉटरी दावे, या प्रतिरूपण) की रिपोर्ट करने के लिए विशेष रूप से समर्पित प्लेटफॉर्म।",
    },
    features: {
      en: [
        "Report suspected fraud messages and phishing links before losing money",
        "Report fraudulent customer support scams and fake KYC requests",
        "Flags spam numbers directly to telecom operators",
      ],
      hi: [
        "पैसे खोने से पहले संदिग्ध धोखाधड़ी वाले संदेशों और फिशिंग लिंक की रिपोर्ट करें",
        "धोखाधड़ी वाले कस्टमर सपोर्ट स्कैम और फर्जी केवाईसी अनुरोधों की रिपोर्ट करें",
        "स्पैम नंबरों को सीधे दूरसंचार ऑपरेटरों को रिपोर्ट करता है",
      ],
    },
  },
  {
    id: "rbi",
    name: {
      en: "RBI Kehta Hai (Reserve Bank of India)",
      hi: "आरबीआई कहता है (भारतीय रिजर्व बैंक)",
    },
    ministry: {
      en: "Reserve Bank of India (RBI)",
      hi: "भारतीय रिजर्व बैंक (RBI)",
    },
    url: "https://rbi.org.in/commonman/",
    category: "financial",
    description: {
      en: "RBI's public education portal designed to create financial literacy. It details banking security protocols, secure digital payment rules, and user rights in financial disputes.",
      hi: "वित्तीय साक्षरता पैदा करने के लिए डिज़ाइन किया गया आरबीआई का जनशिक्षा पोर्टल। यह बैंकिंग सुरक्षा नियमों, सुरक्षित डिजिटल भुगतान आदतों और विवादों में उपयोगकर्ताओं के अधिकारों की जानकारी देता है।",
    },
    features: {
      en: [
        "Understand banking safety guidelines and check-clearing rules",
        "Learn rules for full refund during unauthorized banking transactions",
        "Access official banking ombudsman links for resolving complaints",
      ],
      hi: [
        "बैंकिंग सुरक्षा नियमों और चेक क्लीयरिंग नियमों को समझें",
        "अनधिकृत बैंकिंग लेनदेन के दौरान पूर्ण रिफंड प्राप्त करने के नियम जानें",
        "शिकायतों के समाधान के लिए आधिकारिक बैंकिंग लोकपाल लिंक तक पहुंचें",
      ],
    },
  },
  {
    id: "nciipc",
    name: {
      en: "NCIIPC Portal",
      hi: "एनसीआईआईपीसी पोर्टल",
    },
    ministry: {
      en: "National Critical Information Infrastructure Protection Centre",
      hi: "राष्ट्रीय महत्वपूर्ण सूचना अवसंरचना संरक्षण केंद्र",
    },
    url: "https://nciipc.gov.in",
    category: "cybercrime",
    description: {
      en: "India's national agency responsible for protecting critical infrastructure (power, banking, defense, telecom). Citizens and security researchers can report threats or system vulnerabilities here.",
      hi: "भारत की राष्ट्रीय एजेंसी जो महत्वपूर्ण बुनियादी ढाँचे (बिजली, बैंकिंग, रक्षा, दूरसंचार) की सुरक्षा के लिए ज़िम्मेदार है। नागरिक और सुरक्षा शोधकर्ता यहाँ सिस्टम की कमियों की रिपोर्ट कर सकते हैं।",
    },
    features: {
      en: [
        "Report vulnerabilities in government or public sector IT systems",
        "Understand guidelines for critical infrastructure safety",
        "Access technical whitepapers on security standards",
      ],
      hi: [
        "सरकारी या सार्वजनिक क्षेत्र के आईटी सिस्टम में कमियों की रिपोर्ट करें",
        "महत्वपूर्ण बुनियादी ढांचे की सुरक्षा के दिशानिर्देशों को समझें",
        "सुरक्षा मानकों पर तकनीकी श्वेतपत्र प्राप्त करें",
      ],
    },
  },
  {
    id: "digilocker",
    name: {
      en: "DigiLocker",
      hi: "डिजिलॉकर",
    },
    ministry: {
      en: "Ministry of Electronics & Information Technology (MeitY)",
      hi: "इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय (MeitY)",
    },
    url: "https://www.digilocker.gov.in",
    category: "digital-services",
    description: {
      en: "A cloud-based document wallet enabling citizens to access digitally signed official documents directly from issuer databases, eliminating physical paper dependencies securely.",
      hi: "एक क्लाउड-आधारित दस्तावेज़ वॉलेट जो नागरिकों को सीधे जारीकर्ता डेटाबेस से डिजिटल रूप से हस्ताक्षरित आधिकारिक दस्तावेज़ों तक पहुँचने में सक्षम बनाता है, जिससे कागजों पर निर्भरता सुरक्षित रूप से समाप्त होती है।",
    },
    features: {
      en: [
        "Store digital Aadhaar, Driving License, PAN, and certificates safely",
        "Secure biometric and pin-based access to personal credentials",
        "Reduce identity theft risk by using official digital documents",
      ],
      hi: [
        "डिजिटल आधार, ड्राइविंग लाइसेंस, पैन और प्रमाण पत्र सुरक्षित रूप से सहेजें",
        "व्यक्तिगत दस्तावेजों तक सुरक्षित बायोमेट्रिक और पिन-आधारित पहुंच",
        "आधिकारिक डिजिटल दस्तावेजों का उपयोग करके पहचान चोरी के जोखिम को कम करें",
      ],
    },
  },
  {
    id: "cyberdost",
    name: {
      en: "CyberDost (MHA Cyber Safety Initiative)",
      hi: "साइबर दोस्त (गृह मंत्रालय की साइबर सुरक्षा पहल)",
    },
    ministry: {
      en: "Ministry of Home Affairs (MHA)",
      hi: "गृह मंत्रालय (MHA)",
    },
    url: "https://www.cyberdost.gov.in",
    category: "digital-services",
    description: {
      en: "The MHA's cyber safety handle and resources repository, which generates active safety awareness campaigns via handbooks, warning posters, and guides on daily cyber hygiene.",
      hi: "गृह मंत्रालय का साइबर सुरक्षा जागरूकता हैंडल और संसाधन भंडार, जो पुस्तिकाओं, चेतावनी पोस्टरों और दैनिक साइबर आदतों पर गाइडों के माध्यम से सुरक्षा जागरूकता अभियान चलाता है।",
    },
    features: {
      en: [
        "Download free official Cyber Safety Handbooks for students and businesses",
        "Access safety brochures on phishing, social hacking, and online parenting",
        "Get direct tips from Ministry campaigns regarding ongoing scam types",
      ],
      hi: [
        "छात्रों और व्यवसायों के लिए मुफ्त आधिकारिक साइबर सुरक्षा पुस्तिकाएं डाउनलोड करें",
        "फिशिंग, सोशल हैकिंग और पैरेंटिंग से जुड़े सुरक्षा ब्रोशर प्राप्त करें",
        "सक्रिय स्कैम के प्रकारों के संबंध में मंत्रालय के अभियानों से सीधे सुझाव प्राप्त करें",
      ],
    },
  },
];

const categories = [
  { value: "all", label: { en: "All Portals", hi: "सभी पोर्टल" } },
  { value: "cybercrime", label: { en: "Cybercrime & Security", hi: "साइबर अपराध और सुरक्षा" } },
  { value: "telecom", label: { en: "Telecom & Devices", hi: "दूरसंचार और उपकरण" } },
  { value: "financial", label: { en: "Financial Safety", hi: "वित्तीय सुरक्षा" } },
  { value: "digital-services", label: { en: "Digital Services", hi: "डिजिटल सेवाएं" } },
];

export default function PortalsPage() {
  const { pick, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPortals = useMemo(() => {
    return portalsData.filter((portal) => {
      const matchesCategory = activeCategory === "all" || portal.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        portal.name[language].toLowerCase().includes(query) ||
        portal.description[language].toLowerCase().includes(query) ||
        portal.ministry[language].toLowerCase().includes(query) ||
        portal.url.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, language]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow={pick({ en: "Official Directory", hi: "आधिकारिक निर्देशिका" })}
        title={pick({
          en: "Indian Government Safety Portals",
          hi: "भारत सरकार के सुरक्षा पोर्टल",
        })}
        description={pick({
          en: "Access verified government resources, report digital crimes, track lost mobile phones, or learn official security guidelines.",
          hi: "सत्यापित सरकारी संसाधनों तक पहुँचें, डिजिटल अपराधों की रिपोर्ट करें, खोए हुए मोबाइल फोन ट्रैक करें, या आधिकारिक सुरक्षा दिशानिर्देश जानें।",
        })}
      />

      {/* Safety Alert Warning */}
      <div className="rounded-[28px] border border-amber-200/60 bg-amber-50/50 p-4 flex items-start gap-3 text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/10 dark:text-amber-100">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="text-xs leading-6">
          <p className="font-bold">
            {pick({ en: "Always verify URL domains", hi: "हमेशा यूआरएल डोमेन का सत्यापन करें" })}
          </p>
          <p className="mt-0.5 text-slate-600 dark:text-slate-300">
            {pick({
              en: "Government domains in India end with .gov.in or .nic.in. Never trust support services on private domains or generic numbers.",
              hi: "भारत में सरकारी डोमेन .gov.in या .nic.in पर समाप्त होते हैं। निजी डोमेन या सामान्य नंबरों पर चल रहे सहायता दावों पर कभी भरोसा न करें।",
            })}
          </p>
        </div>
      </div>

      {/* Search and filter controls */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            className="w-full rounded-[24px] border border-slate-200 bg-white/70 py-3 pl-12 pr-4 text-sm font-medium shadow-sm transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:focus:border-sky-400"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={pick({ en: "Search portals by name, services, or ministry...", hi: "पोर्टल नाम, सेवाओं या मंत्रालय द्वारा खोजें..." })}
            value={searchQuery}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                className={`inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  isActive
                    ? "border-sky-500 bg-sky-500 text-white shadow-md"
                    : "border-slate-200 bg-white/60 text-slate-600 hover:border-sky-200 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:border-slate-700"
                }`}
                onClick={() => setActiveCategory(cat.value)}
                type="button"
              >
                {pick(cat.label)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Portals Grid */}
      {filteredPortals.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredPortals.map((portal) => (
            <Card
              key={portal.id}
              className="flex flex-col border border-slate-200/80 bg-white/50 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01] dark:border-slate-800 dark:bg-slate-950/50"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                    {portal.category === "cybercrime" ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : portal.category === "financial" ? (
                      <Landmark className="h-5 w-5" />
                    ) : portal.category === "telecom" ? (
                      <Globe className="h-5 w-5" />
                    ) : (
                      <Landmark className="h-5 w-5" />
                    )}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    {pick(categories.find((c) => c.value === portal.category)?.label || { en: "", hi: "" })}
                  </span>
                </div>
                <CardTitle className="mt-3 text-base font-bold leading-6 text-slate-900 dark:text-white">
                  {portal.name[language]}
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                  {portal.ministry[language]}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 p-5 pt-0">
                <p className="text-xs leading-6 text-slate-600 dark:text-slate-300 flex-1">
                  {portal.description[language]}
                </p>

                {/* Key features checklist */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {pick({ en: "Key Features & Services", hi: "मुख्य विशेषताएं और सेवाएं" })}
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                    {portal.features[language].map((feat, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-sky-500 shrink-0 mt-0.5">•</span>
                        <span className="leading-5">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-2">
                  <a href={portal.url} rel="noopener noreferrer" target="_blank">
                    <Button className="w-full rounded-2xl flex items-center justify-center gap-2 text-xs">
                      <ExternalLink className="h-4 w-4" />
                      {pick({ en: "Visit Official Portal", hi: "आधिकारिक पोर्टल पर जाएं" })}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 bg-white/30 dark:bg-slate-950/30">
          <Globe className="h-10 w-10 text-slate-400 mx-auto opacity-70" />
          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {pick({ en: "No official portals match your search.", hi: "आपकी खोज से मेल खाता कोई पोर्टल नहीं मिला।" })}
          </p>
        </Card>
      )}
    </div>
  );
}
