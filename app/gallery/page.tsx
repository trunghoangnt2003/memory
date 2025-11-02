'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Image as ImageIcon } from 'lucide-react';
import { GalleryService } from '@/controllers/GalleryService';
import type { GalleryImage } from '@/types';
import ImageModal from '@/components/ImageModal';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesData = await GalleryService.getAllImages();
        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ImageIcon className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Album Của Chúng Ta
            </h1>
          </div>
          <p className="text-gray-600">Những khoảnh khắc đáng nhớ được lưu giữ</p>
        </div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-20 h-20 text-pink-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có ảnh nào trong album</p>
            <p className="text-gray-400 text-sm mt-2">Hãy thêm những khoảnh khắc đẹp!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedImage(image.image_url)}
              >
                <Image
                  src={image.image_url}
                  alt={image.caption || 'Gallery image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium">{image.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        src={selectedImage || ''}
        alt="Gallery image"
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
