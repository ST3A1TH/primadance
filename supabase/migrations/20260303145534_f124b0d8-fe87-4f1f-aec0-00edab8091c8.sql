
-- Add length and format constraints to bookings table
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_client_name_length CHECK (char_length(client_name) BETWEEN 1 AND 100),
  ADD CONSTRAINT bookings_client_email_length CHECK (char_length(client_email) BETWEEN 3 AND 255),
  ADD CONSTRAINT bookings_client_phone_length CHECK (char_length(client_phone) BETWEEN 3 AND 30),
  ADD CONSTRAINT bookings_client_email_format CHECK (client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
