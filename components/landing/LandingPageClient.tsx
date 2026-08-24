"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Bot, Phone, Zap, Shield, Users, TrendingUp, CheckCircle, ChevronDown, Play, ArrowRight, Star, BarChart3, Layers, Activity, ArrowUpRight } from "lucide-react";
import { Button, Badge } from "@/components/ui/Button";
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios";
import { cn } from "@/lib/utils";

const TECH_CREDENTIALS = [
  { label: "ISO 9001:2015", desc: "Quality Management" },
  { label: "500+ Klien", desc: "Enterprise Clients" },
  { label: "100M+ Pesan", desc: "Messages/month" },
  { label: "99.9% Uptime", desc: "SLA Guarantee" },
];

const STATS = [
  { label: "Leads Generated", value: "2,847", suffix: "+", icon: Users },
  { label: "Demo Completions", value: "1,523", suffix: "", icon: Play },
  { label: "Avg. Session", value: "4.2", suffix: "min", icon: Activity },
  { label: "Conversion Rate", value: "23", suffix: "%", icon: TrendingUp },
];

const FMCG_PROBLEMS = [
  {
    icon: "🏭",
    title: "Fragmentasi Channel",
    desc: "Distributor, retailer, sales force, dan konsumen akhir — semua pakai channel berbeda. Tidak ada satu platform yang menyatukan semuanya.",
    impact: "30% waktu CS dihabiskan untuk routing antar-channel",
  },
  {
    icon: "📊",
    title: "Blind Spots di Data",
    desc: "Order masuk dari WhatsApp, email, telepon, dan portal — tidak ada konsolidasi real-time.",
    impact: "15% pesanan distributor gagal karena stock mismatch",
  },
  {
    icon: "🤝",
    title: "Sales Cycle Panjang",
    desc: "Sebelum ada demo interaktif, C-level harus jadwal meeting dulu untuk memahami value.",
    impact: "40% prospect cold sebelum sales bisa jelaskan produk",
  },
  {
    icon: "📱",
    title: "Consumer Engagement",
    desc: "Konsumen akhir sulit direach untuk loyalty program dan promo.",
    impact: "60% consumer promo tidak sampai ke target segment",
  },
];

