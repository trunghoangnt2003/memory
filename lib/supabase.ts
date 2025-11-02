// Supabase Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Tables
export const TABLES = {
  CONFIG: 'config',
  EVENTS: 'events',
  GALLERY: 'gallery',
} as const;

// Storage Buckets
export const BUCKETS = {
  COUPLE_IMAGES: 'couple-images',
  EVENT_IMAGES: 'event-images',
  GALLERY_IMAGES: 'gallery-images',
} as const;
