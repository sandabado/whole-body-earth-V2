"use client";

import { useEffect } from "react";

export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-experience");
    if (!root) return;

    const revealItems = Array.from(
      root.querySelectorAll<HTMLElement>("[data-home-reveal]"),
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    root.classList.add("home-motion-ready");

    const threshold = root.querySelector<HTMLElement>(".threshold");
    const hasArrived = window.sessionStorage.getItem("presence-arrived");
    if (hasArrived) threshold?.classList.add("threshold--skip");
    else {
      window.sessionStorage.setItem("presence-arrived", "true");
      window.setTimeout(() => threshold?.classList.add("threshold--depart"), 1000);
    }

    const warmth = root.querySelector<HTMLElement>(".cursor-warmth");
    let warmthX = window.innerWidth / 2;
    let warmthY = window.innerHeight / 2;
    let targetX = warmthX;
    let targetY = warmthY;
    let warmthFrame = 0;
    const followWarmth = () => {
      warmthX += (targetX - warmthX) * 0.12;
      warmthY += (targetY - warmthY) * 0.12;
      warmth?.style.setProperty("transform", `translate3d(${warmthX - 40}px,${warmthY - 40}px,0)`);
      warmthFrame = window.requestAnimationFrame(followWarmth);
    };
    const moveWarmth = (event: PointerEvent) => { targetX = event.clientX; targetY = event.clientY; };
    window.addEventListener("pointermove", moveWarmth, { passive: true });
    if (!prefersReducedMotion) warmthFrame = window.requestAnimationFrame(followWarmth);

    if (prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return () => root.classList.remove("home-motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          entry.target.closest("section")?.classList.add("section-fired");
          entry.target.querySelectorAll<HTMLElement>("[data-typewriter]").forEach((line) => {
            if (line.dataset.typed) return;
            line.dataset.typed = "true";
            const copy = line.textContent ?? "";
            line.textContent = "";
            Array.from(copy).forEach((character, index) => window.setTimeout(() => {
              line.textContent += character;
            }, index * 30));
          });
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.15 },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", moveWarmth);
      window.cancelAnimationFrame(warmthFrame);
      root.classList.remove("home-motion-ready");
    };
  }, []);

  return null;
}
