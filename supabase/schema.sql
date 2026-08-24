-- ============================================
-- JATIS FMCG DEMOHUB - Supabase Schema
-- ============================================

-- Users (Admin/Sales)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'sales',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  use_case TEXT NOT NULL,
  volume_range TEXT NOT NULL,
  follow_up_pref TEXT NOT NULL,
  demo_history JSONB DEFAULT '[]',
  lead_score INTEGER DEFAULT 50,
  score_breakdown JSONB DEFAULT '{}',
  intent TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'new',
  disposition TEXT DEFAULT 'pending',
  disposition_note TEXT,
  otp_verified BOOLEAN DEFAULT FALSE,
  otp_masked TEXT DEFAULT '',
  consent_given BOOLEAN DEFAULT FALSE,
  consent_version TEXT DEFAULT '1.0',
  traffic_source TEXT DEFAULT 'direct',
  utm_params JSONB DEFAULT '{}',
  ip_hash TEXT,
  user_agent TEXT,
  assignee_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  category TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTP Attempts
CREATE TABLE IF NOT EXISTS otp_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_hash TEXT NOT NULL,
  correlation_id TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo Sessions
CREATE TABLE IF NOT EXISTS demo_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  session_id TEXT UNIQUE NOT NULL,
  demo_type TEXT NOT NULL,
  steps_completed INTEGER DEFAULT 0,
  final_outcome TEXT,
  demo_data JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Admin Activity
CREATE TABLE IF NOT EXISTS admin_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_id TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_intent ON leads(intent);
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON events(lead_id);
CREATE INDEX IF NOT EXISTS idx_otp_phone_hash ON otp_attempts(phone_hash);

-- RLS Policies (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public read for leads (for registration)
CREATE POLICY "Public can create leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read own leads" ON leads FOR SELECT USING (true);

-- Admin only policies
CREATE POLICY "Admins can read all leads" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'sales_manager'))
);

CREATE POLICY "Admins can update leads" ON leads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'sales_manager'))
);

CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
