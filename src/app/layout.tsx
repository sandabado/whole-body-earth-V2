import type { Metadata } from "next";
import { Cinzel, DM_Mono, Inter } from "next/font/google";
import PillarAtlasLayer from "@/components/backgrounds/PillarAtlasLayer";
import { EventDrawer } from "@/components/Navigation/EventDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WalletProvider } from "@/components/providers/WalletProvider";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wholebody.earth"),
  icons: {
    icon: [{ url: "/icon.svg?v=2", type: "image/svg+xml", sizes: "any" }],
    shortcut: ["/icon.svg?v=2"],
  },
  title: "Whole Body Earth — Five Pillars. One Whole Body.",
  description:
    "A network for sovereign creators. Five pillars, one living system.",
  keywords: [
    "Whole Body Earth",
    "Quincunx",
    "sovereign creators",
    "creative practice",
    "Whole Body Studios",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Whole Body Earth",
    description: "Five pillars. One whole body. A network for sovereign creators.",
    url: "https://www.wholebody.earth",
    siteName: "Whole Body Earth",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${dmMono.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <WalletProvider>
          <PillarAtlasLayer />
          <Header />
          <EventDrawer />
          <main className="relative z-10 flex-1">{children}</main>
          <div className="relative z-10"><Footer /></div>
        </WalletProvider>
      </body>
    </html>
  );
}
