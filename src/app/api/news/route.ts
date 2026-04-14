import { NextResponse } from "next/server";

import { fallbackNews } from "@/lib/data/content";

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      articles: fallbackNews,
      source: "fallback",
    });
  }

  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set("q", "cybercrime OR scam OR phishing OR digital fraud India");
  url.searchParams.set("lang", "en");
  url.searchParams.set("country", "in");
  url.searchParams.set("max", "9");
  url.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 900,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch news.");
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

    const articles = (data.articles ?? []).map((article, index) => ({
      id: `news-${index}`,
      title: article.title ?? "Cybersecurity update",
      summary: article.description ?? "Latest cybercrime awareness update.",
      source: article.source?.name ?? "GNews",
      url: article.url ?? "#",
      publishedAt: article.publishedAt ?? new Date().toISOString(),
      imageUrl: article.image,
    }));

    return NextResponse.json({
      articles: articles.length > 0 ? articles : fallbackNews,
      source: "gnews",
    });
  } catch {
    return NextResponse.json({
      articles: fallbackNews,
      source: "fallback",
    });
  }
}
