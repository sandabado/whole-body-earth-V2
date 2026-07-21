import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";

const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as Record<string, unknown>;
    if (clean(data.website, 200)) return NextResponse.json({ success: true });
    const name = clean(data.name, 120);
    const email = clean(data.email, 180).toLowerCase();
    const subject = clean(data.subject, 120);
    const message = clean(data.message, 3000);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || message.length < 10) {
      return NextResponse.json({ error: "Required signal is incomplete." }, { status: 400 });
    }
    const runtime = env as unknown as { DB?: D1Database };
    if (!runtime.DB) throw new Error("Database binding unavailable");
    await runtime.DB.prepare(`CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`).run();
    const id = crypto.randomUUID();
    await runtime.DB.prepare("INSERT INTO contact_messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)")
      .bind(id, name, email, subject, message).run();
    return NextResponse.json({ success: true, messageId: id });
  } catch (error) {
    console.error("Contact route error", error);
    return NextResponse.json({ error: "The channel is unavailable. Try again shortly." }, { status: 500 });
  }
}
