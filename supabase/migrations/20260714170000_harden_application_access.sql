-- Applications contain contact details and business information. Public clients
-- submit through the server-side API; only authenticated staff may read or update.

DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;
DROP POLICY IF EXISTS "Admins can read applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;

CREATE POLICY "Staff can read applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('ADMIN', 'FOUNDER')
    )
  );

CREATE POLICY "Staff can update applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('ADMIN', 'FOUNDER')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('ADMIN', 'FOUNDER')
    )
  );
