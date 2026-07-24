import { Reveal } from "../components/Reveal";

const principles = [
  ["01", "Consent", "No touch, recording, disclosure, or intervention without clear, specific, ongoing consent. Silence is never treated as permission."],
  ["02", "Confidentiality", "Stories shared in the circle stay in the circle. Lessons may travel; identities do not."],
  ["03", "Sobriety", "Our spaces are substance-free unless a specific, legal, professionally held ceremony clearly states otherwise."],
  ["04", "Accountability", "Harm is addressed directly. Status, payment, and proximity to leadership grant no exemption."],
  ["05", "Sovereignty", "You may pause, decline, leave, or change your mind at any time. No explanation is required."],
] as const;

export default function Page() {
  return <div className="page page-code">
    <header className="code-hero">
      <div><p className="eyebrow">CODE OF CONDUCT / THE CONTAINER</p><h1>The boundary is<br />part of the care.</h1><p>Every person entering a Whole Body Presence space agrees to protect the dignity, privacy, and sovereignty of everyone else in the circle.</p></div>
      <figure><img src="https://images.unsplash.com/photo-1501004318641-b3f7eb0a1bf9?w=1200&q=88" alt="Hands meeting the earth during a grounding practice" /><figcaption>Before transformation: safety.</figcaption></figure>
    </header>
    <section className="code-principles"><div className="code-principles__intro"><span className="section-index">THE AGREEMENT / 01–05</span><h2>Five things<br />we do not bend.</h2><p>This agreement applies to guests, facilitators, practitioners, founders, photographers, partners, and volunteers alike.</p></div><div className="code-principles__list">{principles.map(([number, title, copy], index) => <Reveal key={number} delay={index * .05}><article><b>{number}</b><div><h3>{title}</h3><p>{copy}</p></div></article></Reveal>)}</div></section>
    <section className="code-response"><p className="eyebrow">IF SOMETHING HAPPENS</p><h2>Tell us. We will not make you carry it alone.</h2><p>Raise a concern with any keeper in the room, or write privately. Immediate safety comes first; review and accountability follow.</p><a className="button ember" href="mailto:safety@wholebody.community">Contact safety →</a></section>
  </div>;
}
