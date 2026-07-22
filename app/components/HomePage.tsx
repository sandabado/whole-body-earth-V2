"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HeroEngine from "./HeroEngine/HeroEngine";
import { HudCard } from "./HudCard";

const tickerEntries = [
  { text: "SANDĀBĀDO · ∞ LOVE — FINAL MIX", system: false },
  { text: "SYS: SYNC LEAD GENERATED — INDEPENDENT FILM", system: true },
  { text: "LIVING EARTH · VOL. 1 — MASTERING", system: false },
  { text: "SYS: TEST PRESSING APPROVED — 180G VINYL", system: true },
  { text: "SARAH VEYA · MEMORY EP — SESSION OPEN", system: false },
  { text: "SYS: RIGHTS CHECK — 100% ARTIST OWNED", system: true },
];

const services = [
  {
    index: "01",
    title: "Record Development",
    price: "FROM $1,500 / TRACK",
    copy: "Production, arrangement, session direction, and the room required to finish the record.",
    keep: "YOU KEEP 100% OF THE MASTER",
  },
  {
    index: "02",
    title: "Mix + Master",
    price: "$650 MIX · $150 MASTER",
    copy: "Translation, depth, and final delivery across streaming, film, radio, and physical formats.",
    keep: "NO BACK-END PARTICIPATION",
  },
  {
    index: "03",
    title: "Physical Release",
    price: "AT COST + 12% MANAGEMENT",
    copy: "Vinyl, CD, packaging, manufacturing, fulfillment, and the details that turn files into artifacts.",
    keep: "YOU OWN THE INVENTORY",
  },
  {
    index: "04",
    title: "Sync + Campaign",
    price: "20% OF PLACEMENTS WE SECURE",
    copy: "Rights-ready catalog preparation, music supervision outreach, positioning, and release strategy.",
    keep: "YOU KEEP 100% OF YOUR IP",
  },
];

const allocations = [
  ["ARTIST / NOW", 35],
  ["PRODUCTION", 25],
  ["ARTIST / RESERVE", 20],
  ["INFRASTRUCTURE", 12],
  ["COMMON GROUND", 8],
] as const;

