import type { Metadata } from "next";
import { Reveal } from "../components/Reveal";

export const metadata: Metadata = { title: "Our Way", description: "Whole Body Presence builds hearths for transformation, integration, and human connection." };

const values = [
  ["01", "PRESENCE", "Phones away. Eyes open. Body engaged. We are here—not performing presence, being it."],
  ["02", "INTEGRITY", "We do what we say. We charge fairly, name our limits, and repair what we can."],
  ["03", "CARE", "Real care is not a product. It is attention. We give ours fully to the people in the room."],
  ["04", "SOVEREIGNTY", "Your body. Your path. Your pace. We guide and reflect. We never decide for you."],
];

export default function AboutPage() {
  return <div className="page page-about">
    <header className="cinematic-hero about-hero"><img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=88" alt="Friends together in warm evening light" /><div className="cinematic-shade"/><div className="cinematic-copy"><p className="eyebrow">WHO WE ARE</p><h1>We build<br />hearths.</h1><p>Not audiences. Not funnels. Rooms where people can become honest again.</p></div></header>
    <section className="editorial-story">
      <Reveal className="story-lead"><span className="section-index">THE MISSION / 01</span><p className="eyebrow">WHY PRESENCE EXISTS</p><h2>The wellness industry learned to sell transformation without staying for the aftermath.</h2></Reveal>
      <Reveal className="story-body" delay={.1}><p>Retreat centers charge thousands for a weekend and send you home with nothing. Apps optimize for screen time, not change. Coaches upsell. Gurus perform.</p><p>We are building something older and more accountable: practitioners who have done their own work; gatherings designed for integration; spaces where care continues after the peak experience.</p><blockquote>“Fire does not consume.<br />Fire transforms.”</blockquote></Reveal>
    </section>
    <section className="values-section"><div className="section-heading left"><span className="section-index">THE CODE / 02</span><p className="eyebrow">WHAT WE STAND ON</p><h2>Four practices.<br />One standard.</h2></div><div className="values-list">{values.map((value, i) => <Reveal key={value[1]} delay={i * .06}><article><b>{value[0]}</b><h3>{value[1]}</h3><p>{value[2]}</p></article></Reveal>)}</div></section>
    <section className="founders-section"><div className="section-heading"><span className="section-index">THE KEEPERS / 03</span><p className="eyebrow">FACES BEHIND THE FIRE</p><h2>People before platform.</h2></div><div className="founder-grid">{[
      ["Jesse Gawlik", "Founder · Somatic Guide", "Desert keeper. Ten years of somatic practice. Builds the rooms and holds the center.", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=85"],
      ["Shannon V.", "Co-Founder · Trauma Specialist", "Clinical trauma training. Wilderness therapy background. Holds the harder edges.", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=85"],
      ["Marcus Reed", "Breathwork · Fire Keeper", "Former firefighter. Breathwork facilitator. Keeps the literal and metaphorical fires burning.", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85"],
    ].map((person, i) => <Reveal key={person[0]} delay={i * .08}><article><div className="portrait-reveal"><img src={person[3]} alt={person[0]} loading="lazy"/><i/></div><div><span className="live-label"><i/>{person[1]}</span><h3>{person[0]}</h3><p>{person[2]}</p></div></article></Reveal>)}</div></section>
    <section className="legal-identity"><span>LEGAL ENTITY / WHOLE BODY GUILD LLC</span><p>Operating as Whole Body Presence</p><a href="https://wholebody.community">wholebody.community ↗</a></section>
  </div>;
}
