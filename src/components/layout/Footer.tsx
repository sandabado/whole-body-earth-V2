"use client";

import { usePathname } from "next/navigation";
import ConstellationStrip from "@/components/Navigation/ConstellationStrip";
import { PressFooter } from "@/components/press/PressFooter";

export function Footer() {
  const pathname = usePathname();
  return pathname.startsWith("/pillars/press") ? <PressFooter /> : <ConstellationStrip />;
}
