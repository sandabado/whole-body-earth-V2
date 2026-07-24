ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_product_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS fulfillment_type TEXT NOT NULL DEFAULT 'manual_delivery',
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'awaiting_payment',
  ADD COLUMN IF NOT EXISTS passport_id TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS purchases_fulfillment_status_idx ON public.purchases (fulfillment_status, created_at DESC);
CREATE INDEX IF NOT EXISTS purchases_customer_email_idx ON public.purchases (customer_email);

INSERT INTO public.products (
  slug, title, type, pillar, description, price_cents, status, featured, fulfillment_type, metadata
) VALUES
  (
    'star-passport-tarot-astrology-reading',
    'Star Passport Tarot + Astrology Reading',
    'personalized digital reading',
    'presence',
    'A personalized Tarot and astrology reading with Shannon, prepared from your Star Passport and delivered as a digital download.',
    11100,
    'active',
    true,
    'manual_digital_delivery',
    '{"facilitator":"Shannon","delivery":"Personalized digital download","source":"star_passport"}'::jsonb
  ),
  (
    'whole-body-deep-dive-jesse-gawlik',
    'Whole Body Deep Dive with Jesse Gawlik',
    'strategic consultation',
    'guardian',
    'A focused sovereign-business deep dive with Whole Body Architect Jesse Gawlik: clarify your next structure, assess Guild alignment, and choose a grounded first move.',
    33300,
    'active',
    true,
    'manual_digital_delivery',
    '{"facilitator":"Jesse Gawlik","delivery":"Personalized follow-up and strategic materials","source":"star_passport"}'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  type = EXCLUDED.type,
  pillar = EXCLUDED.pillar,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  fulfillment_type = EXCLUDED.fulfillment_type,
  metadata = EXCLUDED.metadata,
  updated_at = now();
