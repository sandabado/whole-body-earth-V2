export type House = {
  number: number
  name: string
  archetype: string
  element: string
  chakra: string
  archangel: string
  planet: string
  role: string
  frequency: number
}

export type SystemVote = {
  system: string
  votedFor: number
  points: number
}

export type DodecaReading = {
  primaryHouse: House
  secondaryHouse: House | null
  confidence: number
  confidenceLabel: "Certain" | "Confirmed" | "Likely" | "Exploring"
  systemVotes: SystemVote[]
  recommendation: string | null
}

// Phase 1 uses a deterministic approximation across authored symbolic systems.
// TODO Phase 2: Upgrade to the Swiss Ephemeris implementation.
// See: dodecanic-system/lib/astrology/swiss-ephemeris.ts
export const HOUSES: House[] = [
  { number: 1, name: "Ground", archetype: "The Root", element: "Earth", chakra: "Root", archangel: "Hanael", planet: "Mercury", role: "Warrior", frequency: 128 },
  { number: 2, name: "Flow", archetype: "The Steward", element: "Water", chakra: "Sacral", archangel: "Zaphkiel", planet: "Venus", role: "Feeler", frequency: 170.6 },
  { number: 3, name: "Tech", archetype: "The Communicator", element: "Fire", chakra: "Solar Plexus", archangel: "Jophiel", planet: "Pluto", role: "Navigator", frequency: 227.5 },
  { number: 4, name: "Heart", archetype: "The Homekeeper", element: "Water", chakra: "Heart", archangel: "Rafael", planet: "Saturn", role: "Healer", frequency: 256 },
  { number: 5, name: "Sound", archetype: "The Creator", element: "Air", chakra: "Throat", archangel: "Gabriel", planet: "Moon", role: "Truth", frequency: 286.9 },
  { number: 6, name: "Voice", archetype: "The Healer", element: "Air", chakra: "Third Eye", archangel: "Raziel", planet: "Neptune", role: "Communicator", frequency: 322 },
  { number: 7, name: "Story", archetype: "The Partner", element: "Water", chakra: "Crown", archangel: "Michael", planet: "Sun", role: "Protector", frequency: 341.3 },
  { number: 8, name: "Gather", archetype: "The Alchemist", element: "Fire", chakra: "Ketheric", archangel: "Uriel", planet: "Uranus", role: "Gatekeeper", frequency: 361.8 },
  { number: 9, name: "Wisdom", archetype: "The Scholar", element: "Air", chakra: "Earth Star", archangel: "Sandalphon", planet: "Earth", role: "Artist", frequency: 383.7 },
  { number: 10, name: "Law", archetype: "The Sovereign", element: "Earth", chakra: "Cosmic Heart", archangel: "Zadkiel", planet: "Jupiter", role: "Master", frequency: 405 },
  { number: 11, name: "Future", archetype: "The Visionary", element: "Fire", chakra: "Soul Star", archangel: "Shamael", planet: "Mars", role: "Leader", frequency: 428 },
  { number: 12, name: "Tribe", archetype: "The Elder", element: "Earth", chakra: "Stellar Gateway", archangel: "Metatron", planet: "Chiron", role: "Teacher", frequency: 453 },
]

export const ZODIAC_TO_HOUSE: Record<string, number> = {
  Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
  Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12,
}

export function pillarForElement(element: string): "Foundation" | "Studios" | "Presence" | "Press" | "Guardian" {
  return {
    Earth: "Foundation",
    Water: "Studios",
    Fire: "Presence",
    Air: "Press",
    Ether: "Guardian",
    Aether: "Guardian",
  }[element] as "Foundation" | "Studios" | "Presence" | "Press" | "Guardian" ?? "Guardian"
}

export const PLANET_TO_HOUSE: Record<string, number> = {
  Mercury: 1, Venus: 2, Pluto: 3, Saturn: 4, Moon: 5, Neptune: 6,
  Sun: 7, Uranus: 8, Earth: 9, Jupiter: 10, Mars: 11, Chiron: 12,
}

export const SYSTEM_WEIGHTS = {
  sunSign: 12, chakraPlanet: 10, astroHouses: 8, humanDesign: 5,
  numerology: 4, geneKeys: 3, tarot: 3, iChing: 3, mythology: 3,
  frequency: 2, vortexMath: 2, colorTheory: 2,
} as const

