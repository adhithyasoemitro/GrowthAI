"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare, Zap, Shield, Users, TrendingUp, CheckCircle, ChevronDown,
  Play, ArrowRight, Star, BarChart3, Target, Clock, Sparkles,
} from "lucide-react";

const DEMO_CARDS = [
  {
    icon: "🛒",
    title: "Chat Commerce",
    subtitle: "WhatsApp Business Platform",
    description: "Simulasi lengkap chat commerce — katalog produk, order taking, konfirmasi stok, hingga digital receipt.",
    gradient: "from-emerald-500 to-teal-500",
    badge: "SIMULASI",
    badgeColor: "emerald",
    kpis: [
      { label: "Conversion Rate", value: "23%" },
      { label: "Avg. Order", value: "Rp 850Rb" },
    ],
    href: "/demos/whatsapp-chat",
  },
  {
    icon: "🤖",
    title: "Ngobrol.ai",
    subtitle: "AI Chatbot untuk Distributor",
    description: "AI chatbot menangani pertanyaan distributor — shipping status, retur policy, hingga ticket creation.",
    gradient: "from-violet-500 to-purple-500",
    badge: "SIMULASI",
    badgeColor: "violet",
    kpis: [
      { label: "FAQ Resolution", value: "87%" },
      { label: "CS Load Reduction", value: "65%" },
    ],
    href: "/demos/ai-chatbot",
  },
  {
    icon: "📞",
    title: "RoboCall",
    subtitle: "AI Voice Agent Payment Reminder",
    description: "AI voice agent untuk reminder pembayaran otomatis — IVR, konfirmasi, dan escalation ke WhatsApp.",
    gradient: "from-orange-500 to-amber-500",
    badge: "SIMULASI",
    badgeColor: "orange",
    kpis: [
      { label: "Collection Rate", value: "+34%" },
      { label: "Call Success", value: "89%" },
    ],
    href: "/demos/robocall",
  },
];

const TRUST_BADGES = [
  { label: "ISO 9001:2015", sublabel: "Quality Management" },
  { label: "500+ Klien", sublabel: "Enterprise Clients" },
  { label: "100M+ Pesan", sublabel: "Messages/bulan" },
  { label: "99.9% Uptime", sublabel: "SLA Guarantee" },
];

const STATS = [
  { label: "Leads Generated", value: "2,847+", color: "text-brand-400" },
  { label: "Demo Completions", value: "1,523", color: "text-emerald-400" },
  { label: "Avg. Session", value: "4.2 min", color: "text-violet-400" },
  { label: "Conversion Rate", value: "23%", color: "text-orange-400" },
];

const FEATURES = [
  { icon: "🎯", title: "Demo Interaktif Real-Time", desc: "Bukan slideshow. Pilih persona, input, dan lihat output nyata dari sistem Jatis Mobile." },
  { icon: "🛡️", title: "Simulasi Tanpa Risiko", desc: "Tidak ada data klien nyata. Tidak ada broadcast nyata. Semua sandbox." },
  { icon: "📊", title: "Lead Qualification Otomatis", desc: "Demo yang dicoba, use case yang dipilih — semua jadi sinyal untuk lead scoring." },
  { icon: "✅", title: "WhatsApp OTP Verification", desc: "Nomor diverifikasi via OTP sebelum lead dikirim ke sales team." },
];

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-dark-800/80 backdrop-blur-xl border border-white/5 ${className}`}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const getBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">GrowthAI</p>
                <p className="text-xs text-white/40">by Jatis Mobile</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#demos" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Demos</a>
              <a href="#features" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Features</a>
              <a href="/admin" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Admin</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="btn-secondary text-sm hidden sm:inline-flex">Login</Link>
              <Link href="#demos" className="btn-primary text-sm">Try Demos</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800" />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "linear-gradient(rgba(0,135,230,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,135,230,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-brand-400">Interactive Demo Hub for FMCG</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-orange-500">Jatis FMCG</span>
            <br /><span className="text-white">DemoHub</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 mb-4 font-medium">"Try Before You Talk to Sales"</p>
          <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto mb-10">
            Experience WhatsApp Business Platform, AI Chatbot, RoboCall, dan Enterprise Messaging 
            melalui simulasi operasional yang relevan dengan KPI FMCG Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="#demos" className="btn-primary text-base px-8 py-4 shadow-xl shadow-brand-500/25">
              <Play className="w-5 h-5" />Explore Demos
            </a>
            <Link href="/admin" className="btn-secondary text-base px-8 py-4">
              <BarChart3 className="w-5 h-5" />Admin Panel
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{b.label}</p>
                  <p className="text-xs text-white/40">{b.sublabel}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <p className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-white/30 animate-bounce" />
        </div>
      </section>

      {/* Demos */}
      <section id="demos" className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
              <Sparkles className="w-3 h-3" />SIMULASI INTERAKTIF
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              3 Demo yang Bisa Anda Coba<span className="text-brand-400"> Sekarang</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Setiap demo adalah simulasi operasional lengkap — bukan fake UI. 
              Anda akan lihat apa yang terjadi di balik layar Jatis Mobile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_CARDS.map((demo, i) => (
              <div
                key={i}
                className={`glass-card relative overflow-hidden group transition-all duration-500 ${hoveredCard === i ? "ring-2 ring-brand-500/50" : ""}`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`h-1 bg-gradient-to-r ${demo.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5 border border-white/10">
                        {demo.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{demo.title}</h3>
                        <p className="text-xs text-white/40">{demo.subtitle}</p>
                      </div>
                    </div>
                    <span className={`badge ${getBadgeColor(demo.badgeColor)}`}>{demo.badge}</span>
                  </div>
                  <p className="text-sm text-white/50 mb-4 line-clamp-2">{demo.description}</p>
                  <div className="flex gap-4 mb-5 p-3 rounded-xl bg-white/[0.03]">
                    {demo.kpis.map((k, j) => (
                      <div key={j}>
                        <p className="text-lg font-bold text-white">{k.value}</p>
                        <p className="text-xs text-white/40">{k.label}</p>
                      </div>
                    ))}
                  </div>
                  <Link href={demo.href} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm bg-dark-700 text-white hover:bg-dark-600 transition-all">
                    <Play className="w-4 h-4" />Coba Demo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-dark-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <CheckCircle className="w-3 h-3" />FITUR UNGGULAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Mengapa DemoHub<span className="text-brand-400"> Berbeda</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Tidak ada demo lain yang memberikan pengalaman seinteraktif dan seabstrak ini.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card p-6 hover:border-white/15 transition-all group">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{f.title}</h3>
                    <p className="text-sm text-white/50">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-dark-900">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-16 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <Star className="w-12 h-12 text-brand-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Siap Coba?</h2>
              <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
                Pilih demo yang paling relevan dengan peran Anda, coba simulasi interaktif, dan daftarkan diri untuk lanjut ke free trial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#demos" className="btn-primary text-base px-8 py-4 shadow-xl shadow-brand-500/25">
                  <Play className="w-5 h-5" />Mulai Demo Sekarang
                </a>
                <Link href="/leads" className="btn-secondary text-base px-8 py-4">
                  <ArrowRight className="w-5 h-5" />Daftar Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">GrowthAI DemoHub</p>
                <p className="text-xs text-white/40">by Jatis Mobile</p>
              </div>
            </div>
            <p className="text-xs text-white/30">
              © 2026 Jatis Mobile. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
