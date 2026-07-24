import { byteToBinary, indicesToByte, parseSignal, signalToActiveIndices } from "./signal-parser";
import { resolveCurrentPair } from "./current-pair";
import { HOUSE_ROMAN } from "./house-spectrum";
import { calculateWholeBodyState, type HouseFaceState } from "./quincunx/whole-body";
import { CURRENTS, type CycleResult, type Interaction, type Position9Response, type ValveAction } from "./types";
import { HOUSE_DEFINITIONS } from "@/types/houses";

const DISCLOSURE = "This is a Dodecanic suggestion, not a directive." as const;

function sortByCoherence(direction: "ascending" | "descending") {
  return (faceA: HouseFaceState, faceB: HouseFaceState): number => {
    const difference = faceA.coherence - faceB.coherence;
    if (Math.abs(difference) > Number.EPSILON) {
      return direction === "ascending" ? difference : -difference;
    }
    return faceA.house.number - faceB.house.number;
  };
}

function buildPosition9Response(cycle: Pick<CycleResult, "inputText" | "activeCurrents" | "finalValve" | "createdAt">): Position9Response {
  const body = calculateWholeBodyState(cycle);
  const activeFaces = body.faces
    .filter((face) => face.active)
    .sort((faceA, faceB) => faceA.house.number - faceB.house.number);
  const fallbackFace = body.faces.find((face) => face.house.number === 5)!;
  const questionFace = [...activeFaces].sort(sortByCoherence("ascending"))[0] ?? fallbackFace;
  const actionFace = [...activeFaces].sort(sortByCoherence("descending"))[0] ?? fallbackFace;
  const listedFaces = activeFaces.slice(0, 3)
    .map((face) => `House ${HOUSE_ROMAN[face.house.number]} (${face.house.name}) at ${Math.round(face.coherence * 100)}%`);
  const remainder = activeFaces.length > 3 ? `, with ${activeFaces.length - 3} more active` : "";
  const expressesDisagreement = /\b(does not resonate|doesn't resonate|not accurate|disagree|dismiss this reading)\b/i.test(cycle.inputText);
  const reflection = expressesDisagreement
    ? "You know yourself better than this instrument does. If this reading does not resonate, you may dismiss it. Your assessment takes precedence over the model."
    : activeFaces.length > 0
      ? `Your words emphasized ${listedFaces.join(", ")}${remainder}. These are modeled prompt values, not natal, biometric, or objective facts.`
      : `No prompt-derived House is active. House ${HOUSE_ROMAN[5]} (${HOUSE_DEFINITIONS[5].name}) remains the canonical front, not an inferred reading.`;

  return {
    reflection,
    question: questionFace.house.question,
    nextAction: `Consider this: ${actionFace.house.suggestedAction}`,
    disclosure: DISCLOSURE,
    questionHouse: questionFace.house.number,
    actionHouse: actionFace.house.number,
  };
}

export function runDodecanicCycle(inputText: string): CycleResult {
  const inputSignal = parseSignal(inputText);
  const activeIndices = signalToActiveIndices(inputSignal);
  const stateByte = indicesToByte(activeIndices);
  const interactions: Interaction[] = [];

  for (let a = 0; a < activeIndices.length; a += 1) {
    for (let b = a + 1; b < activeIndices.length; b += 1) {
      const currentA = activeIndices[a];
      const currentB = activeIndices[b];
      const resolution = resolveCurrentPair(CURRENTS[currentA].symbol, CURRENTS[currentB].symbol);
      interactions.push({
        currentA: CURRENTS[currentA].symbol,
        currentB: CURRENTS[currentB].symbol,
        lookupCode: resolution.lookupCode,
        valveAction: resolution.valveAction,
      });
    }
  }

  const finalValve: ValveAction = interactions.some((item) => item.valveAction === "CLOSE")
    ? "CLOSE"
    : interactions.some((item) => item.valveAction === "MONITOR")
      ? "MONITOR"
      : "OPEN";

  const createdAt = new Date().toISOString();
  const activeCurrents = activeIndices.map((index) => CURRENTS[index].symbol);
  const position9 = buildPosition9Response({ inputText, activeCurrents, finalValve, createdAt });

  return {
    inputText,
    inputSignal,
    stateByte,
    activeCurrents,
    interactions,
    finalValve,
    position9,
    response: `${position9.reflection} ${position9.question} ${position9.nextAction} ${position9.disclosure}`,
    createdAt,
  };
}

export { byteToBinary };
