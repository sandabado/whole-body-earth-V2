import type { Phase } from "./builder-data";

export function PhaseGeometry({ geometry, large = false }: { geometry: Phase["geometry"]; large?: boolean }) {
  const polygon = (sides: number, radius: number) => Array.from({ length: sides }, (_, index) => {
    const angle = (index / sides) * Math.PI * 2 - Math.PI / 2;
    return `${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`;
  }).join(" ");

  return <svg className={large ? "phase-geometry large" : "phase-geometry"} viewBox="0 0 100 100" aria-hidden="true">
    <circle className="geometry-guide" cx="50" cy="50" r="43" />
    <path className="geometry-axis" d="M3 50H97M50 3V97" />
    {geometry === "Point" && <><circle className="geometry-main pulse" cx="50" cy="50" r="7" /><circle className="geometry-main" cx="50" cy="50" r="24" /></>}
    {geometry === "Tetrahedron" && <><polygon className="geometry-main" points="50,10 89,78 11,78" /><path className="geometry-detail" d="M50 10L50 56M11 78L50 56L89 78" /></>}
    {geometry === "Quincunx" && <><path className="geometry-detail" d="M25 25L50 50L75 25M25 75L50 50L75 75" />{[[25,25],[75,25],[50,50],[25,75],[75,75]].map(([x,y]) => <circle key={`${x}-${y}`} className="geometry-main" cx={x} cy={y} r="9" />)}</>}
    {geometry === "Nonagon" && <><polygon className="geometry-main" points={polygon(9, 38)} /><circle className="geometry-detail" cx="50" cy="50" r="23" /><path className="geometry-detail" d="M50 12V88M12 50H88" /></>}
    {geometry === "Dodecahedron" && <><polygon className="geometry-main" points={polygon(12, 39)} /><polygon className="geometry-detail" points={polygon(6, 24)} /><circle className="geometry-detail" cx="50" cy="50" r="10" /></>}
  </svg>;
}
