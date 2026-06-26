
-- 1) venues.booking_mode
ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS booking_mode TEXT;

-- Default booking mode by current category
UPDATE public.venues SET booking_mode = 'restaurant_dinner' WHERE category = 'restaurant' AND booking_mode IS NULL;
UPDATE public.venues SET booking_mode = 'beach_daybed' WHERE category = 'beachclub' AND booking_mode IS NULL;
UPDATE public.venues SET booking_mode = 'club_table_only' WHERE category = 'club' AND booking_mode IS NULL;

-- Toy Room: accredito + tavolo
UPDATE public.venues SET booking_mode = 'club_accredito_table' WHERE slug = 'toy-room';

-- Lio + Interni: cena spettacolo  (Lio sposta in restaurant)
UPDATE public.venues SET category = 'restaurant', booking_mode = 'restaurant_dinner_show' WHERE slug = 'lio';
UPDATE public.venues SET booking_mode = 'restaurant_dinner_show' WHERE slug = 'interni';

-- Lunch show
UPDATE public.venues SET booking_mode = 'restaurant_lunch_show'
  WHERE slug IN ('principote','nammos','spilia');

-- Roma Restaurant casing already correct
UPDATE public.venues SET name = 'Roma Restaurant' WHERE slug = 'roma-restaurant';

-- 2) event_bookings.booker
ALTER TABLE public.event_bookings
  ADD COLUMN IF NOT EXISTS booker TEXT;

-- 3) relax INSERT policy to allow pending OR confirmed
DROP POLICY IF EXISTS "Anyone can submit booking" ON public.event_bookings;
CREATE POLICY "Anyone can submit booking" ON public.event_bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status IN ('pending','confirmed')
    AND char_length(full_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 320
    AND char_length(phone) BETWEEN 1 AND 50
    AND guests BETWEEN 1 AND 100
    AND (notes IS NULL OR char_length(notes) <= 2000)
    AND (booker IS NULL OR char_length(booker) <= 100)
    AND (spend IS NULL OR char_length(spend) <= 50)
    AND (booking_time IS NULL OR char_length(booking_time) <= 20)
  );
