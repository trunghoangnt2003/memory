'use client';

import { useState } from 'react';
import { Upload, Check, X, Loader } from 'lucide-react';
import { GalleryService } from '@/controllers/GalleryService';

export default function TestUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Vui lòng chọn ảnh');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await GalleryService.addMultipleImages(selectedFiles);
      
      if (result.success && result.data) {
        setUploadedUrls(result.data.map(img => img.imageUrl));
        setSelectedFiles([]);
        alert(`✅ Upload thành công ${result.data.length} ảnh!`);
      } else {
        setError(result.error || 'Upload thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi upload');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-24 md:pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
            🧪 Test Upload Supabase Storage
          </h1>
          <p className="text-gray-600">
            Test upload ảnh lên Supabase Storage (KHÔNG dùng Firebase)
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Chọn ảnh để upload
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            {selectedFiles.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Đã chọn {selectedFiles.length} ảnh
              </p>
            )}
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Đang upload...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload lên Supabase Storage
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Lỗi!</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadedUrls.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Check className="w-5 h-5 text-green-500" />
                <p className="text-green-800 font-medium">
                  Upload thành công {uploadedUrls.length} ảnh!
                </p>
              </div>
              <div className="space-y-2">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="bg-white rounded p-2 text-xs">
                    <p className="text-gray-600 mb-1">Ảnh {index + 1}:</p>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Thông tin:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Sử dụng <strong>Supabase Storage</strong></li>
              <li>❌ KHÔNG sử dụng Firebase Storage</li>
              <li>🚀 Upload thẳng lên Supabase bucket: <code>gallery-images</code></li>
              <li>🌐 Public URLs tự động</li>
              <li>📦 Không có CORS issues</li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-gray-900 text-white rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-4 text-pink-400">🔧 Chi tiết kỹ thuật</h3>
          <div className="space-y-3 text-sm font-mono">
            <div>
              <span className="text-gray-400">Storage Provider:</span>
              <span className="text-green-400 ml-2">Supabase Storage</span>
            </div>
            <div>
              <span className="text-gray-400">Bucket:</span>
              <span className="text-green-400 ml-2">gallery-images</span>
            </div>
            <div>
              <span className="text-gray-400">Upload Method:</span>
              <span className="text-green-400 ml-2">GalleryService.addMultipleImages()</span>
            </div>
            <div>
              <span className="text-gray-400">Model:</span>
              <span className="text-green-400 ml-2">GalleryModel.uploadImage()</span>
            </div>
            <div>
              <span className="text-gray-400">API:</span>
              <span className="text-green-400 ml-2">supabase.storage.from('gallery-images').upload()</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
