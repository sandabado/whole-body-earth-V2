"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useHeroEngineConfig } from "../HeroEngine";

type PressHeadlineProps = {
  headline: string;
  subhead: string;
  metaLines: string[];
};

export default function PressHeadlineOverlay({ headline, subhead, metaLines }: PressHeadlineProps) {
  const config = useHeroEngineConfig();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), config.headlineDelayMs);
    return () => window.clearTimeout(timer);
  }, [config.headlineDelayMs]);

  return (
    <div className={`press-headline-overlay ${visible ? "press-headline-overlay--visible" : ""}`}>
      <div className="press-headline">
        <div className="press-headline-meta">
          {metaLines.map((line, index) => (
            <p key={line} style={{ transitionDelay: `${index * 150}ms` }}>{line}</p>
          ))}
        </div>
        <h1>{headline}</h1>
        <p className="press-headline-subhead">{subhead}</p>
        <div className="press-headline-separator" aria-hidden="true"><i /><span>✦</span><i /></div>
        <div className="hero-actions">
          <Link className="button gold" href="/press/catalog">EXPLORE CATALOG →</Link>
          <Link className="button" href="/press/submit">SUBMIT MANUSCRIPT</Link>
        </div>
        <p className="press-headline-code">FEED FIRST · AUTHOR-OWNED · NO PLATFORM DEPENDENCY</p>
      </div>
    </div>
  );
}
