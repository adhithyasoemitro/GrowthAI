"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertCircle, Shield, MessageSquare, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const USER_INTENTS = [
  { id: "consumer_engagement", label: "Consumer Engagement", icon: "👥", desc: "Loyalty, onboarding, CS" },
  { id: "distributor_operations", label: "Distributor Operations", icon: "🏭", desc: "Stock alert, order confirmation" },
  { id: "customer_service", label: "Customer Service", icon: "💬", desc: "Omnichannel, AI chatbot" },
  { id: "trade_promotion", label: "Trade Promotion", icon: "🎁", desc: "Promo broadcast, campaigns" },
  { id: "order_management", label: "Order Management", icon: "📦", desc: "Chat commerce, tracking" },
  { id: "payment_collection", label: "Payment Collection", icon: "💳", desc: "RoboCall reminder" },
];

const VOLUME_RANGES = [
  { value: "1k_10k", label: "1K - 10K pesan/bulan" },
  { value: "10k_50k", label: "10K - 50K pesan/bulan" },
  { value: "50k_100k", label: "50K - 100K pesan/bulan" },
  { value: "100k_500k", label: "100K - 500K pesan/bulan" },
  { value: "500k_plus", label: "500K+ pesan/bulan" },
];

const FOLLOWUP_PREFS = [
  { value: "schedule_demo", label: "Jadwalkan Demo dengan Sales" },
  { value: "free_trial", label: "Akses Free Trial Sandbox" },
  { value: "sales_call", label: "Hubungi Sales untuk Konsultasi" },
  { value: "documentation", label: "Kirim Dokumentasi Produk" },
];

export default function LeadsPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    company: "",
    position: "",
    useCase: "",
    volumeRange: "",
    followUpPref: "",
    consent: false,
  });

  const updateForm = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const canProceed = () => {
    if (step === 1) return form.name.length >= 2 && form.email.includes("@") && form.whatsapp.length >= 8;
    if (step === 2) return form.company.length >= 2 && form.position.length >= 2;
    if (step === 3) return form.useCase && form.volumeRange && form.followUpPref;
    if (step === 4) return form.consent;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
          company: form.company,
          position: form.position,
          useCase: form.useCase,
          volumeRange: form.volumeRange,
          followUpPref: form.followUpPref,
          consentGiven: form.consent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Error ${res.status}: Registration failed`);
      }

      // For demo purposes, redirect to confirmation even without real database
      router.push("/confirmation");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} dari 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Personal</h2>
            <p className="text-gray-500 mb-6">Masukkan informasi kontak Anda</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Bisnis *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => updateForm("whatsapp", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="input-field"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed()}
              className={cn("w-full btn-primary mt-6", !canProceed() && "opacity-50 cursor-not-allowed")}
            >
              Lanjutkan
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Company Info */}
        {step === 2 && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Perusahaan</h2>
            <p className="text-gray-500 mb-6">Informasi tentang perusahaan Anda</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Perusahaan *</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  placeholder="PT Nama Perusahaan"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jabatan/Posisi *</label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => updateForm("position", e.target.value)}
                  placeholder="cth: Head of Digital Marketing"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceed()}
                className={cn("btn-primary flex-1", !canProceed() && "opacity-50 cursor-not-allowed")}
              >
                Lanjutkan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Use Case */}
        {step === 3 && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pilih Use Case</h2>
            <p className="text-gray-500 mb-6">Use case mana yang paling relevan dengan operasional Anda?</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {USER_INTENTS.map((intent) => (
                <button
                  key={intent.id}
                  onClick={() => updateForm("useCase", intent.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    form.useCase === intent.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="text-2xl mb-2 block">{intent.icon}</span>
                  <p className="font-semibold text-gray-900 text-sm">{intent.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{intent.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                Kembali
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceed()}
                className={cn("btn-primary flex-1", !canProceed() && "opacity-50 cursor-not-allowed")}
              >
                Lanjutkan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Volume & Follow Up */}
        {step === 4 && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Volume & Preferensi</h2>
            <p className="text-gray-500 mb-6">Estimasi volume messaging dan preferensi follow-up</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Volume Messaging per Bulan</label>
                <select
                  value={form.volumeRange}
                  onChange={(e) => updateForm("volumeRange", e.target.value)}
                  className="input-field"
                >
                  <option value="">Pilih volume...</option>
                  {VOLUME_RANGES.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferensi Follow-up</label>
                <select
                  value={form.followUpPref}
                  onChange={(e) => updateForm("followUpPref", e.target.value)}
                  className="input-field"
                >
                  <option value="">Pilih preferensi...</option>
                  {FOLLOWUP_PREFS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1">
                Kembali
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!canProceed()}
                className={cn("btn-primary flex-1", !canProceed() && "opacity-50 cursor-not-allowed")}
              >
                Lanjutkan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Consent */}
        {step === 5 && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Consent & Privacy</h2>
            <p className="text-gray-500 mb-6">Setuju dengan syarat dan ketentuan</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
              <p className="text-sm text-gray-600 mb-4">
                Dengan mencentang box di bawah, Anda menyetujui:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Data yang Anda berikan akan diproses oleh Jatis Mobile untuk follow-up sales.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Jatis Mobile dapat menghubungi Anda via WhatsApp, email, atau telepon.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Data tidak akan dibagikan ke pihak ketiga tanpa persetujuan Anda.
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => updateForm("consent", e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-600">
                Saya menyetujui syarat dan ketentuan serta kebijakan privasi Jatis Mobile *
              </span>
            </label>

            <div className="flex gap-3">
              <button onClick={() => setStep(4)} className="btn-secondary flex-1">
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className={cn("btn-primary flex-1", (!canProceed() || loading) && "opacity-50 cursor-not-allowed")}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    Daftar Sekarang
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
