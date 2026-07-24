"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export interface PointerInfluence {
  /** Horizontal position normalized to -1 (left) through 1 (right). */
  x: number;
  /** Vertical position normalized to -1 (bottom) through 1 (top). */
  y: number;
  active: boolean;
}

export interface PointerInfluenceRef {
  current: PointerInfluence;
}

export interface PointerInfluenceOptions {
  /** Optional element used as the normalization bounds. Defaults to viewport. */
  targetRef?: RefObject<HTMLElement | null>;
  /** Exponential response rate in changes per second. */
  damping?: number;
  /** Delay before the field eases back to center. */
  idleTimeout?: number;
  /** Multiplier applied after normalization. */
  strength?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Tracks mouse, pen, and touch input without triggering React renders.
 * Consumers can read `ref.current` from an animation loop.
 */
export function usePointerInfluence({
  targetRef,
  damping = 9,
  idleTimeout = 900,
  strength = 1,
}: PointerInfluenceOptions = {}): PointerInfluenceRef {
  const influenceRef = useRef<PointerInfluence>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const influence = influenceRef.current;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = { x: 0, y: 0, active: false };
    let reducedMotion = motionQuery.matches;
    let animationFrame = 0;
    let idleTimer = 0;
    let previousTime = performance.now();

    const stopAtCenter = () => {
      target.x = 0;
      target.y = 0;
      target.active = false;
      startAnimation();
    };

    const animate = (time: number) => {
      animationFrame = 0;
      if (reducedMotion) {
        influenceRef.current.x = 0;
        influenceRef.current.y = 0;
        influenceRef.current.active = false;
        return;
      }

      const delta = Math.min(0.05, Math.max(0.001, (time - previousTime) / 1000));
      previousTime = time;
      const alpha = 1 - Math.exp(-Math.max(0.1, damping) * delta);
      const current = influenceRef.current;
      current.x += (target.x - current.x) * alpha;
      current.y += (target.y - current.y) * alpha;
      current.active = target.active;

      const moving =
        Math.abs(target.x - current.x) > 0.0005 ||
        Math.abs(target.y - current.y) > 0.0005;

      if (moving) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        current.x = target.x;
        current.y = target.y;
        current.active = target.active;
      }
    };

    function startAnimation() {
      if (animationFrame || reducedMotion) return;
      previousTime = performance.now();
      animationFrame = window.requestAnimationFrame(animate);
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion || !event.isPrimary) return;

      const bounds = targetRef?.current?.getBoundingClientRect();
      if (
        bounds &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      ) {
        stopAtCenter();
        return;
      }
      const left = bounds?.left ?? 0;
      const top = bounds?.top ?? 0;
      const width = Math.max(1, bounds?.width ?? window.innerWidth);
      const height = Math.max(1, bounds?.height ?? window.innerHeight);
      const normalizedX = ((event.clientX - left) / width) * 2 - 1;
      const normalizedY = 1 - ((event.clientY - top) / height) * 2;

      target.x = clamp(normalizedX * strength, -1, 1);
      target.y = clamp(normalizedY * strength, -1, 1);
      target.active = true;
      influenceRef.current.active = true;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(stopAtCenter, Math.max(100, idleTimeout));
      startAnimation();
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") stopAtCenter();
    };

    const handleWindowExit = (event: MouseEvent) => {
      if (!event.relatedTarget) stopAtCenter();
    };

    const handleVisibility = () => {
      if (document.hidden) stopAtCenter();
    };

    const handleMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        target.x = 0;
        target.y = 0;
        target.active = false;
        influenceRef.current.x = 0;
        influenceRef.current.y = 0;
        influenceRef.current.active = false;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("mouseout", handleWindowExit, { passive: true });
    window.addEventListener("blur", stopAtCenter);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionPreference);

    return () => {
      window.clearTimeout(idleTimer);
      window.cancelAnimationFrame(animationFrame);
      influence.x = 0;
      influence.y = 0;
      influence.active = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("mouseout", handleWindowExit);
      window.removeEventListener("blur", stopAtCenter);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionPreference);
    };
  }, [damping, idleTimeout, strength, targetRef]);

  return influenceRef;
}

export default usePointerInfluence;
