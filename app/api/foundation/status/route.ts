const phases = [
  { index: "01", title: "The River", status: "SURVIVAL BASELINE", href: "/foundation/the-build" },
  { index: "02", title: "The Quincunx", status: "DESIGNED", href: "/foundation/the-build#quincunx" },
  { index: "03", title: "The Great Hall", status: "PLANNED", href: "/foundation/the-build#great-hall" },
] as const;

export async function GET() {
  return Response.json({
    summary: "Glory Peak survey scheduled",
    location: "Morongo Valley, California",
    phase: "Phase 0 · Site study",
    phases,
  }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
