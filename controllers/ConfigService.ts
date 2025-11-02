// Controller: Config Service
import { ConfigModel } from '@/models/ConfigModel';
import type { CoupleConfig } from '@/types';

export class ConfigService {
  // Get current config
  static async getConfig(): Promise<CoupleConfig | null> {
    return await ConfigModel.getConfig();
  }

  // Save config with image upload
  static async saveConfig(
    config: Partial<CoupleConfig>,
    imageFile?: File
  ): Promise<{ success: boolean; data?: CoupleConfig; error?: string }> {
    try {
      let imageUrl = config.couple_image_url;

      // Upload image if provided
      if (imageFile) {
        const uploadedUrl = await ConfigModel.uploadCoupleImage(imageFile);
        if (!uploadedUrl) {
          return { success: false, error: 'Failed to upload image' };
        }
        imageUrl = uploadedUrl;
      }

      // Save config
      const data = await ConfigModel.upsertConfig({
        ...config,
        couple_image_url: imageUrl,
      });

      if (!data) {
        return { success: false, error: 'Failed to save config' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in saveConfig:', error);
      return { success: false, error: 'An error occurred' };
    }
  }

  // Calculate time elapsed
  static calculateTimeElapsed(loveStartDate: string) {
    const startDate = new Date(loveStartDate);
    const now = new Date();
    const diffMs = now.getTime() - startDate.getTime();

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalSeconds };
  }
}
