# 📸 Upload Ảnh với Supabase Storage - Hướng dẫn Chi tiết

## ✅ Supabase Storage đã thay thế hoàn toàn Firebase Storage!

### 🎯 Lợi ích của Supabase Storage

| Feature | Firebase Storage | Supabase Storage |
|---------|------------------|------------------|
| **CORS Issues** | ❌ Có vấn đề | ✅ Không có |
| **Public URLs** | Phức tạp | ✅ Dễ dàng |
| **Configuration** | Cần CORS setup | ✅ Tự động |
| **CDN** | Google CDN | ✅ Global CDN |
| **Free Tier** | 5GB | 1GB (đủ dùng) |
| **Speed** | Nhanh | ✅ Rất nhanh |

## 🔧 Code Upload Ảnh (Đã tích hợp)

### 1. ConfigModel - Upload Couple Image

```typescript
// models/ConfigModel.ts
static async uploadCoupleImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `couple_${Date.now()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('couple-images')
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data } = supabase.storage
      .from('couple-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
```

### 2. EventModel - Upload Event Image

```typescript
// models/EventModel.ts
static async uploadEventImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `event_${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('event-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
```

### 3. GalleryModel - Upload Gallery Images

```typescript
// models/GalleryModel.ts
// Single image upload
static async uploadImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `gallery_${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('gallery-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Multiple images upload
static async uploadMultipleImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => this.uploadImage(file));
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
}
```

## 🚀 Cách sử dụng trong Components

### Trang Config (Settings)

```typescript
// app/config/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const result = await ConfigService.saveConfig(
    {
      partner1Name,
      partner2Name,
      loveStartDate: new Date(loveStartDate).toISOString(),
    },
    coupleImage || undefined  // ← File upload
  );

  if (result.success) {
    alert('Đã lưu thành công!');
  }
};
```

### Trang Create Event

```typescript
// app/create/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const result = await EventService.createEvent(
    {
      title,
      date: new Date(date).toISOString(),
      location,
      latitude,
      longitude,
      description,
    },
    image || undefined  // ← File upload
  );

  if (result.success) {
    alert('Đã tạo sự kiện thành công!');
  }
};
```

### Trang Gallery (Upload nhiều ảnh)

```typescript
// Example: Upload multiple images
const handleMultipleUpload = async (files: File[]) => {
  setLoading(true);
  
  const result = await GalleryService.addMultipleImages(files);
  
  if (result.success) {
    alert(`Đã upload ${result.data?.length} ảnh!`);
  }
};
```

## 📋 Setup Supabase Storage (Bắt buộc)

### Bước 1: Tạo Storage Buckets

Vào Supabase Dashboard → Storage → Create bucket:

1. **Bucket: `couple-images`**
   - ✅ Public bucket
   - Click "Create bucket"

2. **Bucket: `event-images`**
   - ✅ Public bucket
   - Click "Create bucket"

3. **Bucket: `gallery-images`**
   - ✅ Public bucket
   - Click "Create bucket"

### Bước 2: Configure Storage Policies

Cho mỗi bucket, tạo policy:

```sql
-- Allow public read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'couple-images');

-- Allow public upload
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'couple-images');

-- Allow public update
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'couple-images');

-- Allow public delete
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'couple-images');
```

**Hoặc dùng UI:**
1. Click vào bucket → Policies
2. Click "New policy"
3. Select "For full customization"
4. Policy name: `Public Access`
5. Allowed operations: ✅ SELECT, INSERT, UPDATE, DELETE
6. Target roles: `public`
7. USING expression: `true`
8. WITH CHECK expression: `true`

Lặp lại cho 3 buckets: `couple-images`, `event-images`, `gallery-images`

### Bước 3: Verify Configuration

```typescript
// Test upload in browser console
const testUpload = async () => {
  const { data, error } = await supabase.storage
    .from('couple-images')
    .list();
    
  console.log('Buckets:', data);
  console.log('Error:', error);
};
```

## 🔍 Debugging Upload Issues

### Issue 1: "Bucket not found"
```
Error: Bucket couple-images not found
```

**Solution:**
1. Vào Supabase Dashboard → Storage
2. Tạo bucket `couple-images` (public)
3. Restart dev server

### Issue 2: "Policy violation"
```
Error: new row violates row-level security policy
```

**Solution:**
1. Vào Storage → Policies
2. Tạo policy cho phép public access
3. Verify policy với query:

```sql
SELECT * FROM storage.objects WHERE bucket_id = 'couple-images';
```

### Issue 3: "File too large"
```
Error: Payload too large
```

**Solution:**
```typescript
// Add file size check
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (file.size > MAX_FILE_SIZE) {
  alert('File quá lớn! Tối đa 5MB');
  return;
}
```

### Issue 4: CORS Error (Không nên xảy ra với Supabase)

**Solution:**
- Supabase tự động handle CORS
- Nếu vẫn có lỗi, check URL trong `.env.local`

## 📊 Monitor Uploads

### Check uploaded files in Supabase Dashboard:

1. Storage → `couple-images`
2. Xem list files đã upload
3. Click file để xem preview
4. Copy public URL để test

### Check URLs in Database:

```sql
-- See all config with images
SELECT couple_image_url FROM config;

-- See all events with images
SELECT title, image_url FROM events WHERE image_url IS NOT NULL;

-- See all gallery images
SELECT image_url, caption FROM gallery;
```

## 🎨 Advanced Features

### 1. Image Optimization

```typescript
// Resize before upload (example)
import imageCompression from 'browser-image-compression';

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  return await imageCompression(file, options);
};
```

### 2. Progress Tracking

```typescript
// Track upload progress
const { data, error } = await supabase.storage
  .from('couple-images')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    onUploadProgress: (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Upload progress: ${percent}%`);
    }
  });
```

### 3. Delete Old Images

```typescript
// Delete old image before uploading new one
const deleteOldImage = async (oldUrl: string) => {
  const fileName = oldUrl.split('/').pop();
  
  const { error } = await supabase.storage
    .from('couple-images')
    .remove([fileName]);
    
  if (error) console.error('Error deleting:', error);
};
```

## ✅ Checklist

Trước khi upload ảnh, đảm bảo:

- [x] Đã tạo 3 buckets trong Supabase Storage
- [x] Các buckets đã set là PUBLIC
- [x] Đã tạo policies cho phép public access
- [x] Environment variables đã set đúng
- [x] Dev server đang chạy
- [x] Next.js config có domain Supabase

## 🎉 Kết luận

**Upload ảnh với Supabase đơn giản hơn Firebase:**
- ✅ Không cần config CORS
- ✅ Public URLs tự động
- ✅ Fast CDN global
- ✅ Easy to use API
- ✅ Better error handling

**Firebase đã được thay thế hoàn toàn!** 🚀

---

Need help? Check:
- `SUPABASE_SETUP.md` - Setup guide
- `models/ConfigModel.ts` - Upload code example
- Supabase Docs: https://supabase.com/docs/guides/storage
