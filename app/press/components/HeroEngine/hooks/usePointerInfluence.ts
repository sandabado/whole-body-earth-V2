"use client";

import { useEffect, useRef } from "react";

export function usePointerInfluence() {
  const pointer = useRef({ x: 0.5, y: 0.5, active: 0 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = event.clientX / Math.max(window.innerWidth, 1);
      pointer.current.y = 1 - event.clientY / Math.max(window.innerHeight, 1);
      pointer.current.active = event.pointerType === "touch" ? 0.45 : 1;
    };
    const leave = () => { pointer.current.active = 0; };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return pointer;
}