function TerminalTicker() {
  const items = [...tickerEntries, ...tickerEntries];
  return (
    <div className="ticker" aria-label="Live studio feed">
      <div className="ticker-label"><i />LIVE SYSTEM FEED</div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {items.map((entry, index) => (
            <span className={entry.system ? "ticker-system" : "ticker-artist"} key={`${entry.text}-${index}`}>{entry.text}<b>◆</b></span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const bellPlayed = useRef(false);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const length = section.offsetHeight - window.innerHeight;
      const next = Math.max(0, Math.min(1, -rect.top / Math.max(length, 1)));
      setProgress(next);
      if (next > 0.86 && !bellPlayed.current) {
        bellPlayed.current = true;
        window.dispatchEvent(new Event("wbs-bell"));
        window.dispatchEvent(new Event("wbs-frequency"));
      }
      if (next < 0.55) bellPlayed.current = false;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const lines = [
    "REVENUE ENTERS THE SYSTEM.",
    "THE PEOPLE WHO MADE THE WORK ARE PAID.",
    "THE WORK REPLENISHES ITS OWN RESERVE.",
    "INFRASTRUCTURE IS FED — NEVER OWNERSHIP.",
  ];

  return (
    <section className="manifesto-scroll" ref={sectionRef} id="feed-first">
      <div className="manifesto-sticky">
        <div className="manifesto-copy">
          <p className="eyebrow">THE FEED FIRST ALGORITHM / 001</p>
          <h2>MONEY MOVES<br />IN THE ORDER<br />OF LIFE.</h2>
          <div className="manifesto-lines">
            {lines.map((line, index) => (
              <p key={line} className={progress > 0.11 + index * 0.13 ? "revealed" : ""}>{line}</p>
            ))}
          </div>
        </div>
        <div className="allocation-panel">
          <div className="allocation-head"><span>ALLOCATION / EXAMPLE</span><span>100%</span></div>
          {allocations.map(([label, amount], index) => {
            const fill = Math.max(0, Math.min(1, (progress - 0.38 - index * 0.065) / 0.18));
            return (
              <div className="allocation-row" key={label}>
                <div><span>{label}</span><strong>{amount}%</strong></div>
                <div className="allocation-track"><i style={{ width: `${fill * amount}%` }} /></div>
              </div>
            );
          })}
          <p className={progress > 0.82 ? "manifesto-final revealed" : "manifesto-final"}>THE ARTIST EATS FIRST. <em>ALWAYS.</em></p>
        </div>
        <div className="scroll-meter"><i style={{ height: `${progress * 100}%` }} /><span>{String(Math.round(progress * 100)).padStart(3, "0")}</span></div>
      </div>
    </section>
  );
}

function Calculator() {
  const [gross, setGross] = useState(75000);
  const artist = gross * 0.55;
  const label = gross * 0.08;
  const difference = artist - label;
  const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return (
    <section className="section calculator-section" id="calculator">
      <div className="section-heading split-heading">
        <div><p className="eyebrow">RUN THE NUMBERS / NO FINE PRINT</p><h2>THE MATH<br />SPEAKS.</h2></div>
        <p>Move the gross revenue. Watch where it goes when ownership is not the price of admission.</p>
      </div>
      <HudCard className="calculator-card">
        <div className="calculator-control">
          <label htmlFor="gross-revenue">PROJECT GROSS REVENUE</label>
          <output htmlFor="gross-revenue">{money(gross)}</output>
          <input id="gross-revenue" type="range" min="5000" max="250000" step="5000" value={gross} onChange={(event) => setGross(Number(event.target.value))} />
          <div className="range-bounds"><span>$5K</span><span>$250K</span></div>
        </div>
        <div className="calculator-results">
          <div className="result result--artist"><span>ARTIST WALKS WITH / 55%</span><strong>{money(artist)}</strong><small>35% direct + 20% artist reserve</small></div>
          <div className="result"><span>LABEL EQUIVALENT / 8%</span><strong>{money(label)}</strong><small>Common major-label royalty benchmark</small></div>
          <div className="result result--difference"><span>THE DIFFERENCE</span><strong>+{money(difference)}</strong><small>Agency returned to the artist</small></div>
        </div>
      </HudCard>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HeroEngine
        siteSlug="studios"
        ariaLabel="Whole Body Studios — infrastructure for independent artists"
      >
        <div className="hero-coordinate hero-coordinate--left">33.8734° N<br />115.9010° W</div>
        <div className="hero-coordinate hero-coordinate--right">RAY II / WATER<br />SIGNAL: ACTIVE</div>
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><i />WHOLE BODY STUDIOS / WATER RAY</p>
          <h1><span>INFRASTRUCTURE,</span><br /><em>NOT A LABEL.</em></h1>
          <p className="hero-deck">We finish records. Build campaigns. Place music. Press vinyl. The artist owns every part of the work.</p>
          <div className="hero-actions">
            <Link className="button button--solid" href="/apply"><span>APPLY FOR PARTNERSHIP</span><b>↗</b></Link>
            <a className="text-link" href="#model">SEE THE MODEL <span>↓</span></a>
          </div>
        </div>
        <div className="trust-line"><span>FEED FIRST</span><i>·</i><span>ARTIST-OWNED</span><i>·</i><span>ZERO EXTRACTION</span></div>
        <div className="hero-scroll"><span>SCROLL TO ENTER</span><i /></div>
      </HeroEngine>

      <TerminalTicker />

      <section className="section declaration" id="model">
        <div className="section-number">[ 001 / THE PREMISE ]</div>
        <div className="declaration-copy">
          <p>IF YOU OWN YOUR MASTERS,<br />CONGRATULATIONS — <em>YOU&apos;RE AHEAD OF THE INDUSTRY.</em></p>
          <p>BUT OWNERSHIP ALONE DOESN&apos;T FINISH THE RECORD. IT DOESN&apos;T MIX THE VOCAL. IT DOESN&apos;T CUT THE VINYL. IT DOESN&apos;T GET YOUR SONG INTO THE FILM THAT CHANGES EVERYTHING.</p>
          <p>A LABEL OFFERS SERVICES IN EXCHANGE FOR OWNERSHIP.</p>
          <h2>WE OFFER THE SAME SERVICES.<br /><span>WITHOUT THE EXCHANGE.</span></h2>
        </div>
      </section>

      <section className="section services-section">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">THE INFRASTRUCTURE / FOUR SYSTEMS</p><h2>WHAT THE WORK<br />REQUIRES.</h2></div>
          <p>Every cost is visible. Every boundary is stated. We earn on the work we perform — never the work you own.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <HudCard key={service.index} className="service-card">
              <div className="service-top"><span>{service.index}</span><i>🜄</i></div>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <div className="service-price"><span>ENGAGEMENT</span><strong>{service.price}</strong></div>
              <div className="service-keep">{service.keep}</div>
            </HudCard>
          ))}
        </div>
      </section>

      <Manifesto />
      <Calculator />

      <section className="section proof-section">
        <p className="eyebrow">THE OPERATING COVENANT</p>
        <div className="proof-grid">
          <div><strong>100%</strong><span>ARTIST IP RETAINED</span></div>
          <div><strong>0</strong><span>MASTER TRANSFERS</span></div>
          <div><strong>14</strong><span>DAYS TO A DECISION</span></div>
        </div>
      </section>

      <section className="final-cta">
        <p className="eyebrow">THE DOOR IS OPEN / SELECTIVELY</p>
        <h2>THE RECORD IS YOURS.<br /><em>LET&apos;S BUILD WHAT IT NEEDS.</em></h2>
        <p>Not everyone who applies is chosen. We take artists who carry the frequency — and who are ready to own the responsibility with the work.</p>
        <Link className="button button--solid button--large" href="/apply"><span>ENTER THE GATEWAY</span><b>↗</b></Link>
      </section>
    </>
  );
}
