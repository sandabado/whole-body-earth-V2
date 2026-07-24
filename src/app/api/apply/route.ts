import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  APPLICATION_PILLARS,
  isApplicationPillar,
} from "@/lib/application-pillars";
import { getSupabaseAdminClient } from "@/lib/supabaseClient";

const STAGES = ["WRITING", "RECORDING", "RELEASED", "TOURING"] as const;
const SERVICES: string[] = Object.values(APPLICATION_PILLARS).flatMap(
  (pillar) => pillar.services,
);

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPillar: unknown = body.pillar;
    const pillar =
      typeof rawPillar === "string" && isApplicationPillar(rawPillar)
        ? rawPillar
        : null;
    const artistName =
      typeof body.artistName === "string" ? body.artistName.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const genre = typeof body.genre === "string" ? body.genre.trim() : "";
    const stage = typeof body.stage === "string" ? body.stage : "";
    const portfolioPrimary =
      typeof body.portfolioPrimary === "string"
        ? body.portfolioPrimary.trim()
        : "";
    const portfolioSecondary =
      typeof body.portfolioSecondary === "string"
        ? body.portfolioSecondary.trim()
        : "";
    const rawServices = Array.isArray(body.servicesNeeded)
      ? (body.servicesNeeded as unknown[])
      : [];
    const servicesNeeded = rawServices.filter(
      (item): item is string =>
        typeof item === "string" && SERVICES.includes(item),
    );
    const whatBuilding =
      typeof body.whatBuilding === "string" ? body.whatBuilding.trim() : "";
    const whyStudios =
      typeof body.whyStudios === "string" ? body.whyStudios.trim() : "";
    const retainsIP =
      typeof body.retainsIP === "boolean" ? body.retainsIP : null;
    const consent = body.consent === true;
    const website = typeof body.website === "string" ? body.website.trim() : "";

    if (website) {
      return NextResponse.json(
        { error: "Unable to submit application" },
        { status: 400 },
      );
    }

    if (
      !pillar ||
      !artistName ||
      artistName.length > 140 ||
      !email ||
      !genre ||
      genre.length > 80 ||
      !portfolioPrimary ||
      !whatBuilding ||
      !consent ||
      !STAGES.includes(stage as (typeof STAGES)[number])
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    const normalizeHttpUrl = (value: string) => {
      try {
        const url = new URL(
          /^https?:\/\//i.test(value) ? value : `https://${value}`,
        );
        return url.protocol === "https:" || url.protocol === "http:"
          ? url.toString()
          : null;
      } catch {
        return null;
      }
    };

    const primaryPortfolioUrl = normalizeHttpUrl(portfolioPrimary);
    const secondaryPortfolioUrl = portfolioSecondary
      ? normalizeHttpUrl(portfolioSecondary)
      : null;

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      phone.length > 40 ||
      !primaryPortfolioUrl ||
      (portfolioSecondary && !secondaryPortfolioUrl) ||
      whatBuilding.length > 500 ||
      whyStudios.length > 300
    ) {
      return NextResponse.json(
        { error: "Invalid application data" },
        { status: 400 },
      );
    }

    const portfolioUrls = [primaryPortfolioUrl, secondaryPortfolioUrl].filter(
      (url): url is string => Boolean(url),
    );
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      console.error(
        "Application intake is missing server-side Supabase configuration",
      );
      return NextResponse.json(
        { error: "Application intake is temporarily unavailable" },
        { status: 503 },
      );
    }

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        element: APPLICATION_PILLARS[pillar].element,
        artist_name: artistName,
        email,
        phone: phone || null,
        genre,
        stage,
        portfolio_urls: portfolioUrls,
        services_needed: servicesNeeded,
        what_they_build: whatBuilding,
        why_studios: whyStudios || null,
        retains_ip:
          retainsIP === true ? "Yes" : retainsIP === false ? "No" : "Unsure",
        consent: true,
        status: "PENDING",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase application insert error:", error);
      return NextResponse.json(
        { error: "Unable to save application" },
        { status: 500 },
      );
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const safeArtistName = escapeHtml(artistName);
      const safeEmail = escapeHtml(email);
      const pillarName = APPLICATION_PILLARS[pillar].name;
      const pillarColor = APPLICATION_PILLARS[pillar].color;

      try {
        await resend.emails.send({
          from: "Whole Body Studios <onboarding@resend.dev>",
          to: [email],
          subject: `Application Received — Whole Body ${pillarName}`,
          html: `<div style="font-family:monospace;background:#050505;color:#EDEDED;padding:2rem;max-width:600px"><h1 style="color:${pillarColor}">Application Received</h1><p>Thank you for applying to Whole Body ${escapeHtml(pillarName)}.</p><p style="color:#8888A0">We review every submission within 14 days. If there is a fit, we’ll reach out with the next step.</p><hr style="border:none;border-top:1px solid #2A2A38;margin:1.5rem 0"><p style="color:${pillarColor}">● The whole holds when each part is tended.</p></div>`,
        });

        if (process.env.ADMIN_EMAIL) {
          await resend.emails.send({
            from: "Whole Body Studios <onboarding@resend.dev>",
            to: [process.env.ADMIN_EMAIL],
            subject: `New ${pillarName} application: ${artistName}`,
            html: `<div style="font-family:monospace;background:#050505;color:#EDEDED;padding:2rem;max-width:600px"><h1 style="color:${pillarColor}">New ${escapeHtml(pillarName)} Application</h1><p><strong>Applicant:</strong> ${safeArtistName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Discipline:</strong> ${escapeHtml(genre)}</p><p><strong>Stage:</strong> ${escapeHtml(stage)}</p><p><strong>Requested support:</strong> ${servicesNeeded.map(escapeHtml).join(", ") || "None selected"}</p></div>`,
          });
        }
      } catch (emailError) {
        console.error(
          "Application saved but email delivery failed:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Unable to submit application" },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({
    endpoint: "POST /api/apply",
    methods: ["POST"],
    status: "operational",
  });
}
