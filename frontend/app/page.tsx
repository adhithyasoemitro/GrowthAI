"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Bot,
  Phone,
  Zap,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  Play,
  ArrowRight,
  Star,
  BarChart3,
  Layers,
  Activity,
  Target,
  Clock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_CARDS = [
  {
    icon: "🛒",
    title: "Chat Commerce",
    subtitle: "WhatsApp Business Platform",
    description: "Simulasi lengkap chat commerce — katalog produk, order taking, konfirmasi stok, hingga digital receipt.",
    gradient: "from-emerald-500 to-teal-500",
    badge: "SIMULASI",
    kpis: [
      { label: "Conversion Rate", value: "23%", color: "text-emerald-600" },
      { label: "Avg. Order", value: "Rp 850Rb", color: "text-gray-600" },
    ],
    href: "/demos/whatsapp-chat",
  },
  {
    icon: "🤖",
    title: "Ngobrol.ai",
    subtitle: "AI Chatbot untuk Distributor",
    description: "AI chatbot yang menangani pertanyaan FAQ distributor — shipping status, retur policy, hingga ticket creation.",
    gradient: "from-violet-500 to-purple-500",
    badge: "SIMULASI",
    kpis: [
      { label: "FAQ Resolution", value: "87%", color: "text-violet-600" },
      { label: "CS Reduction", value: "65%", color: "text-gray-600" },
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
    kpis: [
      { label: "Collection Rate", value: "+34%", color: "text-orange-600" },
      { label: "Call Success", value: "89%", color: "text-gray-600" },
    ],
    href: "/demos/robocall",
  },
];

const FEATURES = [
  {
    icon: Layers,
    title: "Demo Interaktif Real-Time",
    description: "Bukan slideshow. Pilih persona,input, dan lihat output nyata dari sistem Jatis Mobile.",
    color: "text-brand-600 bg-brand-50 border-brand-100",
  },
  {
    icon: Shield,
    title: "Simulasi Tanpa Risiko",
    description: "Tidak ada data klien nyata. Tidak ada broadcast nyata. Semua sandbox — explore sepuasnya.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    icon: Target,
    title: "Lead Qualification Otomatis",
    description: "Demo yang dicoba, use case yang dipilih — semua jadi sinyal untuk lead scoring.",
    color: "text-violet-600 bg-violet-50 border-violet-100",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp OTP Verification",
    description: "Nomor diverifikasi via OTP sebelum lead dikirim ke sales team.",
    color: "text-orange-600 bg-orange-50 border-orange-100",
  },
];

const TRUST_BADGES = [
  { label: "ISO 9001:2015", sublabel: "Quality Management" },
  { label: "500+ Klien", sublabel: "Enterprise Clients" },
  { label: "100M+ Pesan", sublabel: "Messages/bulan" },
  { label: "99.9% Uptime", sublabel: "SLA Guarantee" },
];

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container-width max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">GrowthAI</p>
                <p className="text-xs text-gray-500">by Jatis Mobile</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#demos" className="nav-link">Demos</a>
              <a href="#features" className="nav-link">Features</a>
              <a href="/admin" className="nav-link">Admin</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="btn-secondary text-sm hidden sm:inline-flex">
                Login
              </Link>
              <Link href="#demos" className="btn-primary text-sm">
                Try Demos
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-brand-50">
        <div className="absolute inset-0 grid-bg opacity-50" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        
        <div className="relative section-padding">
          <div className="container-width max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-brand-700">Interactive Demo Hub for FMCG</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              <span className="gradient-text">Jatis FMCG</span>
              <br />
              DemoHub
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
              "Try Before You Talk to Sales"
            </p>

            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-10">
              Experience WhatsApp Business Platform, AI Chatbot, RoboCall, dan Enterprise Messaging 
              melalui simulasi operasional yang relevan dengan KPI FMCG Anda.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="#demos" className="btn-primary text-base px-8 py-4 shadow-xl shadow-brand-500/25">
                <Play className="w-5 h-5" />
                Explore Demos
              </a>
              <Link href="/admin" className="btn-secondary text-base px-8 py-4">
                <BarChart3 className="w-5 h-5" />
                Admin Panel
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
              {TRUST_BADGES.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-100 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{badge.label}</p>
                    <p className="text-xs text-gray-500">{badge.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Leads Generated", value: "2,847+", icon: Users, color: "text-brand-600" },
                { label: "Demo Completions", value: "1,523", icon: Play, color: "text-emerald-600" },
                { label: "Avg. Session", value: "4.2 min", icon: Clock, color: "text-violet-600" },
                { label: "Conversion Rate", value: "23%", icon: TrendingUp, color: "text-orange-600" },
              ].map((stat, i) => (
                <div key={i} className="card p-5 text-center">
                  <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
        </div>
      </section>

      {/* Demos Section */}
      <section id="demos" className="section-padding bg-white">
        <div className="container-width max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-simulation mb-4">SIMULASI INTERAKTIF</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              3 Demo yang Bisa Anda Coba
              <span className="gradient-text"> Sekarang</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Setiap demo adalah simulasi operasional lengkap — bukan fake UI. 
              Anda akan lihat apa yang terjadi di balik layar Jatis Mobile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_CARDS.map((demo, i) => (
              <div
                key={i}
                className={cn(
                  "card-interactive relative overflow-hidden group",
                  hoveredCard === i && "ring-2 ring-brand-300"
                )}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient accent */}
                <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", demo.gradient)} />
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br", demo.gradient, "shadow-lg")}>
                        {demo.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{demo.title}</h3>
                        <p className="text-xs text-gray-500">{demo.subtitle}</p>
                      </div>
                    </div>
                    <span className={cn("badge", i === 0 ? "badge-live" : "badge-simulation")}>
                      {demo.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {demo.description}
                  </p>

                  {/* KPIs */}
                  <div className="flex gap-4 mb-5 p-3 rounded-xl bg-gray-50">
                    {demo.kpis.map((kpi, j) => (
                      <div key={j}>
                        <p className={cn("text-lg font-bold", kpi.color)}>{kpi.value}</p>
                        <p className="text-xs text-gray-500">{kpi.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={demo.href}
                    className={cn(
                      "flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300",
                      "bg-gray-900 text-white hover:bg-gray-800",
                      "group-hover:shadow-lg"
                    )}
                  >
                    <Play className="w-4 h-4" />
                    Coba Demo
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-width max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-new mb-4">FITUR UNGGULAN</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Mengapa DemoHub
              <span className="gradient-text"> Berbeda</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Tidak ada demo lain yang memberikan pengalaman seinteraktif dan seabstrak ini.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="card p-6 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0", feature.color)}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-width max-w-4xl mx-auto">
          <div className="card p-8 md:p-16 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <Star className="w-12 h-12 text-brand-500 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Siap Coba?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                Pilih demo yang paling relevan dengan peran Anda, coba simulasi interaktif, 
                dan daftarkan diri untuk lanjut ke free trial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#demos" className="btn-primary text-base px-8 py-4 shadow-xl shadow-brand-500/25">
                  <Play className="w-5 h-5" />
                  Mulai Demo Sekarang
                </a>
                <Link href="/admin" className="btn-secondary text-base px-8 py-4">
                  <BarChart3 className="w-5 h-5" />
                  Masuk ke Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="container-width max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">GrowthAI DemoHub</p>
                <p className="text-xs text-gray-500">by Jatis Mobile</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              © 2026 Jatis Mobile. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
