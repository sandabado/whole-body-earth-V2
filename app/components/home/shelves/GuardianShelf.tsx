import { ShelfContent } from "./ShelfContent";

const stats = [
  { label: "MINIMUM", value: "$50k/year" },
  { label: "STRUCTURES", value: "DAPT + LLC" },
  { label: "STATUS", value: "Waitlist open" },
] as const;

export function GuardianShelf() {
  return (
    <ShelfContent
      id="guardian"
      symbol="⊙"
      title="Whole Body Guardian"
      geometry="ETHER · DODECAHEDRON · 12 FACES"
      about="Guardian is the Ether pillar: agreements, stewardship, protection, and the invisible architecture that lets every other body remain sovereign. It holds relationships designed to outlast urgency."
      stats={stats}
      href="/guardian"
      cta="ENTER GUARDIAN"
    />
  );
}

export default GuardianShelf;
