export interface CoupleConfig {
  id?: string;
  couple_image_url?: string;
  love_start_date: string; // ISO date string
  partner1_name?: string;
  partner2_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DateEvent {
  id?: string;
  title: string;
  date: string; // ISO date string
  location: string;
  latitude: number;
  longitude: number;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface GalleryImage {
  id?: string;
  image_url: string;
  caption?: string;
  uploaded_at?: string;
}
