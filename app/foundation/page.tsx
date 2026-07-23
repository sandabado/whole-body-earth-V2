"use client";
import Link from "next/link";
import { Reveal } from "./components/Reveal";
import FloatingTetrahedronGarden from "./components/models/FloatingTetrahedronGarden";
import FloatingQuincunxDome from "./components/models/FloatingQuincunxDome";
import FloatingGreatHall from "./components/models/FloatingGreatHall";
import FloatingPrismCathedral from "./components/models/FloatingPrismCathedral";
import PhaseBuilderEntrance from "./components/PhaseBuilderEntrance";
import FoundationHeroEngine from "./components/HeroEngine/HeroEngine";
import { FoundationHeadline } from "./components/FoundationHeadline";

const stats = [["ACRES TARGET", "10–20", "acres"], ["SUNNY DAYS", "280+", "each year"], ["ELEVATION", "2,600", "feet"], ["GROWING SEASON", "8–11", "months"], ["GARDEN BEDS", "12", "raised"], ["CURRENT PHASE", "00", "land search"]];
const phases = [["01", "THE TRIANGLE", "Water, solar, food and temporary shelter establish the survival baseline."], ["02", "THE QUINCUNX", "Permanent homes and training grounds let the village breathe."], ["03", "THE NONAGON", "The studio, great hall and publishing systems give the village a voice."], ["04", "THE DODECAHEDRON", "A complete, repeatable settlement sends seeds to new ground."]];

export default function Home() { return <div>
  <FoundationHeroEngine ariaLabel="Whole Body Foundation — a living satellite scan of ancient terrain">
    <FoundationHeadline configDelayMs={4000} />
    <a className="foundation-earth-scroll" href="#existing-foundation-hero"><i /><span>Survey below</span></a>
  </FoundationHeroEngine>
  <div id="existing-foundation-hero"><PhaseBuilderEntrance /></div>
  <div className="ticker"><div>LAND SEARCH ACTIVE　·　MORONGO VALLEY / LANDERS CA　·　WATER RIGHTS RESEARCH　·　GARDEN DESIGN COMPLETE　·　BUILDERS WANTED　·　EARTH ELEMENT / CUBE / 🜃　·　</div></div>
  <section className="section narrow"><Reveal><p className="eyebrow">THE PREMISE / 001</p><h2>THE PROBLEM IS SIMPLE.<br /><em>THE SOLUTION IS DIRT.</em></h2><div className="prose"><p>The old model turns land into a mortgage, shelter into rent, water into a utility bill, and food into a subscription.</p><p>Foundation holds land in trust, builds shelter without banks, activates water as a living system, and grows food with the solar cycle.</p><p className="accent">The community holds the ground. The individual owns their labor.</p></div></Reveal></section>
  <section className="section"><Reveal><div className="section-head"><div><p className="eyebrow">THE GROUND TRUTH / 002</p><h2>HIGH DESERT.<br /><em>REAL CONDITIONS.</em></h2></div><p>Design begins with what the land can actually hold.</p></div></Reveal><div className="stat-grid">{stats.map(([label,value,unit],i)=><Reveal key={label} delay={i*.05}><article className="hud-card"><span>{label}</span><strong>{value}</strong><small>{unit}</small></article></Reveal>)}</div></section>
  <section className="section"><Reveal><p className="eyebrow">THE BUILD SEQUENCE / 003</p><h2>EXPAND BY<br /><em>GEOMETRY.</em></h2></Reveal><div className="phase-list">{phases.map(([num,name,desc])=><Reveal key={num}><Link href="/foundation/the-build"><span>{num}</span><h3>{name}</h3><p>{desc}</p><b>↗</b></Link></Reveal>)}</div></section>
  <section className="section garden-teaser"><Reveal><p className="eyebrow">PHASE 2 / THE QUINCUNX</p><h2>FOUR ELEMENTS.<br /><em>ONE OBSERVER.</em></h2><p>Four geodesic domes hold Earth, Fire, Air, and Water around a central gathering point. The five-point field ties shelter, practice, and community into one village pattern.</p></Reveal><Reveal delay={.15}><FloatingQuincunxDome compact height="380px" /></Reveal><Link href="/foundation/the-build#quincunx" className="text-link">Explore Phase 2 →</Link></section>
  <section className="section garden-teaser"><Reveal><p className="eyebrow">PHASE 3–4 / THE GREAT HALL</p><h2>THE HALL SPEAKS.<br /><em>THE VILLAGE LISTENS.</em></h2><p>A nine-sided hall gathers the community around a central stage, tuned copper panels, concentric seating, and a broadcast mast that carries the signal outward.</p></Reveal><Reveal delay={.15}><FloatingGreatHall compact height="400px" /></Reveal><Link href="/foundation/the-build#great-hall" className="text-link">Enter the Great Hall →</Link></section>
  <section className="section garden-teaser"><Reveal><p className="eyebrow">PHASE 4 / THE FINAL GATE</p><h2>THE CATHEDRAL<br /><em>RESONATES.</em></h2><p>A twelve-faced prismatic shell gathers copper, stone, pattern, and light around a central altar. The completed village speaks to the sky.</p></Reveal><Reveal delay={.15}><FloatingPrismCathedral compact height="420px"/></Reveal><Link href="/foundation/the-build#cathedral" className="text-link">Open the Final Gate →</Link></section>
  <section className="section garden-teaser"><Reveal><p className="eyebrow">THE TETRAHEDRON GARDEN / 004</p><h2>THE GARDEN<br /><em>FLOATS.</em></h2><p>Explore twelve triangular beds, a solar-calibrated copper gnomon, six cold frames, the orchard ring, and the greenhouse in real time.</p></Reveal><Reveal delay={.15}><FloatingTetrahedronGarden compact height="360px" /></Reveal><Link href="/foundation/the-garden" className="text-link">Enter the full garden →</Link></section>
  <section className="section final-call"><Reveal><p className="eyebrow">BUILDERS WANTED / 006</p><h2>WE NEED YOUR HANDS.<br /><em>NOT YOUR RESUME.</em></h2><p>Foundation is in Phase 0. No housing is available yet. We are gathering the people who intend to help build what comes next.</p><Link href="/foundation/apply" className="button primary">Apply to Build →</Link></Reveal></section>
</div>; }
