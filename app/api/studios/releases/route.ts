const releases = [
  { title: "∞ Love", artist: "Sandābādo", date: "September 26, 2026", status: "Preorder", href: "/studios/catalog" },
  { title: "Living Earth Vol. 1", artist: "Various Artists", date: "Planned Q4 2026", status: "Mixing", href: "/studios/catalog" },
  { title: "Memory EP", artist: "Sarah Veya", date: "In development", status: "Mastering", href: "/studios/catalog" },
] as const;

export async function GET() {
  return Response.json({
    summary: "Sandābādo transmits September 26",
    release: releases[0],
    releases,
    streamUrl: "https://sandabado-music.vercel.app/music",
  }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
