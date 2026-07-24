CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, type TEXT NOT NULL,
  pillar TEXT NOT NULL CHECK (pillar IN ('presence', 'press', 'studios', 'foundation', 'guardian')),
  event_date TIMESTAMPTZ NOT NULL, location TEXT, price_cents INTEGER, capacity INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'cancelled', 'complete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
  volume_number INTEGER, author TEXT, description TEXT, digital_price_cents INTEGER, physical_price_cents INTEGER,
  image_url TEXT, status TEXT NOT NULL DEFAULT 'forthcoming' CHECK (status IN ('available', 'forthcoming', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, type TEXT NOT NULL,
  pillar TEXT NOT NULL CHECK (pillar IN ('presence', 'press', 'studios', 'foundation', 'guardian')),
  description TEXT, price_cents INTEGER, image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id), status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES auth.users(id), product_type TEXT NOT NULL,
  product_id UUID, status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), status TEXT NOT NULL DEFAULT 'pending', preferred_dates TEXT[], created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads active events" ON public.events;
DROP POLICY IF EXISTS "Public reads published books" ON public.books;
DROP POLICY IF EXISTS "Public reads active products" ON public.products;
CREATE POLICY "Public reads active events" ON public.events FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "Public reads published books" ON public.books FOR SELECT TO anon, authenticated USING (status IN ('available', 'forthcoming'));
CREATE POLICY "Public reads active products" ON public.products FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE OR REPLACE FUNCTION public.homepage_rsvp_count(target_event UUID)
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::INTEGER FROM public.rsvps WHERE event_id = target_event AND status = 'confirmed';
$$;

CREATE OR REPLACE FUNCTION public.homepage_guardian_audit_count()
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::INTEGER FROM public.applications WHERE element = 'law' AND status IN ('PENDING', 'REVIEWING');
$$;

CREATE OR REPLACE FUNCTION public.homepage_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (pillar TEXT, icon TEXT, action TEXT, occurred_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM (
    SELECT 'presence'::TEXT AS pillar, '🜂'::TEXT AS icon, 'New RSVP for an event'::TEXT AS action, created_at AS occurred_at FROM public.rsvps WHERE status = 'confirmed'
    UNION ALL SELECT CASE product_type WHEN 'book' THEN 'press' ELSE 'studios' END, CASE product_type WHEN 'book' THEN '🜁' ELSE '🜄' END, product_type || ' purchased', created_at FROM public.purchases WHERE status = 'confirmed'
    UNION ALL SELECT CASE element WHEN 'law' THEN 'guardian' ELSE element::TEXT END, '✦', 'New application submitted', created_at FROM public.applications
    UNION ALL SELECT 'foundation', '🜃', 'Garden visit requested', created_at FROM public.visits
  ) activity ORDER BY activity.occurred_at DESC LIMIT greatest(1, least(limit_count, 25));
$$;

REVOKE ALL ON FUNCTION public.homepage_rsvp_count(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.homepage_guardian_audit_count() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.homepage_activity(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.homepage_rsvp_count(UUID), public.homepage_guardian_audit_count(), public.homepage_activity(INTEGER) TO anon, authenticated;

CREATE INDEX IF NOT EXISTS events_homepage_lookup ON public.events (pillar, status, event_date);
CREATE INDEX IF NOT EXISTS books_homepage_lookup ON public.books (featured, status, created_at DESC);
CREATE INDEX IF NOT EXISTS products_homepage_lookup ON public.products (pillar, featured, status, created_at DESC);
