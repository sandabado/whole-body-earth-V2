import { ShelfContent } from "./ShelfContent";

const stats = [
  { label: "NOW STREAMING", value: "Sandabado" },
  { label: "TRACKS", value: "24" },
  { label: "VINYL", value: "Preorder open" },
] as const;

export function StudiosShelf() {
  return (
    <ShelfContent
      id="studios"
      symbol="🜄︎"
      title="Whole Body Studios"
      geometry="WATER · ICOSAHEDRON · 20 FACES"
      about="We finish records, build campaigns, place music, and press vinyl. The artist owns every part of the work; Studios earns on the services it performs, never on ownership."
      stats={stats}
      href="/studios"
      cta="ENTER STUDIOS"
    />
  );
}

export default StudiosShelf;
