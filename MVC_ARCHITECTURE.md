# 🏗️ Cấu trúc MVC trong Next.js App Router

## 📁 Tổ chức thư mục

```
memory/
├── app/                    # Views (Pages/UI)
│   ├── page.tsx           # Home page
│   ├── calendar/          # Calendar page
│   ├── gallery/           # Gallery page
│   ├── create/            # Create event page
│   ├── config/            # Settings page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── models/                # Models (Data Layer)
│   ├── ConfigModel.ts     # Config data operations
│   ├── EventModel.ts      # Event data operations
│   └── GalleryModel.ts    # Gallery data operations
│
├── controllers/           # Controllers (Business Logic)
│   ├── ConfigService.ts   # Config business logic
│   ├── EventService.ts    # Event business logic
│   └── GalleryService.ts  # Gallery business logic
│
├── components/            # Reusable UI Components
│   ├── Navigation.tsx     # Navigation bar
│   ├── ImageModal.tsx     # Image modal
│   └── MapView.tsx        # Map component
│
├── lib/                   # Libraries & Utils
│   ├── supabase.ts        # Supabase config
│   └── firebase.ts        # Firebase config (legacy)
│
└── types/                 # TypeScript Types
    └── index.ts           # Shared types
```

## 🔄 Luồng dữ liệu MVC

```
View (Page) 
   ↓ Call
Controller (Service)
   ↓ Use
Model (Data Layer)
   ↓ Talk to
Database (Supabase)
```

## 💡 Ví dụ cụ thể

### 1. Model Layer (models/ConfigModel.ts)
```typescript
// Chịu trách nhiệm: Giao tiếp với database
export class ConfigModel {
  static async getConfig() {
    const { data } = await supabase
      .from('config')
      .select('*')
      .single();
    return data;
  }
}
```

### 2. Controller Layer (controllers/ConfigService.ts)
```typescript
// Chịu trách nhiệm: Business logic, validation
export class ConfigService {
  static async saveConfig(config, imageFile) {
    // Upload image
    if (imageFile) {
      const imageUrl = await ConfigModel.uploadImage(imageFile);
      config.imageUrl = imageUrl;
    }
    
    // Validate
    if (!config.loveStartDate) {
      return { success: false, error: 'Missing date' };
    }
    
    // Save
    const data = await ConfigModel.upsertConfig(config);
    return { success: true, data };
  }
}
```

### 3. View Layer (app/page.tsx)
```typescript
// Chịu trách nhiệm: UI rendering, user interaction
export default function Home() {
  const [config, setConfig] = useState(null);
  
  useEffect(() => {
    async function loadConfig() {
      const data = await ConfigService.getConfig();
      setConfig(data);
    }
    loadConfig();
  }, []);
  
  return <div>{/* Render UI */}</div>;
}
```

## 🎯 Lợi ích của pattern này

### ✅ Separation of Concerns
- **Model**: Chỉ lo database operations
- **Controller**: Chỉ lo business logic
- **View**: Chỉ lo UI rendering

### ✅ Reusability
```typescript
// Có thể dùng ConfigService ở nhiều nơi
await ConfigService.getConfig();  // In Home page
await ConfigService.getConfig();  // In Settings page
```

### ✅ Testability
```typescript
// Test Model riêng
test('ConfigModel.getConfig', async () => {
  const config = await ConfigModel.getConfig();
  expect(config).toBeDefined();
});

// Test Controller riêng
test('ConfigService.saveConfig', async () => {
  const result = await ConfigService.saveConfig({...});
  expect(result.success).toBe(true);
});
```

### ✅ Maintainability
```typescript
// Đổi database từ Firebase sang Supabase
// Chỉ sửa Model layer, Controller & View không đổi!

// Before (ConfigModel.ts)
const data = await firebase.collection('config').get();

// After (ConfigModel.ts)
const data = await supabase.from('config').select();

// Controller & View không cần thay đổi gì!
```

## 📊 So sánh với kiến trúc khác

### ❌ Không dùng MVC (Bad)
```typescript
// app/page.tsx - Mọi thứ lộn xộn
export default function Home() {
  const [config, setConfig] = useState(null);
  
  useEffect(() => {
    // Database logic
    const fetchData = async () => {
      const { data } = await supabase.from('config').select();
      
      // Business logic
      if (data && data.imageUrl) {
        // Validation
        if (data.loveStartDate) {
          // Calculation
          const days = calculateDays(data.loveStartDate);
          setConfig({ ...data, days });
        }
      }
    };
    fetchData();
  }, []);
  
  // UI rendering cũng ở đây
  return <div>...</div>;
}
```
**Vấn đề**: Code khó maintain, khó test, khó reuse

### ✅ Dùng MVC (Good)
```typescript
// models/ConfigModel.ts
export class ConfigModel {
  static async getConfig() {
    const { data } = await supabase.from('config').select();
    return data;
  }
}

// controllers/ConfigService.ts
export class ConfigService {
  static async getConfig() {
    const data = await ConfigModel.getConfig();
    if (data?.loveStartDate) {
      data.days = this.calculateDays(data.loveStartDate);
    }
    return data;
  }
}

// app/page.tsx
export default function Home() {
  const [config, setConfig] = useState(null);
  
  useEffect(() => {
    ConfigService.getConfig().then(setConfig);
  }, []);
  
  return <div>...</div>;
}
```
**Lợi ích**: Clean, organized, maintainable

## 🚀 Best Practices

### 1. Model chỉ lo database
```typescript
// ✅ Good
class ConfigModel {
  static async getConfig() {
    return await supabase.from('config').select();
  }
}

// ❌ Bad - Business logic trong Model
class ConfigModel {
  static async getConfig() {
    const data = await supabase.from('config').select();
    // Don't do this!
    data.days = calculateDays(data.loveStartDate);
    return data;
  }
}
```

### 2. Controller chứa business logic
```typescript
// ✅ Good
class ConfigService {
  static async saveConfig(config, imageFile) {
    // Validation
    if (!config.loveStartDate) {
      return { success: false, error: 'Missing date' };
    }
    
    // File upload
    if (imageFile) {
      config.imageUrl = await ConfigModel.uploadImage(imageFile);
    }
    
    // Save
    return await ConfigModel.saveConfig(config);
  }
}
```

### 3. View chỉ lo rendering
```typescript
// ✅ Good
export default function Home() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  async function loadData() {
    setLoading(true);
    const data = await ConfigService.getConfig();
    setConfig(data);
    setLoading(false);
  }
  
  if (loading) return <Loading />;
  return <div>{config?.title}</div>;
}
```

## 🎓 Học thêm

- [MVC Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application)

---

**Kết luận**: MVC giúp code của bạn clean, maintainable, và scalable! 🎉
