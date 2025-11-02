# 🚀 Hướng dẫn Setup Supabase cho Love Memory App

## Bước 1: Tạo Project Supabase

1. Truy cập: https://supabase.com
2. Click **"New Project"**
3. Điền thông tin:
   - **Name**: love-memory-app
   - **Database Password**: Tạo password mạnh (lưu lại)
   - **Region**: Singapore (gần Việt Nam nhất)
4. Click **"Create new project"** (chờ 2-3 phút)

## Bước 2: Tạo Database Tables

1. Vào **SQL Editor** (thanh bên trái)
2. Click **"New query"**
3. Copy toàn bộ nội dung file `supabase-schema.sql`
4. Paste vào editor
5. Click **"Run"** (Ctrl + Enter)

## Bước 3: Tạo Storage Buckets

### Couple Images Bucket
1. Vào **Storage** (thanh bên trái)
2. Click **"New bucket"**
3. Name: `couple-images`
4. **Public bucket**: ✅ Check (để ảnh public)
5. Click **"Create bucket"**

### Event Images Bucket
Lặp lại với:
- Name: `event-images`
- Public: ✅ Check

### Gallery Images Bucket
Lặp lại với:
- Name: `gallery-images`
- Public: ✅ Check

## Bước 4: Cấu hình Storage Policies

Cho mỗi bucket (couple-images, event-images, gallery-images):

1. Click vào bucket
2. Click tab **"Policies"**
3. Click **"New policy"**
4. Chọn **"Custom"**
5. Policy name: `Public Access`
6. **Target roles**: public
7. **Policy command**: ALL
8. **USING expression**: `true`
9. **WITH CHECK expression**: `true`
10. Click **"Create policy"**

## Bước 5: Lấy API Keys

1. Vào **Settings** > **API** (thanh bên trái)
2. Tìm và copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (key dài)

## Bước 6: Cấu hình Environment Variables

1. Tạo file `.env.local` trong root project
2. Thêm các dòng sau:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... (anon key của bạn)
```

3. **Lưu ý**: Thay `xxxxx` và key bằng giá trị thực của bạn

## Bước 7: Kiểm tra Connection

1. Restart dev server:
```bash
npm run dev
```

2. Mở browser, check console không có lỗi

## Bước 8: Test Upload

1. Vào trang **Config** (Settings)
2. Thử upload ảnh couple
3. Kiểm tra Storage > couple-images trong Supabase Dashboard
4. Nếu thấy ảnh = thành công! 🎉

## 📊 Kiểm tra Data

### Check Tables
1. Vào **Table Editor**
2. Xem các table: config, events, gallery

### Check Storage
1. Vào **Storage**
2. Xem các bucket có file upload

## 🔒 Bảo mật Production (Tùy chọn)

### Cập nhật RLS Policies
Thay vì `USING (true)`, bạn có thể:

```sql
-- Chỉ cho phép đọc public, ghi cần auth
CREATE POLICY "Public read" ON events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated write" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Storage Policies
```sql
-- Chỉ cho phép upload files < 5MB
CREATE POLICY "Upload limit" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery-images'
    AND (storage.foldername(name))[1] = 'public'
    AND octet_length(content) < 5242880
  );
```

## ⚡ So sánh với Firebase

| Feature | Supabase | Firebase |
|---------|----------|----------|
| Database | PostgreSQL (SQL) | Firestore (NoSQL) |
| Storage | S3-compatible | Cloud Storage |
| CORS | Không vấn đề | Cần config |
| Free Tier | 500MB DB + 1GB storage | 1GB DB + 5GB storage |
| Query | SQL mạnh mẽ | Limited queries |
| Real-time | ✅ | ✅ |

## 🎯 Lợi ích Supabase

✅ **Không có CORS issues**
✅ **SQL queries mạnh mẽ**
✅ **Dashboard trực quan**
✅ **API tự động**
✅ **Backup dễ dàng**
✅ **Open source**

## 🔄 Migration từ Firebase

Nếu đã có data ở Firebase:
1. Export data từ Firebase
2. Convert JSON sang SQL
3. Import vào Supabase

## 📞 Support

- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

---

**Hoàn tất setup!** 🎊

Giờ bạn có thể:
- Upload ảnh không lo CORS
- Query data dễ dàng với SQL
- Scale app dễ dàng hơn
