import type { Metadata } from "next";
import { ConstellationPlaceholder } from "./components/ConstellationPlaceholder";

export const metadata: Metadata = {
  title: "Whole Body Earth — A Seven-Dimensional Operating System",
  description:
    "A seven-dimensional operating system for sovereign creators. Five bodies, five elements, five pillars, one whole system.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Whole Body Earth — A Seven-Dimensional Operating System",
    description:
      "Five bodies. Five elements. Five pillars. One whole system.",
    url: "/",
    siteName: "Whole Body Earth",
    images: [
      {
        url: "/og-earth.png",
        width: 1200,
        height: 630,
        alt: "The Whole Body Earth quincunx awakening in a dark field",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whole Body Earth — A Seven-Dimensional Operating System",
    description:
      "Five bodies. Five elements. Five pillars. One whole system.",
    images: ["/og-earth.png"],
  },
};

export default function WholeHome() {
  return <ConstellationPlaceholder mode="whole" />;
}
