-- RUN THIS SQL IN SUPABASE SQL EDITOR
-- Copy và paste vào SQL Editor trong Supabase Dashboard

-- 1. Allow public access to couple-images bucket
CREATE POLICY "Public Access couple-images"
ON storage.objects FOR ALL
USING (bucket_id = 'couple-images');

-- 2. Allow public access to event-images bucket
CREATE POLICY "Public Access event-images"
ON storage.objects FOR ALL
USING (bucket_id = 'event-images');

-- 3. Allow public access to gallery-images bucket
CREATE POLICY "Public Access gallery-images"
ON storage.objects FOR ALL
USING (bucket_id = 'gallery-images');

-- Verify policies
SELECT * FROM storage.policies;
