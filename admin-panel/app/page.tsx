"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, TrendingUp, Eye, CheckCircle, Activity, BarChart3, Search, Download, RefreshCw,
  Zap, Phone, Mail, X, Filter, ChevronDown, ExternalLink, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const USE_CASE_LABELS: Record<string, string> = {
  consumer_engagement: "Consumer Engagement",
  distributor_operations: "Distributor Operations",
  customer_service: "Customer Service",
  trade_promotion: "Trade Promotion",
  order_management: "Order Management",
  payment_collection: "Payment Collection",
  loyalty_program: "Loyalty Program",
  other: "Other",
};

const VOLUME_LABELS: Record<string, string> = {
  "1k_10k": "1K - 10K/bulan", "10k_50k": "10K - 50K/bulan",
  "50k_100k": "50K - 100K/bulan", "100k_500k": "100K - 500K/bulan",
  "500k_plus": "500K+/bulan", not_sure: "Belum pasti",
};

const STATUS_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  new: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  contacted: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  qualified: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  converted: { text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  lost: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
};

const INTENT_COLORS: Record<string, { text: string; bg: string }> = {
  high: { text: "text-emerald-700", bg: "bg-emerald-50" },
  medium: { text: "text-amber-700", bg: "bg-amber-50" },
  low: { text: "text-red-700", bg: "bg-red-50" },
};

interface Lead {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  whatsapp: string;
  use_case: string;
  volume_range: string;
  lead_score: number;
  intent: string;
  status: string;
  disposition: string;
  otp_verified: boolean;
  consent_given: boolean;
  demo_count: number;
  utm_source: string;
  traffic_source: string;
  created_at: string;
}

