import Link from "next/link";
import { notFound } from "next/navigation";
import { EventRsvpForm } from "@/components/events/EventRsvpForm";
import { eventDateTime, eventPrice, getPublicEventBySlug } from "@/lib/events";
import { PILLARS, type PillarId } from "@/lib/pillars";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getPublicEventBySlug((await params).slug);
  if (!event) notFound();
  const pillar = PILLARS[event.pillar as PillarId];
  const full = event.spotsRemaining === 0;
  return <main className="px-6 py-14 md:py-20"><div className="mx-auto max-w-[900px]"><Link href="/events" className="font-mono text-[10px] uppercase tracking-[.14em] text-ghost transition hover:text-bone">← Back to calendar</Link><header className="mt-10 border-b border-mercury pb-10"><p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: pillar?.color ?? "var(--press)" }}>{pillar?.symbol ?? "✦"} {pillar ? `Whole Body ${pillar.name}` : event.pillar}</p><h1 className="mt-4 font-display text-5xl leading-[.94] text-bone sm:text-6xl">{event.title}</h1><p className="mt-6 text-lg leading-8 text-ghost">{eventDateTime(event)}<br />{event.location ?? (event.locationType === "virtual" ? "Virtual — access details follow your RSVP" : "Whole Body Earth")}</p></header><section className="grid gap-10 py-10 md:grid-cols-[1.1fr_.9fr]"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ghost">About</p><p className="mt-4 whitespace-pre-line leading-8 text-bone/85">{event.description || "A gathering in the Whole Body field. Come as you are, and bring the part of the work that is asking to be held."}</p>{event.recurring ? <p className="mt-8 border-l-2 border-press pl-4 text-sm text-ghost">Recurring · This gathering returns {event.recurring === "weekly" ? "each week" : "each month"}.</p> : null}</div><aside className="border border-mercury bg-carbon/70 p-6"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-press">Reserve your spot</p><dl className="mt-5 space-y-3 border-y border-mercury py-5"><Detail label="Price" value={eventPrice(event)} /><Detail label="Capacity" value={event.capacity ? `${event.capacity} spots` : "Open"} /><Detail label="Remaining" value={event.spotsRemaining === null ? "Open" : `${event.spotsRemaining} spots`} /><Detail label="Access" value={event.locationType === "virtual" ? "Link sent after RSVP" : event.locationType === "hybrid" ? "In-person + virtual" : "In person"} /></dl><EventRsvpForm eventId={event.id} paid={event.priceCents > 0} full={full} waitlist={event.waitlistEnabled} /></aside></section></div></main>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><dt className="text-ghost">{label}</dt><dd className="text-right text-bone">{value}</dd></div>; }
