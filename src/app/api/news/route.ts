import { NextResponse } from "next/server";
import { collection, doc, getDocs, limit, orderBy, query, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import { fallbackNews } from "@/lib/data/content";
import type { NewsArticle } from "@/types";

export const dynamic = "force-dynamic";

let cachedNews: NewsArticle[] | null = null;
let cachedSource: string = "fallback";
let lastFetchTime = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

const seedHistoricalNews: NewsArticle[] = [
  {
    id: "global-news-1",
    title: "Global Cyber Treaty Signed by 45 Nations to Combat Ransomware",
    summary: "An international coalition has signed a landmark treaty to coordinate cyber defense operations and refuse ransom demands, aiming to disrupt global cybercrime syndicates targeting healthcare systems.",
    source: "World Security Forum",
    url: "#",
    publishedAt: "2026-05-29T10:00:00.000Z",
  },
  {
    id: "global-news-2",
    title: "AI Regulation Frameworks Face Hurdles in International Consensus",
    summary: "Different approaches between North America, Europe, and Asia regarding copyright and safety checks on large language models are complicating international trade agreements on software products.",
    source: "Tech Policy Review",
    url: "#",
    publishedAt: "2026-05-28T14:30:00.000Z",
  },
  {
    id: "global-news-3",
    title: "How Zero-Knowledge Proofs are Revolutionizing Digital Identity Safety",
    summary: "Cryptographic breakthroughs are enabling users to verify credentials (like age or citizenship) without sharing their actual name or documents, eliminating database leak risks.",
    source: "Cryptography Journal",
    url: "#",
    publishedAt: "2026-05-27T08:15:00.000Z",
  },
  {
    id: "global-news-4",
    title: "Critical Vulnerability Discovered in Popular Open-Source Library",
    summary: "Security researchers have disclosed a zero-day exploit affecting millions of web servers. System administrators are urged to patch immediately to prevent remote code execution attacks.",
    source: "Cyber Defense Feed",
    url: "#",
    publishedAt: "2026-05-26T11:00:00.000Z",
  },
  {
    id: "global-news-5",
    title: "Rise of Smart Home Cyber Attacks Prompts New Manufacturer Standards",
    summary: "With IoT devices frequently hijacked to launch DDoS attacks, new standards require unique default passcodes and automatic security updates for all connected smart appliances.",
    source: "IoT Security Network",
    url: "#",
    publishedAt: "2026-05-25T10:20:00.000Z",
  },
  {
    id: "global-news-6",
    title: "The Pros and Cons of Central Bank Digital Currencies (CBDCs)",
    summary: "As more nations pilot digital currencies, financial analysts weigh the benefits of rapid transaction processing against privacy concerns over transaction tracing by state authorities.",
    source: "Global Finance Monitor",
    url: "#",
    publishedAt: "2026-05-24T16:45:00.000Z",
  },
  {
    id: "global-news-7",
    title: "Phishing Campaign Targets Remote Corporate Employees via Chat Tools",
    summary: "Security teams alert companies to a massive phishing wave masquerading as internal HR notifications. Attackers bypass 2FA via session hijacking techniques.",
    source: "Corporate Cyber Shield",
    url: "#",
    publishedAt: "2026-05-23T13:10:00.000Z",
  },
  {
    id: "global-news-8",
    title: "Cyberstalking Laws Strengthened Across Europe and North America",
    summary: "New judicial rulings classify online tracking, non-consensual image distribution, and digital tracking via airtags under severe criminal penalties, giving victims legal backing.",
    source: "Digital Rights Advocate",
    url: "#",
    publishedAt: "2026-05-22T07:55:00.000Z",
  },
  {
    id: "global-news-9",
    title: "Global Supply Chain Disruptions Caused by Cyber Attack on Logistical Giant",
    summary: "A major shipping aggregator was offline for 3 days due to malware, causing delays at ports. The incident highlights the vulnerability of global trade networks to infrastructure attacks.",
    source: "Logistics Journal",
    url: "#",
    publishedAt: "2026-05-21T12:40:00.000Z",
  },
  {
    id: "global-news-10",
    title: "Biometric Scams: The Security Flaws of Facial Verification Systems",
    summary: "Sophisticated hackers use 3D masks and high-resolution photo projection to bypass simple facial verification algorithms on finance apps. Liveness checks are becoming mandatory.",
    source: "Biometric Tech Weekly",
    url: "#",
    publishedAt: "2026-05-20T09:15:00.000Z",
  },
  {
    id: "global-news-11",
    title: "How to Secure Your Personal Accounts Against SIM Swapping Scams",
    summary: "SIM swapping allows scammers to intercept SMS verification codes. Experts recommend moving to authenticator apps, security keys, or custom PIN protection with telecom providers.",
    source: "CyberSaathi Advisory",
    url: "#",
    publishedAt: "2026-05-19T15:25:00.000Z",
  },
  {
    id: "global-news-12",
    title: "Data Leaks Exposures Highlight Need for Decentralized Web Standards",
    summary: "Centralized servers holding millions of records remain primary targets. Developers urge the adoption of decentralized protocols where users host and sign their own data packages.",
    source: "Web3 Security Hub",
    url: "#",
    publishedAt: "2026-05-18T11:50:00.000Z",
  },
  {
    id: "global-news-13",
    title: "Digital Arrest Warnings: Interpol Targets Ransom Ring Posing as Officials",
    summary: "Scammers use video conference tools to threaten victims with arrest for illegal parcel shipping, forcing them to transfer funds. Authorities remind that official procedures never occur online.",
    source: "Global Law Network",
    url: "#",
    publishedAt: "2026-05-17T14:10:00.000Z",
  },
  {
    id: "global-news-14",
    title: "E-Commerce Scams Increase: Fake Product Reviews Mislead Shoppers",
    summary: "AI chatbots are generating thousands of fake positive reviews on major sales platforms. Consumer groups advise using browser tools that filter out inorganic product feedback.",
    source: "Consumer Trust Watch",
    url: "#",
    publishedAt: "2026-05-16T10:05:00.000Z",
  },
  {
    id: "global-news-15",
    title: "Cyber Hygiene 101: Essential Safeguards for Senior Citizens Online",
    summary: "Digital education networks are hosting local workshops for senior citizens, covering basics like checking web URLs, avoiding clicking links in text messages, and secure bank calls.",
    source: "Elder Care Network",
    url: "#",
    publishedAt: "2026-05-15T08:30:00.000Z",
  },
  {
    id: "global-news-16",
    title: "Ransomware Attack Disables Municipal Systems in Major Cities",
    summary: "Several city registries and public utility interfaces were locked down by cyber attackers demanding ransom. Councils refuse to pay, reverting to offline operations to restore records.",
    source: "Municipal Security News",
    url: "#",
    publishedAt: "2026-05-14T09:12:00.000Z",
  },
  {
    id: "global-news-17",
    title: "Cyberbullying: Social Media Platforms Under Scrutiny for Algorithmic Promotion",
    summary: "Legislators are debating bills that would hold social platforms accountable for algorithms that amplify negative or harassing content, boosting user engagement at the expense of safety.",
    source: "Tech Regulation Quarterly",
    url: "#",
    publishedAt: "2026-05-13T11:45:00.000Z",
  },
  {
    id: "global-news-18",
    title: "Mobile Spyware Exposure: How to Check If Your Phone is Compromised",
    summary: "Advanced spyware can access microphone and camera feeds silently. Security teams release guides on analyzing battery usage, network data peaks, and auditing background app trackers.",
    source: "Device Defense Feed",
    url: "#",
    publishedAt: "2026-05-12T14:15:00.000Z",
  },
  {
    id: "global-news-19",
    title: "Decentralized Finance (DeFi) Exploits Hit Record High in 2026",
    summary: "Smart contract loopholes have allowed exploiters to extract millions in cryptocurrency assets from decentralized lending pools. Stricter audit standards are being demanded by investors.",
    source: "Crypto Security Hub",
    url: "#",
    publishedAt: "2026-05-11T16:22:00.000Z",
  },
  {
    id: "global-news-20",
    title: "Deepfake Scams Exploit Public Figures to Promote Fake Cryptocurrencies",
    summary: "Synthesized videos showing popular figures endorsing high-yield crypto schemes are circulating on video networks. Security teams warn viewers to ignore any investment advice via video ads.",
    source: "Ad Integrity Watch",
    url: "#",
    publishedAt: "2026-05-10T10:05:00.000Z",
  },
  {
    id: "global-news-21",
    title: "GDPR Violations: Tech Giant Fined $500M for Inadequate User Consent",
    summary: "Regulators find that pre-checked option boxes and complex opt-out layouts violated user consent guidelines. The ruling sets a strict standard for dark patterns in cookie selectors.",
    source: "European Privacy Forum",
    url: "#",
    publishedAt: "2026-05-09T08:50:00.000Z",
  },
  {
    id: "global-news-22",
    title: "VPN Log Disclosures: Why 'No-Logs' Claims Need Independent Audits",
    summary: "A leak from a popular virtual network provider exposed customer IP records despite 'no-logs' guarantees. Industry groups urge users to trust only audited networks.",
    source: "Privacy Tech News",
    url: "#",
    publishedAt: "2026-05-08T15:30:00.000Z",
  },
  {
    id: "global-news-23",
    title: "Public School Boards Sue Social Media Giants Over Digital Harassment",
    summary: "Schools allege that companies knowingly designed platforms to be addictive, causing mental health crises and facilitating online bullying among teens without parental controls.",
    source: "Education and Law Review",
    url: "#",
    publishedAt: "2026-05-07T12:00:00.000Z",
  },
  {
    id: "global-news-24",
    title: "Cyberstalking App Creator Sentenced to Prison in Historic Ruling",
    summary: "The developer of a commercial monitoring application marketed to track partners was convicted of wiretapping, sending a clear warning to the stalkerware industry.",
    source: "Digital Rights Advocate",
    url: "#",
    publishedAt: "2026-05-06T14:15:00.000Z",
  },
  {
    id: "global-news-25",
    title: "DNS Hijacking Waves Redirect Visitors to Phishing Portals",
    summary: "Attackers compromised domain registrars to change DNS records of popular banking networks, loading identical duplicate pages that steal login credentials.",
    source: "DNS Security Digest",
    url: "#",
    publishedAt: "2026-05-05T09:30:00.000Z",
  },
  {
    id: "global-news-26",
    title: "Ransomware Targets Agricultural Tech, Threatening Crop Distribution",
    summary: "Smart farming automation systems governing watering and crop logistics were disabled by a cyber extortion group, raising concerns about cyber threats to food security.",
    source: "AgriTech Security",
    url: "#",
    publishedAt: "2026-05-04T10:10:00.000Z",
  },
  {
    id: "global-news-27",
    title: "AI Chatbots Tricked Into Disclosing Private Training Data",
    summary: "Security analysts bypass safe alignment guards in public AI models, forcing them to print phone numbers and private addresses from training datasets. Prompt injection safeguards are updated.",
    source: "AI Watch Global",
    url: "#",
    publishedAt: "2026-05-03T13:40:00.000Z",
  },
  {
    id: "global-news-28",
    title: "Tech Support Scammers Infiltrate Search Engine Advertising",
    summary: "Fraudsters pay for top search ranking ads posing as official helpline numbers for printers and hardware support, routing users to installation pages for remote access tools.",
    source: "Search Integrity Feed",
    url: "#",
    publishedAt: "2026-05-02T15:20:00.000Z",
  },
  {
    id: "global-news-29",
    title: "India's Tech Sector Steps Up Cyber Awareness Training for Staff",
    summary: "Major IT campuses run simulation drills targeting email spear-phishing, physical tailgating, and social engineering to raise corporate defenses against industrial espionage.",
    source: "Tech News India",
    url: "#",
    publishedAt: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "global-news-30",
    title: "The Role of Quantum Cryptography in Securing Future Banking Networks",
    summary: "As quantum computing advances threaten standard encryption, financial agencies are testing quantum key distribution (QKD) channels to assure mathematically secure transaction lines.",
    source: "Future Banking Feed",
    url: "#",
    publishedAt: "2026-05-01T16:50:00.000Z",
  }
];

function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const unique: NewsArticle[] = [];

  for (const article of articles) {
    const normTitle = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 50);
      
    const normUrl = article.url.toLowerCase().trim();

    if (!seenTitles.has(normTitle) && !seenUrls.has(normUrl)) {
      seenTitles.add(normTitle);
      seenUrls.add(normUrl);
      unique.push(article);
    }
  }

  return unique;
}

