import type { Metadata } from "next";
import { AccountDashboard } from "@/components/guild/AccountDashboard";

export const metadata: Metadata = {
  title: "Account · ØDIN Observer OS",
  description:
    "View your wallet-bound Dodecanic reading and Whole Body Guild status.",
};

type AccountPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ObserverAccountPage({
  searchParams,
}: AccountPageProps) {
  const params = await searchParams;
  return <AccountDashboard checkoutReturned={params.membership === "active"} />;
}
