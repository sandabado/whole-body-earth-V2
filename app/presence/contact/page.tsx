import { ContactForm } from "../components/ContactForm";
import { Reveal } from "../components/Reveal";

const paths = [
  ["Gatherings", "Retreat details, accessibility, scholarship places", "gatherings@wholebody.community"],
  ["Practitioners", "Sessions, referrals, or joining the keeper circle", "keepers@wholebody.community"],
  ["Everything else", "Press, partnerships, questions, and honest notes", "hello@wholebody.community"],
] as const;

export default function Page() {
  return <div className="page page-contact">
    <header className="cinematic-hero contact-hero">
      <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1920&q=88" alt="Open desert road in warm evening light" />
      <div className="cinematic-shade" />
      <div className="cinematic-copy"><p className="eyebrow">CONTACT / A HUMAN ANSWERS</p><h1>Speak plainly.<br />We listen.</h1><p>No ticket maze. No sales sequence. Your note reaches the people holding the room.</p></div>
    </header>
    <section className="contact-layout">
      <Reveal className="contact-paths">
        <span className="section-index">DIRECT PATHS / 01</span>
        <p className="eyebrow">FIND THE RIGHT FIRE</p>
        <h2>Questions belong in the open.</h2>
        <p className="contact-intro">Ask about accessibility, cost, fit, safety, or anything you need before saying yes. We would rather answer clearly than rush you into a room.</p>
        <div className="contact-path-list">{paths.map(([title, copy, email], index) => <a href={`mailto:${email}`} key={email}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p><small>{email} ↗</small></div></a>)}</div>
        <aside><i />Typical reply window <strong>Two human days</strong></aside>
      </Reveal>
      <Reveal className="contact-compose" delay={.1}>
        <span className="section-index">YOUR NOTE / 02</span>
        <ContactForm />
      </Reveal>
    </section>
  </div>;
}
