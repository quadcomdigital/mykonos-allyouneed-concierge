
-- 1) Lock down bookings INSERT: force safe defaults via trigger + restrictive WITH CHECK
CREATE OR REPLACE FUNCTION public.bookings_sanitize_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  NEW.status := 'pending';
  NEW.source := COALESCE(NULLIF(NEW.source, ''), 'website');
  IF NEW.source NOT IN ('website','whatsapp','admin') THEN NEW.source := 'website'; END IF;
  NEW.forward_status := NULL;
  NEW.forward_to := NULL;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS bookings_sanitize_insert_trg ON public.bookings;
CREATE TRIGGER bookings_sanitize_insert_trg
BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.bookings_sanitize_insert();

DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT TO public
  WITH CHECK (
    status = 'pending'
    AND (source IS NULL OR source IN ('website','whatsapp','admin'))
    AND forward_status IS NULL
    AND forward_to IS NULL
    AND char_length(customer_name) BETWEEN 1 AND 200
    AND (customer_email IS NULL OR char_length(customer_email) <= 320)
    AND (customer_phone IS NULL OR char_length(customer_phone) <= 50)
    AND (notes IS NULL OR char_length(notes) <= 4000)
    AND (message IS NULL OR char_length(message) <= 4000)
  );

-- 2) Lock down event_bookings INSERT: enforce server-generated ticket_code & confirmed status
CREATE OR REPLACE FUNCTION public.event_bookings_sanitize_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  NEW.status := 'confirmed';
  NEW.ticket_code := replace(gen_random_uuid()::text, '-', '');
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS event_bookings_sanitize_insert_trg ON public.event_bookings;
CREATE TRIGGER event_bookings_sanitize_insert_trg
BEFORE INSERT ON public.event_bookings
FOR EACH ROW EXECUTE FUNCTION public.event_bookings_sanitize_insert();

DROP POLICY IF EXISTS "Anyone can submit booking" ON public.event_bookings;
CREATE POLICY "Anyone can submit booking" ON public.event_bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'confirmed'
    AND char_length(full_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 320
    AND char_length(phone) BETWEEN 1 AND 50
    AND guests BETWEEN 1 AND 100
    AND (notes IS NULL OR char_length(notes) <= 2000)
  );

-- 3) Restrict storage 'media' bucket writes to admins
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;

CREATE POLICY "Admins can upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4) Restrict has_role SECURITY DEFINER function execution: revoke from public/anon, allow authenticated (needed by RLS)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
