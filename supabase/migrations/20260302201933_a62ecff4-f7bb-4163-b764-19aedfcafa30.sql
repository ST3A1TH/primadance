
-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can read own booking by email" ON public.bookings;

-- Only admins can read bookings
CREATE POLICY "Admins can read bookings"
ON public.bookings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
