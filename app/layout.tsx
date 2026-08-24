import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { AnalyticsProvider } from "@/lib/analytics-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jatis FMCG DemoHub | Try Before You Talk to Sales",
  description:
    "Interactive Demo Hub for C-Level FMCG decision-makers. Experience WhatsApp Business, AI Chatbot, RoboCall, and Enterprise Messaging — no sales call required.",
  keywords: [
    "FMCG",
    "WhatsApp Business",
    "Enterprise Messaging",
    "AI Chatbot",
    "Jatis Mobile",
    "Demo Hub",
    "Chat Commerce",
    "RoboCall",
    "Trade Marketing",
    "Distribution Management",
  ],
  authors: [{ name: "Jatis Mobile" }],
  openGraph: {
    title: "Jatis FMCG DemoHub | Try Before You Talk to Sales",
    description:
      "Interactive Demo Hub for C-Level FMCG decision-makers. Experience real Jatis Mobile capabilities.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://demohub.jatis-mobile.com",
    siteName: "Jatis FMCG DemoHub",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jatis FMCG DemoHub | Interactive Demo Experience",
    description: "Try Jatis Mobile's enterprise messaging and AI solutions before talking to sales.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable}`}>
      <body className="font-sans">
        <div className="noise-overlay" />
        <AnalyticsProvider>
          <Toaster>
            {children}
          </Toaster>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
