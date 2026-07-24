import type { Metadata } from "next";
import { QuincunxDashboard } from "@/components/quincunx/QuincunxDashboard";

export const metadata: Metadata = {
  title: "Living Quincunx — ØDIN",
  description: "Interactive dodecahedral Observer field and whole-system coherence monitor.",
};

export default function QuincunxPage() {
  return <QuincunxDashboard />;
}
