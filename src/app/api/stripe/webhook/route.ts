import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

function paymentIntentId(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id || null;
}

async function recordPaidPurchase(session: Stripe.Checkout.Session) {
  const productId = session.metadata?.product_id;
  if (!productId) return;

  await prisma.purchase.upsert({
    where: { stripeCheckoutSessionId: session.id },
    create: {
      productType: "consultation",
      productId,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId(session),
      customerEmail:
        session.customer_details?.email || session.customer_email || null,
      fulfillmentStatus: "awaiting_fulfillment",
      passportId: session.metadata?.passport_id || null,
      metadata: {
        productSlug: session.metadata?.product_slug || null,
        stripeEvent: "checkout_completed",
      },
      status: "confirmed",
    },
    update: {
      stripePaymentIntentId: paymentIntentId(session),
      customerEmail:
        session.customer_details?.email || session.customer_email || null,
      fulfillmentStatus: "awaiting_fulfillment",
      status: "confirmed",
    },
  });
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret)
    return NextResponse.json(
      { error: "Webhook configuration missing." },
      { status: 400 },
    );

  try {
    const event = getStripeClient().webhooks.constructEvent(
      await request.text(),
      signature,
      secret,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") await recordPaidPurchase(session);
    }
    if (event.type === "checkout.session.async_payment_succeeded")
      await recordPaidPurchase(event.data.object as Stripe.Checkout.Session);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      "Stripe webhook verification failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json({ error: "Webhook rejected." }, { status: 400 });
  }
}
