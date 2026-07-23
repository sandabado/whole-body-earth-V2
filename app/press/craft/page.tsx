import type { Metadata } from "next";
import Link from "next/link";
import { CraftFaq } from "../components/CraftFaq";

export const metadata: Metadata = {
  title: "The Craft",
  description: "Paper, stitching, cloth, foil, and the production standards behind Whole Body Press editions.",
};

const materials = [
  {
    id: "paper",
    title: "Swedish acid-free 100g",
    body: "Uncoated, fiber-rich stock specified to resist yellowing, cracking, and ink bleed. Selected for annotation, return, and long storage.",
    spec: "100g/m² · Uncoated · Acid-free · FSC target",
  },
  {
    id: "cover",
    title: "Binding cloth & leather",
    body: "Hardcover editions use case-bound book cloth. Planned hand-bound editions use vegetable-tanned leather or durable cloth selected to outlive the text block.",
    spec: "Buckram cloth · Vegetable-tanned leather · Refillable where specified",
  },
  {
    id: "binding",
    title: "Stitched signatures",
    body: "Pages are folded into signatures, gathered, checked, and sewn for limited editions. The structure is legible, repairable, and built for repeated opening.",
    spec: "Coptic stitch · Smyth-sewn · Waxed linen thread",
  },
  {
    id: "foil",
    title: "Foil-stamped embossing",
    body: "Custom brass dies press foil into cloth or leather. Edition marks, initials, and constellation glyphs become part of the material rather than ink resting on top.",
    spec: "Gold foil · Brass dies · Heat pressed · Custom mark",
  },
] as const;

const process = [
  ["Typesetting", "The manuscript is shaped into a readable object. Display, body, and utility type are assigned deliberately; line lengths remain humane, margins breathe, and every page break becomes part of the pacing.", "2–3 weeks per title", "type"],
  ["Printing", "Trade editions use responsible print-on-demand or short-run production. Limited editions move to archival stock and smaller runs once material proofs are approved.", "1–2 weeks POD · 3–4 weeks short run", "print"],
  ["Folding & gathering", "Printed sheets are folded into signatures and checked for sequence. Misfolded or damaged signatures do not enter the edition.", "1–2 days per edition", "fold"],
  ["Sewing", "Limited-edition signatures are joined with waxed linen thread using a structure appropriate to the object: exposed Coptic or enclosed Smyth-sewn.", "2–4 hours per hand-bound book", "sew"],
  ["Casing", "The sewn text block meets cloth- or leather-covered boards, acid-free endpapers, and ribbon markers. The case rests under pressure to cure without warping.", "Overnight press + assembly", "case"],
  ["Embossing", "A brass die carries the Press Air glyph, title mark, or commissioned inscription into the cover. Each impression records heat, pressure, and the hand that aligned it.", "Approximately 30 minutes per book", "emboss"],
] as const;

const comparison = [
  ["Digital", "DRM-free PDF + EPUB", "—", "—", "Unlimited", "$9–15", "Instant delivery"],
  ["Trade Paperback", "Acid-free uncoated", "Perfect bound", "No", "Unlimited", "$18–28", "Print on demand"],
  ["Hardcover First", "Acid-free + cloth + ribbon", "Case-bound / Smyth-sewn", "Foil spine", "500+", "$35–55", "Short-run offset"],
  ["Hand-Bound Limited", "Acid-free + leather or cloth", "Coptic / Smyth-sewn", "Custom gold foil", "50 copies", "$125–300", "Planned Stockholm commission"],
  ["Ceremonial", "Archival paper + leather", "Hand-stitched", "Name / quote / glyph", "Commissioned", "$250–500", "Bespoke commission"],
  ["Archive", "Linen paper + linen binding", "Smyth-sewn + slipcase", "Letterpress colophon", "10–25", "$500–1,200", "Collector commission"],
] as const;

