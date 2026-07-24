"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createObserverSnapshot,
  type CommunityTelemetry,
  type ObserverSnapshot,
} from "@/lib/observer-telemetry";
import type { CycleResult } from "@/lib/types";

const POLL_INTERVAL = 60_000;

const EMPTY_COMMUNITY: CommunityTelemetry = {
  observedCycles: 0,
  averageCoherence: 0,
  openCycles: 0,
  monitorCycles: 0,
  closedCycles: 0,
  latestAt: null,
};

type ObserverTelemetryResponse = {
  coherence: {
    overall: number;
    domains: Record<string, number>;
    aetheric: number;
  };
  edges: { total: number; flowing: number; active: number };
  houses: { total: number; active: number };
  observerSeat: {
    filled: boolean;
    selected: boolean;
    originAwaiting: boolean;
  };
  persisted: boolean;
  cycleHistory: ObserverSnapshot[];
};

function applyRemoteTelemetry(
  snapshot: ObserverSnapshot,
  payload: ObserverTelemetryResponse,
): ObserverSnapshot {
  const next = structuredClone(snapshot);
  next.body.overallCoherence = payload.coherence.overall;
  next.body.quincunx.overallCoherence = payload.coherence.overall;
  next.body.quincunx.position9.active = payload.observerSeat.filled;
  next.body.quincunx.position9.valve = payload.observerSeat.filled ? "monitor" : "closed";

  const domainByPillar = {
    physical: payload.coherence.domains.physical ?? payload.coherence.overall,
    mental: payload.coherence.domains.time ?? payload.coherence.overall,
    emotional: payload.coherence.domains.economy ?? payload.coherence.overall,
    spiritual: payload.coherence.domains.spirit ?? payload.coherence.overall,
    aetheric: payload.coherence.aetheric,
  } as const;

  for (const pillar of next.body.pillars) {
    pillar.coherence = domainByPillar[pillar.id];
  }
  for (const corner of Object.keys(next.body.quincunx.corners) as Array<keyof typeof next.body.quincunx.corners>) {
    next.body.quincunx.corners[corner].coherence = domainByPillar[corner];
  }
  next.body.faces = next.body.faces.map((face, index) => ({
    ...face,
    active: index < payload.houses.active,
    valve: index < payload.houses.active ? face.valve : "IDLE",
  }));
  next.body.edges = next.body.edges.map((edge, index) => ({
    ...edge,
    flow: index < payload.edges.flowing ? Math.max(edge.flow, 0.45) : 0,
    valve: index < payload.edges.flowing ? edge.valve : "IDLE",
  }));
  return next;
}

export function useObserverTelemetry(liveResult: CycleResult) {
  const modeledLive = useMemo(() => createObserverSnapshot(liveResult), [liveResult]);
  const [remoteTelemetry, setRemoteTelemetry] = useState<ObserverTelemetryResponse | null>(null);
  const live = useMemo(
    () => remoteTelemetry ? applyRemoteTelemetry(modeledLive, remoteTelemetry) : modeledLive,
    [modeledLive, remoteTelemetry],
  );
  const [history, setHistory] = useState<ObserverSnapshot[]>([]);
  const [community, setCommunity] = useState<CommunityTelemetry>(EMPTY_COMMUNITY);
  const [connection, setConnection] = useState<"connecting" | "live" | "local">("connecting");

  const refetch = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/observer/telemetry?limit=50", {
        cache: "no-store",
        signal,
      });
      if (!response.ok) throw new Error("Telemetry unavailable");
      const payload = (await response.json()) as ObserverTelemetryResponse;
      setRemoteTelemetry(payload);
      setHistory(payload.cycleHistory ?? []);
      setCommunity(EMPTY_COMMUNITY);
      setConnection(payload.persisted ? "live" : "local");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setConnection("local");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const initialRefresh = window.setTimeout(() => void refetch(controller.signal), 0);
    const timer = window.setInterval(() => void refetch(), POLL_INTERVAL);
    return () => {
      controller.abort();
      window.clearTimeout(initialRefresh);
      window.clearInterval(timer);
    };
  }, [refetch]);

  return { live, history, community, connection, refetch };
}
