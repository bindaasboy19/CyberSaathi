import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cybersaathi.in"),
  title: "CyberSaathi | AI-powered cybercrime awareness and assistance",
  description:
    "CyberSaathi helps Indian users prevent scams, respond to cybercrime incidents, and learn safer digital habits through AI guidance and community support.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "CyberSaathi | AI-powered cybercrime awareness and assistance",
    description:
      "CyberSaathi helps Indian users prevent scams, respond to cybercrime incidents, and learn safer digital habits through AI guidance and community support.",
    images: [
      {
        url: "/CyberSaathi Website Header.jpeg",
        width: 1500,
        height: 750,
        alt: "CyberSaathi Header",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberSaathi | AI-powered cybercrime awareness and assistance",
    description:
      "CyberSaathi helps Indian users prevent scams, respond to cybercrime incidents, and learn safer digital habits.",
    images: ["/CyberSaathi Website Header.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
