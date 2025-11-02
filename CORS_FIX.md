# Hướng dẫn sửa lỗi CORS Firebase Storage

## Vấn đề
Lỗi CORS khi upload ảnh lên Firebase Storage từ localhost.

## Giải pháp 1: Cấu hình CORS (Production)

### Bước 1: Cài đặt Google Cloud SDK
Tải và cài đặt từ: https://cloud.google.com/sdk/docs/install

### Bước 2: Đăng nhập
```bash
gcloud auth login
```

### Bước 3: Set project
```bash
gcloud config set project do-an-ffbc6
```

### Bước 4: Cấu hình CORS
```bash
gsutil cors set cors.json gs://do-an-ffbc6.firebasestorage.app
```

## Giải pháp 2: Cập nhật Firebase Storage Rules (Đơn giản hơn)

1. Vào Firebase Console: https://console.firebase.google.com/
2. Chọn project "do-an-ffbc6"
3. Vào Storage > Rules
4. Thay đổi rules thành:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

5. Click "Publish"

## Giải pháp 3: Sử dụng Firebase Storage với đúng cú pháp

Đảm bảo code upload đúng format (đã sửa trong file config/page.tsx và create/page.tsx)

## Kiểm tra sau khi sửa

1. Xóa cache browser (Ctrl + Shift + Delete)
2. Restart dev server
3. Thử upload ảnh lại

## Lưu ý Production

Khi deploy production trên Vercel:
1. Thêm domain Vercel vào CORS
2. Hoặc dùng Firebase Storage Rules với authentication
3. Không nên để `allow write: if true` trong production (không bảo mật)

## Storage Rules Production (An toàn hơn)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024 // Giới hạn 5MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```
