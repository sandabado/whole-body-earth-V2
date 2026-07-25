"use client";

import Link from "next/link";
import { WholeBodyFooter } from "../WholeBodyFooter";
import { HeroQuincunx } from "./HeroQuincunx";
import { HomeContinuum } from "./HomeContinuum";

export function EpicHomeExperience() {
  return (
    <div className="epic-home">
      <main>
        <section className="epic-home-hero" aria-labelledby="epic-home-title">
          <div className="epic-home-canvas" aria-hidden="true">
            <HeroQuincunx />
          </div>
          <div className="epic-home-vignette" aria-hidden="true" />

          <div className="epic-home-hero-copy">
            <span className="epic-home-mark" aria-hidden="true">⊙</span>
            <h1 id="epic-home-title">Whole Body</h1>
            <p>Five elements. One body. Living now.</p>
            <Link href="#reading">Take the Reading <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <HomeContinuum />
      </main>
      <WholeBodyFooter />
    </div>
  );
}
