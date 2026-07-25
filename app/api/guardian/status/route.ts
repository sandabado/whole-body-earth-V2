export async function GET() {
  return Response.json({
    summary: "2 vetting consultations in progress",
    activeConsultations: 2,
    signals: ["Stewardship fit", "Agreement coherence", "Long-view alignment"],
    status: "Private field active",
  }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
