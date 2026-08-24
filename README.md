# GrowthAI - Jatis Mobile DemoHub

Interactive Demo Hub & Admin Dashboard untuk Jatis Mobile FMCG

---

## 🌐 Deployment ke Vercel

### Setup Project di Vercel Dashboard

1. Buka https://vercel.com/dashboard
2. Klik **"Add New..."** → **"Project"**
3. Import dari **GitHub** repo: `adhithyasoemitro/GrowthAI`
4. **PENTING**: Untuk setiap project, set **Root Directory**:

#### Project 1: Frontend (Demo Hub)
| Setting | Value |
|---------|-------|
| Project Name | `growthai-frontend` |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

#### Project 2: Admin Panel
| Setting | Value |
|---------|-------|
| Project Name | `growthai-admin` |
| Root Directory | `admin-panel` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

### Environment Variables (untuk kedua project)

```env
NEXT_PUBLIC_SUPABASE_URL=https://llvuzbfehapbicrlkivt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_BuxRjfCswi3NXY51V3O5dA_-1EATvQ8
```

---

## 📁 Project Structure

```
GrowthAI/
├── frontend/          # Landing Page + Demo Hub
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── leads/page.tsx     # Registration form
│   │   ├── confirmation/     # Success page
│   │   └── api/leads/        # API routes
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── package.json
│
├── admin-panel/       # Admin Dashboard
│   ├── app/
│   │   ├── page.tsx          # Dashboard
│   │   ├── login/page.tsx     # Login
│   │   └── api/leads/        # API routes
│   ├── lib/
│   └── package.json
│
└── README.md
```

---

## 🎨 Tech Stack

- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - White Theme UI
- **Supabase** - Database & Auth

---

## 🔑 Credentials

### Admin Login
```
Email: admin@jatis-mobile.com
Password: JatisFMCG2026!
```

---

## 📝 Pages

### Frontend (`growthai-frontend.vercel.app`)
- `/` - Landing page dengan demo cards
- `/leads` - Registration form (step-by-step)
- `/confirmation` - Success page

### Admin (`growthai-admin.vercel.app`)
- `/` - Dashboard dengan lead table
- `/login` - Admin login

---

## 🔧 Supabase Schema

Jalankan SQL ini di Supabase SQL Editor:

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  use_case TEXT DEFAULT 'other',
  volume_range TEXT DEFAULT 'not_sure',
  follow_up_pref TEXT DEFAULT 'schedule_demo',
  lead_score INTEGER DEFAULT 50,
  intent TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'new',
  disposition TEXT DEFAULT 'pending',
  consent_given BOOLEAN DEFAULT false,
  otp_verified BOOLEAN DEFAULT false,
  traffic_source TEXT DEFAULT 'direct',
  demo_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON leads FOR INSERT WITH CHECK (true);

-- Allow public select
CREATE POLICY "Allow public select" ON leads FOR SELECT USING (true);
```

---

## © Jatis Mobile 2026
