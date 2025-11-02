'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, MapPin, Calendar, Image as ImageIcon, Loader, Search } from 'lucide-react';
import { EventService } from '@/controllers/EventService';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(21.0285); // Hanoi default
  const [longitude, setLongitude] = useState(105.8542);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search location with debounce
  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=vn`,
        {
          headers: {
            'Accept-Language': 'vi',
          },
        }
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error('Error searching location:', error);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle location input change with debounce
  const handleLocationChange = (value: string) => {
    setLocation(value);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  // Select suggestion
  const selectSuggestion = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.display_name);
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setShowSuggestions(false);
    setShowMap(true); // Auto show map when selecting location
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await EventService.createEvent(
        {
          title,
          date: new Date(date).toISOString(),
          location,
          latitude,
          longitude,
          description,
        },
        image || undefined
      );

      if (result.success) {
        // Reset form
        setTitle('');
        setDate('');
        setLocation('');
        setDescription('');
        setImage(null);
        setImagePreview(null);
        alert('Đã tạo sự kiện thành công!');
      } else {
        alert(`Lỗi: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-24 md:pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plus className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Tạo Lịch Hẹn Mới
            </h1>
          </div>
          <p className="text-gray-600">Lưu lại những kỷ niệm đáng nhớ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tiêu đề sự kiện *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="VD: Hẹn hò tại quán cà phê"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              Ngày hẹn *
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <label className="flex text-gray-700 font-medium mb-2 items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              Địa điểm *
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => location.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
                required
                placeholder="Nhập tên địa điểm... (VD: Highlands Coffee Hoàn Kiếm)"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader className="w-5 h-5 text-pink-500 animate-spin" />
                </div>
              )}
              {!searchLoading && location && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{suggestion.display_name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {location && (
              <p className="text-xs text-gray-500 mt-2">
                📍 Tọa độ: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* Map Selection */}
          <div>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium transition-colors"
            >
              <MapPin className="w-5 h-5" />
              {showMap ? '🗺️ Ẩn bản đồ' : '🗺️ Hiển thị bản đồ'}
            </button>
            {showMap && (
              <div className="mt-4 space-y-2">
                <div className="h-[400px] rounded-lg overflow-hidden border-2 border-pink-200 shadow-lg">
                  <MapView
                    center={[latitude, longitude]}
                    markers={[{ position: [latitude, longitude], popup: location || 'Vị trí đã chọn' }]}
                    onMapClick={handleMapClick}
                  />
                </div>
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-pink-500">💡</span>
                    <span>
                      <strong>Hướng dẫn:</strong> Click vào bản đồ để chọn vị trí chính xác. 
                      Marker màu đỏ sẽ hiển thị vị trí bạn chọn.
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    📍 Tọa độ hiện tại: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Ghi chú về sự kiện..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-pink-500" />
              Ảnh sự kiện
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {imagePreview && (
              <div className="mt-4 relative aspect-video rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Tạo sự kiện
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
