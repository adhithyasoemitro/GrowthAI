"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Shield, MessageSquare, Zap, AlertCircle } from "lucide-react";
import { Button, Badge, ProgressBar } from "@/components/ui/Button";
import { USER_INTENTS, USE_CASE_LABELS, VOLUME_LABELS, FOLLOWUP_LABELS } from "@/types";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/lib/analytics-context";
import { leadRegistrationSchema, type LeadRegistration } from "@/lib/validations";

type FormStep = "intent" | "personal" | "company" | "consent" | "otp" | "success";

export function RegistrationForm() {
  const { track, identify } = useAnalytics();
  const [step, setStep] = useState<FormStep>("intent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    email: "",
    whatsapp: "",
    useCase: "",
    volumeRange: "",
    followUpPref: "",
    consentGiven: false,
  });
  const [demoHistory, setDemoHistory] = useState<string[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);

  useEffect(() => {
    const demos = JSON.parse(sessionStorage.getItem("growthai_demo_history") || "[]");
    setDemoHistory(demos);
  }, []);

  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  const updateForm = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const canProceed = () => {
    if (step === "intent") return formData.useCase && formData.volumeRange && formData.followUpPref;
    if (step === "personal") return formData.name.length >= 2 && formData.email.includes("@");
    if (step === "company") return formData.position && formData.company;
    if (step === "consent") return formData.consentGiven;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const validated = leadRegistrationSchema.parse({
        ...formData,
        demoHistory,
        trafficSource: new URLSearchParams(window.location.search).get("utm_source") || "direct",
        utmParams: Object.fromEntries(new URLSearchParams(window.location.search)),
      });

      // Create lead
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      const { leadId, correlationId } = await res.json();
      
      // Send OTP
      const otpRes = await fetch("/api/auth/otp-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.whatsapp, correlationId }),
      });

      if (!otpRes.ok) throw new Error("Gagal mengirim OTP");

      setOtpSent(true);
      setOtpTimer(300);
      track("otp_sent", { leadId });
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      setError("Kode OTP harus 6 digit");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.whatsapp,
          otpCode,
          correlationId: "pending",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.attempts !== undefined) setOtpAttempts(data.attempts);
        throw new Error(data.message || "Kode OTP tidak valid");
      }

      track("lead_verified", { leadId: "verified" });
      identify(formData.email, {
        name: formData.name,
        company: formData.company,
        useCase: formData.useCase,
      });

      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verifikasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (otpTimer > 0) return;
    setLoading(true);
    try {
      await fetch("/api/auth/otp-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.whatsapp }),
      });
      setOtpTimer(300);
      setOtpCode("");
      setError("");
      track("otp_resent", {});
    } catch {
      setError("Gagal mengirim ulang OTP");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["intent", "personal", "company", "consent", "otp", "success"];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen py-12 section-padding">
      <div className="container-width max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            <span>Step {currentIndex + 1} dari {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} color="bg-gradient-to-r from-brand-500 to-fmcg-orange" />
        </div>

        {/* Back */}
        {step !== "success" && (
          <Link href="/demos" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kembali ke Demo</span>
          </Link>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p className="text-sm text-rose-400">{error}</p>
          </motion.div>
        )}

        {/* Step: Intent */}
        {step === "intent" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pilih Use Case Anda</h2>
                <p className="text-sm text-white/40">Use case mana yang paling relevan dengan operasional Anda?</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {USER_INTENTS.map((intent) => (
                <button
                  key={intent.id}
                  onClick={() => updateForm("useCase", intent.id)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    formData.useCase === intent.id
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-white/10 bg-dark-700/50 hover:border-white/20"
                  )}
                >
                  <span className="text-xl mb-2 block">{intent.icon}</span>
                  <p className="font-medium text-white text-sm">{intent.label}</p>
                </button>
              ))}
            </div>

            {/* Volume Range */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">Volume Messaging per Bulan</label>
              <select
                value={formData.volumeRange}
                onChange={(e) => updateForm("volumeRange", e.target.value)}
                className="input-field"
              >
                <option value="">Pilih volume...</option>
                {Object.entries(VOLUME_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Follow Up Preference */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">Preferensi Follow-up</label>
              <select
                value={formData.followUpPref}
                onChange={(e) => updateForm("followUpPref", e.target.value)}
                className="input-field"
              >
                <option value="">Pilih preferensi...</option>
                {Object.entries(FOLLOWUP_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <Button
              className="w-full"
              onClick={() => setStep("personal")}
              disabled={!canProceed()}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Lanjutkan
            </Button>
          </motion.div>
        )}

        {/* Step: Personal */}
        {step === "personal" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Data Personal</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Email Bisnis *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => updateForm("whatsapp", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="input-field"
                />
                <p className="text-xs text-white/30 mt-1">OTP verifikasi akan dikirim ke nomor ini</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("intent")} className="flex-1">
                Kembali
              </Button>
              <Button onClick={() => setStep("company")} disabled={!canProceed()} className="flex-1" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Lanjutkan
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: Company */}
        {step === "company" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Data Perusahaan</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Jabatan/Posisi *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => updateForm("position", e.target.value)}
                  placeholder="cth: Head of Digital Marketing"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Nama Perusahaan *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  placeholder="Masukkan nama perusahaan"
                  className="input-field"
                />
              </div>
            </div>

            {/* Demo History */}
            {demoHistory.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
                <p className="text-sm text-brand-400 font-medium mb-2">Demo yang telah Anda coba:</p>
                <div className="flex flex-wrap gap-2">
                  {demoHistory.map((d) => (
                    <Badge key={d} variant="live">{d.replace("_", " ")}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("personal")} className="flex-1">
                Kembali
              </Button>
              <Button onClick={() => setStep("consent")} disabled={!canProceed()} className="flex-1" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Lanjutkan
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: Consent */}
        {step === "consent" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Consent & Privacy</h2>

            <div className="p-4 rounded-xl bg-dark-700/50 mb-6 max-h-48 overflow-y-auto scrollbar-dark">
              <p className="text-sm text-white/60 mb-4">
                Dengan mencentang box di bawah, Anda menyetujui hal-hal berikut:
              </p>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Data yang Anda berikan akan diproses oleh Jatis Mobile untuk keperluan follow-up sales.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Nomor WhatsApp Anda akan diverifikasi via OTP sebelum lead dikirim ke sales team.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Jatis Mobile dapat menghubungi Anda melalui WhatsApp, email, atau telepon.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Data tidak akan dibagikan ke pihak ketiga tanpa persetujuan Anda.
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={formData.consentGiven}
                onChange={(e) => updateForm("consentGiven", e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-white/20 bg-dark-700 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm text-white/60">
                Saya menyetujui syarat dan ketentuan serta kebijakan privasi Jatis Mobile. *
              </span>
            </label>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("company")} className="flex-1">
                Kembali
              </Button>
              <Button onClick={handleSubmit} disabled={!canProceed() || loading} className="flex-1" icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}>
                {loading ? "Mengirim..." : "Daftar & Verifikasi OTP"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-brand-400" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Verifikasi WhatsApp</h2>
            <p className="text-white/50 text-sm mb-6">
              Kode OTP telah dikirim ke <span className="text-white">{formData.whatsapp}</span>
            </p>

            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Masukkan 6 digit OTP"
              className="input-field text-center text-2xl tracking-widest mb-4"
              maxLength={6}
            />

            <p className="text-xs text-white/30 mb-4">
              {otpTimer > 0 ? (
                <>Kirim ulang dalam <span className="text-brand-400">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, "0")}</span></>
              ) : (
                <button onClick={resendOTP} disabled={loading} className="text-brand-400 hover:underline">
                  Kirim ulang OTP
                </button>
              )}
            </p>

            {otpAttempts > 0 && (
              <p className="text-xs text-amber-400 mb-4">
                {3 - otpAttempts} percobaan tersisa
              </p>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("consent")} className="flex-1">
                Kembali
              </Button>
              <Button onClick={handleVerifyOTP} disabled={otpCode.length !== 6 || loading} className="flex-1" icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}>
                {loading ? "Memverifikasi..." : "Verifikasi"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-white/50 mb-6">
              Lead Anda telah tercatat di sistem. Sales team kami akan menghubungi Anda dalam 1x24 jam kerja.
            </p>

            <div className="bg-dark-700/50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-white/40 mb-2">Ringkasan:</p>
              <ul className="space-y-1 text-sm">
                <li><span className="text-white/60">Nama:</span> <span className="text-white">{formData.name}</span></li>
                <li><span className="text-white/60">Perusahaan:</span> <span className="text-white">{formData.company}</span></li>
                <li><span className="text-white/60">Use Case:</span> <span className="text-white">{USE_CASE_LABELS[formData.useCase as keyof typeof USE_CASE_LABELS] || formData.useCase}</span></li>
                <li><span className="text-white/60">Volume:</span> <span className="text-white">{VOLUME_LABELS[formData.volumeRange]}</span></li>
              </ul>
            </div>

            <Link href="/">
              <Button className="w-full" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Kembali ke Home
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
