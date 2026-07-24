CREATE TYPE application_stage AS ENUM ('WRITING', 'RECORDING', 'RELEASED', 'TOURING');
CREATE TYPE application_status AS ENUM ('PENDING', 'REVIEWING', 'INVITED', 'DECLINED', 'PARTNER');

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  genre TEXT,
  stage application_stage,
  portfolio_urls TEXT[],
  services_needed TEXT[],
  what_they_build TEXT,
  why_studios TEXT,
  retains_ip TEXT,
  consent BOOLEAN DEFAULT false,
  status application_status DEFAULT 'PENDING',
  calendly_url TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON applications FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read applications"
  ON applications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
