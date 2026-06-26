-- Drop the overly broad SELECT policy
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;

-- Create a more restrictive policy that still allows public access to files by path
CREATE POLICY "Public can view media files" ON storage.objects 
  FOR SELECT USING (bucket_id = 'media' AND (storage.foldername(name))[1] IS NOT NULL);