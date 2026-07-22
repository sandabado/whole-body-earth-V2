import type { Metadata } from "next";
import { requireChatGPTUser } from "../../chatgpt-auth";
import { HeroConfigAdmin } from "./HeroConfigAdmin";

export const metadata: Metadata = {
  title: "Hero Configuration",
  robots: { index: false, follow: false },
};

export default async function HeroConfigsAdminPage() {
  const user = await requireChatGPTUser("/admin/hero-configs");
  return <HeroConfigAdmin editorName={user.displayName} />;
}
