// Model: Events
import { supabase, TABLES } from '@/lib/supabase';
import type { DateEvent } from '@/types';

export class EventModel {
  // Get all events
  static async getAllEvents(): Promise<DateEvent[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return (data as DateEvent[]) || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Get single event
  static async getEvent(id: string): Promise<DateEvent | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as DateEvent;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  // Create event
  static async createEvent(event: Omit<DateEvent, 'id' | 'created_at'>): Promise<DateEvent | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .insert({
          ...event,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as DateEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  // Update event
  static async updateEvent(id: string, event: Partial<DateEvent>): Promise<DateEvent | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update(event)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as DateEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  // Delete event
  static async deleteEvent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.EVENTS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  // Upload event image
  static async uploadEventImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `event_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }
}
