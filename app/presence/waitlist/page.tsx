import { WaitlistForm } from "../components/WaitlistForm";

export default function Page() {
  return <div className="page page-waitlist">
    <section className="waitlist-stage">
      <div className="waitlist-stage__ember-field" aria-hidden="true" />
      <div className="waitlist-stage__veil" />
      <div className="waitlist-stage__copy"><span className="fire-glyph" aria-hidden="true">🜂</span><p className="eyebrow">INVITE-ONLY BETA · DECEMBER 2026</p><h1>Come sit<br />by the fire.</h1><p>We are opening slowly, relationship by relationship. Add your name and tell us what is calling you.</p><div className="waitlist-stage__signals"><span><i />Early retreat invitations</span><span><i />Keeper introductions</span><span><i />No noise. No tracking.</span></div></div>
      <div className="waitlist-stage__form"><span className="section-index">YOUR PLACE / 01</span><WaitlistForm /></div>
    </section>
  </div>;
}
