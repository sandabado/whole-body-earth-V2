import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // TODO Phase 2: Query DimensionScore for latest coherence.
  // TODO Phase 2: Query AgentConfig for active edges.
  // TODO Phase 2: Query QuincunxPositionAssignment for active Houses and Position 9.
  const mockResponse = {
    coherence: {
      overall: 0.59,
      domains: {
        intention: 0.72,
        spirit: 0.68,
        time: 0.61,
        physical: 0.55,
        economy: 0.59,
        law: 0.59,
      },
      aetheric: 0.59,
    },
    sealStatus: "OPEN",
    edges: {
      total: 30,
      flowing: 0,
      active: 0,
    },
    houses: {
      total: 12,
      active: 0,
    },
    geometry: {
      vertices: 20,
      faces: 12,
    },
    observerSeat: {
      filled: false,
      selected: true,
      originAwaiting: true,
    },
    persisted: false,
    cycleHistory: [],
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(mockResponse, {
    headers: { "Cache-Control": "no-store" },
  });
}
