
-- Add missing partner venues
INSERT INTO public.venues (slug, name, category, zone, description, season, sort_order, is_active)
VALUES
  ('roma-restaurant', 'Roma Restaurant', 'restaurant', 'Mykonos Town', 'Cucina italiana raffinata nel cuore di Mykonos.', 'Maggio - Ottobre', 100, true),
  ('180-sunset-bar', '180° Sunset Bar', 'club', 'Above Little Venice', 'Vista a 360° sul tramonto più iconico dell''isola.', 'Maggio - Ottobre', 101, true)
ON CONFLICT (slug) DO NOTHING;

-- Event bookings (QR ticket requests)
CREATE TABLE IF NOT EXISTS public.event_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  event_date DATE NOT NULL,
  event_dj TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_slug TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  ticket_code TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.event_bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.event_bookings TO authenticated;
GRANT ALL ON public.event_bookings TO service_role;

ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit booking" ON public.event_bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins manage bookings" ON public.event_bookings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_event_bookings_updated_at
  BEFORE UPDATE ON public.event_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
