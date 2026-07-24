DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;

CREATE POLICY "Anyone can submit an application"
  ON public.applications
  FOR INSERT
  TO public
  WITH CHECK (true);
