import { NextResponse } from "next/server";

export function GET() {
  const hour = new Date().getUTCHours() - 7;
  const normalized = hour < 0 ? hour + 24 : hour;
  const status = normalized >= 10 && normalized < 18 ? "RECORDING" : normalized >= 18 && normalized < 23 ? "MIXING" : "STANDING BY";
  return NextResponse.json({ status, location: "DESERT STUDIO", updatedAt: new Date().toISOString() });
}