export default function CraftPage() {
  return (
    <div className="page press-page craft-page">
      <header className="craft-hero">
        <div className="craft-hero__study" aria-label="Abstract material study representing paper, leather, thread, and a bookbinder's tools">
          <span className="craft-hand craft-hand--one" /><span className="craft-hand craft-hand--two" />
          <i className="craft-awl" /><i className="craft-thread" /><b>🜁</b>
        </div>
        <div className="craft-hero__veil" />
        <div className="craft-hero__copy">
          <p className="eyebrow">THE CRAFT</p>
          <h1>Made to be used,<br />loved, kept.</h1>
          <p>Every Whole Body Press edition begins with durable paper and ends as an object designed for return. We print on stock chosen not to yellow, bind limited editions with structures that can be repaired, and emboss marks meant to remain.</p>
          <small>ACID-FREE · SIGNATURE-SEWN · CLOTH & LEATHER · FOIL-STAMPED</small>
        </div>
      </header>

      <section className="press-section">
        <div className="launch-format-note"><span>LAUNCH FORMATS</span><strong>DIGITAL + TRADE PAPERBACK</strong><i>HAND-BOUND EDITIONS · Q2 2027</i></div>
        <div className="press-section-head">
          <div><p className="eyebrow">MATERIALS</p><h2>What goes in matters.</h2></div>
          <p>The material standard is specific even while individual production partners and final supplier contracts are being confirmed.</p>
        </div>
        <div className="material-grid">
          {materials.map((material, index) => (
            <article key={material.id}>
              <div className={`material-visual material-visual--${material.id}`} aria-hidden="true">
                <span>0{index + 1}</span><i /><b>{material.id === "paper" ? "100G" : material.id === "cover" ? "CLOTH" : material.id === "binding" ? "LINEN" : "23K"}</b>
              </div>
              <div><p className="eyebrow">{material.id}</p><h3>{material.title}</h3><p>{material.body}</p><small>{material.spec}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="press-section-head">
          <div><p className="eyebrow">THE PROCESS</p><h2>From manuscript<br />to artifact.</h2></div>
        </div>
        <div className="process-list">
          {process.map(([title, body, duration, visual], index) => (
            <article key={title}>
              <div className={`process-visual process-visual--${visual}`} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><i /><b>🜁</b></div>
              <div><span className="process-number">{String(index + 1).padStart(2, "0")}</span><p className="eyebrow">STEP {String(index + 1).padStart(2, "0")}</p><h3>{title}</h3><p>{body}</p><small>{duration}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="bookbinders-section" id="bookbinders">
        <div className="bookbinders-mark" aria-label="Stockholm production pathway material study">
          <span>1927</span><b>STOCKHOLM</b><i>CRAFT PATHWAY</i><small>PARTNERSHIP IN DEVELOPMENT</small>
        </div>
        <div>
          <p className="eyebrow">INTENDED PRODUCTION PARTNER</p>
          <h2>Bookbinders Design<br />Stockholm.</h2>
          <p>Bookbinders Design was founded in Stockholm in 1927 and has built a nearly century-long practice around notebooks, journals, cloth, paper, and personalization.</p>
          <p>Whole Body Press intends to commission, rather than claim, that craft. The proposed relationship begins with Press as customer and Bookbinders as maker: we design an edition; their workshop executes the binding where scope, pricing, rights, and scheduling are formally agreed.</p>
          <p>Future phases may include custom constellation dies and a joint limited-edition imprint. Until an agreement is signed, these remain a transparent production roadmap—not a partnership announcement.</p>
          <div className="partner-callout"><span>Bookbinders Design</span><strong>Stockholm, Sweden</strong><small>EST. 1927 · FORMAL COMMISSION PENDING</small></div>
          <a href="https://www.bookbindersdesign.com/en/" className="button" target="_blank" rel="noreferrer">VISIT BOOKBINDERS →</a>
        </div>
      </section>

      <section className="press-section comparison-section">
        <div className="press-section-head">
          <div><p className="eyebrow">EDITIONS</p><h2>Six ways to hold a thought.</h2></div>
          <p>Hand-bound pricing is an estimate until supplier quotes and edition specifications are approved.</p>
        </div>
        <div className="comparison-scroll">
          <table>
            <thead><tr><th>FORMAT</th><th>MATERIALS</th><th>BINDING</th><th>EMBOSSING</th><th>EDITION</th><th>PRICE</th><th>PRODUCTION</th></tr></thead>
            <tbody>{comparison.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="custom-orders">
        <p className="eyebrow">CUSTOM ORDERS / PLANNED</p>
        <h2>Your name in gold.</h2>
        <p>Ceremonial and Archive editions will be commissioned individually after the production pathway is confirmed. Choose cloth or leather, a glyph or inscription, and an edition number. Estimated lead time is six to eight weeks after materials are approved.</p>
        <div className="custom-order-meta">
          <span>50% DEPOSIT</span><span>80 CHARACTER MAXIMUM</span><span>🜂 🜃 🜁 🜄 ☉</span><span>NO CUT MATERIAL / FULL REFUND</span>
        </div>
        <a className="button gold" href="mailto:orders@wholebody.press?subject=Custom edition inquiry">OPEN A CUSTOM EDITION INQUIRY →</a>
      </section>

      <section className="press-section craft-faq-section">
        <div className="press-section-head"><div><p className="eyebrow">QUESTIONS / MATERIAL ANSWERS</p><h2>Before the first fold.</h2></div></div>
        <CraftFaq />
      </section>

      <section className="press-footer-cta">
        <p className="eyebrow">BROWSE THE CATALOG</p>
        <h2>Hold one in your hands.</h2>
        <div className="hero-actions">
          <Link className="button gold" href="/press/catalog">EXPLORE CATALOG →</Link>
          <Link className="button" href="/press/submit">SUBMIT MANUSCRIPT</Link>
        </div>
      </section>
    </div>
  );
}
