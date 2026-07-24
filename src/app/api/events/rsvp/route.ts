import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdminClient } from "@/lib/supabaseClient";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const eventId = text(body.eventId, 100);
    const name = text(body.name, 200);
    const email = text(body.email, 200).toLowerCase();
    const phone = text(body.phone, 50);
    if (
      text(body.website, 200) ||
      !eventId ||
      !name ||
      !EMAIL.test(email) ||
      body.consent !== true
    )
      return NextResponse.json(
        { error: "Please complete the required reservation details." },
        { status: 400 },
      );

    const supabase = getSupabaseAdminClient();
    if (!supabase)
      return NextResponse.json(
        { error: "Reservations are temporarily unavailable." },
        { status: 503 },
      );

    const { data, error } = await supabase.rpc("reserve_event_rsvp", {
      p_event_id: eventId,
      p_name: name,
      p_email: email,
      p_phone: phone || null,
      p_is_member: false,
      p_first_time: body.firstTime === true,
    });
    if (error)
      return NextResponse.json(
        {
          error: error.message.includes("already exists")
            ? "You already have a reservation for this gathering."
            : error.message,
        },
        { status: 409 },
      );

    const rsvp = Array.isArray(data) ? data[0] : data;
    const { data: event } = await supabase
      .from("events")
      .select("title,event_date")
      .eq("id", eventId)
      .maybeSingle();
    if (process.env.RESEND_API_KEY && event && rsvp?.status === "confirmed") {
      try {
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: "Whole Body Earth <onboarding@resend.dev>",
          to: [email],
          subject: `Reserved — ${event.title}`,
          html: `<div style="font-family:monospace;background:#050505;color:#ededed;padding:2rem;max-width:600px"><h1 style="color:#2ba8a0">Your spot is reserved.</h1><p>${event.title}</p><p style="color:#aaa">${new Date(event.event_date).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: "America/Los_Angeles" })}</p><p>Event details will arrive from Whole Body Earth.</p></div>`,
        });
      } catch (emailError) {
        console.error("RSVP saved but confirmation email failed:", emailError);
      }
    }
    return NextResponse.json({ success: true, status: rsvp?.status ?? "confirmed" });
  } catch (error) {
    console.error("Event RSVP error:", error);
    return NextResponse.json(
      { error: "Unable to reserve your spot." },
      { status: 500 },
    );
  }
}
