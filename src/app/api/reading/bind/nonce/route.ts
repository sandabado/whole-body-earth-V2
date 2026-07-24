import { NextResponse } from "next/server";
import { issueReadingNonce } from "@/lib/wallet/nonce-store";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(issueReadingNonce(), {
    headers: { "Cache-Control": "no-store" },
  });
}
