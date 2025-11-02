'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Settings, Heart, Calendar, User, Loader, Upload } from 'lucide-react';
import { ConfigService } from '@/controllers/ConfigService';
import type { CoupleConfig } from '@/types';

export default function Config() {
  const [config, setConfig] = useState<CoupleConfig | null>(null);
  const [partner1Name, setPartner1Name] = useState('');
  const [partner2Name, setPartner2Name] = useState('');
  const [loveStartDate, setLoveStartDate] = useState('');
  const [coupleImage, setCoupleImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await ConfigService.getConfig();
        if (data) {
          setConfig(data);
          setPartner1Name(data.partner1_name || '');
          setPartner2Name(data.partner2_name || '');
          setLoveStartDate(data.love_start_date ? data.love_start_date.split('T')[0] : '');
          setImagePreview(data.couple_image_url || null);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoupleImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await ConfigService.saveConfig(
        {
          partner1_name: partner1Name,
          partner2_name: partner2Name,
          love_start_date: new Date(loveStartDate).toISOString(),
          couple_image_url: config?.couple_image_url,
        },
        coupleImage || undefined
      );

      if (result.success) {
        alert('Đã lưu cấu hình thành công!');
        window.location.reload();
      } else {
        alert(`Lỗi: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Cài Đặt
            </h1>
          </div>
          <p className="text-gray-600">Cấu hình thông tin cặp đôi của bạn</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Partner Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <User className="w-5 h-5 text-pink-500" />
                Tên người thứ nhất
              </label>
              <input
                type="text"
                value={partner1Name}
                onChange={(e) => setPartner1Name(e.target.value)}
                placeholder="VD: Anh"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <User className="w-5 h-5 text-pink-500" />
                Tên người thứ hai
              </label>
              <input
                type="text"
                value={partner2Name}
                onChange={(e) => setPartner2Name(e.target.value)}
                placeholder="VD: Em"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Love Start Date */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              Ngày bắt đầu yêu *
            </label>
            <input
              type="date"
              value={loveStartDate}
              onChange={(e) => setLoveStartDate(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Couple Image */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Ảnh đôi
            </label>
            
            {imagePreview && (
              <div className="mb-4 relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Couple preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                {coupleImage ? coupleImage.name : 'Chọn ảnh đôi'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
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
                Đang lưu...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Lưu cấu hình
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-pink-50 rounded-2xl p-6 border border-pink-100">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Hướng dẫn:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Ảnh đôi sẽ hiển thị trên trang chủ</li>
            <li>• Ngày bắt đầu yêu dùng để tính số ngày đã yêu</li>
            <li>• Tên cặp đôi sẽ hiển thị trên trang chủ (không bắt buộc)</li>
            <li>• Bạn có thể cập nhật thông tin bất cứ lúc nào</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
