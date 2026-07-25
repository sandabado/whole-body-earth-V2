"use client";

import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { HomeContinuum } from "./HomeContinuum";
import { HeroQuincunx } from "./HeroQuincunx";

const EASE = [0.16, 1, 0.3, 1] as const;

export function EpicHomeExperience() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 0.72], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.66, 1], [1, 0.72, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="epic-home">
        <section
          ref={heroRef}
          className="epic-home-hero"
          aria-labelledby="epic-home-title"
        >
          <motion.div
            className="epic-home-hero-sticky"
            style={{
              opacity: reducedMotion ? 1 : heroOpacity,
              scale: reducedMotion ? 1 : heroScale,
              y: reducedMotion ? 0 : heroY,
            }}
          >
            <div className="epic-home-canvas">
              <HeroQuincunx />
            </div>
            <div className="epic-home-vignette" aria-hidden="true" />
            <div className="epic-home-quincunx-labels" aria-hidden="true">
              <span className="epic-home-label-press"><i>🜁</i> Press / Air</span>
              <span className="epic-home-label-presence"><i>🜂</i> Presence / Fire</span>
              <span className="epic-home-label-studios"><i>🜄</i> Studios / Water</span>
              <span className="epic-home-label-foundation"><i>🜃</i> Foundation / Earth</span>
              <span className="epic-home-label-guardian"><i>⊙</i> Guardian / Observer</span>
            </div>
            <div className="epic-home-hero-copy">
              <motion.p
                className="epic-home-kicker"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.35 }}
              >
                System awakening · Position zero
              </motion.p>
              <motion.h1
                id="epic-home-title"
                initial={{ opacity: 0, y: 20, letterSpacing: "-.08em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "-.055em" }}
                transition={{ duration: 1.6, delay: 0.65, ease: EASE }}
              >
                <span className="epic-home-title-line">WHOLE BODY</span>
                <span>EARTH</span>
              </motion.h1>
              <motion.p
                className="epic-home-subtitle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.55, ease: EASE }}
              >
                Seven-dimensional operating system for sovereign creators
              </motion.p>
            </div>
            <motion.a
              href="#system"
              className="epic-home-scroll-cue"
              aria-label="Continue to the Whole Body system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.8 }}
            >
              <span>Enter</span>
              <i aria-hidden="true" />
            </motion.a>
          </motion.div>
        </section>

        <HomeContinuum />
      </div>
    </MotionConfig>
  );
}
