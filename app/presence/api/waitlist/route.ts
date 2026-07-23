import { getDb } from "../../../../db";
import { waitlistEntries } from "../../../../db/schema";

type WaitlistBody = { name?: unknown; email?: unknown; interest?: unknown; message?: unknown; _gotcha?: unknown };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as WaitlistBody;
    if (clean(body._gotcha, 10)) return Response.json({ ok: true });
    const name = clean(body.name, 100);
    const email = clean(body.email, 254).toLowerCase();
    const interest = clean(body.interest, 100) || undefined;
    const message = clean(body.message, 1500) || undefined;
    if (!name || !emailPattern.test(email)) {
      return Response.json({ error: "A valid name and email are required." }, { status: 400 });
    }
    await getDb().insert(waitlistEntries).values({ name, email, interest, message })
      .onConflictDoUpdate({ target: waitlistEntries.email, set: { name, interest, message } });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Waitlist submission failed", error);
    return Response.json({ error: "Unable to join the waitlist." }, { status: 500 });
  }
}
