"use client";

import {
  Mail,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  FileQuestion,
  User,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/ui/section-heading";

type FAQItem = {
  id: string;
  question: { en: string; hi: string };
  answer: { en: string; hi: string };
  category: "features" | "account" | "troubleshooting";
};

const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    category: "features",
    question: {
      en: "What is the difference between the 'AI Assistant' and the 'Legal AI' workspace?",
      hi: "एआई सहायक और लीगल एआई कार्यस्थान में क्या अंतर है?",
    },
    answer: {
      en: "The AI Assistant tab is designed for quick, conversational safety questions. The 'Legal AI' workspace is a structured guide that classifies your incident, builds a checklist of evidence, generates a formal filing-ready complaint text, and enables exporting to PDF.",
      hi: "एआई सहायक त्वरित सुरक्षा बातचीत और सवालों के लिए है। 'लीगल एआई' कार्यस्थान एक विस्तृत गाइड है जो घटना का वर्गीकरण करता है, साक्ष्यों की सूची बनाता है, और पुलिस/पोर्टल के लिए शिकायत ड्राफ्ट बनाकर पीडीएफ निर्यात की अनुमति देता है।",
    },
  },
  {
    id: "faq-2",
    category: "account",
    question: {
      en: "Why does the app say 'Demo Mode' and where is my profile progress saved?",
      hi: "ऐप 'डेमो मोड' क्यों दिखाता है और मेरी प्रोफाइल प्रगति कहाँ सेव होती है?",
    },
    answer: {
      en: "Demo Mode is enabled when Firebase environment configuration keys are unconfigured. To ensure full usability offline, all user registration, course completions, quiz trophies, and incident reports are securely saved directly in your web browser's local storage (localStorage) and never lost.",
      hi: "डेमो मोड तब चालू होता है जब Firebase की चाबियां कॉन्फ़िगर नहीं होती हैं। यूज़र को ऑफलाइन भी पूर्ण सुविधा देने के लिए, सभी कोर्स प्रगति, क्विज़ ट्रॉफ़ी और शिकायत ड्राफ्ट आपके ब्राउज़र के लोकल स्टोरेज (localStorage) में सुरक्षित रूप से सेव किए जाते हैं।",
    },
  },
  {
    id: "faq-3",
    category: "troubleshooting",
    question: {
      en: "I received a 'Clipboard API not supported' error. How do I copy my complaint?",
      hi: "मुझे 'क्लिपबोर्ड एपीआई समर्थित नहीं है' त्रुटि मिली। मैं अपनी शिकायत कैसे कॉपी करूँ?",
    },
    answer: {
      en: "On insecure network IP connections (non-localhost HTTP), browsers block automatic clipboard copies. CyberSaathi handles this by falling back to a text selector that highlights the draft complaint, letting you copy manually. You can also export the draft as a PDF.",
      hi: "असुरक्षित नेटवर्क आईपी (बिना-localhost HTTP) पर ब्राउज़र क्लिपबोर्ड कॉपी ब्लॉक करते हैं। साइबरसाथी स्वचालित रूप से टेक्स्ट का चयन कर लेता है ताकि आप उसे आसानी से मैनुअली कॉपी कर सकें, या आप शिकायत को सीधे पीडीएफ के रूप में डाउनलोड कर सकते हैं।",
    },
  },
  {
    id: "faq-4",
    category: "features",
    question: {
      en: "How does the quiz lock system work in the Learning Hub?",
      hi: "लर्निंग हब में क्विज़ लॉक सिस्टम कैसे काम करता है?",
    },
    answer: {
      en: "Quizzes are locked to ensure proper learning flow. You must mark all lessons in a module as completed by reading their content or watching the instructional videos. Once all lessons are marked done, the module's quiz will unlock automatically.",
      hi: "उचित सीख सुनिश्चित करने के लिए क्विज़ लॉक रहते हैं। आपको मॉड्यूल के सभी पाठों को पढ़ना या उनके वीडियो देखना होगा। सभी पाठों को 'पूरा' चिह्नित करने के बाद, उस मॉड्यूल का क्विज़ अपने आप अनलॉक हो जाएगा।",
    },
  },
  {
    id: "faq-5",
    category: "troubleshooting",
    question: {
      en: "Why do I see a sync warning or offline message on the blog or community boards?",
      hi: "मुझे ब्लॉग या कम्युनिटी बोर्ड पर सिंक चेतावनी या ऑफलाइन संदेश क्यों दिख रहा है?",
    },
    answer: {
      en: "When the application is run in Demo Mode or when the network connection fails, we protect your user experience by allowing you to submit questions, answers, and comments locally. A warning banner is displayed to notify you that data is stored locally and will sync when a live Firestore database is connected.",
      hi: "डेमो मोड में या नेटवर्क न होने पर, हम आपको स्थानीय रूप से प्रश्न और ब्लॉग पोस्ट लिखने की अनुमति देते हैं। यह चेतावनी दर्शाती है कि आपका डेटा ब्राउज़र में सुरक्षित है और डेटाबेस से कनेक्ट होने पर सिंक हो जाएगा।",
    },
  },
];

