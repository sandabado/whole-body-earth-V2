import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

const GUILD_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret =
    process.env.STRIPE_GUILD_WEBHOOK_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Guild webhook configuration is missing." },
      { status: 400 },
    );
  }

  try {
    const rawBody = await request.text();
    const event = getStripeClient().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (GUILD_EVENTS.has(event.type)) {
      const eventObject = event.data.object;
      console.info("Guild Stripe event received", {
        eventId: event.id,
        eventType: event.type,
        objectId:
          "id" in eventObject && typeof eventObject.id === "string"
            ? eventObject.id
            : "unknown",
      });
      // TODO Phase 2: Store membership and subscription state in Prisma.
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      "Guild webhook verification failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 },
    );
  }
}
