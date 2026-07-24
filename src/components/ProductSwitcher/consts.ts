import { PILLAR_BRANDS } from "@/lib/pillar-brands";
import { PILLARS } from "@/lib/pillars";

export interface AppData {
  name: string;
  icon: string;
  element: string;
  status: "HERE" | "ACTIVE" | "LOCKED" | "INVESTOR";
  url: string;
  subtitle: string;
  brandColor: string;
}

export const constellationApps: AppData[] = [
  { name: "Whole Body Earth", icon: "♁", element: "CONSTELLATION", status: "ACTIVE", url: "/", subtitle: "Active", brandColor: PILLAR_BRANDS.constellation },
  ...(["presence", "foundation", "press", "guardian", "studios"] as const).map((id) => ({ name: PILLARS[id].name, icon: PILLARS[id].symbol, element: PILLARS[id].elementLabel.toUpperCase(), status: id === "studios" ? "HERE" : "ACTIVE", url: PILLARS[id].href, subtitle: PILLARS[id].releaseLabel, brandColor: PILLARS[id].color, } satisfies AppData)),
];

export const investorPortal: AppData = {
  name: "Partnerships",
  icon: "✦",
  element: "CONSTELLATION",
  status: "INVESTOR",
  url: "/apply",
  subtitle: "Apply",
  brandColor: PILLAR_BRANDS.constellation,
};
