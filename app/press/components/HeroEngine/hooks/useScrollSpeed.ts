"use client";

import { useEffect, useRef } from "react";

export function useScrollSpeed() {
  const speed = useRef(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let frame = 0;

    const scroll = () => {
      const now = performance.now();
      const elapsed = Math.max(now - lastTime, 16);
      speed.current = Math.min(Math.abs(window.scrollY - lastY) / elapsed, 2.4);
      lastY = window.scrollY;
      lastTime = now;
    };
    const decay = () => {
      speed.current *= 0.91;
      frame = window.requestAnimationFrame(decay);
    };

    window.addEventListener("scroll", scroll, { passive: true });
    frame = window.requestAnimationFrame(decay);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return speed;
}
