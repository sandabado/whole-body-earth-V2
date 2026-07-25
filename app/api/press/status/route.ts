import { pressEvents, pressTitles } from "../../../press/components/press-catalog";

export async function GET() {
  return Response.json({
    summary: "Vol. III review opens Aug 12",
    volumes: pressTitles.slice(0, 3).map((title) => ({
      title: title.title,
      subtitle: title.subtitle,
      glyph: title.cover.glyph,
      folio: title.cover.folio,
      tone: title.cover.tone,
      status: title.status,
      href: `/press/catalog/${title.slug}`,
    })),
    nextEvent: pressEvents[0] ? { title: pressEvents[0].title, date: pressEvents[0].date } : null,
  }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
