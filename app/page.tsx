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
        url: "/og-home-v2.png",
        width: 1730,
        height: 909,
        alt: "Whole Body Earth — four elemental pillars held around Guardian at the center",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whole Body Earth — Five Elements. One Body.",
    description:
      "Five elements. One body. Living now.",
    images: ["/og-home-v2.png"],
  },
};

export default function WholeHome() {
  return <ConstellationPlaceholder mode="whole" />;
}
