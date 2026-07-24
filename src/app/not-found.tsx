import Link from "next/link";

const ELEMENTS = [
  { symbol: "🜂", name: "Fire", color: "#d16b45" },
  { symbol: "🜁", name: "Air", color: "#d4af37" },
  { symbol: "🜄", name: "Water", color: "#2ba8a0" },
  { symbol: "🜃", name: "Earth", color: "#84a66e" },
  { symbol: "☉", name: "Ether", color: "#8f5bff" },
];

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-5 py-20 sm:px-6">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_44%,rgba(255,120,196,.14),transparent_25%),radial-gradient(ellipse_at_22%_76%,rgba(43,168,160,.12),transparent_34%),radial-gradient(ellipse_at_80%_18%,rgba(143,91,255,.16),transparent_36%)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[min(86vw,43rem)] w-[min(86vw,43rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone/10 [box-shadow:0_0_0_1.2rem_rgba(255,255,255,.025),0_0_0_4rem_rgba(255,255,255,.018),0_0_9rem_rgba(255,120,196,.1)]" />

      <div className="mx-auto w-full max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[.24em] text-bone/65">404 · cosmic routing notice</p>
        <p className="mt-6 bg-[linear-gradient(90deg,#ff7aab,#f3d26e,#79d9d3,#a993ff,#ff7aab)] bg-[length:200%_100%] bg-clip-text font-display text-[clamp(7rem,27vw,15rem)] leading-[.68] text-transparent animate-[earth-gradient-flow_5s_linear_infinite]">404</p>
        <h1 className="mt-10 font-display text-4xl font-medium leading-[.96] text-bone sm:text-6xl">The geometry is<br />out of coherence.</h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-bone/75 sm:text-lg">This path wandered beyond the known constellation. Even the dodecahedron gets a little turned around sometimes.</p>

        <div className="mx-auto mt-10 grid max-w-xl grid-cols-5 border border-bone/15 bg-void/55 backdrop-blur-sm">
          {ELEMENTS.map((element, index) => <div key={element.name} className={`p-3 sm:p-4 ${index < ELEMENTS.length - 1 ? "border-r border-bone/15" : ""}`}>
            <span aria-hidden="true" className="alchemical-glyph text-2xl sm:text-3xl" style={{ color: element.color }}>{element.symbol}</span>
            <p className="mt-2 font-mono text-[8px] uppercase tracking-[.12em] text-bone/60 sm:text-[9px]">{element.name}</p>
          </div>)}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="bg-bone px-5 py-3 font-mono text-xs uppercase tracking-[.12em] text-void transition hover:bg-[#f3d26e]">Return to Earth ♁</Link>
          <Link href="/reading" className="border border-bone/45 px-5 py-3 font-mono text-xs uppercase tracking-[.12em] text-bone transition hover:border-[#ff9dcc] hover:bg-[#ff78c4]/10 hover:text-[#ff9dcc]">Find your pillar →</Link>
        </div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[.13em] text-ghost">No geometries were harmed in this detour.</p>
      </div>
    </section>
  );
}
