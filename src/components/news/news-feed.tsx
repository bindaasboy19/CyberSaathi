"use client";

import { Newspaper, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatRelativeDate } from "@/lib/utils";
import type { NewsArticle } from "@/types";
import { useLanguage } from "@/components/providers/language-provider";

const CATEGORIES = [
  { id: "all", label: { en: "All News", hi: "सभी समाचार" } },
  { id: "global", label: { en: "Global", hi: "वैश्विक" } },
  { id: "indian", label: { en: "Indian", hi: "भारतीय" } },
  { id: "law", label: { en: "Cyber Law", hi: "साइबर कानून" } },
  { id: "crime", label: { en: "Cyber Crime", hi: "साइबर अपराध" } },
  { id: "literacy", label: { en: "Digital Literacy", hi: "डिजिटल साक्षरता" } },
  { id: "safety", label: { en: "Tech Safety", hi: "तकनीकी सुरक्षा" } },
];

function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const unique: NewsArticle[] = [];

  for (const article of articles) {
    // Strict deduplication by normalized title (first 50 alphanumeric characters) and exact URL
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

function getArticleCategories(article: NewsArticle): string[] {
  const categories = ["all"];
  const text = `${article.title} ${article.summary}`.toLowerCase();

  const indianKeywords = [
    "india", "indian", "delhi", "mumbai", "bengaluru", "chennai", "kolkata",
    "hyderabad", "pune", "cbi", "police", "cert-in", "rbi", "upi", "isro", "iit"
  ];
  if (indianKeywords.some((keyword) => text.includes(keyword))) {
    categories.push("indian");
  } else {
    categories.push("global");
  }

  const lawKeywords = [
    "law", "act", "regulation", "policy", "gdpr", "dpdp", "bill", "legal",
    "court", "government", "fine", "penalty", "sue", "lawsuit", "complaint"
  ];
  if (lawKeywords.some((keyword) => text.includes(keyword))) {
    categories.push("law");
  }

  const crimeKeywords = [
    "hack", "scam", "fraud", "phishing", "ransomware", "arrest", "bully",
    "harass", "stalk", "victim", "breach", "leak", "attack", "malware",
    "spyware", "virus", "theft", "stolen", "extortion", "blackmail"
  ];
  if (crimeKeywords.some((keyword) => text.includes(keyword))) {
    categories.push("crime");
  }

  const literacyKeywords = [
    "how to", "permission", "verify", "learn", "literacy", "check", "education",
    "protect", "guide", "tips", "awareness", "know", "identify", "spot", "recognize"
  ];
  if (literacyKeywords.some((keyword) => text.includes(keyword))) {
    categories.push("literacy");
  }

  const safetyKeywords = [
    "mfa", "2fa", "password", "wi-fi", "vpn", "encryption", "safe", "protect",
    "security", "firewall", "backup", "credential", "auth", "authentication"
  ];
  if (safetyKeywords.some((keyword) => text.includes(keyword))) {
    categories.push("safety");
  }

  return categories;
}

export function NewsFeed() {
  const { pick } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  async function loadNews() {
    setLoading(true);
    setError(null);
    setVisibleCount(9);

    try {
      const response = await fetch(`/api/news?t=${Date.now()}`);
      const data = (await response.json()) as {
        articles?: NewsArticle[];
      };

      const rawArticles = data.articles ?? [];
      const cleanArticles = deduplicateArticles(rawArticles);

      setArticles(cleanArticles);
    } catch {
      setError("Unable to load cyber news right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadNews();
  }, []);

  useEffect(() => {
    setVisibleCount(9);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const filteredArticles = articles.filter((article) => {
    const categories = getArticleCategories(article);
    return categories.includes(selectedCategory);
  });

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Latest Updates"
        title="Cyber Security & Literacy News"
        description="Stay updated with the latest in cybercrime awareness, digital literacy, policy changes, and cyber laws globally."
        action={
          <Button variant="secondary" onClick={() => void loadNews()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh Feed
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
                isActive
                  ? "bg-sky-600 border-sky-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {pick(cat.label)}
            </button>
          );
        })}
      </div>


      {error && (
        <Card className="border border-rose-500/20 bg-rose-500/5">
          <CardContent className="py-6 text-sm text-rose-500 font-medium">{error}</CardContent>
        </Card>
      )}

      {loading && articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {pick({ en: "Loading cyber news feed...", hi: "साइबर समाचार फीड लोड हो रहा है..." })}
          </p>
        </div>
      ) : visibleArticles.length === 0 ? (
        <Card className="border border-dashed border-slate-300 dark:border-slate-700 bg-transparent p-12 text-center">
          <CardContent className="space-y-3">
            <Newspaper className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {pick({
                en: "No news articles found in this category.",
                hi: "इस श्रेणी में कोई समाचार लेख नहीं मिले।",
              })}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article) => (
            <Card key={article.id} className="flex flex-col border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Newspaper className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold leading-snug line-clamp-2 min-h-[3.5rem]">{article.title}</CardTitle>
                <CardDescription className="text-xs">
                  {article.source} · {formatRelativeDate(article.publishedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between pt-0">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4">
                  {article.summary}
                </p>
                <a
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
                  href={article.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Read full source &rarr;
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {visibleCount < filteredArticles.length && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleLoadMore}
            className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl px-8 py-2.5 font-semibold shadow-sm hover:shadow transition-all"
          >
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
}
