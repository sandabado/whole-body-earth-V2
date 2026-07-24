CREATE TABLE IF NOT EXISTS public.readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  birth_date DATE NOT NULL,
  birth_time VARCHAR(5),
  birth_place VARCHAR(200) NOT NULL,
  has_birth_time BOOLEAN NOT NULL DEFAULT false,
  dominant_pillar VARCHAR(50) NOT NULL CHECK (dominant_pillar IN ('presence', 'press', 'studios', 'foundation', 'guardian')),
  dominant_body VARCHAR(50) NOT NULL,
  secondary_pillar VARCHAR(50) CHECK (secondary_pillar IN ('presence', 'press', 'studios', 'foundation', 'guardian')),
  is_guardian BOOLEAN NOT NULL DEFAULT false,
  confidence SMALLINT NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  chart_json JSONB NOT NULL,
  reading_json JSONB NOT NULL,
  engine_version VARCHAR(50) NOT NULL DEFAULT 'quincunx-v1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own readings" ON public.readings;
CREATE POLICY "Users can read own readings"
  ON public.readings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save own readings" ON public.readings;
CREATE POLICY "Users can save own readings"
  ON public.readings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS readings_user_created_at_idx
  ON public.readings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS readings_dominant_pillar_idx
  ON public.readings (dominant_pillar, created_at DESC);
