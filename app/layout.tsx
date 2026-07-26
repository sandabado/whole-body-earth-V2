import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { WholeBodyTransitionProvider } from "./components/WholeBodyTransition";
import "./globals.css";
import "./design-system.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wholebody.earth"),
  title: {
    default: "Whole Body Earth — Five Pillars. One Whole Body.",
    template: "%s — Whole Body Earth",
  },
  description: "Five pillars. One whole body. A living constellation for sovereign creators.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Whole Body Earth — Five Pillars. One Whole Body.",
    description: "Five pillars. One whole body.",
    type: "website",
    siteName: "Whole Body Earth",
    images: [
      {
        url: "/og-home-globe.png",
        width: 1733,
        height: 907,
        alt: "Whole Body Earth — five pillars held in one living constellation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whole Body Earth — Five Pillars. One Whole Body.",
    description: "Five pillars. One whole body.",
    images: ["/og-home-globe.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <WholeBodyTransitionProvider>{children}</WholeBodyTransitionProvider>
      </body>
    </html>
  );
}
