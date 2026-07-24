import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

const PASSPORT_ID = /^WB-[A-Z0-9]{8}$/;

function appUrl(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
  ).replace(/\/$/, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      slug?: unknown;
      passportId?: unknown;
    };
    const slug = typeof body.slug === "string" ? body.slug : "";
    const passportId =
      typeof body.passportId === "string" && PASSPORT_ID.test(body.passportId)
        ? body.passportId
        : "";
    if (!slug)
      return NextResponse.json(
        { error: "Choose a valid consultation." },
        { status: 400 },
      );

    const product = await prisma.product.findFirst({
      where: { slug, status: "active" },
    });
    if (!product?.stripePriceId)
      return NextResponse.json(
        { error: "This consultation is not available for checkout yet." },
        { status: 503 },
      );

    const session = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
      customer_creation: "always",
      metadata: {
        product_id: product.id,
        product_slug: product.slug || slug,
        passport_id: passportId,
      },
      success_url: `${appUrl(request)}/reading?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl(request)}/reading?checkout=cancelled`,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(
      "Checkout session creation failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { error: "Checkout is unavailable right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
