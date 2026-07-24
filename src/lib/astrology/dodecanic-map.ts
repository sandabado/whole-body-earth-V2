import { ZODIAC_SIGNS, type ZodiacSign } from "./types";
import { HOUSE_DEFINITIONS, type HouseElement, type HouseNumber } from "@/types/houses";

export const ZODIAC_TO_DODECANIC_HOUSE: Readonly<Record<ZodiacSign, HouseNumber>> = {
  aries: 3,
  taurus: 1,
  gemini: 6,
  cancer: 4,
  leo: 5,
  virgo: 2,
  libra: 7,
  scorpio: 8,
  sagittarius: 11,
  capricorn: 10,
  aquarius: 9,
  pisces: 12,
};

export const DODECANIC_HOUSE_TO_ZODIAC = Object.fromEntries(
  Object.entries(ZODIAC_TO_DODECANIC_HOUSE).map(([sign, house]) => [house, sign]),
) as Readonly<Record<HouseNumber, ZodiacSign>>;

const ZODIAC_ELEMENTS: Readonly<Record<ZodiacSign, HouseElement>> = {
  aries: "fire",
  taurus: "earth",
  gemini: "air",
  cancer: "water",
  leo: "fire",
  virgo: "earth",
  libra: "air",
  scorpio: "water",
  sagittarius: "fire",
  capricorn: "earth",
  aquarius: "air",
  pisces: "water",
};

export type HousePresenceLevel = "pending" | "dim" | "lit" | "bright";

export interface HousePresenceState {
  house: HouseNumber;
  level: HousePresenceLevel;
  natalPlacements: number;
  transitActivations: number;
}

export type HousePresenceMap = Readonly<Record<HouseNumber, HousePresenceState>>;

const HOUSE_NUMBERS = Object.keys(HOUSE_DEFINITIONS).map(Number) as HouseNumber[];

export const PENDING_HOUSE_PRESENCE = Object.fromEntries(
  HOUSE_NUMBERS.map((house) => [house, {
    house,
    level: "pending",
    natalPlacements: 0,
    transitActivations: 0,
  }]),
) as HousePresenceMap;

export function mapZodiacSignToDodecanicHouse(sign: ZodiacSign): HouseNumber {
  return ZODIAC_TO_DODECANIC_HOUSE[sign];
}

/**
 * Builds verified face-presence state. `activatedTransitSigns` must already be
 * filtered through the ratified transit/aspect rules; a planet merely being in
 * a sign does not make this function declare a bright activation.
 */
export function calculateHousePresence(
  natalSigns: readonly ZodiacSign[],
  activatedTransitSigns: readonly ZodiacSign[],
): HousePresenceMap {
  const natalCounts = new Map<HouseNumber, number>();
  const transitCounts = new Map<HouseNumber, number>();

  natalSigns.forEach((sign) => {
    const house = mapZodiacSignToDodecanicHouse(sign);
    natalCounts.set(house, (natalCounts.get(house) ?? 0) + 1);
  });
  activatedTransitSigns.forEach((sign) => {
    const house = mapZodiacSignToDodecanicHouse(sign);
    transitCounts.set(house, (transitCounts.get(house) ?? 0) + 1);
  });

  return Object.fromEntries(HOUSE_NUMBERS.map((house) => {
    const natalPlacements = natalCounts.get(house) ?? 0;
    const transitActivations = transitCounts.get(house) ?? 0;
    const level: HousePresenceLevel = transitActivations > 0
      ? "bright"
      : natalPlacements > 0
        ? "lit"
        : "dim";
    return [house, { house, level, natalPlacements, transitActivations }];
  })) as HousePresenceMap;
}

const mappedHouses = Object.values(ZODIAC_TO_DODECANIC_HOUSE);
if (mappedHouses.length !== ZODIAC_SIGNS.length
  || new Set(mappedHouses).size !== HOUSE_NUMBERS.length
  || ZODIAC_SIGNS.some((sign) => HOUSE_DEFINITIONS[ZODIAC_TO_DODECANIC_HOUSE[sign]].element !== ZODIAC_ELEMENTS[sign])
) {
  throw new Error("Amendment 01 zodiac, House, and element invariants failed.");
}
