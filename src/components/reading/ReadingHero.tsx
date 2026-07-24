"use client";

import { useState } from "react";
import { ReadingWorkbench } from "@/components/reading/ReadingWorkbench";

const fieldMarks = [
  { mark: "🜂", label: "Spiritual", element: "Fire", color: "#d16b45" },
  { mark: "🜁", label: "Mental", element: "Air", color: "#d4af37" },
  { mark: "🜄", label: "Emotional", element: "Water", color: "#2ba8a0" },
  { mark: "🜃", label: "Physical", element: "Earth", color: "#84a66e" },
  { mark: "☉", label: "Ethereal", element: "Ether", color: "#8f5bff" },
];

export function ReadingHero({ checkout }: { checkout?: string }) {
  const [editorialOpen, setEditorialOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-[var(--radius-surface)] bg-[conic-gradient(from_210deg_at_50%_50%,#ff78c4,#ff9dcc,#ffc65e,#7de5d2,#a78bfa,#ff78c4)] p-px shadow-[0_28px_100px_rgba(0,0,0,.44)]">
        <header className="relative isolate overflow-hidden rounded-[calc(var(--radius-surface)-1px)] bg-[linear-gradient(118deg,rgba(39,10,31,.98),rgba(15,4,15,.99))] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <CelestialField />
          <div className="relative grid items-stretch gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,.9fr)] xl:gap-12">
            <div className="flex min-h-full flex-col">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#ffb0d8]">
                The Whole Body method
              </p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[.91] font-semibold tracking-[-.035em] text-bone sm:text-6xl lg:text-7xl">
                The chart is the map.
                <span className="block text-[#ff9dcc]">Your body is the terrain.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-ghost sm:text-lg">
                Your Star Passport translates celestial placements into a
                practical view of how you think, feel, build, belong, and lead.
              </p>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-4 border-t border-[#ff9dcc]/25 pt-6">
                <Metric value="5" label="Bodies held in view" />
                <Metric value="1" label="Personal field map" />
                <Metric value="4 min" label="To generate your passport" />
              </div>
              <button
                aria-controls="reading-editorial"
                aria-expanded={editorialOpen}
                className="mt-12 inline-flex w-fit rounded-[var(--radius-control)] bg-[linear-gradient(90deg,#ff78c4,#ff9dcc,#ffc65e,#7de5d2,#a78bfa,#ff78c4)] p-px shadow-[0_12px_30px_rgba(0,0,0,.32)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff9dcc] xl:mt-auto"
                onClick={() => setEditorialOpen((isOpen) => !isOpen)}
                type="button"
              >
                <span className="flex items-center gap-3 rounded-[calc(var(--radius-control)-1px)] bg-[#1b0919] px-4 py-3 font-mono text-[10px] uppercase tracking-[.14em] text-[#ffd4e8] transition hover:bg-[#310d2b]">
                  <span>{editorialOpen ? "Close the field" : "Explore the field"}</span>
                  <span aria-hidden="true" className="text-base leading-none">
                    {editorialOpen ? "↑" : "↓"}
                  </span>
                </span>
              </button>
            </div>
            <div>
              <ReadingWorkbench />
            </div>
          </div>
        </header>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${editorialOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        id="reading-editorial"
      >
        <div className="overflow-hidden">
          <div className={`transition-opacity duration-300 ${editorialOpen ? "opacity-100 delay-100" : "opacity-0"}`}>
            <section className="border-x border-b border-[#ff9dcc]/20 bg-[#1a0a18]/90 px-6 py-9 sm:px-10 sm:py-11 lg:px-14">
              <div className="grid gap-7 lg:grid-cols-[minmax(13rem,.56fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#ffb0d8]">
                  Beyond a horoscope
                </p>
                <div>
                  <p className="max-w-3xl font-display text-3xl leading-tight text-bone sm:text-4xl">
                    Your placements become a decision-making instrument.
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-ghost sm:text-base sm:leading-7">
                    See the patterns that need attention, the body that leads, and
                    the next practice that brings the field into balance.
                  </p>
                  <div className="mt-7 flex items-center gap-3 border-t border-[#ff9dcc]/20 pt-4 font-mono text-[10px] uppercase tracking-[.13em] text-bone/80">
                    <span className="text-xl text-[#ff9dcc]">✦</span>
                    A living field report
                  </div>
                </div>
              </div>
            </section>

            <section className="border-x border-b border-[#ff9dcc]/20 bg-[#1a0a18]/90 px-6 py-9 sm:px-10 sm:py-11 lg:px-14">
              <div className="grid gap-6 border-b border-[#ff9dcc]/20 pb-8 lg:grid-cols-[minmax(13rem,.56fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#ffb0d8]">
                  How the chart is organized
                </p>
                <div>
                  <h2 className="font-display text-3xl leading-tight text-bone sm:text-4xl">
                    Five bodies. Five elements. One field.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-ghost sm:text-base sm:leading-7">
                    Each body is held in relation to its element, pattern, and
                    practice—so the chart shows not just what is present, but how
                    the whole field can work together.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-px border border-[#ff9dcc]/25 bg-[#ff9dcc]/25 sm:grid-cols-5">
                {fieldMarks.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-center gap-2 bg-[#1a0a18] px-3 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-bone/85"
                  >
                    <span className="text-base" style={{ color: item.color }}>
                      {item.mark}
                    </span>
                    <span>{item.label}</span>
                    <span className="text-ghost/80">/ {item.element}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {checkout === "success" ? (
        <p className="mt-3 border border-press/55 bg-press/10 px-5 py-4 text-center text-sm leading-6 text-bone">
          Your purchase is confirmed. We&apos;ll use the email collected at
          checkout to send the next delivery step.
        </p>
      ) : null}
      {checkout === "cancelled" ? (
        <p className="mt-3 border border-mercury bg-carbon/70 px-5 py-4 text-center text-sm leading-6 text-ghost">
          Checkout was cancelled. Your Star Passport is still here when
          you&apos;re ready.
        </p>
      ) : null}
    </>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <span className="font-display text-2xl text-bone">{value}</span>
      <span className="ml-2 font-mono text-[9px] uppercase tracking-[.13em] text-ghost">
        {label}
      </span>
    </div>
  );
}

function CelestialField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -top-20 -right-24 h-[36rem] w-[36rem] opacity-70 sm:-top-28 sm:right-0"
      viewBox="0 0 576 576"
      fill="none"
    >
      <g className="reading-dodecahedron-spin">
        <circle cx="288" cy="288" r="228" stroke="rgba(255,130,195,.48)" />
        <circle cx="288" cy="288" r="172" stroke="rgba(255,221,239,.21)" strokeDasharray="3 9" />
        <path d="M288 60V516M60 288H516M127 127L449 449M449 127L127 449" stroke="rgba(255,217,235,.18)" />
        <path d="M288 84 465 390H111L288 84ZM288 492 111 186H465L288 492Z" stroke="rgba(255,103,181,.48)" />
        <circle cx="127" cy="127" r="3" fill="#ff9dcc" />
        <circle cx="449" cy="127" r="3" fill="#ff78c4" />
        <circle cx="449" cy="449" r="3" fill="#ffc1df" />
        <circle cx="127" cy="449" r="3" fill="#ff8ac5" />
      </g>
      <g className="reading-dodecahedron-counterspin">
        <circle cx="288" cy="288" r="104" stroke="rgba(255,154,207,.34)" />
        <path d="M288 84 465 390H111L288 84ZM288 492 111 186H465L288 492Z" stroke="rgba(255,214,239,.24)" />
      </g>
      <circle cx="288" cy="288" r="13" fill="rgba(255,136,197,.9)" />
      <circle cx="288" cy="288" r="31" stroke="rgba(255,154,207,.55)" />
    </svg>
  );
}
