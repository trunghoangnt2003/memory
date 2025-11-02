# 🎯 HƯỚNG DẪN SỬ DỤNG - Our Love Story

## 🚀 Bắt đầu nhanh (5 phút)

### 1. Cài đặt dự án
```bash
npm install
```

### 2. Tạo Firebase Project
- Truy cập: https://console.firebase.google.com/
- Tạo project mới
- Bật Firestore Database
- Bật Storage

### 3. Cấu hình môi trường
Tạo file `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain-here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket-here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Chạy ứng dụng
```bash
npm run dev
```
→ Mở http://localhost:3000

---

## 📖 Hướng dẫn chi tiết từng trang

### 🏠 Trang chủ (/)

**Mục đích:** Hiển thị ảnh đôi và đếm số ngày yêu nhau

**Cách sử dụng:**
1. Trang này tự động load dữ liệu từ Firebase
2. Hiển thị:
   - Ảnh đôi (nếu đã cấu hình)
   - Số ngày đã yêu
   - Ngày bắt đầu yêu
   - Tên cặp đôi

**Lưu ý:**
- Cần cấu hình trong trang **Cài đặt** trước khi sử dụng
- Nếu chưa có ảnh, sẽ hiển thị placeholder

---

### 📅 Trang lịch hẹn (/calendar)

**Mục đích:** Xem danh sách các buổi hẹn hò đã có

**Cách sử dụng:**
1. Xem danh sách các sự kiện
2. Click vào card sự kiện để xem chi tiết
3. Xem vị trí trên bản đồ

**Tính năng:**
- ✅ Hiển thị ảnh sự kiện
- ✅ Thông tin ngày giờ, địa điểm
- ✅ Mô tả sự kiện
- ✅ Xem vị trí trên bản đồ Leaflet

---

### 🖼️ Trang album (/gallery)

**Mục đích:** Xem tất cả ảnh đã upload

**Cách sử dụng:**
1. Xem lưới ảnh với hiệu ứng fade-in
2. Click vào ảnh để xem full size
3. Đọc caption (nếu có)

**Tính năng:**
- ✅ Layout responsive masonry
- ✅ Hiệu ứng hover
- ✅ Modal xem ảnh full screen
- ✅ Animation mượt mà

---

### ➕ Trang tạo lịch (/create)

**Mục đích:** Thêm sự kiện hẹn hò mới

**Hướng dẫn từng bước:**

#### Bước 1: Điền thông tin cơ bản
- **Tiêu đề**: VD: "Hẹn hò tại quán cà phê"
- **Ngày hẹn**: Chọn ngày và giờ
- **Địa điểm**: VD: "Highlands Coffee, Hoàn Kiếm"

#### Bước 2: Chọn vị trí trên bản đồ
1. Click "Chọn vị trí trên bản đồ"
2. Click vào bản đồ để đánh dấu vị trí
3. Tọa độ sẽ tự động cập nhật

#### Bước 3: Thêm mô tả (tuỳ chọn)
- Ghi chú đặc biệt về sự kiện
- Cảm xúc, kỷ niệm...

#### Bước 4: Upload ảnh (tuỳ chọn)
- Chọn ảnh từ sự kiện
- Preview trước khi upload

#### Bước 5: Lưu
- Click "Tạo sự kiện"
- Đợi upload xong
- Sự kiện sẽ xuất hiện trong trang Lịch hẹn

**Tips:**
- 💡 Địa điểm mặc định: Hà Nội (có thể zoom và chọn vị trí khác)
- 💡 Ảnh nên < 2MB để upload nhanh
- 💡 Có thể không cần ảnh, chỉ cần thông tin text

---

### 📤 Trang upload (/upload)

**Mục đích:** Upload nhiều ảnh vào album cùng lúc

**Hướng dẫn từng bước:**

#### Bước 1: Chọn ảnh
1. Click vào khu vực upload
2. Chọn nhiều ảnh (Ctrl/Cmd + Click)
3. Preview sẽ hiển thị ngay

#### Bước 2: Thêm caption
- Mỗi ảnh có thể có caption riêng
- Caption giúp ghi nhớ khoảnh khắc

#### Bước 3: Upload
- Click "Upload X ảnh"
- Đợi quá trình upload hoàn tất
- Tự động chuyển đến trang Album

**Tips:**
- 💡 Có thể upload 10-20 ảnh cùng lúc
- 💡 Nén ảnh trước khi upload để nhanh hơn
- 💡 Caption không bắt buộc nhưng rất hữu ích

---

### ⚙️ Trang cài đặt (/config)

**Mục đích:** Cấu hình thông tin cặp đôi

**Thông tin cần cấu hình:**

#### 1. Tên cặp đôi (tuỳ chọn)
- Tên người thứ nhất: VD: "Anh"
- Tên người thứ hai: VD: "Em"
- Hiển thị trên trang chủ: "Anh & Em"

#### 2. Ngày bắt đầu yêu ⭐ (BẮT BUỘC)
- Chọn ngày đầu tiên bắt đầu yêu nhau
- Dùng để tính số ngày đã yêu
- Hiển thị trên trang chủ

#### 3. Ảnh đôi
- Upload ảnh chung của 2 người
- Hiển thị to trên trang chủ
- Có thể thay đổi bất cứ lúc nào

#### Bước thực hiện:
1. Điền thông tin vào form
2. Upload ảnh đôi
3. Click "Lưu cấu hình"
4. Đợi upload xong
5. Trang sẽ tự động reload
6. Về trang chủ để xem kết quả

**Lưu ý quan trọng:**
- ⚠️ Phải cấu hình trang này TRƯỚC KHI sử dụng các trang khác
- ⚠️ Ngày bắt đầu yêu là bắt buộc
- 💡 Có thể cập nhật nhiều lần

---

## 🎨 Tính năng UI/UX

### Animations
- ✨ **Fade-in**: Xuất hiện mượt mà khi load trang
- 🎯 **Scale-in**: Ảnh phóng to nhẹ khi hiển thị
- 📤 **Slide-up**: Nội dung trượt lên từ dưới
- 💓 **Pulse**: Icon trái tim nhấp nháy đáng yêu

### Responsive Design
- 📱 **Mobile**: Navigation ở dưới cùng
- 💻 **Desktop**: Navigation ở trên cùng
- 🎨 **Tablet**: Layout tối ưu tự động

### Color Scheme (GenZ Style)
- 💗 Pink pastel chủ đạo
- 🌸 Rose accent
- ⚪ White background
- 🎨 Gradient mượt mà

---

## 🔥 Firebase Collections

### Collection: `config`
Lưu cấu hình cặp đôi (chỉ 1 document)

```javascript
{
  coupleImageUrl: "https://...",
  loveStartDate: "2024-01-01T00:00:00.000Z",
  partner1Name: "Anh",
  partner2Name: "Em",
  createdAt: "2024-...",
  updatedAt: "2024-..."
}
```

### Collection: `events`
Lưu các sự kiện hẹn hò (nhiều documents)

```javascript
{
  title: "Hẹn hò tại quán cà phê",
  date: "2024-01-15T18:00:00.000Z",
  location: "Highlands Coffee",
  latitude: 21.0285,
  longitude: 105.8542,
  description: "Buổi hẹn đầu tiên...",
  imageUrl: "https://...",
  createdAt: "2024-..."
}
```

### Collection: `gallery`
Lưu ảnh album (nhiều documents)

```javascript
{
  imageUrl: "https://...",
  caption: "Khoảnh khắc đáng nhớ",
  uploadedAt: "2024-..."
}
```

---

## 💡 Tips & Tricks

### Tối ưu hiệu suất
1. **Nén ảnh trước khi upload**
   - Dùng TinyPNG hoặc Squoosh
   - Kích thước đề xuất: < 1-2MB
   - Resolution: 1920x1080 là đủ

2. **Upload theo batch**
   - Upload 10-15 ảnh mỗi lần
   - Tránh upload quá nhiều cùng lúc

3. **Clear cache định kỳ**
   - Ctrl + F5 để hard refresh
   - Xóa cache browser

### Best Practices
1. **Backup dữ liệu**
   - Export Firestore định kỳ
   - Lưu ảnh gốc ở local

2. **Bảo mật**
   - Không share link public nếu muốn riêng tư
   - Có thể thêm Firebase Auth sau này

3. **Tổ chức ảnh**
   - Đặt caption có ý nghĩa
   - Upload theo thứ tự thời gian

---

## ❓ FAQ

### Q: Làm sao để thay đổi ảnh đôi?
**A:** Vào trang **Cài đặt** → Upload ảnh mới → Lưu

### Q: Có giới hạn số lượng ảnh không?
**A:** Firebase free tier: 5GB storage. Khoảng 2000-5000 ảnh tuỳ chất lượng

### Q: Làm sao để xóa sự kiện hoặc ảnh?
**A:** Hiện tại chưa có UI xóa. Có thể xóa trực tiếp trong Firebase Console

### Q: Có thể thêm nhiều người dùng không?
**A:** Hiện tại app dành cho 1 cặp đôi. Muốn nhiều user cần thêm Firebase Auth

### Q: App có hoạt động offline không?
**A:** Cần internet để load dữ liệu từ Firebase

### Q: Chi phí sử dụng?
**A:** Hoàn toàn MIỄN PHÍ với Firebase Free Tier + Vercel Free Tier

---

## 🚨 Troubleshooting

### Lỗi: "Firebase is not initialized"
→ Kiểm tra file `.env.local` có đầy đủ thông tin chưa

### Lỗi: Ảnh không hiển thị
→ Kiểm tra Firebase Storage Rules đã public chưa

### Lỗi: Không tạo được sự kiện
→ Kiểm tra Firestore Rules cho phép write

### Lỗi: Map không hiển thị
→ Kiểm tra đã import Leaflet CSS trong layout chưa

### Lỗi: Build failed
```bash
# Clear cache và rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check console log (F12)
2. Check Firebase Console
3. Check file README.md và DEPLOY.md
4. Google error message

---

## 🎉 Kết luận

Ứng dụng này giúp bạn:
- ✅ Lưu giữ kỷ niệm tình yêu
- ✅ Đếm ngày yêu tự động
- ✅ Quản lý lịch hẹn hò
- ✅ Tạo album ảnh đẹp
- ✅ Chia sẻ với người thương

**Chúc bạn có những khoảnh khắc đáng nhớ! 💕**

---

Made with 💖 by Next.js + Firebase
