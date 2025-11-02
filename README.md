# 💕 Our Love Story - Ứng dụng Kỷ niệm Tình yêu

Ứng dụng web lưu giữ và chia sẻ những khoảnh khắc đáng nhớ trong hành trình tình yêu của bạn với UI GenZ đáng yêu và hiệu ứng mượt mà! ✨

## ✨ Tính năng

### 🏠 Trang chủ
- 💖 Hiển thị ảnh đôi với hiệu ứng scale-in đẹp mắt
- ⏰ Bộ đếm ngày yêu tự động với animation
- 📅 Hiển thị ngày bắt đầu yêu đầy đủ
- 🎨 Thiết kế gradient pastel GenZ
- 💫 Responsive hoàn toàn

### 📅 Trang lịch hẹn
- 📝 Liệt kê tất cả sự kiện hẹn hò
- 🗺️ Click vào sự kiện để xem vị trí trên bản đồ
- 📍 Tích hợp Leaflet + OpenStreetMap (100% miễn phí)
- 🖼️ Hiển thị ảnh cho mỗi sự kiện
- ⚡ Animation fade-in từng card

### 🖼️ Trang album
- 📸 Hiển thị lưới ảnh masonry
- ✨ Hiệu ứng fade-in staggered khi load
- 🔍 Click vào ảnh để xem full size
- 💬 Thêm caption cho mỗi ảnh
- 📱 Layout responsive tối ưu

### ➕ Trang tạo lịch
- 📝 Form tạo sự kiện mới với UI đẹp
- 📆 Chọn ngày giờ hẹn
- 🗺️ Chọn địa điểm trên bản đồ tương tác
- 📷 Upload ảnh cho sự kiện
- 💾 Lưu trữ tự động lên Firebase

### ⚙️ Trang cài đặt (Settings)
- 💑 Cập nhật ảnh đôi
- 💝 Thiết lập ngày bắt đầu yêu
- 👫 Thêm tên cặp đôi
- 🎨 UI GenZ với màu sắc pastel
- 💫 Hiệu ứng đáng yêu
- 🔄 Cập nhật real-time

## 🛠️ Tech Stack

| Thành phần | Công nghệ | Ghi chú |
|-----------|-----------|---------|
| **Frontend + API** | Next.js 16 (App Router) | ⚡ Host free trên Vercel |
| **Database** | Firebase Firestore | 🔥 NoSQL, real-time, free tier 1 GB |
| **Storage ảnh** | Firebase Storage | 📦 Lưu ảnh, tự có CDN, free 5 GB |
| **Auth** | Firebase Auth | 🔐 Đăng nhập (tuỳ chọn) |
| **Map** | Leaflet + OpenStreetMap | 🗺️ 100% miễn phí, không cần API key |
| **UI** | Tailwind CSS | 🎨 Styling hiện đại |
| **Icons** | Lucide React | ⭐ Icon đẹp, nhẹ |
| **Language** | TypeScript | 🔷 Type-safe |

## 🚀 Cài đặt & Chạy dự án

### 1️⃣ Clone repository

```bash
git clone <repository-url>
cd memory
```

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

### 3️⃣ Cấu hình Firebase

#### Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới
3. Thêm Web App vào project
4. Copy thông tin config

#### Tạo file môi trường
Tạo file `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

#### Cấu hình Firestore & Storage
1. Trong Firebase Console, bật **Firestore Database**
   - Chọn "Start in test mode"
   
2. Bật **Storage**
   - Chọn "Start in test mode"

### 4️⃣ Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Cấu trúc thư mục

```
memory/
├── app/
│   ├── page.tsx              # 🏠 Trang chủ (bộ đếm + ảnh đôi)
│   ├── calendar/
│   │   └── page.tsx          # 📅 Trang lịch hẹn
│   ├── gallery/
│   │   └── page.tsx          # 🖼️ Trang album ảnh
│   ├── create/
│   │   └── page.tsx          # ➕ Trang tạo sự kiện
│   ├── config/
│   │   └── page.tsx          # ⚙️ Trang cấu hình
│   ├── layout.tsx            # Layout chung + Navigation
│   └── globals.css           # CSS toàn cục + animations
├── components/
│   ├── Navigation.tsx        # 🧭 Navigation bar
│   ├── ImageModal.tsx        # 🖼️ Modal xem ảnh
│   └── MapView.tsx           # 🗺️ Component bản đồ Leaflet
├── lib/
│   └── firebase.ts           # 🔥 Firebase configuration
├── types/
│   └── index.ts              # 📝 TypeScript types
└── package.json
```

## 🎨 Firestore Collections

### `config` collection
```typescript
{
  coupleImageUrl: string,       // URL ảnh đôi
  loveStartDate: string,        // Ngày bắt đầu yêu (ISO)
  partner1Name?: string,        // Tên người 1
  partner2Name?: string,        // Tên người 2
  createdAt: string,
  updatedAt: string
}
```

### `events` collection
```typescript
{
  title: string,                // Tiêu đề sự kiện
  date: string,                 // Ngày hẹn (ISO)
  location: string,             // Địa điểm
  latitude: number,             // Vị trí bản đồ
  longitude: number,
  description?: string,         // Mô tả
  imageUrl?: string,            // Ảnh sự kiện
  createdAt: string
}
```

### `gallery` collection
```typescript
{
  imageUrl: string,             // URL ảnh
  caption?: string,             // Caption
  uploadedAt: string
}
```

## 🌐 Deploy lên Vercel

### 1. Push code lên GitHub

```bash
git init
git add .
git commit -m "🎉 Initial commit - Love Story App"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy với Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Import repository từ GitHub
3. Thêm Environment Variables (copy từ `.env.local`)
4. Click Deploy! 🚀

