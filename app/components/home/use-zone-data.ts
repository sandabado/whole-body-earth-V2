"use client";

import { useEffect, useState } from "react";

export function useZoneData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) throw new Error(`Zone feed returned ${response.status}`);
        setData(await response.json() as T);
      } catch (loadError) {
        if ((loadError as Error).name !== "AbortError") setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [endpoint]);

  return { data, error };
}
