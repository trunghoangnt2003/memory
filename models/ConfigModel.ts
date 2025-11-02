// Model: Config
import { supabase, TABLES } from '@/lib/supabase';
import type { CoupleConfig } from '@/types';

export class ConfigModel {
  // Get config
  static async getConfig(): Promise<CoupleConfig | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CONFIG)
        .select('*')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No data found
        throw error;
      }

      return data as CoupleConfig;
    } catch (error) {
      console.error('Error fetching config:', error);
      return null;
    }
  }

  // Create or update config
  static async upsertConfig(config: Partial<CoupleConfig>): Promise<CoupleConfig | null> {
    try {
      // Check if config exists
      const existing = await this.getConfig();

      if (existing?.id) {
        // Update
        const { data, error } = await supabase
          .from(TABLES.CONFIG)
          .update({
            ...config,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data as CoupleConfig;
      } else {
        // Insert
        const { data, error } = await supabase
          .from(TABLES.CONFIG)
          .insert({
            ...config,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data as CoupleConfig;
      }
    } catch (error) {
      console.error('Error upserting config:', error);
      return null;
    }
  }

  // Upload couple image
  static async uploadCoupleImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `couple_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('couple-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('couple-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }
}
