// Model: Gallery
import { supabase, TABLES } from '@/lib/supabase';
import type { GalleryImage } from '@/types';

export class GalleryModel {
  // Get all images
  static async getAllImages(): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return (data as GalleryImage[]) || [];
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
  }

  // Get single image
  static async getImage(id: string): Promise<GalleryImage | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as GalleryImage;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }

  // Create image
  static async createImage(image: Omit<GalleryImage, 'id' | 'uploaded_at'>): Promise<GalleryImage | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .insert({
          ...image,
          uploaded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as GalleryImage;
    } catch (error) {
      console.error('Error creating image:', error);
      return null;
    }
  }

  // Update image
  static async updateImage(id: string, image: Partial<GalleryImage>): Promise<GalleryImage | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .update(image)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as GalleryImage;
    } catch (error) {
      console.error('Error updating image:', error);
      return null;
    }
  }

  // Delete image
  static async deleteImage(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.GALLERY)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Upload gallery image
  static async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      return results.filter((url): url is string => url !== null);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      return [];
    }
  }
}
