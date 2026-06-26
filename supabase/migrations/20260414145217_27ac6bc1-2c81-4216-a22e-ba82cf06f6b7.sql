-- Add new columns to bookings
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'website',
ADD COLUMN IF NOT EXISTS forward_to text,
ADD COLUMN IF NOT EXISTS forward_status text;

-- Allow anonymous inserts for public booking requests
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);