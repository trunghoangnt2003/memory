'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Calendar, Sparkles } from 'lucide-react';
import { ConfigService } from '@/controllers/ConfigService';
import type { CoupleConfig } from '@/types';

export default function Home() {
  const [config, setConfig] = useState<CoupleConfig | null>(null);
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });
  const [loading, setLoading] = useState(true);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  // Generate floating hearts
  useEffect(() => {
    const hearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setFloatingHearts(hearts);
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await ConfigService.getConfig();
        if (data) {
          setConfig(data);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Real-time counter that updates every second
  useEffect(() => {
    if (!config?.love_start_date) return;

    const calculateTime = () => {
      const startDate = new Date(config.love_start_date);
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();
      
      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeElapsed({ days, hours, minutes, seconds, totalSeconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [config]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-pink-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <Heart className="w-16 h-16 text-pink-400 animate-pulse mx-auto mb-4 relative z-10" />
          <p className="text-gray-600 relative z-10">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 pb-20 md:pt-20 overflow-hidden relative">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-float-up"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            <Heart 
              className="text-pink-300/30" 
              size={20 + Math.random() * 20}
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      {/* Sparkles Effect */}
      <div className="fixed top-20 right-10 animate-bounce-slow">
        <Sparkles className="w-8 h-8 text-yellow-400" />
      </div>
      <div className="fixed top-40 left-10 animate-bounce-slow" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-6 h-6 text-pink-400" />
      </div>
      <div className="fixed bottom-40 right-20 animate-bounce-slow" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-7 h-7 text-purple-400" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Header Section with Animated Gradient */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-500 animate-pulse" fill="currentColor" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              Our Love Story 💕
            </h1>
            <Heart className="w-8 h-8 text-pink-500 animate-pulse" fill="currentColor" />
          </div>
          {config && (
            <p className="text-gray-600 text-xl font-medium animate-slide-in">
              {config.partner1_name && config.partner2_name && 
                `${config.partner1_name} 💖 ${config.partner2_name}`
              }
            </p>
          )}
        </div>

        {/* Couple Image */}
        {config?.couple_image_url ? (
          <div className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 animate-scale-in">
            <Image
              src={config.couple_image_url}
              alt="Couple Photo"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ) : (
          <div className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center">
            <div className="text-center text-white">
              <Heart className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-xl">Chưa có ảnh đôi</p>
              <p className="text-sm mt-2 opacity-75">Hãy thêm ảnh trong phần Cài đặt</p>
            </div>
          </div>
        )}

        {/* Days Counter */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-slide-up border border-pink-100">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-pink-500 animate-bounce" />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Chúng ta đã yêu nhau được
            </h2>
            <Calendar className="w-6 h-6 text-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          
          {/* Animated Time Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Days */}
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-6xl font-bold text-pink-600 mb-2 animate-number-change">
                {timeElapsed.days}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Ngày</div>
            </div>

            {/* Hours */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-6xl font-bold text-purple-600 mb-2 animate-number-change">
                {timeElapsed.hours}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Giờ</div>
            </div>

            {/* Minutes */}
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-6xl font-bold text-rose-600 mb-2 animate-number-change">
                {timeElapsed.minutes}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Phút</div>
            </div>

            {/* Seconds */}
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-6xl font-bold text-pink-600 mb-2 animate-number-pulse">
                {timeElapsed.seconds}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Giây</div>
            </div>
          </div>

          {/* Total Seconds Counter */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-8">
            <p className="text-gray-600 text-sm mb-2">Tổng cộng</p>
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {timeElapsed.totalSeconds.toLocaleString()}
              </span>
              <span className="text-gray-600 text-lg">giây</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">của tình yêu đong đầy 💕</p>
          </div>

          {config?.love_start_date && (
            <div className="pt-8 border-t border-pink-100">
              <p className="text-gray-500 text-sm mb-2">Kể từ ngày</p>
              <p className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {new Date(config.love_start_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {/* Love Quote */}
        <div className="mt-12 text-center animate-fade-in-delay">
          <p className="text-gray-600 italic text-lg md:text-xl">
            "Tình yêu không phải là nhìn nhau, mà là cùng nhìn về một hướng."
          </p>
          <p className="text-gray-400 text-sm mt-2">- Antoine de Saint-Exupéry</p>
        </div>
      </div>
    </div>
  );
}
