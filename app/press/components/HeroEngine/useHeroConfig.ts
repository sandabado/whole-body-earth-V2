"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDefaultHeroConfig,
  normalizeHeroConfig,
  type HeroConfig,
  type HeroConfigResponse,
  type HeroConfigSource,
} from "./config";

type HeroConfigState = {
  config: HeroConfig;
  loading: boolean;
  error: Error | null;
  source: HeroConfigSource;
  version: number;
};

export function useHeroConfig(siteSlug: string): HeroConfigState {
  const fallback = useMemo(() => getDefaultHeroConfig(siteSlug), [siteSlug]);
  const [state, setState] = useState<HeroConfigState>({
    config: fallback,
    loading: true,
    error: null,
    source: "fallback",
    version: 1,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/hero-config?site=${encodeURIComponent(siteSlug)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Hero configuration returned ${response.status}`);
        return response.json() as Promise<HeroConfigResponse>;
      })
      .then((result) => {
        setState({
          config: normalizeHeroConfig(result.config, fallback),
          loading: false,
          error: null,
          source: result.source,
          version: result.version,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({
          config: fallback,
          loading: false,
          error: error instanceof Error ? error : new Error("Hero configuration unavailable"),
          source: "fallback",
          version: 1,
        });
      });

    return () => controller.abort();
  }, [fallback, siteSlug]);

  return state;
}
