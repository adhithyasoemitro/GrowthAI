# 🚀 Jatis FMCG DemoHub - GrowthAI

**Interactive Demo Hub & Self-Registration Funnel untuk C-Level FMCG**

*"Try before you talk to sales."*

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

---

## 🎯 Overview

Jatis FMCG DemoHub adalah website full stack yang mengubah website enterprise messaging Jatis Mobile menjadi pengalaman **"try-before-you-talk-to-sales"** khusus untuk C-level dan Head of Digital/Trade Marketing perusahaan FMCG.

### ✨ Features

- **🛒 Chat Commerce Demo** — Simulasi WhatsApp Business Platform untuk order management
- **🤖 Ngobrol.ai Demo** — AI chatbot untuk FAQ distributor & retailer  
- **📞 RoboCall Demo** — AI voice agent untuk payment reminder
- **📝 Lead Registration** — Form dengan WhatsApp OTP verification
- **📊 Sales Dashboard** — Admin panel untuk manage leads & track engagement
- **🎯 Lead Scoring** — Automatic scoring berdasarkan ICP fit
- **📈 Analytics** — Event tracking & funnel measurement

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) + Prisma ORM |
| Auth | JWT (jose) + bcrypt |
| Analytics | Custom event tracking |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/adhithyasoemitro/GrowthAI.git
cd GrowthAI

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase keys

# Push database schema
npx prisma db push

# Seed database with admin user
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

---

## 📁 Project Structure

```
GrowthAI/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Login, OTP
│   │   ├── leads/        # Lead CRUD
│   │   └── admin/        # Admin endpoints
│   ├── admin/            # Admin dashboard
│   ├── demos/            # Demo pages
│   ├── leads/            # Registration page
│   └── login/            # Login page
├── components/           # React components
│   ├── ui/              # UI primitives
│   ├── landing/         # Landing page
│   ├── demos/           # Demo components
│   ├── registration/     # Registration form
│   └── admin/           # Admin dashboard
├── lib/                  # Utilities
│   ├── auth.ts          # JWT helpers
│   ├── prisma.ts        # Prisma client
│   ├── utils.ts         # Common utilities
│   ├── validations.ts   # Zod schemas
│   ├── lead-scoring.ts  # Lead scoring logic
│   ├── demo-scenarios.ts # Demo data
│   └── analytics-context.tsx # Analytics provider
├── prisma/              # Database schema
├── supabase/            # Supabase config
└── utils/supabase/      # Supabase clients
```

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/otp-request` | Send OTP via WhatsApp |
| POST | `/api/auth/otp-verify` | Verify OTP |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List all leads |
| POST | `/api/leads` | Create new lead |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/leads` | Admin lead list with stats |
| PATCH | `/api/admin/leads` | Update lead disposition |

---

## 🎨 Demo Scenarios

### 1. Chat Commerce (WhatsApp)
- Product catalog browsing
- Order taking via WhatsApp
- Stock check integration
- Payment confirmation
- Digital receipt

### 2. Ngobrol.ai (AI Chatbot)
- Distributor FAQ handling
- Shipping status lookup
- Return policy information
- Smart human handoff
- Ticket creation

### 3. RoboCall (Voice Agent)
- Outbound payment reminder
- IVR with DTMF
- Interactive conversation
- WhatsApp detail send
- Call summary to CRM

---

## 👥 Demo Credentials

```
Admin Dashboard: http://localhost:3000/admin
Login Email: admin@jatis-mobile.com
Login Password: JatisFMCG2026!
```

---

## 📊 Lead Scoring

| Factor | Weight |
|--------|--------|
| Position Level | 15-25 pts |
| Use Case | 18-30 pts |
| Volume Range | 10-30 pts |
| Demo Completion | 0-20 pts |

**Grade A**: 80+ pts (High Intent)
**Grade B**: 60-79 pts (Medium Intent)  
**Grade C**: 40-59 pts (Low Intent)
**Grade D**: <40 pts (Nurture)

---

## 🔒 Security Features

- ✅ JWT authentication with HTTP-only cookies
- ✅ WhatsApp OTP verification
- ✅ Input sanitization & validation (Zod)
- ✅ Rate limiting for OTP requests
- ✅ PII masking in logs
- ✅ Row-level security (Supabase RLS)
- ✅ Security headers (middleware)

---

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interactions
- Safe area aware
- Optimized for 360px - 1440px

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Supabase Setup

1. Create new Supabase project
2. Run `supabase/schema.sql` in SQL editor
3. Enable Email auth provider
4. Copy credentials to `.env.local`

---

## 📄 License

© 2026 Jatis Mobile. All rights reserved.
PT. Agra Karya Digital

---

## 🤝 Support

- **WhatsApp**: 0815-1925-0845
- **Email**: support@jatis-mobile.com
- **Documentation**: [docs.jatis-mobile.com](https://docs.jatis-mobile.com)

---

Built with ❤️ by **VeryCoolApps** — PT. Agra Karya Digital
