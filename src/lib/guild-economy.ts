import { DODECAHEDRON_EDGES, getAdjacentHouses } from "@/lib/dodecahedron/topology";
import type { SovereigntyEntry } from "@/lib/sovereignty";
import type { HouseNumber } from "@/types/houses";

export const GUILD_PROJECT_STORAGE_KEY = "dodecanic.guild-projects.v1";

export type GuildProjectStatus = "open" | "in_progress" | "completed" | "cancelled";

export interface GuildProject {
  id: string;
  title: string;
  description: string;
  postingHouse: HouseNumber;
  requiredHouse: HouseNumber;
  budget: number;
  deadline: string;
  status: GuildProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export const REVENUE_ALLOCATION_POLICY = [
  { id: "worker", label: "Feed First / worker plan", percent: 30 },
  { id: "operations", label: "House operations plan", percent: 20 },
  { id: "reserve", label: "AURA / reserve plan", percent: 20 },
  { id: "growth", label: "FLUX / growth plan", percent: 15 },
  { id: "community", label: "Community plan", percent: 10 },
  { id: "governance", label: "Governance plan", percent: 5 },
] as const;

export interface RevenueAllocation {
  id: (typeof REVENUE_ALLOCATION_POLICY)[number]["id"];
  label: string;
  percent: number;
  amount: number;
}

export function calculateRevenueAllocation(amount: number): RevenueAllocation[] {
  const safeCents = Math.max(0, Math.round(amount * 100));
  let assignedCents = 0;
  return REVENUE_ALLOCATION_POLICY.map((allocation, index) => {
    const cents = index === REVENUE_ALLOCATION_POLICY.length - 1
      ? safeCents - assignedCents
      : Math.round(safeCents * allocation.percent / 100);
    assignedCents += cents;
    return { ...allocation, amount: cents / 100 };
  });
}

export function findShortestHouseRoute(from: HouseNumber, to: HouseNumber): HouseNumber[] {
  if (from === to) return [from];
  const queue: HouseNumber[][] = [[from]];
  const visited = new Set<HouseNumber>([from]);
  while (queue.length > 0) {
    const route = queue.shift()!;
    const current = route[route.length - 1];
    for (const neighbor of getAdjacentHouses(current).sort((a, b) => a - b)) {
      if (visited.has(neighbor)) continue;
      const nextRoute = [...route, neighbor];
      if (neighbor === to) return nextRoute;
      visited.add(neighbor);
      queue.push(nextRoute);
    }
  }
  return [];
}

export function edgeIdForHouses(houseA: HouseNumber, houseB: HouseNumber): string | null {
  return DODECAHEDRON_EDGES.find((edge) => (
    edge.houseA === houseA && edge.houseB === houseB
  ) || (
    edge.houseA === houseB && edge.houseB === houseA
  ))?.id ?? null;
}

export function isGuildProject(value: unknown): value is GuildProject {
  if (!value || typeof value !== "object") return false;
  const project = value as Partial<GuildProject>;
  return typeof project.id === "string"
    && typeof project.title === "string"
    && typeof project.description === "string"
    && Number.isInteger(project.postingHouse)
    && project.postingHouse! >= 1
    && project.postingHouse! <= 12
    && Number.isInteger(project.requiredHouse)
    && project.requiredHouse! >= 1
    && project.requiredHouse! <= 12
    && typeof project.budget === "number"
    && Number.isFinite(project.budget)
    && project.budget >= 0
    && typeof project.deadline === "string"
    && ["open", "in_progress", "completed", "cancelled"].includes(project.status ?? "")
    && typeof project.createdAt === "string"
    && typeof project.updatedAt === "string";
}

export function economyTotals(entries: readonly SovereigntyEntry[], startDate: string) {
  const relevant = entries.filter((entry) => entry.date >= startDate);
  const revenue = relevant.filter((entry) => entry.metric === "revenue").reduce((sum, entry) => sum + entry.value, 0);
  const expenses = relevant.filter((entry) => entry.metric === "spend").reduce((sum, entry) => sum + entry.value, 0);
  return { revenue, expenses, net: revenue - expenses };
}

const HOUSE_NUMBERS = Array.from({ length: 12 }, (_, index) => index + 1) as HouseNumber[];
if (REVENUE_ALLOCATION_POLICY.reduce((sum, allocation) => sum + allocation.percent, 0) !== 100
  || HOUSE_NUMBERS.some((from) => HOUSE_NUMBERS.some((to) => findShortestHouseRoute(from, to).length === 0))) {
  throw new Error("Guild economy allocation or House-route invariant failed.");
}
