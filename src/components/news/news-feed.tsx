"use client";

import { Newspaper, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatRelativeDate } from "@/lib/utils";
import type { NewsArticle } from "@/types";

export function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [source, setSource] = useState<string>("loading");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadNews() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/news");
      const data = (await response.json()) as {
        articles?: NewsArticle[];
        source?: string;
      };

      setArticles(data.articles ?? []);
      setSource(data.source ?? "unknown");
    } catch {
      setError("Unable to load cyber news right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadNews();
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Latest Updates"
        title="Cyber news stream"
        description="Cards refresh from the news route and gracefully fall back to bundled data when the external API is not configured."
        action={
          <Button variant="secondary" onClick={() => void loadNews()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Source status</CardTitle>
          <CardDescription>
            {loading ? "Loading news feed..." : `Current source: ${source}`}
          </CardDescription>
        </CardHeader>
      </Card>
      {error ? (
        <Card>
          <CardContent className="py-6 text-sm text-rose-500">{error}</CardContent>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} className="flex flex-col">
            <CardHeader>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <Newspaper className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">{article.title}</CardTitle>
              <CardDescription>
                {article.source} · {formatRelativeDate(article.publishedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between">
              <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                {article.summary}
              </p>
              <a
                className="mt-6 inline-flex text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-300"
                href={article.url}
                rel="noreferrer"
                target="_blank"
              >
                Read source
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
