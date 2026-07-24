-- Prisma does not support nullable PostgreSQL array fields. The application API
-- always writes arrays, so make that invariant explicit in Supabase as well.
UPDATE public.applications
SET portfolio_urls = '{}'
WHERE portfolio_urls IS NULL;

UPDATE public.applications
SET services_needed = '{}'
WHERE services_needed IS NULL;

ALTER TABLE public.applications
  ALTER COLUMN portfolio_urls SET DEFAULT '{}',
  ALTER COLUMN portfolio_urls SET NOT NULL,
  ALTER COLUMN services_needed SET DEFAULT '{}',
  ALTER COLUMN services_needed SET NOT NULL;
