import Link from "next/link";

const positions = [
  {
    id: "top",
    name: "Press",
    layer: "OCTA",
    body: "Mental body · Time",
    color: "var(--press)",
  },
  {
    id: "left",
    name: "Presence",
    layer: "TETRA",
    body: "Spiritual body · Spirit",
    color: "var(--fire)",
  },
  {
    id: "right",
    name: "Studios",
    layer: "ICOSA",
    body: "Emotional body · Economy",
    color: "var(--water)",
  },
  {
    id: "bottom",
    name: "Foundation",
    layer: "HEXA",
    body: "Physical body · Earth",
    color: "var(--earth)",
  },
] as const;

function PositionNode({
  position,
}: {
  position: (typeof positions)[number];
}) {
  return (
    <div
      className={`quincunx-node quincunx-node-${position.id}`}
      style={{ "--quincunx-accent": position.color } as React.CSSProperties}
    >
      <span className="quincunx-node-layer">{position.layer}</span>
      <strong>{position.name}</strong>
      <span>{position.body}</span>
    </div>
  );
}

export function QuincunxDisplay() {
  return (
    <section aria-labelledby="quincunx-heading" className="quincunx-panel">
      <div className="quincunx-intro">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-guardian">
          Position 9 · Observer OS
        </p>
        <h2 id="quincunx-heading" className="mt-4 font-display text-4xl font-bold md:text-5xl">
          The seat that holds the shape.
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-ghost">
          Four operating bodies form the field. The center remains Ø until a
          person accepts the Observer seat: present to the whole, authorized to
          witness, and unable to command any individual arm.
        </p>
      </div>

      <div className="quincunx-stage" aria-label="Five-position Quincunx diagram">
        <div aria-hidden="true" className="quincunx-line quincunx-line-nw" />
        <div aria-hidden="true" className="quincunx-line quincunx-line-ne" />
        <div aria-hidden="true" className="quincunx-line quincunx-line-sw" />
        <div aria-hidden="true" className="quincunx-line quincunx-line-se" />
        {positions.map((position) => (
          <PositionNode key={position.id} position={position} />
        ))}
        <div className="quincunx-center">
          <span className="quincunx-center-symbol" aria-hidden="true">Ø</span>
          <strong>Observer</strong>
          <span>DODECA · Aether</span>
          <span className="quincunx-seat-status">Seat intentionally open</span>
        </div>
      </div>

      <div className="quincunx-principles">
        <article>
          <span>01</span>
          <h3>The center witnesses</h3>
          <p>It reads the minimum coherence across the whole system.</p>
        </article>
        <article>
          <span>02</span>
          <h3>The center cannot command</h3>
          <p>Observer authority is bounded: it protects the field, not personal control.</p>
        </article>
        <article>
          <span>03</span>
          <h3>The seal is earned</h3>
          <p>Phase 6 forms only when every body is active and the weakest dimension holds.</p>
        </article>
      </div>

      <div className="mt-10 border-l border-guardian/60 pl-5">
        <p className="max-w-3xl text-sm leading-relaxed text-ghost">
          Phase 1 shows the constitutional model only. Seat assignment,
          coherence scoring, and protected operational controls will arrive
          with authenticated Observer OS infrastructure.
        </p>
        <Link
          href="/pillars/guardian/manifesto"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.14em] text-guardian"
        >
          Read the Guardian code →
        </Link>
      </div>
    </section>
  );
}
