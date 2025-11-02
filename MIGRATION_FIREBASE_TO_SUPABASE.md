# 🔄 Migration Guide: Firebase to Supabase

## ✅ Đã hoàn thành

### 1. Dependencies
- ❌ Removed: `firebase` (79 packages)
- ✅ Added: `@supabase/supabase-js` (13 packages)

### 2. File Structure
```
✅ lib/supabase.ts          - Supabase client
✅ models/                  - Data layer (MVC)
  ├── ConfigModel.ts
  ├── EventModel.ts
  └── GalleryModel.ts
✅ controllers/             - Business logic
  ├── ConfigService.ts
  ├── EventService.ts
  └── GalleryService.ts
```

### 3. Pages Updated
- ✅ `app/page.tsx` - Home (uses ConfigService)
- ✅ `app/calendar/page.tsx` - Calendar (uses EventService)
- ✅ `app/gallery/page.tsx` - Gallery (uses GalleryService)
- ✅ `app/create/page.tsx` - Create Event (uses EventService)
- ✅ `app/config/page.tsx` - Settings (uses ConfigService)

### 4. Configuration
- ✅ `next.config.ts` - Updated for Supabase storage
- ✅ `.env.local.supabase` - Template for env variables

### 5. Documentation
- ✅ `SUPABASE_SETUP.md` - Complete setup guide
- ✅ `MVC_ARCHITECTURE.md` - Architecture explanation
- ✅ `supabase-schema.sql` - Database schema

## 🚀 Next Steps

### Step 1: Setup Supabase (Required)

1. **Create Supabase Project**
   - Go to: https://supabase.com
   - Create new project
   - Wait 2-3 minutes for setup

2. **Run SQL Schema**
   - Open SQL Editor in Supabase
   - Copy content from `supabase-schema.sql`
   - Execute all commands

3. **Create Storage Buckets**
   - Create 3 public buckets:
     - `couple-images`
     - `event-images`
     - `gallery-images`
   - Set all as PUBLIC

4. **Configure Environment**
   ```bash
   # Create .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 📊 Comparison

| Feature | Firebase | Supabase |
|---------|----------|----------|
| **Database** | Firestore (NoSQL) | PostgreSQL (SQL) |
| **CORS Issues** | ❌ Yes | ✅ No |
| **Query Power** | Limited | ✅ Full SQL |
| **Code Organization** | Scattered | ✅ MVC Pattern |
| **Storage** | Cloud Storage | ✅ S3-compatible |
| **Real-time** | ✅ Yes | ✅ Yes |
| **Free Tier** | 1GB + 5GB | 500MB + 1GB |
| **Migration** | - | ✅ Easy |

## 🔑 Key Changes

### Before (Firebase)
```typescript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const q = query(collection(db, 'config'));
const snapshot = await getDocs(q);
const data = snapshot.docs[0].data();
```

### After (Supabase + MVC)
```typescript
import { ConfigService } from '@/controllers/ConfigService';

const data = await ConfigService.getConfig();
```

## ✨ Benefits

### 1. No CORS Issues
- Firebase Storage had CORS problems
- Supabase works out of the box

### 2. Clean Architecture
- MVC pattern separates concerns
- Easy to test and maintain
- Reusable code

### 3. Better Developer Experience
- SQL is more powerful
- Better documentation
- Cleaner API

### 4. Performance
- Fewer dependencies (79 → 13 packages)
- Faster builds
- Smaller bundle size

## 🐛 Troubleshooting

### If you see import errors:
```bash
# Restart TypeScript server in VS Code
Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### If images don't load:
1. Check Supabase storage buckets are PUBLIC
2. Verify URLs in database match storage
3. Check Next.js config for image domains

### If database queries fail:
1. Verify SQL schema ran successfully
2. Check RLS policies allow public access
3. Verify environment variables are set

## 📚 Documentation

Read these files in order:
1. **SUPABASE_SETUP.md** - Setup database
2. **MVC_ARCHITECTURE.md** - Understand code structure
3. **supabase-schema.sql** - Database schema reference

## 🎉 Completed Migration!

You now have:
- ✅ Modern database (PostgreSQL)
- ✅ Clean architecture (MVC)
- ✅ No CORS issues
- ✅ Better performance
- ✅ Easier to maintain

**Start coding with confidence!** 🚀
