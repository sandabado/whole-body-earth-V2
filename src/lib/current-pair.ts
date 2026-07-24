import { CURRENTS, type ValveAction } from "./types";

const LOOKUP_TABLE = [
  ["COMP", "BREATH", "VORTEX", "GROUND", "SING", "WITH", "ENCODE", "SEED"],
  ["BREATH", "AMP", "AMP", "OPEN", "MON", "MON", "OPEN", "OPEN"],
  ["VORTEX", "AMP", "HUM", "AC", "INT", "FEED", "SPIRAL", "DEC"],
  ["GROUND", "OPEN", "AC", "MON", "OPEN", "OPEN", "OPEN", "OPEN"],
  ["SING", "MON", "INT", "OPEN", "GRID", "MON", "MON", "HALT"],
  ["WITH", "MON", "FEED", "OPEN", "MON", "MIRROR", "OPEN", "OPEN"],
  ["ENCODE", "OPEN", "SPIRAL", "OPEN", "MON", "OPEN", "TRAP", "OPEN"],
  ["SEED", "OPEN", "DEC", "OPEN", "HALT", "OPEN", "OPEN", "RESET"],
] as const;

const MONITOR_CODES = new Set(["COMP", "SING", "INT", "WITH", "ENCODE", "MON"]);
const CLOSE_CODES = new Set(["GRID", "MIRROR", "TRAP", "HALT"]);

function valveFor(code: string): ValveAction {
  if (CLOSE_CODES.has(code)) return "CLOSE";
  if (MONITOR_CODES.has(code)) return "MONITOR";
  return "OPEN";
}

export interface CurrentPairResolution {
  lookupCode: string;
  valveAction: ValveAction;
}

export function resolveCurrentPair(
  currentA: string,
  currentB: string,
): CurrentPairResolution {
  const indexA = CURRENTS.findIndex((current) => current.symbol === currentA);
  const indexB = CURRENTS.findIndex((current) => current.symbol === currentB);
  if (indexA < 0 || indexB < 0) {
    return { lookupCode: "UNKNOWN", valveAction: "MONITOR" };
  }
  const lookupCode = LOOKUP_TABLE[indexA][indexB];
  return { lookupCode, valveAction: valveFor(lookupCode) };
}
