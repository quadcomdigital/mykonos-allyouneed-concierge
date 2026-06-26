-- Create app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- VILLAS
CREATE TABLE public.villas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  zone TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 2,
  bedrooms INT NOT NULL DEFAULT 1,
  bathrooms INT NOT NULL DEFAULT 1,
  description TEXT,
  tagline TEXT,
  highlights TEXT[],
  amenities TEXT[],
  images TEXT[],
  distances JSONB,
  price_range TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active villas" ON public.villas FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage villas" ON public.villas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_villas_updated_at BEFORE UPDATE ON public.villas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- APARTMENTS
CREATE TABLE public.apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  zone TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 2,
  bedrooms INT NOT NULL DEFAULT 1,
  bathrooms INT NOT NULL DEFAULT 1,
  has_kitchen BOOLEAN DEFAULT false,
  pool_type TEXT DEFAULT 'none',
  description TEXT,
  tagline TEXT,
  highlights TEXT[],
  amenities TEXT[],
  images TEXT[],
  guest_options INT[],
  price_range TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active apartments" ON public.apartments FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage apartments" ON public.apartments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON public.apartments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- VEHICLES
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  price_low TEXT,
  price_mid TEXT,
  price_high TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active vehicles" ON public.vehicles FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage vehicles" ON public.vehicles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- YACHTS
CREATE TABLE public.yachts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  model TEXT,
  length TEXT,
  guests INT,
  overnight_guests INT,
  cabins INT,
  crew INT,
  speed TEXT,
  year TEXT,
  engines TEXT,
  description_it TEXT,
  description_en TEXT,
  includes TEXT[],
  images TEXT[],
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.yachts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active yachts" ON public.yachts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage yachts" ON public.yachts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_yachts_updated_at BEFORE UPDATE ON public.yachts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- VENUES
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  zone TEXT,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  gallery TEXT[],
  opening_hours TEXT,
  season TEXT,
  vibe TEXT[],
  dress_code TEXT,
  cuisine TEXT,
  music_style TEXT,
  highlights TEXT[],
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active venues" ON public.venues FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage venues" ON public.venues FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- EVENTS
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  dj TEXT NOT NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  venue_name TEXT,
  venue_slug TEXT,
  description TEXT,
  image_url TEXT,
  highlight BOOLEAN DEFAULT false,
  tag TEXT,
  time TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active events" ON public.events FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');