const MOCK_LEADS: Lead[] = [
  { id: "1", name: "Budi Santoso", position: "Head of Digital Marketing", company: "PT Unilever Indonesia", email: "budi.s@unilever.com", whatsapp: "6281234567890", use_case: "consumer_engagement", volume_range: "100k_500k", lead_score: 78, intent: "high", status: "qualified", disposition: "meeting_booked", otp_verified: true, consent_given: true, demo_count: 3, utm_source: "linkedin", traffic_source: "linkedin", created_at: "2026-08-24T10:30:00" },
  { id: "2", name: "Siti Rahayu", position: "Finance Manager", company: "PT Astra International", email: "siti.r@astra.co.id", whatsapp: "6289876543210", use_case: "payment_collection", volume_range: "500k_plus", lead_score: 92, intent: "high", status: "qualified", disposition: "contacted", otp_verified: true, consent_given: true, demo_count: 2, utm_source: "direct", traffic_source: "direct", created_at: "2026-08-24T09:15:00" },
  { id: "3", name: "Ahmad Wijaya", position: "Supply Chain Director", company: "PT Indofood CBP", email: "ahmad.w@indofood.com", whatsapp: "6281122334455", use_case: "distributor_operations", volume_range: "100k_500k", lead_score: 65, intent: "medium", status: "new", disposition: "pending", otp_verified: true, consent_given: true, demo_count: 1, utm_source: "google", traffic_source: "google", created_at: "2026-08-23T16:45:00" },
  { id: "4", name: "Dewi Kusuma", position: "CRM Manager", company: "PT Telekomunikasi Indonesia", email: "dewi.k@telkom.co.id", whatsapp: "6285566778899", use_case: "customer_service", volume_range: "50k_100k", lead_score: 55, intent: "medium", status: "contacted", disposition: "nurture", otp_verified: true, consent_given: true, demo_count: 2, utm_source: "email", traffic_source: "email", created_at: "2026-08-23T14:20:00" },
  { id: "5", name: "Rudi Hermawan", position: "Trade Marketing Head", company: "PT Salim Group", email: "rudi.h@salim.co.id", whatsapp: "6289988776655", use_case: "trade_promotion", volume_range: "500k_plus", lead_score: 88, intent: "high", status: "qualified", disposition: "qualified_opportunity", otp_verified: true, consent_given: true, demo_count: 3, utm_source: "referral", traffic_source: "referral", created_at: "2026-08-23T11:00:00" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Baru saja";
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIntent, setFilterIntent] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [dataSource, setDataSource] = useState<"supabase" | "demo">("demo");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      
      if (data.leads && data.leads.length > 0) {
        setLeads(data.leads);
        setDataSource(data.storage || "demo");
      } else {
        // Fallback to mock data
        setLeads(MOCK_LEADS);
        setDataSource("demo");
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setLeads(MOCK_LEADS);
      setDataSource("demo");
    } finally {
      setLoading(false);
    }
  };

  const filtered = leads.filter(l => {
    const s = search.toLowerCase();
    const match = !s || l.name.toLowerCase().includes(s) || l.company.toLowerCase().includes(s) || l.email.toLowerCase().includes(s);
    return match && (filterStatus === "all" || l.status === filterStatus) && (filterIntent === "all" || l.intent === filterIntent);
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    qualified: leads.filter(l => l.status === "qualified").length,
    avgScore: Math.round(leads.reduce((sum, l) => sum + l.lead_score, 0) / (leads.length || 1)),
    highIntent: leads.filter(l => l.intent === "high").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">GrowthAI</p>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </Link>
              <div className="hidden md:block h-8 w-px bg-gray-200" />
              <span className="hidden md:inline text-sm text-gray-500">Jatis Mobile</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchLeads} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500" title="Refresh">
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
              </button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {dataSource === "supabase" ? "Live Data" : "Demo Data"}
              </div>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">Admin Jatis</p>
                  <p className="text-xs text-gray-500">admin@jatis-mobile.com</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white font-bold">A</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview performa lead dan engagement demo</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Leads Baru</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.new}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Qualified</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.qualified}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgScore}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search nama, perusahaan, email..." className="input-field pl-10" />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-full md:w-36">
                <option value="all">All Status</option>
                <option value="new">New</option><option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option><option value="converted">Converted</option>
              </select>
              <select value={filterIntent} onChange={e => setFilterIntent(e.target.value)} className="input-field w-full md:w-32">
                <option value="all">All Intent</option>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
              <button className="btn-secondary whitespace-nowrap">
                <Download className="w-4 h-4" />Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Lead</th>
                  <th className="px-4 py-3 text-left">Perusahaan</th>
                  <th className="px-4 py-3 text-left">Use Case</th>
                  <th className="px-4 py-3 text-left">Volume</th>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Intent</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Loading leads...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Tidak ada leads ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(l => (
                    <tr key={l.id} className="table-row">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 text-sm">{l.name}</p>
                        <p className="text-xs text-gray-500">{l.position}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{l.company}</p>
                        <p className="text-xs text-gray-500">{l.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-info">{USE_CASE_LABELS[l.use_case] || l.use_case}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{VOLUME_LABELS[l.volume_range] || l.volume_range}</td>
                      <td className="px-4 py-3">
                        <span className="badge badge-gray capitalize">{l.utm_source || l.traffic_source || "direct"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${l.lead_score}%`, backgroundColor: l.lead_score >= 70 ? "#10b981" : l.lead_score >= 40 ? "#0ea5e9" : "#f59e0b" }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{l.lead_score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("badge", INTENT_COLORS[l.intent]?.bg, INTENT_COLORS[l.intent]?.text)}>
                          {l.intent?.toUpperCase() || "MEDIUM"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("badge", STATUS_COLORS[l.status]?.bg, STATUS_COLORS[l.status]?.text)}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{timeAgo(l.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(l)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Detail">
                            <Eye className="w-4 h-4" />
                          </button>
                          <a href={`https://wa.me/${l.whatsapp.replace(/\D/g, "")}`} target="_blank" className="p-2 rounded-lg hover:bg-emerald-50 text-gray-500 hover:text-emerald-600" title="WhatsApp">
                            <Phone className="w-4 h-4" />
                          </a>
                          <a href={`mailto:${l.email}`} className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600" title="Email">
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Lead Detail</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white text-xl font-bold">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-sm text-gray-500">{selected.position}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selected.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">WhatsApp</p>
                  <p className="text-sm font-medium text-gray-900">{selected.whatsapp}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Use Case</p>
                  <p className="text-sm font-medium text-gray-900">{USE_CASE_LABELS[selected.use_case] || selected.use_case}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Volume</p>
                  <p className="text-sm font-medium text-gray-900">{VOLUME_LABELS[selected.volume_range] || selected.volume_range}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={cn("badge", INTENT_COLORS[selected.intent]?.bg, INTENT_COLORS[selected.intent]?.text)}>
                  {selected.intent?.toUpperCase() || "MEDIUM"} INTENT
                </span>
                <span className={cn("badge", STATUS_COLORS[selected.status]?.bg, STATUS_COLORS[selected.status]?.text)}>
                  {selected.status?.toUpperCase()}
                </span>
                {selected.otp_verified && <span className="badge badge-success">OTP Verified</span>}
                {selected.consent_given && <span className="badge badge-info">Consent Given</span>}
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="badge badge-gray">Demos: {selected.demo_count || 0}</span>
                <span className="badge badge-gray capitalize">Source: {selected.utm_source || selected.traffic_source || "direct"}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Lead Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${selected.lead_score}%`, backgroundColor: selected.lead_score >= 70 ? "#10b981" : selected.lead_score >= 40 ? "#0ea5e9" : "#f59e0b" }} />
                  </div>
                  <span className="text-lg font-bold text-gray-900">{selected.lead_score}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Actions</p>
                <div className="flex gap-3">
                  <a href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}`} target="_blank" className="flex-1">
                    <button className="btn-primary w-full">
                      <Phone className="w-4 h-4" /> WhatsApp
                    </button>
                  </a>
                  <a href={`mailto:${selected.email}`} className="flex-1">
                    <button className="btn-secondary w-full">
                      <Mail className="w-4 h-4" /> Email
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
