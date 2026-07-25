import { events } from "../../../presence/components/data";

export async function GET() {
  const gatheringEvents = events.filter((event) => ["Gathering", "Retreat", "Intensive"].includes(event.kind)).slice(0, 3);
  return Response.json({
    summary: `${gatheringEvents.length} gatherings in the current field`,
    nearest: gatheringEvents[0] ? {
      title: gatheringEvents[0].title,
      date: gatheringEvents[0].date,
      location: gatheringEvents[0].location,
      href: `/presence/events/${gatheringEvents[0].slug}`,
      startsAt: "2027-03-15T15:00:00-07:00",
    } : null,
    events: gatheringEvents.map((event) => ({
      title: event.title,
      kind: event.kind,
      date: event.date,
      location: event.location,
      availability: event.availability,
      image: event.image,
      href: `/presence/events/${event.slug}`,
    })),
  }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
