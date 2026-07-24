import type { NatalChart } from "@/lib/reading-engine";

type BirthInput = { birthDate: string; birthTime?: string; birthPlace: string };
type Point = { sign: string; degrees?: number; house?: number };

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

function toSign(longitude: number): Point {
  const normalized = ((longitude % 360) + 360) % 360;
  return { sign: SIGNS[Math.floor(normalized / 30)], degrees: normalized % 30 };
}

function opposite(point: Point): Point {
  const index = SIGNS.findIndex(
    (sign) => sign.toLowerCase() === point.sign.toLowerCase(),
  );
  return toSign(Math.max(index, 0) * 30 + (point.degrees || 0) + 180);
}

function position(data: Record<string, unknown>, key: string): Point {
  const value = data[key] as Record<string, unknown> | undefined;
  const longitude = Number(value?.longitude ?? value?.lon ?? 0);
  const fallback = toSign(longitude);
  const house = Number(value?.house);
  return {
    sign: String(value?.sign ?? fallback.sign),
    degrees: Number(value?.degrees ?? fallback.degrees),
    ...(Number.isInteger(house) && house >= 1 && house <= 12 ? { house } : {}),
  };
}

async function geocode(place: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
    {
      headers: {
        "User-Agent":
          "Whole Body Earth reading service (support@wholebody.earth)",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok)
    throw new Error(
      "Birthplace lookup is unavailable. Please try again shortly.",
    );
  const locations = (await response.json()) as Array<{
    lat: string;
    lon: string;
  }>;
  if (!locations[0])
    throw new Error(
      "We could not locate that birthplace. Try including city and country.",
    );
  return { lat: Number(locations[0].lat), lon: Number(locations[0].lon) };
}

export async function getNatalChart(input: BirthInput): Promise<NatalChart> {
  const apiUrl = process.env.SWISSEPH_API_URL;
  if (!apiUrl)
    throw new Error(
      "The chart service is not configured yet. Please check back shortly.",
    );

  const { lat, lon } = await geocode(input.birthPlace);
  const params = new URLSearchParams({
    date: input.birthDate,
    lat: String(lat),
    lon: String(lon),
    houseSystem: "placidus",
  });
  if (input.birthTime) params.set("time", input.birthTime);
  const headers = process.env.SWISSEPH_API_KEY
    ? { "X-API-Key": process.env.SWISSEPH_API_KEY }
    : undefined;
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/natal?${params}`, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: unknown;
    } | null;
    throw new Error(
      typeof payload?.error === "string"
        ? payload.error
        : "The chart service is unavailable. Please try again shortly.",
    );
  }

  const data = (await response.json()) as Record<string, unknown>;
  const planets = (data.planets || data.bodies || {}) as Record<
    string,
    unknown
  >;
  const ascendant = position(data, "ascendant");
  const northNode = position(planets, "northNode");
  return {
    sun: position(planets, "sun"),
    moon: position(planets, "moon"),
    mercury: position(planets, "mercury"),
    venus: position(planets, "venus"),
    mars: position(planets, "mars"),
    ascendant,
    midheaven: position(data, "midheaven"),
    descendant: data.descendant
      ? position(data, "descendant")
      : opposite(ascendant),
    northNode,
    southNode: planets.southNode
      ? position(planets, "southNode")
      : opposite(northNode),
  };
}
