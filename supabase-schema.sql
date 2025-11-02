-- Supabase SQL Schema for Love Memory App

-- 1. Create Config Table
CREATE TABLE IF NOT EXISTS config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_image_url TEXT,
  love_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  partner1_name TEXT,
  partner2_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_uploaded_at ON gallery(uploaded_at DESC);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 6. Create Policies (Allow all for now - update for production)
-- Config Policies
CREATE POLICY "Allow public read access on config" ON config
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on config" ON config
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on config" ON config
  FOR UPDATE USING (true);

-- Events Policies
CREATE POLICY "Allow public read access on events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on events" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on events" ON events
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on events" ON events
  FOR DELETE USING (true);

-- Gallery Policies
CREATE POLICY "Allow public read access on gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on gallery" ON gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on gallery" ON gallery
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on gallery" ON gallery
  FOR DELETE USING (true);

-- 7. Create storage buckets (run in Supabase Storage settings)
-- couple-images
-- event-images
-- gallery-images

-- 8. Storage Policies (for each bucket)
-- Allow public read and write
-- Insert this in Storage > Policies

-- Example for couple-images bucket:
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
USING (bucket_id = 'couple-images');

-- Repeat for 'event-images' and 'gallery-images'
