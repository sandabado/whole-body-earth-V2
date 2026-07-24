CREATE TABLE IF NOT EXISTS public.pillar_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  pillar TEXT NOT NULL CHECK (pillar IN ('presence', 'press', 'studios', 'foundation', 'guardian')),
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  kicker TEXT NOT NULL,
  summary TEXT NOT NULL,
  href TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  priority INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pillar_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads published pillar activities"
  ON public.pillar_activities FOR SELECT TO anon, authenticated
  USING (status = 'published' AND published_at <= now());

CREATE INDEX IF NOT EXISTS pillar_activities_public_lookup
  ON public.pillar_activities (pillar, status, priority DESC, starts_at ASC);

INSERT INTO public.pillar_activities
  (slug, pillar, kind, title, kicker, summary, href, cta_label, priority, status, published_at)
SELECT * FROM (VALUES
  ('presence-next-circle', 'presence', 'event', 'Next gathering', 'Circle activity', 'Circles, retreats, and shared practice for the body that gathers.', '/calendar', 'View calendar', 100, 'published', now()),
  ('press-whole-body-series', 'press', 'reading', 'The Whole Body Series', 'Reader activity', 'Five volumes, field manuals, and permanent reading paths for the work.', '/library', 'Open library', 100, 'published', now()),
  ('studios-infinity-love', 'studios', 'release', '∞ Love', 'Release activity', 'Sandābādo’s debut is moving through the archive: music, film, and signal.', '/media', 'Enter media', 100, 'published', now()),
  ('foundation-garden-field', 'foundation', 'fieldwork', 'Garden field', 'Field activity', 'The Tetrahedron Garden is growing toward its next phase in Morongo Valley.', '/pillars/foundation/garden', 'Explore garden', 100, 'published', now()),
  ('guardian-eligibility', 'guardian', 'stewardship', 'Eligibility', 'Gate activity', 'A referral-led stewardship path for those holding real responsibility.', '/pillars/guardian', 'Read eligibility', 100, 'published', now())
) AS seed(slug, pillar, kind, title, kicker, summary, href, cta_label, priority, status, published_at)
ON CONFLICT (slug) DO NOTHING;
