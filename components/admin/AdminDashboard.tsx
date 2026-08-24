"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { Button, Badge, Tabs, ProgressBar, Modal } from "@/components/ui/Button";
import { getStatusColor, getDispositionLabel, getIntentColor, formatDate, getRelativeTime, getUseCaseLabel, getVolumeLabel } from "@/lib/utils";

interface LeadData {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  whatsapp: string;
  useCase: string;
  volumeRange: string;
  followUpPref: string;
  leadScore: number;
  intent: string;
  status: string;
  disposition: string;
  otpVerified: boolean;
  demoHistory: string[];
  createdAt: string;
  assigneeId?: string;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  avgLeadScore: number;
  demoCompletions: number;
  otpVerificationRate: number;
  topUseCases: { useCase: string; count: number }[];
  leadsByDay: { date: string; count: number }[];
}

export function AdminDashboard() {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIntent, setFilterIntent] = useState("all");
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    avgLeadScore: 0,
    demoCompletions: 0,
    otpVerificationRate: 0,
    topUseCases: [],
    leadsByDay: [],
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setStats(data.stats || stats);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchIntent = filterIntent === "all" || lead.intent === filterIntent;
    return matchSearch && matchStatus && matchIntent;
  });

  const updateDisposition = async (leadId: string, disposition: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, disposition }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, disposition } : l))
        );
      }
    } catch (err) {
      console.error("Failed to update disposition:", err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/5">
        <div className="container-width px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Sales Dashboard</h1>
              <p className="text-xs text-white/40">Jatis FMCG DemoHub — Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={fetchLeads} icon={<RefreshCw className="w-4 h-4" />} />
            <Link href="/">
              <Button variant="ghost" size="sm" icon={<LogOut className="w-4 h-4" />}>
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container-width px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "text-brand-400" },
            { label: "New Today", value: stats.newLeads, icon: Activity, color: "text-emerald-400" },
            { label: "Qualified", value: stats.qualifiedLeads, icon: CheckCircle, color: "text-violet-400" },
            { label: "Avg Score", value: stats.avgLeadScore, icon: TrendingUp, color: "text-amber-400" },
            { label: "OTP Rate", value: `${Math.round(stats.otpVerificationRate)}%`, icon: Phone, color: "text-cyan-400" },
            { label: "Demo Tried", value: stats.demoCompletions, icon: MessageSquare, color: "text-fmcg-orange" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, company, email..."
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <select
            value={filterIntent}
            onChange={(e) => setFilterIntent(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Intent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>

        {/* Leads Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800/50">
                <tr className="text-left text-xs text-white/40 uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Use Case</th>
                  <th className="px-4 py-3 font-medium">Volume</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Intent</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-white/40">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-white/40">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const statusColors = getStatusColor(lead.status);
                    const intentColors = getIntentColor(lead.intent);
                    return (
                      <tr key={lead.id} className="table-row-hover">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-white text-sm">{lead.name}</p>
                            <p className="text-xs text-white/40">{lead.position}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{lead.company}</p>
                          <p className="text-xs text-white/40">{lead.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="default" className="text-xs">
                            {getUseCaseLabel(lead.useCase)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/60">{getVolumeLabel(lead.volumeRange)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 rounded-full bg-dark-600 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${lead.leadScore}%`,
                                  backgroundColor:
                                    lead.leadScore >= 70 ? "#10b981" :
                                    lead.leadScore >= 40 ? "#0ea5e9" : "#f59e0b",
                                }}
                              />
                            </div>
                            <span className="text-sm text-white/60">{lead.leadScore}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${intentColors}`}>
                            {lead.intent.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.disposition}
                            onChange={(e) => updateDisposition(lead.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-lg border bg-transparent ${statusColors.text} ${statusColors.bg} ${statusColors.border}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="meeting_booked">Meeting Booked</option>
                            <option value="qualified_opportunity">Qualified</option>
                            <option value="disqualified">Disqualified</option>
                            <option value="nurture">Nurture</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-white/40">{getRelativeTime(lead.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-emerald-400 transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            <a
                              href={`mailto:${lead.email}`}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-brand-400 transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <Modal isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} title="Lead Detail" size="lg">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-lg font-bold text-white">
                {selectedLead.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedLead.name}</h3>
                <p className="text-white/50">{selectedLead.position} — {selectedLead.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-700/50 rounded-lg p-3">
                <p className="text-xs text-white/40 mb-1">Email</p>
                <p className="text-sm text-white">{selectedLead.email}</p>
              </div>
              <div className="bg-dark-700/50 rounded-lg p-3">
                <p className="text-xs text-white/40 mb-1">WhatsApp</p>
                <p className="text-sm text-white">{selectedLead.whatsapp}</p>
              </div>
              <div className="bg-dark-700/50 rounded-lg p-3">
                <p className="text-xs text-white/40 mb-1">Use Case</p>
                <p className="text-sm text-white">{getUseCaseLabel(selectedLead.useCase)}</p>
              </div>
              <div className="bg-dark-700/50 rounded-lg p-3">
                <p className="text-xs text-white/40 mb-1">Volume</p>
                <p className="text-sm text-white">{getVolumeLabel(selectedLead.volumeRange)}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge variant={selectedLead.otpVerified ? "live" : "default"}>
                {selectedLead.otpVerified ? "OTP Verified" : "OTP Pending"}
              </Badge>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntentColor(selectedLead.intent)}`}>
                {selectedLead.intent.toUpperCase()} INTENT
              </span>
              <Badge variant="default">Score: {selectedLead.leadScore}</Badge>
            </div>

            {selectedLead.demoHistory?.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-2">Demo History</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedLead.demoHistory.map((d) => (
                    <Badge key={d} variant="simulation">{d.replace("_", " ")}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <a
                href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full" icon={<Phone className="w-4 h-4" />}>
                  WhatsApp
                </Button>
              </a>
              <a href={`mailto:${selectedLead.email}`} className="flex-1">
                <Button variant="secondary" className="w-full" icon={<Mail className="w-4 h-4" />}>
                  Email
                </Button>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
