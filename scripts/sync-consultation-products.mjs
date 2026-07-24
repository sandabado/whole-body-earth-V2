import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const slugs = [
  "star-passport-tarot-astrology-reading",
  "whole-body-deep-dive-jesse-gawlik",
];
const key = process.env.STRIPE_RESTRICTED_KEY;

if (!key)
  throw new Error(
    "STRIPE_RESTRICTED_KEY is required. Use a restricted key with Products, Prices, and Checkout Sessions write access.",
  );

const stripe = new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
const prisma = new PrismaClient();

try {
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
  });
  if (products.length !== slugs.length)
    throw new Error(
      "Consultation products are missing from the database. Apply Supabase migrations first.",
    );

  for (const product of products) {
    const stripeProduct = product.stripeProductId
      ? await stripe.products.retrieve(product.stripeProductId)
      : await stripe.products.create({
          name: product.title,
          description: product.description || undefined,
          metadata: {
            whole_body_product_id: product.id,
            whole_body_slug: product.slug || "",
          },
        });
    const stripePrice = product.stripePriceId
      ? await stripe.prices.retrieve(product.stripePriceId)
      : await stripe.prices.create({
          currency: "usd",
          unit_amount: product.priceCents,
          product: stripeProduct.id,
          metadata: {
            whole_body_product_id: product.id,
            whole_body_slug: product.slug || "",
          },
        });

    await prisma.product.update({
      where: { id: product.id },
      data: {
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      },
    });
    console.log(`Linked ${product.slug} to Stripe.`);
  }
} finally {
  await prisma.$disconnect();
}
