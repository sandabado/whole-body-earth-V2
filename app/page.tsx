import type { Metadata } from "next";
import { EpicHomeExperience } from "./components/home/EpicHomeExperience";
import "./epic-home.css";

export const metadata: Metadata = {
  title: "Whole Body Earth — Five Pillars. One Whole Body.",
  description:
    "Five pillars. One whole body. A living constellation for sovereign creators.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Whole Body Earth — Five Pillars. One Whole Body.",
    description:
      "Five pillars. One whole body.",
    url: "/",
    siteName: "Whole Body Earth",
    images: [
      {
        url: "/og-home-globe.png",
        width: 1733,
        height: 907,
        alt: "Whole Body Earth — four elemental pillars held around Guardian at the center",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whole Body Earth — Five Pillars. One Whole Body.",
    description:
      "Five pillars. One whole body.",
    images: ["/og-home-globe.png"],
  },
};

export default function WholeHome() {
  return <EpicHomeExperience />;
}
