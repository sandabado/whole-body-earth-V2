import { getDb } from "../../../../../../db";
import { eventRegistrations } from "../../../../../../db/schema";
import { getEvent } from "../../../../components/press-catalog";

type Payload = { name?: unknown; email?: unknown; quantity?: unknown; consent?: unknown; _gotcha?: unknown };
const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = getEvent(id);
    if (!event) return Response.json({ error: "Event not found." }, { status: 404 });
    const payload = await request.json() as Payload;
    if (clean(payload._gotcha, 10)) return Response.json({ ok: true });
    const name = clean(payload.name, 120);
    const email = clean(payload.email, 254).toLowerCase();
    const quantity = Number(payload.quantity);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "A valid name and email are required." }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 4) {
      return Response.json({ error: "Choose between one and four places." }, { status: 400 });
    }
    if (!(payload.consent === true || payload.consent === "on" || payload.consent === "true")) {
      return Response.json({ error: "Transactional consent is required." }, { status: 400 });
    }
    const [registration] = await getDb().insert(eventRegistrations).values({
      eventId: event.id, name, email, quantity, consentTransactional: true,
    }).returning({ id: eventRegistrations.id });
    return Response.json({ ok: true, id: registration.id, event: event.title }, { status: 201 });
  } catch (error) {
    console.error("Press event registration failed", error);
    return Response.json({ error: "Registration could not be completed." }, { status: 500 });
  }
}
