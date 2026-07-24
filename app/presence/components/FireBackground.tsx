"use client";

import { useEffect, useState, type ComponentType } from "react";

export function FireBackground() {
  const [Scene, setScene] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    void import("./FireCanvas").then(({ FireCanvas }) => {
      if (active) setScene(() => FireCanvas);
    });
    return () => { active = false; };
  }, []);

  return <div className="fire-bg" aria-hidden="true">{Scene ? <Scene /> : null}</div>;
}
