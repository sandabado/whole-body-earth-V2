"use client";

import { useEffect, useRef } from "react";

export interface ScrollInfluence {
  /** Signed velocity in CSS pixels per millisecond. Positive means downward. */
  velocity: number;
  /** Absolute velocity normalized to the 0..1 range. */
  speed: number;
  direction: -1 | 0 | 1;
}

export interface ScrollInfluenceRef {
  current: ScrollInfluence;
}

export interface ScrollSpeedOptions {
  /** Maximum velocity represented by speed=1, in CSS pixels per millisecond. */
  maxVelocity?: number;
  /** Exponential response rate in changes per second. */
  damping?: number;
  /** Exponential decay rate after scrolling stops. */
  decay?: number;
  sensitivity?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Measures scroll velocity and lets it decay smoothly without causing renders.
 * Read the returned ref from the render loop that drives the fire uniforms.
 */
export function useScrollSpeed({
  maxVelocity = 2.4,
  damping = 12,
  decay = 5,
  sensitivity = 1,
}: ScrollSpeedOptions = {}): ScrollInfluenceRef {
  const influenceRef = useRef<ScrollInfluence>({
    velocity: 0,
    speed: 0,
    direction: 0,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const velocityLimit = Math.max(0.1, maxVelocity);
    let reducedMotion = motionQuery.matches;
    let previousScrollY = window.scrollY;
    let previousEventTime = performance.now();
    let previousFrameTime = previousEventTime;
    let targetVelocity = 0;
    let animationFrame = 0;

    const clear = () => {
      targetVelocity = 0;
      influenceRef.current.velocity = 0;
      influenceRef.current.speed = 0;
      influenceRef.current.direction = 0;
    };

    const animate = (time: number) => {
      animationFrame = 0;
      if (reducedMotion) {
        clear();
        return;
      }

      const delta = Math.min(
        0.05,
        Math.max(0.001, (time - previousFrameTime) / 1000),
      );
      previousFrameTime = time;
      targetVelocity *= Math.exp(-Math.max(0.1, decay) * delta);

      const alpha = 1 - Math.exp(-Math.max(0.1, damping) * delta);
      const current = influenceRef.current;
      current.velocity += (targetVelocity - current.velocity) * alpha;
      current.speed = clamp(Math.abs(current.velocity) / velocityLimit, 0, 1);
      current.direction =
        Math.abs(current.velocity) < 0.005
          ? 0
          : current.velocity > 0
            ? 1
            : -1;

      if (
        Math.abs(targetVelocity) > 0.002 ||
        Math.abs(current.velocity) > 0.002
      ) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        clear();
      }
    };

    const startAnimation = () => {
      if (animationFrame || reducedMotion) return;
      previousFrameTime = performance.now();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const time = performance.now();
      const elapsed = clamp(time - previousEventTime, 8, 100);
      const distance = window.scrollY - previousScrollY;
      previousScrollY = window.scrollY;
      previousEventTime = time;

      if (reducedMotion) return;

      targetVelocity = clamp(
        (distance / elapsed) * sensitivity,
        -velocityLimit,
        velocityLimit,
      );
      startAnimation();
    };

    const handleMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      previousScrollY = window.scrollY;
      previousEventTime = performance.now();
      if (reducedMotion) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        clear();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    motionQuery.addEventListener("change", handleMotionPreference);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      clear();
      window.removeEventListener("scroll", handleScroll);
      motionQuery.removeEventListener("change", handleMotionPreference);
    };
  }, [damping, decay, maxVelocity, sensitivity]);

  return influenceRef;
}

export default useScrollSpeed;
