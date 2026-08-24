"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Bot, Phone, Lock, Zap, ArrowRight, Clock, Users, TrendingUp } from "lucide-react";
import { Button, Badge, Tabs } from "@/components/ui/Button";
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/lib/analytics-context";

export function DemosList() {
  const { track } = useAnalytics();
  const [filter, setFilter] = useState("all");

  const demos = DEMO_SCENARIOS.map((demo) => ({
    ...demo,
    estimatedMinutes: demo.estimatedTime,
  }));

  return (
    <div className="section-padding">
      <div className="container-width">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kembali ke Home</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="simulation">SIMULASI</Badge>
            <Badge variant="default" className="text-xs">
              <Lock className="w-3 h-3 mr-1" />
              No Real Data
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Interactive <span className="gradient-text">Demo Hub</span>
          </h1>
          <p className="text-white/50 max-w-2xl">
            Pilih demo yang paling relevan dengan peran dan kebutuhan Anda. 
            Setiap simulasi berjalan dengan data operasional FMCG yang realistis — 
            tidak ada data klien nyata yang dipakai.
          </p>
        </motion.div>

        {/* Demo Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo, i) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden group hover:border-brand-500/30 transition-all duration-500"
            >
              <div className={cn("h-1.5", demo.gradient.replace("/20", ""))} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${demo.color}15`, border: `1px solid ${demo.color}30` }}>
                      <span className="text-2xl">{demo.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{demo.title}</h3>
                      <p className="text-xs text-white/40">{demo.subtitle}</p>
                    </div>
                  </div>
                  <Badge variant="simulation" className="text-[10px]">SIMULASI</Badge>
                </div>

                <p className="text-sm text-white/50 mb-5 line-clamp-2">{demo.description}</p>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {demo.kpis.map((kpi, j) => (
                    <div key={j} className="bg-dark-700/50 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-white">{kpi.value}
                        <span className="text-[10px] text-white/40 ml-0.5">{kpi.unit}</span>
                      </p>
                      <p className="text-[10px] text-white/40">{kpi.label}</p>
                    </div>
                  ))}
                </div>

                {/* Persona */}
                <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-dark-700/30">
                  <Users className="w-3 h-3 text-brand-400" />
                  <p className="text-xs text-white/50">
                    <span className="text-white/80 font-medium">{demo.persona}</span>
                    {" "}— {demo.personaPosition}
                  </p>
                </div>

                {/* Integrations */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {demo.integrations.map((int, j) => (
                    <span key={j} className="px-2 py-0.5 rounded text-[10px] bg-dark-600 text-white/40 border border-white/5">
                      {int.name}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-white/30 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{demo.estimatedMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {demo.steps.length - 2} steps
                  </span>
                </div>

                <Link href={`/demos/${demo.type}`} onClick={() => track("demo_selected", { demo_type: demo.type, demo_id: demo.id })}>
                  <Button className="w-full group-hover:shadow-glow-sm transition-all" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    {demo.ctaLabel}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 glass-card p-8 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-brand-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ingin tahu lebih banyak?</h3>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Setiap demo menampilkan layanan Jatis Mobile yang berbeda. 
            Setelah mencoba, daftarkan diri untuk akses free trial sandbox atau jadwalkan demo dengan sales.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/leads">
              <Button icon={<ArrowRight className="w-4 h-4" />} iconPosition="right" onClick={() => track("cta_click", { cta: "register_after_browsing_demos", location: "demos_page" })}>
                Daftar & Lanjutkan
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
