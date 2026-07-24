import tzLookup from "tz-lookup";
import {
  calculateHouses,
  calculatePosition,
  dateToJulianDay,
  HouseSystem,
  LunarPoint,
  Planet,
} from "@swisseph/node";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
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
const HOUSE_SYSTEMS = {
  placidus: HouseSystem.Placidus,
  koch: HouseSystem.Koch,
  porphyrius: HouseSystem.Porphyrius,
  regiomontanus: HouseSystem.Regiomontanus,
  campanus: HouseSystem.Campanus,
  equal: HouseSystem.Equal,
  wholesign: HouseSystem.WholeSign,
};

const PLANETS = {
  sun: Planet.Sun,
  moon: Planet.Moon,
  mercury: Planet.Mercury,
  venus: Planet.Venus,
  mars: Planet.Mars,
  jupiter: Planet.Jupiter,
  saturn: Planet.Saturn,
  uranus: Planet.Uranus,
  neptune: Planet.Neptune,
  pluto: Planet.Pluto,
  northNode: LunarPoint.TrueNode,
};

export class InputError extends Error {}

function required(searchParams, name) {
  const value = searchParams.get(name)?.trim();
  if (!value) throw new InputError(`Missing ${name}.`);
  return value;
}

function number(searchParams, name, minimum, maximum) {
  const value = Number(required(searchParams, name));
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new InputError(`${name} must be between ${minimum} and ${maximum}.`);
  }
  return value;
}

function validDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}

export function parseNatalRequest(searchParams) {
  const birthDate = required(searchParams, "date");
  const birthTime = searchParams.get("time")?.trim() || null;
  const houseSystem = (
    searchParams.get("houseSystem") || "placidus"
  ).toLowerCase();

  if (!validDate(birthDate))
    throw new InputError("date must be a valid YYYY-MM-DD value.");
  if (birthTime && !TIME_PATTERN.test(birthTime))
    throw new InputError("time must be an HH:MM 24-hour value.");
  if (!HOUSE_SYSTEMS[houseSystem])
    throw new InputError("Unsupported houseSystem.");

  const [year] = birthDate.split("-").map(Number);
  if (year < 1800 || year > 2100)
    throw new InputError("date must be between 1800 and 2100.");

  return {
    birthDate,
    birthTime,
    latitude: number(searchParams, "lat", -90, 90),
    longitude: number(searchParams, "lon", -180, 180),
    houseSystem,
  };
}

function partsFor(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)]),
  );
}

function offsetMinutesAt(timestamp, timeZone) {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(timestamp))
    .find(({ type }) => type === "timeZoneName")?.value;
  if (!part || part === "GMT") return 0;
  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(part);
  if (!match)
    throw new Error(`Unable to resolve the UTC offset for ${timeZone}.`);
  const minutes = Number(match[2]) * 60 + Number(match[3] || 0);
  return match[1] === "+" ? minutes : -minutes;
}

function sameCivilTime(parts, target) {
  return (
    parts.year === target.year &&
    parts.month === target.month &&
    parts.day === target.day &&
    parts.hour === target.hour &&
    parts.minute === target.minute
  );
}

/** Converts a local civil time at a coordinate into UTC and rejects DST ambiguity. */
export function zonedDateTimeToUtc({
  birthDate,
  birthTime,
  latitude,
  longitude,
}) {
  const timeZone = tzLookup(latitude, longitude);
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = (birthTime || "12:00").split(":").map(Number);
  const target = { year, month, day, hour, minute };
  const assumedUtc = Date.UTC(year, month - 1, day, hour, minute);
  const offsets = new Set([
    offsetMinutesAt(assumedUtc - 86_400_000, timeZone),
    offsetMinutesAt(assumedUtc, timeZone),
    offsetMinutesAt(assumedUtc + 86_400_000, timeZone),
  ]);
  const matches = [...offsets]
    .map((offset) => new Date(assumedUtc - offset * 60_000))
    .filter((candidate) =>
      sameCivilTime(partsFor(candidate, timeZone), target),
    );

  if (matches.length === 1) return { date: matches[0], timeZone };
  if (matches.length > 1)
    throw new InputError(
      "That local birth time occurs twice during a daylight-saving transition. Please provide a time outside the transition hour.",
    );
  throw new InputError(
    "That local birth time does not exist in this time zone because of a daylight-saving transition. Please check the birth record.",
  );
}

function point(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  return {
    longitude: Number(normalized.toFixed(6)),
    sign: SIGNS[Math.floor(normalized / 30)],
    degrees: Number((normalized % 30).toFixed(6)),
  };
}

function opposite(position) {
  return point(position.longitude + 180);
}

function houseFor(longitude, cusps) {
  const normalized = ((longitude % 360) + 360) % 360;
  for (let index = 0; index < cusps.length; index += 1) {
    const start = cusps[index];
    const end = cusps[(index + 1) % cusps.length];
    const span = (end - start + 360) % 360;
    const position = (normalized - start + 360) % 360;
    if (position < span || (index === cusps.length - 1 && position === span))
      return index + 1;
  }
  return 12;
}

export function calculateNatalChart(input) {
  const { date, timeZone } = zonedDateTimeToUtc(input);
  const julianDay = dateToJulianDay(date);
  const houses = calculateHouses(
    julianDay,
    input.latitude,
    input.longitude,
    HOUSE_SYSTEMS[input.houseSystem],
  );
  const cusps = houses.cusps.slice(1);
  const planets = Object.fromEntries(
    Object.entries(PLANETS).map(([name, body]) => {
      const position = point(calculatePosition(julianDay, body).longitude);
      return [
        name,
        { ...position, house: houseFor(position.longitude, cusps) },
      ];
    }),
  );
  const ascendant = { ...point(houses.ascendant), house: 1 };

  return {
    engine: "swisseph-1.2.2",
    zodiac: "tropical",
    houseSystem: input.houseSystem,
    calculatedAt: new Date().toISOString(),
    utc: date.toISOString(),
    input: {
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      timeKnown: Boolean(input.birthTime),
      timeZone,
      latitude: input.latitude,
      longitude: input.longitude,
    },
    planets: {
      ...planets,
      southNode: {
        ...opposite(planets.northNode),
        house: houseFor(planets.northNode.longitude + 180, cusps),
      },
    },
    ascendant,
    midheaven: point(houses.mc),
    descendant: opposite(ascendant),
    houses: cusps.map(point),
  };
}
