CREATE TYPE user_role AS ENUM ('VISITOR', 'ARTIST', 'ADMIN', 'FOUNDER');
CREATE TYPE element_type AS ENUM ('studios', 'presence', 'foundation', 'press', 'law');
CREATE TYPE project_type AS ENUM ('SINGLE', 'EP', 'ALBUM', 'FILM_SCORE', 'COMPILATION');
CREATE TYPE project_status AS ENUM ('DEVELOPMENT', 'RECORDING', 'MIXING', 'MASTERING', 'RELEASING', 'RELEASED');
CREATE TYPE revenue_source AS ENUM ('SYNC', 'DISTRIBUTION', 'VINYL', 'SERVICE_FEE', 'STIPEND');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'VISITOR',
  elements element_type[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE applications
  ADD COLUMN user_id UUID REFERENCES users(id),
  ADD COLUMN element element_type NOT NULL DEFAULT 'studios';

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES users(id),
  element element_type NOT NULL DEFAULT 'studios',
  title TEXT NOT NULL,
  type project_type,
  status project_status DEFAULT 'DEVELOPMENT',
  release_date TIMESTAMPTZ,
  asset_url TEXT,
  sync_eligible BOOLEAN DEFAULT true,
  revenue_total NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE revenue_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  element element_type NOT NULL DEFAULT 'studios',
  amount NUMERIC(10, 2) NOT NULL,
  source revenue_source,
  artist_share NUMERIC(10, 2),
  guild_share NUMERIC(10, 2),
  stipend_share NUMERIC(10, 2),
  infra_share NUMERIC(10, 2),
  founder_share NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION calculate_feed_first_split()
RETURNS TRIGGER AS $$
BEGIN
  NEW.artist_share := ROUND(NEW.amount * 0.35, 2);
  NEW.guild_share := ROUND(NEW.amount * 0.25, 2);
  NEW.stipend_share := ROUND(NEW.amount * 0.20, 2);
  NEW.infra_share := ROUND(NEW.amount * 0.12, 2);
  NEW.founder_share := ROUND(NEW.amount * 0.08, 2);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feed_first_split
  BEFORE INSERT ON revenue_entries
  FOR EACH ROW
  EXECUTE FUNCTION calculate_feed_first_split();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can read released projects"
  ON projects FOR SELECT TO anon, authenticated USING (status = 'RELEASED');

CREATE POLICY "Authenticated can manage projects"
  ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can read revenue"
  ON revenue_entries FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_applications_element ON applications(element);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_projects_element ON projects(element);
CREATE INDEX idx_projects_artist ON projects(artist_id);
CREATE INDEX idx_revenue_entries_element ON revenue_entries(element);
CREATE INDEX idx_revenue_entries_project ON revenue_entries(project_id);
