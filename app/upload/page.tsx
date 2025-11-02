'use client';

import { useState } from 'react';
import { Upload, Image as ImageIcon, Loader, Heart, Sparkles } from 'lucide-react';
import { GalleryService } from '@/controllers/GalleryService';

export default function UploadGallery() {
  const [images, setImages] = useState<File[]>([]);
  const [captions, setCaptions] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleCaptionChange = (index: number, value: string) => {
    setCaptions(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ảnh!');
      return;
    }

    setLoading(true);

    try {
      // Convert captions object to array
      const captionsArray = images.map((_, index) => captions[index] || '');

      // Upload all images using GalleryService
      const result = await GalleryService.addMultipleImages(images, captionsArray);

      if (result.success) {
        alert(`Đã upload thành công ${result.data?.length || images.length} ảnh! 🎉`);
        setImages([]);
        setCaptions({});
        setPreviews([]);
        window.location.href = '/gallery';
      } else {
        alert(`Lỗi: ${result.error}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-24 md:pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Upload Ảnh
            </h1>
            <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
          </div>
          <p className="text-gray-600">Thêm những khoảnh khắc đẹp vào album 💝</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center hover:border-pink-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-pink-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Click để chọn ảnh
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Có thể chọn nhiều ảnh cùng lúc
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-pink-500" />
                Đã chọn {previews.length} ảnh
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {previews.map((preview, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 space-y-3 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Thêm caption (tuỳ chọn)..."
                      value={captions[index] || ''}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {previews.length > 0 && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Đang upload...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Upload {previews.length} ảnh
                </>
              )}
            </button>
          )}
        </form>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 animate-fade-in-delay">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            💡 Tips:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-pink-500">•</span>
              <span>Có thể chọn nhiều ảnh cùng lúc để upload nhanh hơn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500">•</span>
              <span>Caption giúp ghi nhớ khoảnh khắc tốt hơn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500">•</span>
              <span>Nên chọn ảnh có kích thước vừa phải để load nhanh</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500">•</span>
              <span>Ảnh sẽ hiển thị ngay trong trang Album sau khi upload</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