const SIGNS = [
  ["Capricorn", 1, 19], ["Aquarius", 1, 20], ["Pisces", 2, 19],
  ["Aries", 3, 21], ["Taurus", 4, 20], ["Gemini", 5, 21],
  ["Cancer", 6, 21], ["Leo", 7, 23], ["Virgo", 8, 23],
  ["Libra", 9, 23], ["Scorpio", 10, 23], ["Sagittarius", 11, 22],
  ["Capricorn", 12, 22],
] as const

const PLANETS = Object.keys(PLANET_TO_HOUSE)
const ELEMENT_HOUSES: Record<string, number[]> = {
  Air: [3, 5, 6, 9], Earth: [1, 10, 12], Fire: [3, 8, 11], Water: [2, 4, 7],
}

function modHouse(value: number) {
  return ((Math.abs(Math.trunc(value)) - 1) % 12) + 1
}

function dateParts(date: Date) {
  return { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() }
}

export function calculateSunSign(date: Date): string {
  const { day, month } = dateParts(date)
  for (let index = SIGNS.length - 1; index >= 0; index--) {
    const [sign, startMonth, startDay] = SIGNS[index]
    if (month > startMonth || (month === startMonth && day >= startDay)) return sign
  }
  return "Capricorn"
}

/** A deterministic ascendant approximation when ephemeris coordinates are unavailable. */
export function calculateAscendant(date: Date, time = "12:00", location = ""): string {
  const [hours = 12, minutes = 0] = time.split(":").map(Number)
  const { day, month, year } = dateParts(date)
  const locationOffset = [...location.toLowerCase()].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const signIndex = (month * 31 + day + year + hours * 2 + Math.floor(minutes / 10) + locationOffset) % 12
  return Object.keys(ZODIAC_TO_HOUSE)[signIndex]
}

export function calculateDominantPlanets(date: Date): string[] {
  const { day, month, year } = dateParts(date)
  const offset = (day + month * 3 + year) % PLANETS.length
  return PLANETS.map((_, index) => PLANETS[(index + offset) % PLANETS.length])
}

export function calculateLifePath(date: Date): number {
  const digits = date.toISOString().slice(0, 10).replace(/\D/g, "")
  let total = [...digits].reduce((sum, digit) => sum + Number(digit), 0)
  while (total > 9 && ![11, 22].includes(total)) total = [...String(total)].reduce((sum, digit) => sum + Number(digit), 0)
  return total
}

export function calculateTarotBirthCard(date: Date): number {
  const { day, month, year } = dateParts(date)
  return ((day + month + [...String(year)].reduce((sum, digit) => sum + Number(digit), 0) - 1) % 21) + 1
}

export function calculateIChing(date: Date): number {
  const { day, month, year } = dateParts(date)
  return ((day * month + year) % 64) + 1
}

export function calculateHumanDesign(date: Date, time = "12:00", location = "") {
  const types = ["Generator", "Manifesting Generator", "Projector", "Manifestor", "Reflector"]
  const profiles = ["1/3", "2/4", "3/5", "4/6", "5/1", "6/2"]
  const seed = date.getTime() + time.length * 19 + location.length * 37
  return { profile: profiles[Math.abs(seed) % profiles.length], type: types[Math.abs(Math.floor(seed / 7)) % types.length] }
}

export function calculateGeneKeys(hd: { type: string; profile: string }): number[] {
  const seed = [...`${hd.type}${hd.profile}`].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return [seed % 64 + 1, (seed * 3) % 64 + 1, (seed * 7) % 64 + 1]
}

export function calculateVortexMath(date: Date): number[] {
  const { day, month, year } = dateParts(date)
  const reduce = (value: number) => ((value - 1) % 9) + 1
  return [reduce(day), reduce(month), reduce(year), reduce(day + month + year)]
}

export function calculateFrequencyFromElement(element: string): number {
  return { Earth: 128, Water: 256, Fire: 341.3, Air: 383.7 }[element] ?? 405
}

export function calculateColorFromElement(element: string): string {
  return { Earth: "ochre", Water: "indigo", Fire: "crimson", Air: "gold" }[element] ?? "violet"
}

