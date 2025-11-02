'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Calendar, Sparkles, Star, Moon, Infinity, Mail } from 'lucide-react';
import { ConfigService } from '@/controllers/ConfigService';
import type { CoupleConfig } from '@/types';

// Sweet love messages for falling letters
const loveMessages = [
  "Anh yêu em nhiều lắm!",
  "Em là cả thế giới của anh ",
  "Mỗi ngày bên em đều đặc biệt ",
  "Cảm ơn em vì đã đến bên anh ",
  "Em làm cuộc đời anh ý nghĩa hơn ",
  "Anh muốn ở bên em mãi mãi ",
  "Em là điều tuyệt vời nhất đời anh ",
  "Yêu em từ cái nhìn đầu tiên ",
  "Em là lý do anh cười mỗi ngày ",
  "Anh may mắn vì có em ",
  "Em là thiên thần của anh ",
  "Tình yêu của anh dành cho em thôi 💗",
  "Cùng nhau đi hết cuộc đời này nhé ",
  "Em là món quà quý giá nhất ",
  "Mãi yêu em, người ơi! ",
];

// Romantic quotes
const loveQuotes = [
  { text: "Tình yêu không phải là nhìn nhau, mà là cùng nhìn về một hướng", author: "Antoine de Saint-Exupéry" },
  { text: "Yêu em không phải vì em hoàn hảo, mà vì em khiến anh trở nên hoàn hảo hơn", author: "Unknown" },
  { text: "Trong vô vàn người đó, anh chỉ nhìn thấy có em", author: "Unknown" },
  { text: "Tình yêu là khi hạnh phúc của người kia trở thành hạnh phúc của chính mình", author: "Unknown" },
  { text: "Em là lý do anh cười mỗi ngày", author: "Unknown" },
  { text: "Yêu là cho đi, không đòi hỏi, không hối tiếc", author: "Unknown" },
  { text: "Tình yêu đích thực không bao giờ già đi, nó chỉ lớn lên mỗi ngày", author: "Unknown" },
];

