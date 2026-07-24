"use client";

import Link from "next/link";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { HeroQuincunx } from "@/components/home/HeroQuincunx";
import { PILLARS, type PillarId } from "@/lib/pillars";

const EASE = [0.16, 1, 0.3, 1] as const;

const PILLAR_STORIES: Array<{
  id: PillarId;
  dimension: string;
  essence: string;
  description: string;
}> = [
  {
    id: "presence",
    dimension: "Spirit",
    essence: "Ignition",
    description:
      "Where fire meets the body—retreats, healing, practice, and community ignition.",
  },
  {
    id: "press",
    dimension: "Mind",
    essence: "Transmission",
    description:
      "Manuals, books, and living archives that turn signal into practical sovereignty.",
  },
  {
    id: "studios",
    dimension: "Blood",
    essence: "Flow",
    description:
      "Music, objects, and artist development carried through an economy with roots.",
  },
  {
    id: "foundation",
    dimension: "Body",
    essence: "Anchor",
    description:
      "Land, infrastructure, and prototypes built to hold in the physical world.",
  },
  {
    id: "guardian",
    dimension: "Shield",
    essence: "Containment",
    description:
      "Trust architecture, legal sovereignty, and protection for what the system creates.",
  },
];

const FORMS = [
  { phase: "00", form: "Point", system: "Observer OS", role: "The seed" },
  { phase: "01", form: "Tetrahedron", system: "Tetra OS", role: "Ignition" },
  { phase: "02", form: "Octahedron", system: "Octa OS", role: "Transmission" },
  { phase: "03", form: "Hexahedron", system: "Hexa OS", role: "Anchor" },
  { phase: "04", form: "Icosahedron", system: "Icosa OS", role: "Flow" },
  {
    phase: "05",
    form: "Dodecahedron",
    system: "Dodeca OS",
    role: "Containment",
  },
  { phase: "06", form: "Sphere", system: "Whole Body OS", role: "Emergence" },
] as const;

const reveal = {
  initial: { opacity: 0, y: 42 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.95, ease: EASE },
};

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
                WHOLE BODY
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

        <section
          id="system"
          className="epic-home-manifesto"
          aria-labelledby="manifesto-title"
        >
          <motion.div {...reveal} className="epic-home-manifesto-copy">
            <p className="epic-home-scene-label">01 · The whole system</p>
            <h2 id="manifesto-title">
              You are not one body.
              <span>You are a constellation.</span>
            </h2>
            <div className="epic-home-manifesto-lines">
              <p>
                Mental. Physical. Emotional.
                <br />
                Spiritual. Ethereal.
              </p>
              <p>
                Air. Earth. Water.
                <br />
                Fire. Ether.
              </p>
            </div>
            <p className="epic-home-system-statement">
              One system. Seven dimensions. Zero extraction.
            </p>
          </motion.div>
        </section>

        <section
          className="epic-home-bodies"
          aria-labelledby="five-bodies-title"
        >
          <motion.header {...reveal} className="epic-home-section-heading">
            <p className="epic-home-scene-label">02 · The five bodies</p>
            <h2 id="five-bodies-title">Five ways to build.</h2>
            <p>
              Each body maps to an element. Each element becomes a pillar of
              work.
            </p>
          </motion.header>

          <div className="epic-home-pillar-grid">
            {PILLAR_STORIES.map((story, index) => {
              const pillar = PILLARS[story.id];
              return (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 70, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.85,
                    delay: index * 0.09,
                    ease: EASE,
                  }}
                  style={{ "--epic-accent": pillar.color } as CSSProperties}
                >
                  <Link href={pillar.href} aria-label={`Enter Whole Body ${pillar.name}`}>
                    <div className="epic-home-pillar-sigil" aria-hidden="true">
                      <span>{pillar.symbol}</span>
                    </div>
                    <p>{pillar.elementLabel.toUpperCase()}</p>
                    <h3>{pillar.name}</h3>
                    <dl>
                      <div>
                        <dt>Body</dt>
                        <dd>{pillar.body.replace(" body", "")}</dd>
                      </div>
                      <div>
                        <dt>Dimension</dt>
                        <dd>{story.dimension}</dd>
                      </div>
                    </dl>
                    <p className="epic-home-pillar-description">
                      {story.description}
                    </p>
                    <span className="epic-home-pillar-enter">
                      {story.essence} · Enter →
                    </span>
                  </Link>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            {...reveal}
            className="epic-home-observer-card"
            style={{ "--epic-accent": "#8f5bff" } as CSSProperties}
          >
            <Link href="/observer">
              <div>
                <p>Position 09 · The witness</p>
                <h3>ØDIN Observer OS</h3>
                <span>
                  Decode your House. Bind your public result. Watch the system
                  watching itself.
                </span>
              </div>
              <strong aria-hidden="true">Ø</strong>
              <i>Enter Observer →</i>
            </Link>
          </motion.div>
        </section>

        <section
          className="epic-home-architecture"
          aria-labelledby="architecture-title"
        >
          <div>
            <motion.header {...reveal} className="epic-home-section-heading">
              <p className="epic-home-scene-label">03 · The architecture</p>
              <h2 id="architecture-title">Seven forms of emergence.</h2>
              <p>
                Geometry becomes sequence. Sequence becomes a system capable of
                holding itself.
              </p>
            </motion.header>

            <ol className="epic-home-form-list">
              {FORMS.map((form, index) => (
                <motion.li
                  key={form.phase}
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.65 }}
                  transition={{
                    duration: 0.58,
                    delay: index * 0.055,
                    ease: EASE,
                  }}
                >
                  <span>{form.phase}</span>
                  <strong>{form.form}</strong>
                  <p>{form.system}</p>
                  <em>{form.role}</em>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="epic-home-convergence"
          aria-labelledby="convergence-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.35, ease: EASE }}
            className="epic-home-convergence-field"
          >
            <div className="epic-home-sphere" aria-hidden="true">
              {PILLAR_STORIES.map((story) => (
                <i
                  key={story.id}
                  data-node={story.id}
                  style={{
                    "--epic-accent": PILLARS[story.id].color,
                  } as CSSProperties}
                />
              ))}
              <b />
            </div>
            <p className="epic-home-scene-label">04 · Coherence</p>
            <h2 id="convergence-title">
              One system.
              <span>Seven dimensions.</span>
              Zero extraction.
            </h2>
          </motion.div>
        </section>

        <section className="epic-home-call" aria-labelledby="begin-title">
          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <p className="epic-home-scene-label">05 · Your coordinates</p>
            <h2 id="begin-title">Begin.</h2>
            <p>
              Find your House. Connect your wallet. Build where the ground is
              solid.
            </p>
            <Link href="/observer/reading">Decode your House →</Link>
            <small>
              About 60 seconds · No email required · Your wallet remains your
              identity
            </small>
          </motion.div>
        </section>
      </div>
    </MotionConfig>
  );
}
