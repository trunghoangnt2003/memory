'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Heart } from 'lucide-react';
import { EventService } from '@/controllers/EventService';
import type { DateEvent } from '@/types';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function Calendar() {
  const [events, setEvents] = useState<DateEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DateEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await EventService.getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-20 md:pt-20">
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-24 md:pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarIcon className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Lịch Hẹn Hò
            </h1>
          </div>
          <p className="text-gray-600">Những khoảnh khắc đáng nhớ của chúng ta</p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="w-20 h-20 text-pink-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có sự kiện nào</p>
            <p className="text-gray-400 text-sm mt-2">Hãy tạo lịch hẹn đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedEvent(event)}
              >
                {event.image_url && (
                  <div className="relative h-48 bg-gradient-to-br from-pink-200 to-rose-300">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-pink-500" />
                      <span>
                        {new Date(event.date).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-pink-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.description && (
                    <p className="mt-4 text-gray-500 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <button className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Xem trên bản đồ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedEvent.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedEvent.location}</p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[500px]">
                <MapView
                  center={[selectedEvent.latitude, selectedEvent.longitude]}
                  markers={[{
                    position: [selectedEvent.latitude, selectedEvent.longitude],
                    popup: `<b>${selectedEvent.title}</b><br/>${selectedEvent.location}`
                  }]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
