import { NextResponse } from "next/server";
import {
  calculateDodecaReading,
  pillarForElement,
} from "@/lib/reading/house-calculator";

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const birthDate = optionalString(body.birthDate);
  const birthTime = optionalString(body.birthTime);
  const birthLocation = optionalString(body.birthLocation);

  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(Date.parse(`${birthDate}T12:00:00Z`))) {
    return NextResponse.json({ error: "Please enter a valid birth date." }, { status: 400 });
  }
  if (birthTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(birthTime)) {
    return NextResponse.json({ error: "Birth time must use HH:MM." }, { status: 400 });
  }

  const reading = calculateDodecaReading({ birthDate, birthTime, birthLocation });
  const result = {
    house: reading.primaryHouse.number,
    houseName: reading.primaryHouse.name,
    element: reading.primaryHouse.element,
    archetype: reading.primaryHouse.archetype,
    pillar: pillarForElement(reading.primaryHouse.element),
    confidence: reading.confidence,
    confidenceLabel: reading.confidenceLabel,
  };

  return NextResponse.json({ reading: result }, {
    headers: { "Cache-Control": "no-store" },
  });
}
