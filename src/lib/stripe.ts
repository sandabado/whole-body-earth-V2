import Stripe from "stripe";

export function getStripeClient() {
  const key = process.env.STRIPE_RESTRICTED_KEY;
  if (!key) throw new Error("Stripe payments are not configured.");
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}
