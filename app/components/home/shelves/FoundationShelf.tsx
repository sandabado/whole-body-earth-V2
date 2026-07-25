import { ShelfContent } from "./ShelfContent";

const stats = [
  { label: "BUILD PHASE", value: "Phase 0" },
  { label: "LOCATION", value: "Morongo Valley" },
  { label: "NEXT MILESTONE", value: "Site survey" },
] as const;

export function FoundationShelf() {
  return (
    <ShelfContent
      id="foundation"
      symbol="🜃︎"
      title="Whole Body Foundation"
      geometry="EARTH · CUBE · 6 FACES"
      about="Whole Body Foundation acquires land and builds permanent infrastructure for the constellation. Water, food, shelter, and gathering systems arrive in a sequence the ground can support."
      stats={stats}
      href="/foundation"
      cta="ENTER FOUNDATION"
    />
  );
}

export default FoundationShelf;
