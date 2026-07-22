import type { Metadata } from "next";
import { Cinzel, DM_Mono, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteExperience } from "./components/SiteExperience";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "wholebody.studios";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: {
      default: "Whole Body Studios — Infrastructure, Not a Label",
      template: "%s — Whole Body Studios",
    },
    description: "Ceremonial infrastructure for independent artists. Artist-owned. Feed First. Zero extraction.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Whole Body Studios — Infrastructure, Not a Label",
      description: "The artist eats first. Always.",
      type: "website",
      siteName: "Whole Body Studios",
      images: [{ url: `${origin}/og-water.png`, width: 1731, height: 909, alt: "Whole Body Studios — Infrastructure, Not a Label" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Whole Body Studios — Infrastructure, Not a Label",
      description: "The artist eats first. Always.",
      images: [`${origin}/og-water.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable}`}
      >
        <SiteExperience>{children}</SiteExperience>
      </body>
    </html>
  );
}
