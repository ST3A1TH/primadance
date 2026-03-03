
-- Remove the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;

-- Replace with a restrictive policy - only service role (edge functions) can insert
-- Since service role bypasses RLS, no explicit policy is needed for the edge function.
-- Authenticated admins can still insert via the admin panel.
CREATE POLICY "Admins can insert bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
