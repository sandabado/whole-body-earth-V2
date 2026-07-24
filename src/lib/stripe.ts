import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const key =
    process.env.STRIPE_SECRET_KEY || process.env.STRIPE_RESTRICTED_KEY;
  if (!key) throw new Error("Stripe payments are not configured.");
  stripeClient ??= new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
  return stripeClient;
}
