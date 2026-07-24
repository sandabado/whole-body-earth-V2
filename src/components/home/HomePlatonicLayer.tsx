"use client";

import dynamic from "next/dynamic";

const HomePlatonicBackground = dynamic(() => import("./HomePlatonicBackground"), { ssr: false });

export function HomePlatonicLayer() {
  return <HomePlatonicBackground />;
}
