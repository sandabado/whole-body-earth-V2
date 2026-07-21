import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";

type ApplicationPayload = {
  artistName?: unknown;
  email?: unknown;
  phone?: unknown;
  genre?: unknown;
  stage?: unknown;
  portfolioPrimary?: unknown;
  portfolioSecondary?: unknown;
  servicesNeeded?: unknown;
  whatTheyBuild?: unknown;
  whyStudios?: unknown;
  retainsIP?: unknown;
  consent?: unknown;
  website?: unknown;
};

const text = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as ApplicationPayload;
    if (text(data.website)) return NextResponse.json({ success: true });

    const artistName = text(data.artistName, 120);
    const email = text(data.email, 180).toLowerCase();
    const genre = text(data.genre, 160);
    const stage = text(data.stage, 30);
    const portfolioPrimary = text(data.portfolioPrimary, 500);
    const whatTheyBuild = text(data.whatTheyBuild, 500);
    const retainsIp = text(data.retainsIP, 20);
    const services = Array.isArray(data.servicesNeeded) ? data.servicesNeeded.map((item) => text(item, 120)).filter(Boolean).slice(0, 8) : [];

    if (!artistName || !emailPattern.test(email) || !genre || !stage || !portfolioPrimary || !whatTheyBuild || !retainsIp || !services.length || data.consent !== true) {
      return NextResponse.json({ error: "Required signal is incomplete." }, { status: 400 });
    }

    const runtime = env as unknown as { DB?: D1Database; RESEND_API_KEY?: string };
    if (!runtime.DB) throw new Error("Database binding unavailable");

    await runtime.DB.prepare(`CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY NOT NULL,
      artist_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      genre TEXT NOT NULL,
      stage TEXT NOT NULL,
      portfolio_primary TEXT NOT NULL,
      portfolio_secondary TEXT,
      services_needed TEXT NOT NULL,
      what_they_build TEXT NOT NULL,
      why_studios TEXT,
      retains_ip TEXT NOT NULL,
      consent INTEGER NOT NULL,
      status TEXT DEFAULT 'NEW' NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`).run();

    const id = crypto.randomUUID();
    await runtime.DB.prepare(`INSERT INTO applications (
      id, artist_name, email, phone, genre, stage, portfolio_primary, portfolio_secondary,
      services_needed, what_they_build, why_studios, retains_ip, consent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(
        id, artistName, email, text(data.phone, 40) || null, genre, stage,
        portfolioPrimary, text(data.portfolioSecondary, 500) || null,
        JSON.stringify(services), whatTheyBuild, text(data.whyStudios, 300) || null,
        retainsIp, 1,
      ).run();

    if (runtime.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${runtime.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Whole Body Studios <onboarding@wholebody.studios>",
          to: [email],
          subject: "Application Received — Whole Body Studios",
          html: `<div style="background:#050505;color:#ededed;padding:32px;font-family:monospace"><p style="color:#2ba8a0">TRANSMISSION / RECEIVED</p><h1>Application received.</h1><p>We review every submission within 14 days.</p><p>If your work carries the frequency, we’ll reach out.</p><hr style="border-color:#2a2a38"><small style="color:#8888a0">wholebody.studios · The artist eats first. Always.</small></div>`,
        }),
      }).catch(() => undefined);
    }

    return NextResponse.json({ success: true, applicationId: id });
  } catch (error) {
    console.error("Application route error", error);
    return NextResponse.json({ error: "The channel is unavailable. Try again shortly." }, { status: 500 });
  }
}
