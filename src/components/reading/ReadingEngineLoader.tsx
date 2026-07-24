const solids = [
  {
    id: "tetrahedron",
    name: "Tetrahedron",
    element: "Fire",
    paths: ["M90 18 152 132 28 132Z", "M90 18v114M28 132l62-42 62 42"],
  },
  {
    id: "cube",
    name: "Cube",
    element: "Earth",
    paths: ["M46 56h72v72H46z", "M70 30h72v72H70z", "M46 56 70 30m48 26 24-26m-24 98 24-26M46 128l24-26"],
  },
  {
    id: "octahedron",
    name: "Octahedron",
    element: "Water",
    paths: ["M90 18 152 90 90 162 28 90Z", "M28 90h124M90 18v144M28 90 90 56l62 34M28 90l62 34 62-34"],
  },
  {
    id: "dodecahedron",
    name: "Dodecahedron",
    element: "Ether",
    paths: ["M90 18 132 48 116 98H64L48 48Z", "M48 48 28 94l36 44 26-40m42 0 26 40 36-44-20-46m-116 90 42 24 42-24"],
  },
  {
    id: "icosahedron",
    name: "Icosahedron",
    element: "Air",
    paths: ["M90 18 146 58 124 138H56L34 58Z", "M34 58h112M56 138 90 18l34 120M34 58l56 42 56-42M56 138l34-38 34 38"],
  },
] as const;

export function ReadingEngineLoader() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      aria-label="Calculating your Whole Body reading"
      className="reading-engine-loader"
    >
      <div className="reading-engine-orbit" aria-hidden="true" />
      <div className="reading-engine-solids" aria-hidden="true">
        {solids.map((solid, index) => (
          <svg
            key={solid.id}
            viewBox="0 0 180 180"
            className="reading-engine-solid"
            style={{ "--solid-index": index } as React.CSSProperties}
          >
            {solid.paths.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
        ))}
      </div>
      <div className="reading-engine-copy">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-press">
          Whole Body engine online
        </p>
        <div className="relative mt-3 h-7 overflow-hidden">
          {solids.map((solid, index) => (
            <p
              key={solid.id}
              className="reading-engine-label font-display text-xl text-bone"
              style={{ "--solid-index": index } as React.CSSProperties}
            >
              {solid.element} · {solid.name}
            </p>
          ))}
        </div>
        <p className="mt-3 text-sm text-ghost">
          Mapping your five bodies and celestial pattern…
        </p>
      </div>
    </section>
  );
}
