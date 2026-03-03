
-- Add columns to track when reminder and thank-you emails were sent
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS thankyou_sent_at timestamptz;
