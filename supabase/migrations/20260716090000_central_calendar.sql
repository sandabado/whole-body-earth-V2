-- One canonical event system for the public calendar, live shelf, RSVP flows,
-- and eventual admin management. `event_date` remains the start timestamp so
-- existing homepage consumers continue to work without a data migration.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS recurring TEXT,
  ADD COLUMN IF NOT EXISTS recurring_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS location_type TEXT,
  ADD COLUMN IF NOT EXISTS location_address TEXT,
  ADD COLUMN IF NOT EXISTS virtual_url TEXT,
  ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS members_only BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS waitlist_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS parent_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;

UPDATE public.events
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(id::text, 8)
WHERE slug IS NULL OR btrim(slug) = '';

ALTER TABLE public.events ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_key ON public.events (slug);
CREATE UNIQUE INDEX IF NOT EXISTS events_stripe_product_id_key ON public.events (stripe_product_id) WHERE stripe_product_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS events_stripe_price_id_key ON public.events (stripe_price_id) WHERE stripe_price_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS events_calendar_lookup ON public.events (status, event_date);
CREATE INDEX IF NOT EXISTS events_parent_event_id_idx ON public.events (parent_event_id);

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE public.events ADD CONSTRAINT events_status_check CHECK (status IN ('draft', 'active', 'cancelled', 'complete', 'completed'));
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_location_type_check;
ALTER TABLE public.events ADD CONSTRAINT events_location_type_check CHECK (location_type IS NULL OR location_type IN ('virtual', 'in_person', 'hybrid'));
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_recurring_check;
ALTER TABLE public.events ADD CONSTRAINT events_recurring_check CHECK (recurring IS NULL OR recurring IN ('weekly', 'monthly'));

ALTER TABLE public.rsvps
  ADD COLUMN IF NOT EXISTS name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS email VARCHAR(200),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_member BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_time BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reservation_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS rsvps_event_email_key ON public.rsvps (event_id, lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS rsvps_stripe_checkout_session_id_key ON public.rsvps (stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS rsvps_event_status_idx ON public.rsvps (event_id, status);
CREATE INDEX IF NOT EXISTS rsvps_email_idx ON public.rsvps (lower(email));

-- Capacity decisions happen in Postgres under an event-row lock. Public clients
-- never write RSVP records directly; the server route uses this function.
CREATE OR REPLACE FUNCTION public.reserve_event_rsvp(
  p_event_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_is_member BOOLEAN DEFAULT false,
  p_first_time BOOLEAN DEFAULT false
)
RETURNS public.rsvps
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_event public.events;
  occupied INTEGER;
  next_status TEXT;
  created_rsvp public.rsvps;
BEGIN
  SELECT * INTO target_event FROM public.events WHERE id = p_event_id FOR UPDATE;
  IF NOT FOUND OR target_event.status <> 'active' THEN
    RAISE EXCEPTION 'This event is not accepting reservations.';
  END IF;
  IF target_event.members_only AND NOT p_is_member THEN
    RAISE EXCEPTION 'This gathering is currently open to Guild members only.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.rsvps WHERE event_id = p_event_id AND lower(email) = lower(p_email) AND status <> 'cancelled') THEN
    RAISE EXCEPTION 'An RSVP already exists for this email address.';
  END IF;

  SELECT count(*) INTO occupied
  FROM public.rsvps
  WHERE event_id = p_event_id
    AND status IN ('confirmed', 'pending', 'payment_pending');

  IF target_event.capacity IS NOT NULL AND occupied >= target_event.capacity THEN
    IF NOT target_event.waitlist_enabled THEN
      RAISE EXCEPTION 'This gathering is full.';
    END IF;
    next_status := 'waitlisted';
  ELSIF target_event.requires_approval THEN
    next_status := 'pending';
  ELSE
    next_status := 'confirmed';
  END IF;

  INSERT INTO public.rsvps (event_id, name, email, phone, status, is_member, first_time)
  VALUES (p_event_id, p_name, lower(p_email), NULLIF(p_phone, ''), next_status, p_is_member, p_first_time)
  RETURNING * INTO created_rsvp;
  RETURN created_rsvp;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_event_rsvp(UUID, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.set_calendar_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_set_updated_at ON public.events;
CREATE TRIGGER events_set_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_calendar_updated_at();
DROP TRIGGER IF EXISTS rsvps_set_updated_at ON public.rsvps;
CREATE TRIGGER rsvps_set_updated_at BEFORE UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.set_calendar_updated_at();
