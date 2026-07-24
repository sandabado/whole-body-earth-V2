import type { Metadata } from "next";
import { GuildMembership } from "@/components/guild/GuildMembership";

export const metadata: Metadata = {
  title: "Sovereign Guild · ØDIN Observer OS",
  description:
    "Join the Whole Body Guild for readings, gatherings, directory access, voting, AMAs, and member discounts.",
};

export default function ObserverGuildPage() {
  return <GuildMembership />;
}
