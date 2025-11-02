// Controller: Gallery Service
import { GalleryModel } from '@/models/GalleryModel';
import type { GalleryImage } from '@/types';

export class GalleryService {
  // Get all images
  static async getAllImages(): Promise<GalleryImage[]> {
    return await GalleryModel.getAllImages();
  }

  // Get single image
  static async getImage(id: string): Promise<GalleryImage | null> {
    return await GalleryModel.getImage(id);
  }

  // Add single image
  static async addImage(
    caption: string,
    imageFile: File
  ): Promise<{ success: boolean; data?: GalleryImage; error?: string }> {
    try {
      // Upload image
      const imageUrl = await GalleryModel.uploadImage(imageFile);
      if (!imageUrl) {
        return { success: false, error: 'Failed to upload image' };
      }

      // Create gallery entry
      const data = await GalleryModel.createImage({
        image_url: imageUrl,
        caption,
      });

      if (!data) {
        return { success: false, error: 'Failed to add image to gallery' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in addImage:', error);
      return { success: false, error: 'An error occurred' };
    }
  }

  // Add multiple images
  static async addMultipleImages(
    files: File[],
    captions?: string[]
  ): Promise<{ success: boolean; data?: GalleryImage[]; error?: string }> {
    try {
      console.log(`Starting upload of ${files.length} images...`);
      
      // Upload all images
      const imageUrls = await GalleryModel.uploadMultipleImages(files);
      console.log(`Uploaded ${imageUrls.length} images successfully:`, imageUrls);
      
      if (imageUrls.length === 0) {
        return { success: false, error: 'Failed to upload images' };
      }

      if (imageUrls.length !== files.length) {
        console.warn(`Warning: Only ${imageUrls.length} out of ${files.length} images uploaded`);
      }

      // Create gallery entries
      const createPromises = imageUrls.map((imageUrl, index) =>
        GalleryModel.createImage({
          image_url: imageUrl,
          caption: captions?.[index] || '',
        })
      );

      const results = await Promise.all(createPromises);
      const successfulResults = results.filter((r): r is GalleryImage => r !== null);

      console.log(`Created ${successfulResults.length} database entries`);

      if (successfulResults.length === 0) {
        return { success: false, error: 'Failed to add images to gallery' };
      }

      return { success: true, data: successfulResults };
    } catch (error) {
      console.error('Error in addMultipleImages:', error);
      return { success: false, error: 'An error occurred' };
    }
  }

  // Update image caption
  static async updateCaption(
    id: string,
    caption: string
  ): Promise<{ success: boolean; data?: GalleryImage; error?: string }> {
    try {
      const data = await GalleryModel.updateImage(id, { caption });
      if (!data) {
        return { success: false, error: 'Failed to update caption' };
      }
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateCaption:', error);
      return { success: false, error: 'An error occurred' };
    }
  }

  // Delete image
  static async deleteImage(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = await GalleryModel.deleteImage(id);
      if (!success) {
        return { success: false, error: 'Failed to delete image' };
      }
      return { success: true };
    } catch (error) {
      console.error('Error in deleteImage:', error);
      return { success: false, error: 'An error occurred' };
    }
  }
}
