import type { Metadata } from "next";
import { ConstellationPlaceholder } from "./components/ConstellationPlaceholder";

export const metadata: Metadata = {
  title: "Whole Body Earth — Five Elements. One Body.",
  description:
    "Five elements. One body. A living constellation for sovereign creators.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Whole Body Earth — Five Elements. One Body.",
    description:
      "Five elements. One body. Living now.",
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
    title: "Whole Body Earth — Five Elements. One Body.",
    description:
      "Five elements. One body. Living now.",
    images: ["/og-earth.png"],
  },
};

export default function WholeHome() {
  return <ConstellationPlaceholder mode="whole" />;
}
