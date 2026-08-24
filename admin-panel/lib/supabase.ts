import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lead = {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  whatsapp: string;
  use_case: string;
  volume_range: string;
  follow_up_pref: string;
  demo_history: string[];
  lead_score: number;
  intent: string;
  status: string;
  disposition: string;
  otp_verified: boolean;
  consent_given: boolean;
  traffic_source: string;
  created_at: string;
};

export async function getLeads(): Promise<Lead[]> {
  try {
    const res = await fetch('/api/admin/leads')
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.leads || []
  } catch {
    return []
  }
}

export async function getLeadStats() {
  try {
    const res = await fetch('/api/admin/leads')
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.stats || {}
  } catch {
    return {}
  }
}
