"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users, TrendingUp, TrendingDown, Activity, BarChart3, Search, Download,
  Zap, Phone, Mail, Settings, LogOut, Menu, Bell, ArrowUpRight, Clock, Target, MessageSquare
} from "lucide-react";

function LineChart({ data, color }: { data: number[], color: string }) {
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const pts = data.map((v, i) => {
    const xPct = (i / (data.length - 1)) * 100;
    const yPct = 100 - (((v - minVal) / range) * 80);
    return xPct + "," + yPct;
  });
  const points = pts.join(" ");
  const areaPts = "0,100 " + points + " 100,100";
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height: 150 }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill="url(#grad)" />
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = -90;
  const paths = segments.map(s => {
    const angle = (s.value / total) * 360;
    const start = currentAngle;
    currentAngle += angle;
    const end = currentAngle;
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    const r = 70;
    const cx = 100;
    const cy = 100;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    return { d: "M" + cx + "," + cy + " L" + x1 + "," + y1 + " A" + r + "," + r + " 0 " + largeArc + ",1 " + x2 + "," + y2 + " Z", color: s.color };
  });
  return (
    <div className="flex items-center gap-8">
      <svg viewBox="0 0 200 200" style={{ width: 160, height: 160 }}>
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
      </svg>
      <div className="space-y-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-gray-600">{s.label}</span>
            <span className="text-sm font-semibold text-gray-900">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_DATA = {
  totalLeads: 2847,
  newThisWeek: 156,
  conversionRate: 23.5,
  avgSession: "4.2m",
  weeklyLeads: [12, 18, 15, 25, 22, 28, 35, 32, 40, 38, 45, 52],
  intentBreakdown: [
    { label: "High Intent", value: 45, color: "#10b981" },
    { label: "Medium Intent", value: 35, color: "#f59e0b" },
    { label: "Low Intent", value: 20, color: "#ef4444" }
  ],
  leadsBySource: [
    { label: "LinkedIn", value: 35 },
    { label: "Google Ads", value: 28 },
    { label: "Referral", value: 18 },
    { label: "Email", value: 12 },
    { label: "Direct", value: 7 }
  ],
  recentLeads: [
    { id: "1", name: "Budi Santoso", company: "PT Unilever Indonesia", email: "budi.s@unilever.com", useCase: "Consumer Engagement", score: 78, intent: "high", status: "qualified", date: "2 jam lalu" },
    { id: "2", name: "Siti Rahayu", company: "PT Astra International", email: "siti.r@astra.co.id", useCase: "Payment Collection", score: 92, intent: "high", status: "contacted", date: "3 jam lalu" },
    { id: "3", name: "Ahmad Wijaya", company: "PT Indofood CBP", email: "ahmad.w@indofood.com", useCase: "Distributor Ops", score: 65, intent: "medium", status: "new", date: "5 jam lalu" },
    { id: "4", name: "Dewi Kusuma", company: "PT Telkom", email: "dewi.k@telkom.co.id", useCase: "Customer Service", score: 55, intent: "medium", status: "contacted", date: "Kemarin" },
    { id: "5", name: "Rudi Hermawan", company: "PT Salim Group", email: "rudi.h@salim.co.id", useCase: "Trade Promotion", score: 88, intent: "high", status: "qualified", date: "Kemarin" }
  ]
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">GrowthAI</p>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: "overview", icon: BarChart3, label: "Overview" },
              { id: "leads", icon: Users, label: "Leads" },
              { id: "analytics", icon: TrendingUp, label: "Analytics" },
              { id: "campaigns", icon: MessageSquare, label: "Campaigns" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map(item => (
              <button key={item.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-600 hover:bg-gray-50">
                <item.icon className="w-5 h-5" />{item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Admin Jatis</p>
                <p className="text-xs text-gray-500 truncate">admin@jatis-mobile.com</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Overview performa leads dan engagement</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100"><Bell className="w-5 h-5 text-gray-500" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>
            <Link href="/" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100"><ArrowUpRight className="w-4 h-4" />Lihat Situs</Link>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Leads", value: "2,847", change: "+12%", icon: Users, color: "from-blue-500 to-blue-600", neg: false },
              { label: "New This Week", value: "156", change: "+8%", icon: Activity, color: "from-emerald-500 to-emerald-600", neg: false },
              { label: "Conversion Rate", value: "23.5%", change: "+3.2%", icon: Target, color: "from-violet-500 to-violet-600", neg: false },
              { label: "Avg. Session", value: "4.2m", change: "-0.5%", icon: Clock, color: "from-orange-500 to-orange-600", neg: true },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + stat.color + " flex items-center justify-center shadow-lg"}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {stat.neg ? <TrendingDown className="w-4 h-4 text-red-500" /> : <TrendingUp className="w-4 h-4 text-emerald-500" />}
                  <span className={"text-sm font-semibold " + (stat.neg ? "text-red-500" : "text-emerald-600")}>{stat.change}</span>
                  <span className="text-sm text-gray-400">vs last week</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900">Leads Trend</h3>
                  <p className="text-sm text-gray-500">Weekly performance</p>
                </div>
                <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm">
                  <option>Last 7 days</option><option>Last 30 days</option>
                </select>
              </div>
              <LineChart data={MOCK_DATA.weeklyLeads} color="#0087E6" />
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6">Intent Breakdown</h3>
              <DonutChart segments={MOCK_DATA.intentBreakdown} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6">Leads by Source</h3>
              <div className="space-y-4">
                {MOCK_DATA.leadsBySource.map((source, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-600">{source.label}</div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg" style={{ width: source.value + "%" }} />
                    </div>
                    <div className="w-10 text-right text-sm font-semibold text-gray-900">{source.value}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6">Conversion Funnel</h3>
              <div className="space-y-3">
                {[
                  { label: "Demo Viewed", value: 100, color: "bg-blue-500" },
                  { label: "Registration", value: 65, color: "bg-violet-500" },
                  { label: "OTP Verified", value: 45, color: "bg-emerald-500" },
                  { label: "Completed", value: 32, color: "bg-amber-500" },
                  { label: "Qualified", value: 23, color: "bg-orange-500" },
                ].map((stage, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-28 text-sm text-gray-600">{stage.label}</div>
                    <div className="flex-1 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      <div className={"h-full " + stage.color + " rounded-lg flex items-center justify-end pr-4"} style={{ width: stage.value + "%" }}>
                        <span className="text-sm font-semibold text-white">{stage.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Recent Leads</h3>
                <p className="text-sm text-gray-500">Latest submissions</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none">
                  <option value="all">All Status</option>
                  <option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100">
                  <Download className="w-4 h-4" />Export
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 font-medium">
                  <th className="px-6 py-3 text-left">Lead</th><th className="px-6 py-3 text-left">Company</th>
                  <th className="px-6 py-3 text-left">Use Case</th><th className="px-6 py-3 text-left">Score</th>
                  <th className="px-6 py-3 text-left">Intent</th><th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th><th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_DATA.recentLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><p className="font-semibold text-gray-900">{lead.name}</p><p className="text-sm text-gray-500">{lead.email}</p></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.company}</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{lead.useCase}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: lead.score + "%" }} /></div>
                        <span className="text-sm font-semibold">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={"px-3 py-1 rounded-full text-xs font-semibold " + (lead.intent === "high" ? "bg-emerald-50 text-emerald-600" : lead.intent === "medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600")}>
                        {lead.intent.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={"px-3 py-1 rounded-full text-xs font-medium " + (lead.status === "qualified" ? "bg-violet-50 text-violet-600" : lead.status === "contacted" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600")}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lead.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><BarChart3 className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"><Phone className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Mail className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
