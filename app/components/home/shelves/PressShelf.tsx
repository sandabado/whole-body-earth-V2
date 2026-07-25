import { ShelfContent } from "./ShelfContent";

const stats = [
  { label: "VOLUMES", value: "5 published" },
  { label: "IN REVIEW", value: "2 manuscripts" },
  { label: "FREE CHAPTER", value: "Vol. I" },
] as const;

export function PressShelf() {
  return (
    <ShelfContent
      id="press"
      symbol="🜁"
      title="Whole Body Press"
      geometry="AIR · OCTAHEDRON · 8 FACES"
      about="Whole Body Press publishes texts rooted in wisdom traditions, somatic practice, ecological thinking, and creative rebellion. Each edition is crafted to last. Authors retain 100% of their IP; Press earns on production and placement—never ownership."
      stats={stats}
      href="/press"
      cta="ENTER PRESS"
    />
  );
}

export default PressShelf;
