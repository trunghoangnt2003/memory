'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Image, Plus, Settings, Upload } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/calendar', label: 'Lịch hẹn', icon: Calendar },
    { href: '/gallery', label: 'Album', icon: Image },
    { href: '/create', label: 'Tạo lịch', icon: Plus },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/config', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-pink-100 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="flex justify-around md:justify-center md:gap-4 py-2 md:py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-2 md:px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-pink-500 bg-pink-50 scale-105'
                    : 'text-gray-600 hover:text-pink-400 hover:bg-pink-50/50 hover:scale-105'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