export async function GET() {
  const now = Date.now();

  // Return from in-memory cache if within TTL
  if (cachedNews && (now - lastFetchTime < CACHE_TTL)) {
    return NextResponse.json({
      articles: cachedNews,
      source: `${cachedSource} (cached)`,
    });
  }

  // 1. Fetch historical articles from Firestore
  let dbArticles: NewsArticle[] = [];
  let dbActive = false;

  if (db) {
    try {
      const q = query(
        collection(db, "news_articles"),
        orderBy("publishedAt", "desc"),
        limit(300) // Support large archives
      );
      const snapshot = await getDocs(q);
      dbArticles = snapshot.docs.map((document) => {
        const data = document.data();
        return {
          id: document.id,
          title: data.title || "",
          summary: data.summary || "",
          source: data.source || "",
          url: data.url || "",
          publishedAt: data.publishedAt || new Date().toISOString(),
          imageUrl: data.imageUrl,
        } satisfies NewsArticle;
      });
      dbActive = true;

      // Seed historical news if database has no articles
      if (dbArticles.length === 0) {
        try {
          await Promise.all(
            seedHistoricalNews.map((article) => {
              return setDoc(doc(db!, "news_articles", article.id), article);
            })
          );
          console.log(`Seeded ${seedHistoricalNews.length} historical news articles to Firestore.`);
          dbArticles = [...seedHistoricalNews];
        } catch (seedErr) {
          console.warn("Could not seed historical news to Firestore:", seedErr);
        }
      }
    } catch (e) {
      console.warn("Could not read news from Firestore (safe fallback active):", e);
    }
  }

  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    const merged = deduplicateArticles([...fallbackNews, ...dbArticles]);
    merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Update cache
    cachedNews = merged;
    cachedSource = dbActive ? "firestore" : "fallback";
    lastFetchTime = now;

    return NextResponse.json({
      articles: merged,
      source: cachedSource,
    });
  }

  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set(
    "q",
    "cybercrime OR \"cyber security\" OR \"digital literacy\" OR \"cyber law\" OR \"online safety\" OR \"phishing\""
  );
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", "100"); // GNews maximum limit
  url.searchParams.set("apikey", apiKey);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch news. Status: ${response.status}`);
    }

    const data = (await response.json()) as {
      articles?: Array<{
        title?: string;
        description?: string;
        url?: string;
        publishedAt?: string;
        image?: string;
        source?: { name?: string };
      }>;
    };

    const fetchedArticles = (data.articles ?? []).map((article, index) => {
      const title = article.title ?? "Cybersecurity update";
      const docId = title.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 80);
      return {
        id: docId || `news-${index}-${now}`,
        title,
        summary: article.description ?? "Latest cybercrime awareness update.",
        source: article.source?.name ?? "GNews",
        url: article.url ?? "#",
        publishedAt: article.publishedAt ?? new Date().toISOString(),
        imageUrl: article.image,
      } satisfies NewsArticle;
    });

    // 2. Identify new unique articles not already in Firestore dbArticles
    if (dbActive && fetchedArticles.length > 0) {
      const existingUrls = new Set(dbArticles.map((a) => a.url.toLowerCase().trim()));
      const existingTitles = new Set(
        dbArticles.map((a) => a.title.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 50))
      );

      const newArticles = fetchedArticles.filter((article) => {
        const normTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 50);
        const normUrl = article.url.toLowerCase().trim();
        return !existingUrls.has(normUrl) && !existingTitles.has(normTitle);
      });

      // 3. Write only new articles to Firestore in parallel
      if (newArticles.length > 0) {
        try {
          await Promise.all(
            newArticles.map((article) => {
              return setDoc(doc(db!, "news_articles", article.id), article, { merge: true });
            })
          );
          console.log(`Synced ${newArticles.length} new articles to Firestore.`);
          
          // Add newly saved articles to our current memory list
          dbArticles = [...newArticles, ...dbArticles];
        } catch (e) {
          console.warn("Could not save new articles to Firestore:", e);
        }
      }
    }

    const merged = deduplicateArticles([...fetchedArticles, ...dbArticles]);
    merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Update in-memory cache
    cachedNews = merged;
    cachedSource = "gnews+firestore";
    lastFetchTime = now;

    return NextResponse.json({
      articles: merged,
      source: "gnews+firestore",
    });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("API news fetch failed, merging fallback + firestore:", error);
    
    const merged = deduplicateArticles([...fallbackNews, ...dbArticles]);
    merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Cache merged response briefly for 5 minutes on GNews failure
    cachedNews = merged;
    cachedSource = dbActive ? "firestore" : "fallback";
    lastFetchTime = now - CACHE_TTL + (5 * 60 * 1000); // expires in 5 minutes

    return NextResponse.json({
      articles: merged,
      source: cachedSource,
    });
  }
}
