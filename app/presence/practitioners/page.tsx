import Link from "next/link";
import {PractitionerDirectory} from "./PractitionerDirectory";

export default function PractitionersPage() {
  return (
    <div className="page directory-page">
      <header className="page-hero directory-hero">
        <p className="eyebrow">THE KEEPERS</p>
        <h1>Hands that hold space.</h1>
        <p>
          Trained practitioners. Real humans. Not influencers. Not gurus. People
          who have done their own work and now hold space for yours.
        </p>
        <div className="hero-proof" aria-label="Practitioner standards">
          <span>VETTED BY RELATIONSHIP</span>
          <span>CONSENT-LED</span>
          <span>VIRTUAL + DESERT</span>
        </div>
      </header>

      <PractitionerDirectory />

      <section className="callout keeper-callout" aria-labelledby="keeper-callout-title">
        <p className="eyebrow">ARE YOU A KEEPER?</p>
        <h2 id="keeper-callout-title">Hold space with us.</h2>
        <p>
          We are growing the circle carefully. If you are a trained practitioner
          aligned with consent, privacy, and care without extraction, begin a
          conversation with us.
        </p>
        <Link className="button ember" href="/presence/contact">
          APPLY TO JOIN <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
