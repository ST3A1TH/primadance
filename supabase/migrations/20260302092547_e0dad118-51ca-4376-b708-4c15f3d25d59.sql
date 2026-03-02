
-- Bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID REFERENCES public.schedule(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(schedule_id, booking_date, client_email)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read own booking by email" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Booking settings (participant limits per class)
CREATE TABLE public.booking_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID REFERENCES public.schedule(id) ON DELETE CASCADE NOT NULL UNIQUE,
  max_participants INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read booking settings" ON public.booking_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert booking settings" ON public.booking_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update booking settings" ON public.booking_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete booking settings" ON public.booking_settings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Closed dates (admin can close specific dates)
CREATE TABLE public.closed_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

ALTER TABLE public.closed_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read closed dates" ON public.closed_dates FOR SELECT USING (true);
CREATE POLICY "Admins can insert closed dates" ON public.closed_dates FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update closed dates" ON public.closed_dates FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete closed dates" ON public.closed_dates FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
