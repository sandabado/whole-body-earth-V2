import type { Metadata } from "next";
import { SiteExperience } from "../components/SiteExperience";
import "./studios-global.css";
import "./source.css";

export const metadata: Metadata = {
  title: {
    default: "Whole Body Studios — Infrastructure, Not a Label",
    template: "%s — Whole Body Studios",
  },
  description:
    "Ceremonial infrastructure for independent artists. Artist-owned. Feed First. Zero extraction.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Whole Body Studios — Infrastructure, Not a Label",
    description: "The artist eats first. Always.",
    type: "website",
    siteName: "Whole Body Studios",
    images: [
      {
        url: "/og-water.png",
        width: 1731,
        height: 909,
        alt: "Whole Body Studios — Infrastructure, Not a Label",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whole Body Studios — Infrastructure, Not a Label",
    description: "The artist eats first. Always.",
    images: ["/og-water.png"],
  },
};

export default function StudiosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteExperience>{children}</SiteExperience>;
}
