import { ShelfContent } from "./ShelfContent";

const stats = [
  { label: "NEXT CIRCLE", value: "Aug 3 · 7pm" },
  { label: "RETREATS", value: "Autumn 2027" },
  { label: "ACTIVE MEMBERS", value: "12" },
] as const;

export function PresenceShelf() {
  return (
    <ShelfContent
      id="presence"
      symbol="🜂︎"
      title="Whole Body Presence"
      geometry="FIRE · TETRAHEDRON · 4 FACES"
      about="Embodied practice, open fire, and gatherings built for integration—not performance. Presence is a place to become honest again, held by real people in real rooms through work the body can recognize."
      stats={stats}
      href="/presence"
      cta="ENTER PRESENCE"
    />
  );
}

export default PresenceShelf;