export default function HelpPage() {
  const { pick } = useLanguage();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Form State
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    category: "general",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleFaq = (id: string) => {
    setOpenFaq((current) => (current === id ? null : id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.user_name.trim()) {
      setError(pick({ en: "Please enter your name.", hi: "कृपया अपना नाम दर्ज करें।" }));
      return;
    }
    if (!formData.user_email.trim() || !formData.user_email.includes("@")) {
      setError(pick({ en: "Please enter a valid email address.", hi: "कृपया एक वैध ईमेल पता दर्ज करें।" }));
      return;
    }
    if (!formData.message.trim()) {
      setError(pick({ en: "Please write a message.", hi: "कृपया एक संदेश लिखें।" }));
      return;
    }

    setLoading(true);

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

      const templateParams = {
        user_name: formData.user_name,
        user_email: formData.user_email,
        category: formData.category,
        time: new Date().toLocaleString(),
        message: formData.message,
      };

      // Persist the support query in Firebase via local API
      try {
        await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.user_name,
            email: formData.user_email,
            category: formData.category,
            message: formData.message,
          }),
        });
      } catch (dbError) {
        console.error("Firebase support query persistence failed:", dbError);
      }

      if (publicKey && serviceId && templateId) {
        await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        );
      } else {
        // Fallback simulation when keys are missing
        console.log("EmailJS keys missing. Simulated payload sending:", templateParams);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setSuccess(true);
      setFormData({
        user_name: "",
        user_email: "",
        category: "general",
        message: "",
      });
    } catch (err) {
      setError(
        pick({
          en: `Unable to send message: ${err instanceof Error ? err.message : String(err)}`,
          hi: `संदेश भेजने में असमर्थ: ${err instanceof Error ? err.message : String(err)}`,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow={pick({ en: "Help & Support", hi: "सहायता और संपर्क" })}
        title={pick({ en: "Frequently Asked Questions & Contact", hi: "अक्सर पूछे जाने वाले प्रश्न और संपर्क" })}
        description={pick({
          en: "Troubleshoot common digital issues, learn quick response actions, or reach out directly to the developing team.",
          hi: "सामान्य डिजिटल समस्याओं का समाधान करें, त्वरित प्रतिक्रिया क्रियाएं सीखें, या सीधे विकास टीम से संपर्क करें।",
        })}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* FAQs Left Panel */}
        <div className="space-y-4">
          <Card className="border border-white/60 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <FileQuestion className="h-5 w-5 text-sky-500" />
                {pick({ en: "Common Issues & Solutions", hi: "आम समस्याएं और समाधान" })}
              </CardTitle>
              <CardDescription>
                {pick({
                  en: "Select a category to filter down common digital emergency solutions.",
                  hi: "सामान्य डिजिटल आपातकालीन समाधानों को फ़िल्टर करने के लिए एक श्रेणी चुनें।",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category selector pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: "all", label: { en: "All App FAQs", hi: "सभी प्रश्न" } },
                  { id: "features", label: { en: "App Features", hi: "ऐप विशेषताएं" } },
                  { id: "account", label: { en: "Account & Sync", hi: "अकाउंट और सिंक" } },
                  { id: "troubleshooting", label: { en: "Troubleshooting", hi: "समस्या निवारण" } },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenFaq(null);
                    }}
                    type="button"
                    className={`rounded-full px-4 py-2 text-xs font-semibold border transition ${activeCategory === cat.id
                        ? "border-sky-500 bg-sky-500 text-white shadow-sm"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                      }`}
                  >
                    {pick(cat.label)}
                  </button>
                ))}
              </div>

              {/* FAQ Accordion List */}
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-slate-200/80 bg-white/50 p-4 transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-900/30"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        type="button"
                        className="flex w-full items-start justify-between gap-3 text-left font-semibold text-slate-950 dark:text-white"
                      >
                        <span className="text-sm leading-6">{pick(faq.question)}</span>
                        <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800/60">
                          <p className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                            {pick(faq.answer)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Right Panel */}
        <div className="space-y-6">
          <Card className="border border-white/60 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Mail className="h-5 w-5 text-emerald-500" />
                {pick({ en: "Contact Developing Team", hi: "विकास टीम से संपर्क करें" })}
              </CardTitle>
              <CardDescription>
                {pick({
                  en: "Submit bugs, request training topics, or seek technical assistance.",
                  hi: "बग रिपोर्ट करें, कोर्सेज के विषयों का अनुरोध करें, या तकनीकी सहायता प्राप्त करें।",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center text-emerald-950 dark:border-emerald-950/60 dark:bg-emerald-950/20 dark:text-emerald-100 flex flex-col items-center gap-3">
                  <CheckCircle className="h-10 w-10 text-emerald-500 animate-bounce" />
                  <p className="font-semibold text-sm">
                    {pick({
                      en: "Message Submitted Successfully!",
                      hi: "आपका संदेश सफलतापूर्वक भेज दिया गया है!",
                    })}
                  </p>
                  <p className="text-xs leading-5 opacity-90">
                    {pick({
                      en: "Thank you for reaching out. The CyberSaathi dev team will review your message shortly.",
                      hi: "हमसे संपर्क करने के लिए धन्यवाद। साइबरसाथी टीम जल्द ही आपके संदेश की समीक्षा करेगी।",
                    })}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => setSuccess(false)}
                  >
                    {pick({ en: "Send another message", hi: "दूसरा संदेश भेजें" })}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {pick({ en: "Your Name", hi: "आपका नाम" })}
                    </label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="user_name"
                        type="text"
                        placeholder={pick({ en: "John Doe", hi: "जॉन डो" })}
                        value={formData.user_name}
                        onChange={handleInputChange}
                        className="pl-9"
                        required
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <input type="hidden" name="time" id="contact-time" value={new Date().toLocaleString()} />

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {pick({ en: "Your Email Address", hi: "आपका ईमेल पता" })}
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="user_email"
                        type="email"
                        placeholder={pick({ en: "john@example.com", hi: "john@example.com" })}
                        value={formData.user_email}
                        onChange={handleInputChange}
                        className="pl-9"
                        required
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {pick({ en: "Inquiry Category", hi: "पूछताछ की श्रेणी" })}
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <option value="general">{pick({ en: "General Feedback", hi: "सामान्य प्रतिक्रिया" })}</option>
                      <option value="bug">{pick({ en: "Bug / Technical Issue", hi: "बग / तकनीकी समस्या" })}</option>
                      <option value="content">{pick({ en: "Request Syllabus Topic", hi: "कोर्स विषय का अनुरोध" })}</option>
                      <option value="support">{pick({ en: "Security / Scam Help", hi: "सुरक्षा / स्कैम सहायता" })}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {pick({ en: "Your Message", hi: "आपका संदेश" })}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder={pick({
                        en: "Write details of the issue or feedback here...",
                        hi: "समस्या या प्रतिक्रिया का विवरण यहाँ लिखें...",
                      })}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-950/60 dark:bg-red-950/20 dark:text-red-200 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      pick({ en: "Sending...", hi: "भेज रहा है..." })
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {pick({ en: "Send Message", hi: "संदेश भेजें" })}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Helpline quick card */}
          <Card className="border border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20 p-4">
            <div className="flex items-start gap-3 text-sm text-amber-900 dark:text-amber-100">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">{pick({ en: "Emergency helpline", hi: "आपातकालीन हेल्पलाइन" })}</p>
                <p className="mt-1 text-xs leading-5">
                  {pick({
                    en: "This contact form is for application support. For real financial scams, dial 1930 immediately.",
                    hi: "यह संपर्क फ़ॉर्म ऐप सहायता के लिए है। वास्तविक वित्तीय घोटालों के लिए तुरंत 1930 डायल करें।",
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