## 📱 Responsive Design

✅ Mobile-first design
- 📱 Mobile: Navigation dạng bottom bar
- 💻 Desktop: Navigation dạng top bar
- 🎨 Tối ưu cho mọi kích thước màn hình

## 🎭 Animations & Effects

- ✨ **fade-in**: Hiệu ứng mờ dần khi load
- 🎯 **scale-in**: Phóng to mượt mà
- 📤 **slide-up**: Trượt lên từ dưới
- 💗 **pulse-slow**: Nhấp nháy cho hearts
- 🌈 **gradient**: Màu gradient GenZ

## 💰 Chi phí

**HOÀN TOÀN MIỄN PHÍ** với:
- ✅ Firebase Free Tier (1GB Firestore + 5GB Storage)
- ✅ Vercel Free Tier (unlimited sites)
- ✅ OpenStreetMap (miễn phí, không cần key)
- ✅ Lucide Icons (open source)

## 🎯 Hướng dẫn sử dụng

### Bước 1: Cấu hình ban đầu
1. Vào trang **Cài đặt** (Settings) ⚙️
2. Upload ảnh đôi 💑
3. Chọn ngày bắt đầu yêu 💝
4. Nhập tên cặp đôi (tuỳ chọn) 👫
5. Click **Lưu cấu hình** 💾

### Bước 2: Thêm sự kiện
1. Vào trang **Tạo lịch** ➕
2. Điền thông tin sự kiện
3. Chọn vị trí trên bản đồ 🗺️
4. Upload ảnh (tuỳ chọn) 📷
5. Click **Tạo sự kiện** ✅

### Bước 3: Thêm ảnh vào album
1. Tạo collection `gallery` trong Firestore
2. Thêm document với `imageUrl` và `caption`
3. Ảnh sẽ tự động hiển thị trong trang Album 🖼️

## 🔥 Tips & Tricks

### Upload ảnh vào Gallery
Bạn có thể tạo trang upload riêng hoặc dùng Firebase Console:

```javascript
// Code mẫu để thêm ảnh vào gallery
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

async function uploadToGallery(file, caption) {
  // Upload ảnh lên Storage
  const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  
  // Lưu vào Firestore
  await addDoc(collection(db, 'gallery'), {
    imageUrl,
    caption,
    uploadedAt: new Date().toISOString()
  });
}
```

### Customize màu sắc
Edit file `app/globals.css` để thay đổi theme:
- Đổi `pink` → `purple`, `blue`, `green`...
- Tùy chỉnh gradient theo ý thích

## 🎨 UI/UX Features GenZ

- 🌸 Màu sắc pastel soft
- 💖 Icons trái tim everywhere
- ✨ Animations mượt mà
- 🎀 Border radius lớn (rounded-3xl)
- 🌈 Gradient backgrounds
- 💫 Hover effects đáng yêu
- 📱 Mobile-friendly hoàn toàn

## 🐛 Troubleshooting

### Lỗi Firebase
```
Error: Firebase: Error (auth/invalid-api-key)
```
→ Kiểm tra lại file `.env.local`

### Lỗi Map không hiển thị
→ Đảm bảo đã import CSS của Leaflet trong `layout.tsx`

### Ảnh không load
→ Kiểm tra Firebase Storage Rules đã public chưa

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Leaflet Docs](https://leafletjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 💝 Made with Love

Được xây dựng với ❤️ bằng Next.js, Firebase và rất nhiều tình yêu! 

Perfect cho các cặp đôi muốn lưu giữ kỷ niệm một cách hiện đại và đáng yêu! 💕✨

---

⭐ Nếu bạn thích project này, đừng quên star nhé! ⭐
