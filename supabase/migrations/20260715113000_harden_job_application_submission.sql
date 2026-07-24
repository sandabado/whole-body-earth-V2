-- Applications are accepted only by the server route using the Supabase service role.
-- This keeps guest submissions possible without exposing direct table inserts.
DROP POLICY IF EXISTS "Public submit job applications" ON public.job_applications;
