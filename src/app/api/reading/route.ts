import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { calculateReading } from "@/lib/reading-engine";
import { getNatalChart } from "@/lib/swisseph";
import { createClient } from "@/utils/supabase/server";

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
const TIME_FORMAT = /^([01]\d|2[0-3]):[0-5]\d$/;

function validDate(value: string) {
  return DATE_FORMAT.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { birthDate?: unknown; birthTime?: unknown; birthPlace?: unknown; website?: unknown };
    const birthDate = typeof body.birthDate === "string" ? body.birthDate.trim() : "";
    const birthTime = typeof body.birthTime === "string" ? body.birthTime.trim() : "";
    const birthPlace = typeof body.birthPlace === "string" ? body.birthPlace.trim() : "";

    if (typeof body.website === "string" && body.website) {
      return NextResponse.json({ error: "Unable to calculate this reading." }, { status: 400 });
    }
    if (!validDate(birthDate) || (birthTime && !TIME_FORMAT.test(birthTime)) || !birthPlace || birthPlace.length > 200) {
      return NextResponse.json({ error: "Enter a valid birth date, optional time, and birthplace." }, { status: 400 });
    }

    const chart = await getNatalChart({ birthDate, birthTime: birthTime || undefined, birthPlace });
    const result = calculateReading(chart, Boolean(birthTime));
    let saved = false;

    try {
      const supabase = createClient(await cookies());
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("readings").insert({
          user_id: user.id,
          birth_date: birthDate,
          birth_time: birthTime || null,
          birth_place: birthPlace,
          has_birth_time: Boolean(birthTime),
          dominant_pillar: result.dominantPillar,
          dominant_body: result.dominantBody,
          secondary_pillar: result.secondaryPillar,
          is_guardian: result.isGuardian,
          confidence: result.confidence,
          chart_json: chart,
          reading_json: result,
          engine_version: "quincunx-v1",
        });
        if (error) console.error("Reading insert error:", error);
        else saved = true;
      }
    } catch (storageError) {
      console.error("Reading completed but could not be saved:", storageError);
    }

    return NextResponse.json({ result, saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The reading could not be calculated.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ endpoint: "POST /api/reading", status: "operational" });
}
