"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Eye,
  CheckCircle,
  Activity,
  BarChart3,
  Search,
  Download,
  RefreshCw,
  Zap,
  Phone,
  Mail,
  X,
  ChevronRight,
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
  "1k_10k": "1K - 10K/bulan",
  "10k_50k": "10K - 50K/bulan",
  "50k_100k": "50K - 100K/bulan",
  "100k_500k": "100K - 500K/bulan",
  "500k_plus": "500K+/bulan",
  not_sure: "Belum pasti",
};

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  new: { text: "text-blue-700", bg: "bg-blue-50" },
  contacted: { text: "text-amber-700", bg: "bg-amber-50" },
  qualified: { text: "text-emerald-700", bg: "bg-emerald-50" },
  converted: { text: "text-violet-700", bg: "bg-violet-50" },
  lost: { text: "text-red-700", bg: "bg-red-50" },
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
  demo_history: string[];
  created_at: string;
}

interface Stats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  avgLeadScore: number;
}

const MOCK_LEADS: Lead[] = [
  { id: "1", name: "Budi Santoso", position: "Head of Digital Marketing", company: "PT Unilever Indonesia", email: "budi.s@unilever.com", whatsapp: "6281234567890", use_case: "consumer_engagement", volume_range: "100k_500k", lead_score: 78, intent: "high", status: "qualified", disposition: "meeting_booked", otp_verified: true, demo_history: ["whatsapp_chat", "ai_chatbot"], created_at: "2026-08-24T10:30:00" },
  { id: "2", name: "Siti Rahayu", position: "Finance Manager", company: "PT Astra International", email: "siti.r@astra.co.id", whatsapp: "6289876543210", use_case: "payment_collection", volume_range: "500k_plus", lead_score: 92, intent: "high", status: "qualified", disposition: "contacted", otp_verified: true, demo_history: ["robocall"], created_at: "2026-08-24T09:15:00" },
  { id: "3", name: "Ahmad Wijaya", position: "Supply Chain Director", company: "PT Indofood CBP", email: "ahmad.w@indofood.com", whatsapp: "6281122334455", use_case: "distributor_operations", volume_range: "100k_500k", lead_score: 65, intent: "medium", status: "new", disposition: "pending", otp_verified: true, demo_history: ["whatsapp_chat"], created_at: "2026-08-23T16:45:00" },
  { id: "4", name: "Dewi Kusuma", position: "CRM Manager", company: "PT Telekomunikasi Indonesia", email: "dewi.k@telkom.co.id", whatsapp: "6285566778899", use_case: "customer_service", volume_range: "50k_100k", lead_score: 55, intent: "medium", status: "contacted", disposition: "nurture", otp_verified: true, demo_history: ["ai_chatbot"], created_at: "2026-08-23T14:20:00" },
  { id: "5", name: "Rudi Hermawan", position: "Trade Marketing Head", company: "PT Salim Group", email: "rudi.h@salim.co.id", whatsapp: "6289988776655", use_case: "trade_promotion", volume_range: "500k_plus", lead_score: 88, intent: "high", status: "qualified", disposition: "qualified_opportunity", otp_verified: true, demo_history: ["whatsapp_chat", "ai_chatbot", "robocall"], created_at: "2026-08-23T11:00:00" },
];

const MOCK_STATS: Stats = {
  totalLeads: 1247,
  newLeads: 23,
  qualifiedLeads: 89,
  avgLeadScore: 72,
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffHours < 1) return "Baru saja";
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function AdminDashboard() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);
  const [stats] = useState<Stats>(MOCK_STATS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIntent, setFilterIntent] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchSearch = !search || 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchIntent = filterIntent === "all" || lead.intent === filterIntent;
    return matchSearch && matchStatus && matchIntent;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">GrowthAI</p>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">Admin Jatis</p>
                  <p className="text-xs text-gray-500">admin@jatis-mobile.com</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview performa lead dan engagement demo</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card bg-brand-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalLeads.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-600" />
              </div>
            </div>
          </div>
          <div className="stat-card bg-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Leads Baru</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.newLeads}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="stat-card bg-violet-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Qualified</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.qualifiedLeads}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </div>
          <div className="stat-card bg-amber-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgLeadScore}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nama, perusahaan, atau email..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-full md:w-36">
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
              </select>
              <select value={filterIntent} onChange={(e) => setFilterIntent(e.target.value)} className="input-field w-full md:w-32">
                <option value="all">All Intent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button className="btn-secondary whitespace-nowrap">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Lead</th>
                  <th className="px-4 py-3 text-left">Perusahaan</th>
                  <th className="px-4 py-3 text-left">Use Case</th>
                  <th className="px-4 py-3 text-left">Volume</th>
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Intent</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="table-row">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.position}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{lead.company}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-info">{USE_CASE_LABELS[lead.use_case]}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {VOLUME_LABELS[lead.volume_range]}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${lead.lead_score}%`, backgroundColor: lead.lead_score >= 70 ? "#10b981" : lead.lead_score >= 40 ? "#0ea5e9" : "#f59e0b" }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{lead.lead_score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${INTENT_COLORS[lead.intent].bg} ${INTENT_COLORS[lead.intent].text}`}>{lead.intent.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[lead.status].bg} ${STATUS_COLORS[lead.status].text}`}>{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedLead(lead)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Lihat Detail">
                          <Eye className="w-4 h-4" />
                        </button>
                        <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 transition-colors" title="WhatsApp">
                          <Phone className="w-4 h-4" />
                        </a>
                        <a href={`mailto:${lead.email}`} className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors" title="Email">
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Tidak ada leads yang ditemukan</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <p>Menampilkan {filteredLeads.length} dari {leads.length} leads</p>
        </div>
      </main>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Lead Detail</h2>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white text-xl font-bold">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedLead.name}</h3>
                  <p className="text-sm text-gray-500">{selectedLead.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedLead.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">WhatsApp</p>
                  <p className="text-sm font-medium text-gray-900">{selectedLead.whatsapp}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Use Case</p>
                  <p className="text-sm font-medium text-gray-900">{USE_CASE_LABELS[selectedLead.use_case]}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Volume</p>
                  <p className="text-sm font-medium text-gray-900">{VOLUME_LABELS[selectedLead.volume_range]}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className={`badge ${INTENT_COLORS[selectedLead.intent].bg} ${INTENT_COLORS[selectedLead.intent].text}`}>{selectedLead.intent.toUpperCase()} INTENT</span>
                <span className={`badge ${STATUS_COLORS[selectedLead.status].bg} ${STATUS_COLORS[selectedLead.status].text}`}>{selectedLead.status.toUpperCase()}</span>
                {selectedLead.otp_verified && <span className="badge badge-success">OTP Verified</span>}
              </div>

              {selectedLead.demo_history?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Demo History</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedLead.demo_history.map((d) => <span key={d} className="badge badge-gray">{d.replace("_", " ")}</span>)}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-2">Lead Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${selectedLead.lead_score}%`, backgroundColor: selectedLead.lead_score >= 70 ? "#10b981" : selectedLead.lead_score >= 40 ? "#0ea5e9" : "#f59e0b" }} />
                  </div>
                  <span className="text-lg font-bold text-gray-900">{selectedLead.lead_score}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <a href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button className="btn-primary w-full"><Phone className="w-4 h-4" /> WhatsApp</button>
                </a>
                <a href={`mailto:${selectedLead.email}`} className="flex-1">
                  <button className="btn-secondary w-full"><Mail className="w-4 h-4" /> Email</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
