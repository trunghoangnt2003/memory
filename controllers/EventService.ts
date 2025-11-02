// Controller: Event Service
import { EventModel } from '@/models/EventModel';
import type { DateEvent } from '@/types';

export class EventService {
  // Get all events
  static async getAllEvents(): Promise<DateEvent[]> {
    return await EventModel.getAllEvents();
  }

  // Get single event
  static async getEvent(id: string): Promise<DateEvent | null> {
    return await EventModel.getEvent(id);
  }

  // Create event with image upload
  static async createEvent(
    event: Omit<DateEvent, 'id' | 'created_at'>,
    imageFile?: File
  ): Promise<{ success: boolean; data?: DateEvent; error?: string }> {
    try {
      let imageUrl = event.image_url;

      // Upload image if provided
      if (imageFile) {
        const uploadedUrl = await EventModel.uploadEventImage(imageFile);
        if (!uploadedUrl) {
          return { success: false, error: 'Failed to upload image' };
        }
        imageUrl = uploadedUrl;
      }

      // Create event
      const data = await EventModel.createEvent({
        ...event,
        image_url: imageUrl,
      });

      if (!data) {
        return { success: false, error: 'Failed to create event' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in createEvent:', error);
      return { success: false, error: 'An error occurred' };
    }
  }

  // Update event
  static async updateEvent(
    id: string,
    event: Partial<DateEvent>,
    imageFile?: File
  ): Promise<{ success: boolean; data?: DateEvent; error?: string }> {
    try {
      let imageUrl = event.image_url;

      // Upload new image if provided
      if (imageFile) {
        const uploadedUrl = await EventModel.uploadEventImage(imageFile);
        if (!uploadedUrl) {
          return { success: false, error: 'Failed to upload image' };
        }
        imageUrl = uploadedUrl;
      }

      // Update event
      const data = await EventModel.updateEvent(id, {
        ...event,
        image_url: imageUrl,
      });

      if (!data) {
        return { success: false, error: 'Failed to update event' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in updateEvent:', error);
      return { success: false, error: 'An error occurred' };
    }
  }

  // Delete event
  static async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = await EventModel.deleteEvent(id);
      if (!success) {
        return { success: false, error: 'Failed to delete event' };
      }
      return { success: true };
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      return { success: false, error: 'An error occurred' };
    }
  }
}
