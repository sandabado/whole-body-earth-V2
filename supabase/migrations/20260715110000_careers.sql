CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  department VARCHAR(100),
  pillar VARCHAR(50),
  type VARCHAR(50),
  location VARCHAR(100),
  remote BOOLEAN NOT NULL DEFAULT true,
  compensation VARCHAR(100),
  description TEXT NOT NULL,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  nice_to_have TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paused', 'closed', 'filled')),
  posted_date TIMESTAMPTZ,
  closing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(200),
  linkedin_url TEXT,
  portfolio_url TEXT,
  website_url TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  additional_files TEXT[] NOT NULL DEFAULT '{}',
  has_reading BOOLEAN NOT NULL DEFAULT false,
  house_number INTEGER CHECK (house_number BETWEEN 1 AND 12),
  element VARCHAR(50),
  pillar VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn')),
  admin_notes TEXT,
  interview_stage VARCHAR(50),
  referred_by VARCHAR(200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON public.job_postings(slug);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON public.job_applications(email);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read open jobs" ON public.job_postings
  FOR SELECT TO anon, authenticated USING (status IN ('open', 'paused'));
CREATE POLICY "Users read own job applications" ON public.job_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public submit job applications" ON public.job_applications
  FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('applications', 'applications', false)
ON CONFLICT (id) DO UPDATE SET public = false;

INSERT INTO public.job_postings (title, slug, department, pillar, type, location, remote, compensation, description, responsibilities, requirements, nice_to_have, benefits, status, posted_date)
SELECT * FROM (VALUES
  ('Music Producer & Engineer', 'music-producer-engineer', 'Studios', 'studios', 'full-time', 'Morongo Valley, CA', true, '$60k-$80k + Creator Royalty Pool', 'Lead recording sessions at Whole Body Studios. Mix and master releases through the Studios pipeline. Maintain the studio as an instrument.', ARRAY['Lead recording sessions', 'Mix and master all releases', 'Maintain studio equipment', 'Collaborate with artists on production'], ARRAY['3+ years professional audio engineering', 'Proficiency in Pro Tools or Ableton', 'Understanding of analog signal flow', 'Portfolio of released work'], ARRAY['Experience with live recording', 'Familiarity with the Whole Body system', 'Multi-instrumentalist', 'Vinyl mastering experience'], ARRAY['100% IP retention on personal work', 'Creator Royalty Pool access', 'Health stipend after 90 days', 'Annual garden retreat', 'Guild membership included'], 'open', NOW()),
  ('Editor & Manuscript Reader', 'editor-manuscript-reader', 'Press', 'press', 'part-time', 'Remote', true, '$25/hr + Profit Share', 'Review manuscript submissions. Edit accepted works. Uphold the Feed First standard in every volume published.', ARRAY['Review incoming manuscript submissions', 'Edit accepted manuscripts', 'Coordinate with authors on revisions', 'Maintain editorial calendar'], ARRAY['2+ years editorial experience', 'Strong understanding of nonfiction or spiritual writing', 'Meticulous attention to detail', 'Published work or editorial portfolio'], ARRAY['Experience in independent publishing', 'Familiarity with somatic practice', 'Copyediting certification'], ARRAY['Flexible remote schedule', 'Profit share on edited volumes', 'Guild membership included', 'Free Codex volumes'], 'open', NOW()),
  ('Presence Coordinator', 'presence-coordinator', 'Presence', 'presence', 'part-time', 'Morongo Valley, CA', true, '$20/hr + Circle Access', 'Coordinate weekly circles and seasonal retreats. Hold the container so the facilitator can hold the circle.', ARRAY['Manage event RSVPs and attendee communication', 'Coordinate weekly circle logistics', 'Assist with retreat planning', 'Maintain the Presence calendar'], ARRAY['Event coordination experience', 'Strong communication skills', 'Comfort with group dynamics', 'Reliable and detail-oriented'], ARRAY['Experience with group facilitation', 'Familiarity with Whole Body', 'Local to Morongo Valley'], ARRAY['Participation in circles and retreats', 'Guild membership included', 'Flexible hours'], 'open', NOW()),
  ('Foundation Garden Steward', 'foundation-garden-steward', 'Foundation', 'foundation', 'part-time', 'Morongo Valley, CA', false, 'Trade + Stipend', 'Maintain and expand the Tetrahedron Garden. Plant, harvest, tend, host visitors, and document growth.', ARRAY['Daily garden maintenance', 'Seasonal planting and harvesting', 'Host garden visits', 'Document growth and yield'], ARRAY['2+ years gardening experience', 'Desert or permaculture practice', 'Comfort with manual labor', 'Reliable transportation'], ARRAY['Permaculture certification', 'Sacred geometry agriculture', 'Carpentry or construction skills'], ARRAY['Room and board option', 'Garden produce', 'Guild membership included'], 'open', NOW())
) AS seed(title, slug, department, pillar, type, location, remote, compensation, description, responsibilities, requirements, nice_to_have, benefits, status, posted_date)
WHERE NOT EXISTS (SELECT 1 FROM public.job_postings);
