CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  house_number INTEGER,
  pillar TEXT NOT NULL CHECK (pillar IN ('presence', 'press', 'studios', 'foundation', 'guardian')),
  avatar_url TEXT,
  role VARCHAR(100),
  joined_date DATE,
  featured BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'pending')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads active testimonials"
  ON public.testimonials FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE INDEX IF NOT EXISTS testimonials_wall_lookup
  ON public.testimonials (status, display_order, created_at DESC);

INSERT INTO public.testimonials (quote, author_name, house_number, pillar, role, joined_date, featured, display_order)
SELECT * FROM (VALUES
  ('I came for the reading and stayed for the circle. I didn''t know I was lonely until I wasn''t.', 'Maya R.', 3, 'presence', 'Member', DATE '2026-01-15', true, 10),
  ('The Codex gave me the language for what I''ve been building for 10 years. I read Vol I in one night.', 'David K.', 5, 'press', 'Reader', DATE '2025-12-08', true, 20),
  ('I released my album through Studios and kept 100% of my masters. No label. No extraction.', 'Sandabado', 8, 'studios', 'Artist', DATE '2026-02-01', true, 30),
  ('I stood in the garden and understood the tetrahedron. Not as a concept. As a place.', 'Ren T.', 4, 'foundation', 'Visitor', DATE '2026-04-12', true, 40),
  ('The Old World told me to grind alone. The circle told me to sit down. I chose the circle.', 'Tyler M.', 1, 'presence', 'Member', DATE '2026-02-20', true, 50),
  ('They didn''t sign me. They built with me. That''s the difference.', 'Marcus J.', 9, 'studios', 'Artist', DATE '2026-03-01', true, 60),
  ('I submitted my manuscript on a Tuesday. They responded in eight days. I retain 100% of my IP.', 'Evelyn T.', 2, 'press', 'Author', DATE '2026-01-30', true, 70),
  ('Whole Body didn''t give me a personality test. It gave me an architecture.', 'Jesse G.', 1, 'presence', 'Founder', DATE '2025-11-01', true, 80),
  ('I was skeptical. This is different because it doesn''t stop at diagnosis. It sends you to work.', 'Alana B.', 8, 'presence', 'Member', DATE '2026-03-15', true, 90),
  ('Guardian isn''t networking. It''s stewardship.', 'Anonymous', 12, 'guardian', 'Partner', DATE '2026-04-01', true, 100)
) AS seed(quote, author_name, house_number, pillar, role, joined_date, featured, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials);
