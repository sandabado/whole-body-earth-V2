import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function appUrl(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
  ).replace(/\/$/, "");
}

export async function POST(request: NextRequest) {
  try {
    let body: {
      walletAddress?: unknown;
      email?: unknown;
    };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return NextResponse.json(
        { error: "Checkout request must be valid JSON." },
        { status: 400 },
      );
    }

    const walletAddress =
      typeof body.walletAddress === "string" && isAddress(body.walletAddress)
        ? body.walletAddress.toLowerCase()
        : null;
    const email =
      typeof body.email === "string" && body.email.trim()
        ? body.email.trim().toLowerCase()
        : null;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Connect a valid wallet before joining the Guild." },
        { status: 400 },
      );
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address or leave it blank." },
        { status: 400 },
      );
    }

    // TODO Phase 2: Require a server-persisted, wallet-bound Dodecanic reading.
    const stripe = getStripeClient();
    const existingCustomers = email
      ? await stripe.customers.list({ email, limit: 10 })
      : null;
    const customer = existingCustomers?.data.find(
      (candidate) =>
        candidate.metadata.wallet_address?.toLowerCase() === walletAddress,
    );

    if (!customer) {
      const createdCustomer = await stripe.customers.create({
        ...(email ? { email } : {}),
        metadata: { wallet_address: walletAddress },
      });

      return createGuildCheckout(
        request,
        createdCustomer.id,
        walletAddress,
      );
    }

    return createGuildCheckout(request, customer.id, walletAddress);
  } catch (error) {
    console.error(
      "Guild checkout session creation failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { error: "Guild checkout is unavailable right now. Please try again." },
      { status: 500 },
    );
  }
}

async function createGuildCheckout(
  request: NextRequest,
  customerId: string,
  walletAddress: string,
) {
  const session = await getStripeClient().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Whole Body Sovereign Guild Membership",
            description:
              "Readings, gatherings, member directory, voting, AMAs, and member discounts.",
          },
          recurring: { interval: "month" },
          unit_amount: 1111,
        },
        quantity: 1,
      },
    ],
    metadata: {
      membership: "sovereign_guild",
      wallet_address: walletAddress,
    },
    subscription_data: {
      metadata: {
        membership: "sovereign_guild",
        wallet_address: walletAddress,
      },
    },
    success_url: `${appUrl(request)}/observer/account?membership=active`,
    cancel_url: `${appUrl(request)}/observer/guild`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL.");
  }

  return NextResponse.json({ sessionId: session.id, url: session.url });
}