export function inferMythology(zodiac: string): string {
  return ({ Aries: "Ares", Taurus: "Gaia", Gemini: "Hermes", Cancer: "Selene", Leo: "Apollo", Virgo: "Demeter", Libra: "Themis", Scorpio: "Hades", Sagittarius: "Artemis", Capricorn: "Pan", Aquarius: "Prometheus", Pisces: "Poseidon" })[zodiac] ?? "The Spiral"
}

export function calculateDodecaReading(input: { birthDate: string; birthTime?: string; birthLocation?: string }): DodecaReading {
  const date = new Date(`${input.birthDate}T12:00:00.000Z`)
  const time = input.birthTime || "12:00"
  const location = input.birthLocation || ""
  const zodiac = calculateSunSign(date)
  const sunHouse = ZODIAC_TO_HOUSE[zodiac]
  const dominantPlanet = calculateDominantPlanets(date)[0]
  const ascendant = calculateAscendant(date, time, location)
  const hd = calculateHumanDesign(date, time, location)
  const lifePath = calculateLifePath(date)
  const tarot = calculateTarotBirthCard(date)
  const iChing = calculateIChing(date)
  const geneKey = calculateGeneKeys(hd)[0]
  const vortex = calculateVortexMath(date)
  const sunElement = HOUSES[sunHouse - 1].element
  const sameElementHouse = (value: number) => {
    const available = ELEMENT_HOUSES[sunElement] || [sunHouse]
    return available[value % available.length]
  }

  const votes: SystemVote[] = [
    { system: "Astrology · Sun Sign", votedFor: sunHouse, points: SYSTEM_WEIGHTS.sunSign },
    { system: "Chakra Planet", votedFor: PLANET_TO_HOUSE[dominantPlanet], points: SYSTEM_WEIGHTS.chakraPlanet },
    { system: "Astrology · Ascendant", votedFor: ZODIAC_TO_HOUSE[ascendant], points: SYSTEM_WEIGHTS.astroHouses },
    { system: "Human Design", votedFor: modHouse(hd.type.length + hd.profile.length), points: SYSTEM_WEIGHTS.humanDesign },
    { system: "Numerology", votedFor: modHouse(lifePath), points: SYSTEM_WEIGHTS.numerology },
    { system: "Gene Keys", votedFor: modHouse(geneKey), points: SYSTEM_WEIGHTS.geneKeys },
    { system: "Tarot", votedFor: modHouse(tarot), points: SYSTEM_WEIGHTS.tarot },
    { system: "I Ching", votedFor: modHouse(iChing), points: SYSTEM_WEIGHTS.iChing },
    { system: "Mythology", votedFor: sunHouse, points: SYSTEM_WEIGHTS.mythology },
    { system: "Frequency", votedFor: sameElementHouse(Math.round(calculateFrequencyFromElement(sunElement))), points: SYSTEM_WEIGHTS.frequency },
    { system: "Vortex Math", votedFor: modHouse(vortex.reduce((sum, value) => sum + value, 0)), points: SYSTEM_WEIGHTS.vortexMath },
    { system: "Color Theory", votedFor: sameElementHouse(calculateColorFromElement(sunElement).length), points: SYSTEM_WEIGHTS.colorTheory },
  ]

  const scores = Array.from({ length: 12 }, () => 0)
  votes.forEach(({ votedFor, points }) => { scores[votedFor - 1] += points })
  const ranked = scores.map((score, index) => ({ number: index + 1, score })).sort((a, b) => b.score - a.score || a.number - b.number)
  const primary = ranked[0]
  const secondary = ranked[1].score > 0 && primary.score - ranked[1].score <= 15 ? ranked[1] : null
  const confidence = Number(((primary.score / 54) * 100).toFixed(1))
  const confidenceLabel = confidence >= 70 ? "Certain" : confidence >= 45 ? "Confirmed" : confidence >= 30 ? "Likely" : "Exploring"

  return {
    primaryHouse: HOUSES[primary.number - 1],
    secondaryHouse: secondary ? HOUSES[secondary.number - 1] : null,
    confidence,
    confidenceLabel,
    recommendation: confidence < 45 ? "Book with Jesse" : null,
    systemVotes: votes,
  }
}
