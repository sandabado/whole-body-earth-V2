import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json([
    { text: "SANDĀBĀDO · ∞ LOVE — FINAL MIX", isSystemLog: false },
    { text: "SYS: SYNC LEAD GENERATED — INDEPENDENT FILM", isSystemLog: true },
    { text: "LIVING EARTH · VOL. 1 — MASTERING", isSystemLog: false },
    { text: "SYS: TEST PRESSING APPROVED — 180G VINYL", isSystemLog: true },
  ]);
}
