"use client";

import { useEffect, useRef, useState } from "react";
import { AirZone } from "./air-zone";
import { EarthZone } from "./earth-zone";
import { EtherZone } from "./ether-zone";
import styles from "./element-zones.module.css";
import { FireZone } from "./fire-zone";
import { WaterZone } from "./water-zone";

const zoneLabels = ["Fire", "Air", "Water", "Earth", "Ether"] as const;

export function ElementZones() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zonesInView, setZonesInView] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const zones = Array.from(rail.querySelectorAll<HTMLElement>("[data-element-zone]"));
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const viewportObserver = new IntersectionObserver(([entry]) => {
      setZonesInView(entry.isIntersecting);
    }, { threshold: 0.04 });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = zones.indexOf(entry.target as HTMLElement);
        if (index >= 0) setActiveIndex(index);
      });
    }, { root: desktop ? rail : null, threshold: desktop ? 0.58 : 0.35 });
    viewportObserver.observe(rail);
    zones.forEach((zone) => observer.observe(zone));
    return () => {
      observer.disconnect();
      viewportObserver.disconnect();
    };
  }, []);

  const goTo = (index: number) => {
    const rail = railRef.current;
    const target = rail?.querySelectorAll<HTMLElement>("[data-element-zone]")[index];
    if (!rail || !target) return;
    if (window.matchMedia("(min-width: 768px)").matches) rail.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className={styles.section} aria-labelledby="element-zones-title">
      <header className={styles.sectionHeader}>
        <div><small>THE LIVING CONSTELLATION / 01—05</small><h2 id="element-zones-title">Five fields. One current.</h2></div>
        <p>Swipe or choose an element to enter its active field.</p>
      </header>
      <nav className={styles.zoneNav} aria-label="Choose an element zone">
        {zoneLabels.map((label, index) => (
          <button type="button" key={label} aria-current={activeIndex === index ? "true" : undefined} onClick={() => goTo(index)}>
            <i />{label}
          </button>
        ))}
      </nav>
      <div className={styles.rail} ref={railRef} tabIndex={0} aria-label="Five interactive element zones">
        <FireZone active={zonesInView && activeIndex === 0} />
        <AirZone active={zonesInView && activeIndex === 1} />
        <WaterZone active={zonesInView && activeIndex === 2} />
        <EarthZone active={zonesInView && activeIndex === 3} />
        <EtherZone active={zonesInView && activeIndex === 4} />
      </div>
      <div className={styles.railProgress} aria-hidden="true"><i style={{ transform: `scaleX(${(activeIndex + 1) / zoneLabels.length})` }} /></div>
    </section>
  );
}