const WHY_DEMOHUB = [
  { title: "Demo Interaktif Real-Time", desc: "Bukan slideshow. Visitor memilih persona dan role, lalu simulasi berjalan seolah-olah mereka sedang menggunakan Jatis Mobile.", icon: Layers, color: "text-brand-400 bg-brand-500/10 border-brand-500/20" },
  { title: "Simulasi Tanpa Risiko", desc: "Tidak ada data klien nyata, tidak ada broadcast nyata, tidak ada cost per message.", icon: Shield, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { title: "Lead Qualification Otomatis", desc: "Demo apa yang mereka coba, use case apa yang mereka pilih — semua jadi sinyal untuk lead scoring.", icon: BarChart3, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { title: "Verifikasi WhatsApp OTP", desc: "Nomor WhatsApp diverifikasi via OTP sebelum lead dikirim ke sales.", icon: MessageSquare, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
];

export function LandingPageClient() {
  const [activeProblem, setActiveProblem] = useState(0);
  const [visibleDemos, setVisibleDemos] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisibleDemos(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-pattern grid-bg" />
        
        <div className="relative z-10 section-padding container-width text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-sm font-medium text-brand-400">Interactive Demo Hub for FMCG</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Jatis FMCG</span>
            <br />
            <span className="text-white">DemoHub</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-4">
            "Try Before You Talk to Sales"
          </p>

          <p className="text-base text-white/40 max-w-2xl mx-auto mb-10">
            Erfahrung WhatsApp Business Platform, AI Chatbot, RoboCall, dan Enterprise Messaging 
            melalui simulasi operasional yang relevan dengan KPI FMCG Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/demos">
              <Button size="xl" className="w-full sm:w-auto" icon={<Play className="w-5 h-5" />}>
                Explore Demos
              </Button>
            </Link>
            <Link href="/leads">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                Register Now
              </Button>
            </Link>
          </div>

          {/* Tech Credentials */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-16">
            {TECH_CREDENTIALS.map((cred, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{cred.label}</p>
                  <p className="text-xs text-white/40">{cred.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STATS.map((stat, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <stat.icon className="w-6 h-6 text-brand-400 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                  <span className="text-brand-400 text-lg">{stat.suffix}</span>
                </p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-white/30 animate-bounce" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding relative">
        <div className="container-width">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">Pain Points</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text-warm">Masalah FMCG</span>
              <br />
              <span className="text-white">yang Jatis Mobile Selesaikan</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Channel komunikasi yang terfragmentasi bukan sekadar inconvenience — 
              ini直接影响 bottom line Anda.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {FMCG_PROBLEMS.map((problem, i) => (
                <div
                  key={i}
                  className={cn(
                    "glass-card p-6 cursor-pointer transition-all duration-300",
                    activeProblem === i ? "border-brand-500/30 shadow-glow-sm" : "hover:border-white/15"
                  )}
                  onClick={() => setActiveProblem(i)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{problem.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{problem.title}</h3>
                      <p className="text-sm text-white/50">{problem.desc}</p>
                      <div className={cn(
                        "mt-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 transition-all",
                        activeProblem === i ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"
                      )}>
                        <p className="text-xs text-rose-400">
                          <span className="font-semibold">Impact: </span>
                          {problem.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 border border-brand-500/20 flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{FMCG_PROBLEMS[activeProblem]?.title}</h3>
              <p className="text-white/50 text-sm mb-6">{FMCG_PROBLEMS[activeProblem]?.desc}</p>
              <div className="w-full p-4 rounded-xl bg-dark-700/50">
                <p className="text-sm text-rose-400 font-medium mb-2">💥 Business Impact</p>
                <p className="text-xs text-white/60">{FMCG_PROBLEMS[activeProblem]?.impact}</p>
              </div>
              <Link href="/demos" className="mt-6">
                <Button variant="accent" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Lihat Solusinya
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="section-padding relative bg-dark-800/50">
        <div className="container-width">
          <div className="text-center mb-16">
            <Badge variant="simulation" className="mb-4" dot>SIMULASI</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">3 Demo Interaktif</span>
              <br />
              <span className="gradient-text">yang Bisa Anda Coba Sekarang</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Setiap demo adalah simulasi operasional lengkap — bukan fake UI. 
              Anda akan lihat apa yang terjadi di balik layar Jatis Mobile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_SCENARIOS.map((demo, i) => (
              <div
                key={demo.id}
                className={cn(
                  "glass-card overflow-hidden group transition-all duration-500",
                  visibleDemos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={cn("h-2 bg-gradient-to-r", demo.gradient.replace("/20", ""))} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{demo.icon}</span>
                    <Badge variant="simulation">{demo.badge}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{demo.title}</h3>
                  <p className="text-sm text-white/40 mb-4">{demo.subtitle}</p>
                  
                  <div className="flex gap-4 mb-4">
                    {demo.kpis.slice(0, 2).map((kpi, j) => (
                      <div key={j}>
                        <p className="text-lg font-bold text-white">{kpi.value}
                          <span className="text-xs text-white/40 ml-0.5">{kpi.unit}</span>
                        </p>
                        <p className="text-xs text-white/40">{kpi.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {demo.integrations.slice(0, 3).map((int, j) => (
                      <span key={j} className="px-2 py-0.5 rounded text-xs bg-dark-600 text-white/50">
                        {int.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/demos/${demo.type}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full" icon={<Play className="w-3 h-3" />}>
                        Coba Demo
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">Detail</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/demos">
              <Button variant="secondary" size="lg" icon={<Layers className="w-5 h-5" />}>
                Lihat Semua Demo
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why DemoHub Section */}
      <section className="section-padding relative">
        <div className="container-width">
          <div className="text-center mb-16">
            <Badge variant="new" className="mb-4">Why DemoHub</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Mengapa</span>
              <span className="gradient-text"> DemoHub Berbeda</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Tidak ada demo lain yang memberikan pengalaman seinteraktif dan seabstrak ini.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {WHY_DEMOHUB.map((item, i) => (
              <div key={i} className="glass-card p-6 hover:border-white/15 transition-all group">
                <div className="flex gap-4">
                  <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0", item.color)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative">
        <div className="container-width">
          <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-16 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <Star className="w-12 h-12 text-brand-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Siap Coba?
              </h2>
              <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                Pilih demo yang paling relevan dengan peran Anda, coba simulasi interaktif, 
                dan daftarkan diri untuk lanjut ke free trial atau jadwalkan demo dengan sales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demos">
                  <Button size="xl" className="w-full sm:w-auto" icon={<Play className="w-5 h-5" />}>
                    Mulai Demo Sekarang
                  </Button>
                </Link>
                <Link href="/leads">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="container-width">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Jatis FMCG DemoHub</p>
                <p className="text-xs text-white/40">by Jatis Mobile</p>
              </div>
            </div>
            <p className="text-xs text-white/30">
              © 2026 Jatis Mobile. All rights reserved. — Interactive Demo Hub for FMCG Decision-Makers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
