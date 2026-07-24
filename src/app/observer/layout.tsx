import type { Metadata } from "next";
import { PortalLayout } from "@/components/shared/PortalLayout";
import "./design-system.css";
import "./observer-source.css";
import "./observer.css";

export const metadata: Metadata = {
  title: "ØDIN Observer OS",
  description: "System coherence, twelve Houses, quincunx visualization, and Dodecanic readings.",
};

export default function ObserverLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayout
      title="ØDIN"
      description="Observer OS — System coherence, 12 Houses, quincunx visualization, Dodecanic readings"
      domain="dodeca.life"
      accentColor="border-purple-500/20"
    >
      {children}
    </PortalLayout>
  );
}
