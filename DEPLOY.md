# 🚀 Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị Firebase

### 1.1 Tạo Firebase Project
1. Truy cập https://console.firebase.google.com/
2. Click **Add project**
3. Đặt tên project (ví dụ: "love-story-app")
4. Tắt Google Analytics (không cần thiết)
5. Click **Create project**

### 1.2 Cấu hình Firestore Database
1. Trong Firebase Console, chọn **Build** → **Firestore Database**
2. Click **Create database**
3. Chọn **Start in test mode** (cho development)
4. Chọn location gần bạn nhất (asia-southeast1)
5. Click **Enable**

### 1.3 Cấu hình Storage
1. Chọn **Build** → **Storage**
2. Click **Get started**
3. Chọn **Start in test mode**
4. Click **Done**

### 1.4 Lấy thông tin config
1. Vào **Project Settings** (icon bánh răng)
2. Scroll xuống phần **Your apps**
3. Click icon **</>** (Web)
4. Đặt tên app và click **Register app**
5. Copy toàn bộ `firebaseConfig` object

## Bước 2: Push code lên GitHub

```bash
# Khởi tạo git repository
git init

# Thêm file .gitignore
echo "node_modules
.next
.env.local
.DS_Store" > .gitignore

# Commit code
git add .
git commit -m "🎉 Initial commit - Love Story App"

# Tạo repo trên GitHub và push
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

## Bước 3: Deploy lên Vercel

### 3.1 Import Project
1. Truy cập https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **Add New** → **Project**
4. Import repository vừa tạo

### 3.2 Configure Project
1. **Framework Preset**: Next.js (tự động detect)
2. **Root Directory**: ./
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### 3.3 Add Environment Variables
Click **Environment Variables** và thêm:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3.4 Deploy
1. Click **Deploy**
2. Đợi 2-3 phút để build
3. Done! 🎉

## Bước 4: Sử dụng ứng dụng

### 4.1 Cấu hình ban đầu
1. Truy cập URL Vercel của bạn
2. Vào trang **Cài đặt**
3. Upload ảnh đôi
4. Chọn ngày bắt đầu yêu
5. Lưu cấu hình

### 4.2 Thêm sự kiện
1. Vào **Tạo lịch**
2. Điền thông tin
3. Chọn vị trí trên bản đồ
4. Submit

### 4.3 Upload ảnh
1. Vào **Upload**
2. Chọn nhiều ảnh cùng lúc
3. Thêm caption
4. Upload

## Bước 5: Custom Domain (Tuỳ chọn)

1. Mua domain (GoDaddy, Namecheap...)
2. Trong Vercel project → **Settings** → **Domains**
3. Add domain của bạn
4. Cấu hình DNS theo hướng dẫn
5. Done!

## 🔒 Bảo mật Production

### Cập nhật Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chỉ cho phép đọc công khai
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Cần đăng nhập
    }
  }
}
```

### Cập nhật Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Cần đăng nhập
    }
  }
}
```

## 🎯 Tips

### Performance
- ✅ Vercel tự động optimize Next.js
- ✅ Firebase CDN tự động cho ảnh
- ✅ Nén ảnh trước khi upload (< 1MB)

### SEO
Thêm vào `layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Our Love Story - [Tên cặp đôi]",
  description: "Những khoảnh khắc đáng nhớ của chúng ta",
  openGraph: {
    images: ['/og-image.jpg'],
  },
};
```

### Backup
- Firebase tự động backup
- Code trên GitHub = backup code
- Export Firestore định kỳ

## ❓ Troubleshooting

### Build failed
```bash
# Chạy local để test
npm run build
```

### Environment variables not working
- Đảm bảo tên biến bắt đầu với `NEXT_PUBLIC_`
- Redeploy sau khi thêm env vars

### Firebase errors
- Kiểm tra API key
- Kiểm tra Storage/Firestore đã enable

## 📱 Mobile App (PWA)

Thêm vào `layout.tsx`:
```typescript
export const metadata: Metadata = {
  manifest: '/manifest.json',
  themeColor: '#ec4899',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Our Love Story',
  },
};
```

Tạo `public/manifest.json`:
```json
{
  "name": "Our Love Story",
  "short_name": "Love Story",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ec4899",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🎉 Hoàn thành!

Ứng dụng của bạn đã sẵn sàng để sử dụng! 

URL: `https://your-project.vercel.app`

---

Made with 💕 by Next.js + Firebase + Vercel