interface FallingLetter {
  id: number;
  left: number;
  delay: number;
  duration: number;
  message: string;
  opened: boolean;
}

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
  const [currentQuote, setCurrentQuote] = useState(0);
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const [openedLetter, setOpenedLetter] = useState<FallingLetter | null>(null);

  // Generate floating hearts
  useEffect(() => {
    const hearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setFloatingHearts(hearts);
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % loveQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Generate falling letters every 5 seconds
  useEffect(() => {
    const generateLetter = () => {
      const newLetter: FallingLetter = {
        id: Date.now() + Math.random(),
        left: Math.random() * 90 + 5, // 5% to 95%
        delay: 0,
        duration: 8 + Math.random() * 4, // 8-12 seconds
        message: loveMessages[Math.floor(Math.random() * loveMessages.length)],
        opened: false,
      };
      
      setFallingLetters(prev => [...prev, newLetter]);

      // Remove letter after animation ends
      setTimeout(() => {
        setFallingLetters(prev => prev.filter(l => l.id !== newLetter.id));
      }, (newLetter.duration + 2) * 1000);
    };

    // Generate first letter after 2 seconds
    const initialTimeout = setTimeout(generateLetter, 2000);

    // Generate new letter every 5 seconds
    const interval = setInterval(generateLetter, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Handle letter click
  const handleLetterClick = (letter: FallingLetter) => {
    setOpenedLetter(letter);
    setFallingLetters(prev => prev.filter(l => l.id !== letter.id));
  };

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
      <div className="fixed top-1/3 right-1/4 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
        <Star className="w-6 h-6 text-yellow-300" />
      </div>
      <div className="fixed bottom-1/3 left-1/4 animate-bounce-slow" style={{ animationDelay: '2.5s' }}>
        <Moon className="w-7 h-7 text-purple-300" />
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
            <div className="space-y-3 animate-slide-in">
              {/* Couple names with gradient and glow */}
              {config.partner1_name && config.partner2_name && (
                <div className="relative inline-block">
                  {/* Glow effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 blur-2xl opacity-40 animate-pulse"></div>
                  
                  {/* Main text container */}
                  <div className="relative flex items-center justify-center gap-4 md:gap-6">
                    {/* Partner 1 Name */}
                    <p className="text-2xl md:text-xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl animate-slide-in-right">
                      {config.partner1_name}
                    </p>
                    
                    {/* Beating Heart in the middle */}
                    <div className="relative">
                      {/* Outer glow rings */}
                      
                      
                      {/* Main beating heart */}
                      <div className="relative z-10">
                        <Heart 
                          className="w-12 h-12 md:w-16 md:h-16 text-pink-500 drop-shadow-2xl" 
                          fill="url(#heartGradient)"
                          strokeWidth={1.5}
                        />
                        {/* SVG Gradient Definition */}
                        <svg width="0" height="0">
                          <defs>
                            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="50%" stopColor="#f43f5e" />
                              <stop offset="100%" stopColor="#be185d" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      
                      {/* Sparkle particles around heart */}
                      
                    </div>
                    
                    {/* Partner 2 Name */}
                    <p className="text-2xl md:text-xl font-bold bg-gradient-to-r from-purple-500 via-rose-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl animate-slide-in-left">
                      {config.partner2_name}
                    </p>
                  </div>
                  
                  {/* Decorative sparkles around */}
                  <div className="absolute -top-4 left-1/4 text-yellow-400 animate-bounce-slow">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="absolute -top-4 right-1/4 text-pink-400 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-2 left-1/3 text-purple-400 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="absolute -bottom-2 right-1/3 text-rose-400 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
                    <Star className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              {/* Romantic subtitle with animation */}
              <div className="flex items-center justify-center gap-2 text-pink-500 mt-6">
                <Infinity className="w-5 h-5 animate-pulse" />
                <p className="text-base font-semibold italic bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Mãi mãi bên nhau
                </p>
                <Infinity className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Couple Image */}
        {config?.couple_image_url ? (
          <div className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 animate-scale-in group">
            <Image
              src={config.couple_image_url}
              alt="Couple Photo"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            {/* Floating badge */}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg animate-bounce-slow">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" fill="currentColor" />
                <span className="text-sm font-semibold text-gray-700">Tình yêu của chúng ta</span>
              </div>
            </div>
            {/* Corner decoration */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2">
              <div className="bg-pink-500/80 backdrop-blur-sm rounded-full p-2 animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="bg-rose-500/80 backdrop-blur-sm rounded-full p-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 bg-gradient-to-br from-pink-200 via-rose-200 to-purple-200 flex items-center justify-center group hover:from-pink-300 hover:via-rose-300 hover:to-purple-300 transition-all duration-500">
            <div className="text-center text-white relative z-10">
              <Heart className="w-20 h-20 mx-auto mb-4 opacity-50 animate-pulse" />
              <p className="text-xl font-semibold">Chưa có ảnh đôi</p>
              <p className="text-sm mt-2 opacity-75">Hãy thêm ảnh trong phần Cài đặt</p>
            </div>
            {/* Animated circles */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        )}

        {/* Days Counter */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-slide-up border-2 border-pink-100 relative overflow-hidden">
          {/* Decorative hearts in corners */}
          <div className="absolute top-4 left-4 opacity-10">
            <Heart className="w-20 h-20 text-pink-300" fill="currentColor" />
          </div>
          <div className="absolute bottom-4 right-4 opacity-10">
            <Heart className="w-20 h-20 text-rose-300" fill="currentColor" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-8 relative z-10">
            <Calendar className="w-6 h-6 text-pink-500 animate-bounce" />
            <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Chúng ta đã yêu nhau được
            </h2>
            <Calendar className="w-6 h-6 text-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          
          {/* Animated Time Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 relative z-10">
            {/* Days */}
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-6 transform hover:scale-110 transition-all hover:shadow-2xl hover:rotate-1 group">
              <div className="text-4xl md:text-6xl font-bold text-pink-600 mb-2 animate-number-change group-hover:scale-110 transition-transform">
                {timeElapsed.days}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Ngày</div>
              <div className="mt-2 h-1 bg-pink-300 rounded-full w-0 group-hover:w-full transition-all duration-500"></div>
            </div>

            {/* Hours */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 transform hover:scale-110 transition-all hover:shadow-2xl hover:-rotate-1 group">
              <div className="text-4xl md:text-6xl font-bold text-purple-600 mb-2 animate-number-change group-hover:scale-110 transition-transform">
                {timeElapsed.hours}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Giờ</div>
              <div className="mt-2 h-1 bg-purple-300 rounded-full w-0 group-hover:w-full transition-all duration-500"></div>
            </div>

            {/* Minutes */}
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-6 transform hover:scale-110 transition-all hover:shadow-2xl hover:rotate-1 group">
              <div className="text-4xl md:text-6xl font-bold text-rose-600 mb-2 animate-number-change group-hover:scale-110 transition-transform">
                {timeElapsed.minutes}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Phút</div>
              <div className="mt-2 h-1 bg-rose-300 rounded-full w-0 group-hover:w-full transition-all duration-500"></div>
            </div>

            {/* Seconds */}
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 transform hover:scale-110 transition-all hover:shadow-2xl hover:-rotate-1 group">
              <div className="text-4xl md:text-6xl font-bold text-pink-600 mb-2 animate-number-pulse group-hover:scale-110 transition-transform">
                {timeElapsed.seconds}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Giây</div>
              <div className="mt-2 h-1 bg-pink-300 rounded-full w-0 group-hover:w-full transition-all duration-500"></div>
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

        {/* Love Quote with rotation */}
        <div className="mt-12 space-y-8">
          {/* Main rotating quote */}
          <div className="bg-gradient-to-br from-pink-50/80 via-rose-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-xl animate-fade-in-delay">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-700">Lời nhắn tình yêu</h3>
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <div 
              key={currentQuote}
              className="text-center space-y-4 animate-fade-in"
            >
              <p className="text-gray-700 italic text-lg md:text-2xl font-light leading-relaxed">
                &ldquo;{loveQuotes[currentQuote].text}&rdquo;
              </p>
              <p className="text-gray-500 text-sm">— {loveQuotes[currentQuote].author}</p>
            </div>
            {/* Quote indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {loveQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentQuote 
                      ? 'w-8 bg-pink-500' 
                      : 'w-2 bg-pink-200 hover:bg-pink-300'
                  }`}
                  aria-label={`Quote ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Love milestones section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Milestone 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" fill="currentColor" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Tình yêu đích thực</h4>
                <p className="text-sm text-gray-600">Là khi hạnh phúc của em trở thành hạnh phúc của anh</p>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Infinity className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Mãi mãi bên nhau</h4>
                <p className="text-sm text-gray-600">Không phải vì hoàn hảo, mà vì chấp nhận mọi khuyết điểm</p>
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Khoảnh khắc đặc biệt</h4>
                <p className="text-sm text-gray-600">Mỗi ngày bên em đều là một kỷ niệm đáng nhớ</p>
              </div>
            </div>
          </div>

          {/* Sweet message */}
          <div className="text-center space-y-4 animate-fade-in-delay">
            <div className="inline-block bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full px-6 py-3 shadow-lg">
              <p className="text-white font-medium flex items-center gap-2">
                <Heart className="w-4 h-4" fill="currentColor" />
                Yêu em nhiều hơn hôm qua, ít hơn ngày mai
                <Heart className="w-4 h-4" fill="currentColor" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Falling Letters */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {fallingLetters.map((letter) => (
          <div
            key={letter.id}
            className="absolute pointer-events-auto cursor-pointer animate-fall"
            style={{
              left: `${letter.left}%`,
              top: '-60px',
              animationDuration: `${letter.duration}s`,
              animationDelay: `${letter.delay}s`,
            }}
            onClick={() => handleLetterClick(letter)}
          >
            <div className="bg-white rounded-lg shadow-lg p-2 hover:scale-110 transition-transform hover:shadow-xl">
              <Mail className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Message Modal */}
      {openedLetter && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={() => setOpenedLetter(null)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-6">
              <Mail className="w-12 h-12 text-pink-500" />
            </div>
            <p className="text-2xl font-semibold text-center bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent leading-relaxed mb-6">
              {openedLetter.message}
            </p>
            <button
              onClick={() => setOpenedLetter(null)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
