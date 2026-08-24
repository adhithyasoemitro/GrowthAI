"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Pause, Play, RotateCcw, Clock, CheckCircle, AlertCircle, ArrowRight, User, Building, CreditCard, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallLog {
  id: string;
  customer: string;
  company: string;
  amount: string;
  status: "connected" | "no_answer" | "busy" | "failed";
  duration: number;
  outcome: "promised" | "pending" | "refused" | "callback";
  time: string;
}

const MOCK_LOGS: CallLog[] = [
  { id: "1", customer: "Budi Santoso", company: "PT Indomaret", amount: "Rp 15.500.000", status: "connected", duration: 142, outcome: "promised", time: "09:30" },
  { id: "2", customer: "Siti Rahayu", company: "PT Alfamart", amount: "Rp 8.750.000", status: "connected", duration: 98, outcome: "pending", time: "09:45" },
  { id: "3", customer: "Ahmad Wijaya", company: "PT Hero", amount: "Rp 22.100.000", status: "no_answer", duration: 0, outcome: "callback", time: "10:00" },
  { id: "4", customer: "Dewi Kusuma", company: "PT Giant", amount: "Rp 5.200.000", status: "busy", duration: 0, outcome: "callback", time: "10:15" },
  { id: "5", customer: "Rudi Hermawan", company: "PT Transmart", amount: "Rp 18.900.000", status: "connected", duration: 187, outcome: "promised", time: "10:30" },
];

const SCRIPT_STEPS = [
  { speaker: "bot", text: "Halo, saya Aiko dari Jatis Mobile. Saya menghubungi untuk mengingatkan tagihan PT Hero sebanyak Rp 22.100.000 yang sudah jatuh tempo. Apakah Bapak Ahmad Wijaya tersedia?" },
  { speaker: "user", text: "[Jawab]", delay: 1000 },
  { speaker: "bot", text: "Baik Bapak. Tagihan tersebut sudah 30 hari overdue. Apakah ada kendala dalam proses pembayarannya?" },
  { speaker: "user", text: "[Jawab]", delay: 1000 },
  { speaker: "bot", text: "Kami menawarkan cicilan 3x tanpa bunga. Apakah Bapak bersedia安排了 jadwal pembayaran?" },
  { speaker: "user", text: "[Konfirmasi / Tolak]", delay: 1000 },
  { speaker: "bot", text: "Baik terima kasih. Konfirmasi pembayaran akan dikirim via WhatsApp. Mohon tunggu pesan berikutnya." },
];

export default function RoboCallDemo() {
  const [callState, setCallState] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (callState === "connected") {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [callState]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const startCall = () => {
    setCallState("calling");
    setTimer(0);
    setCurrentStep(0);
    setTimeout(() => {
      setCallState("connected");
    }, 3000);
  };

  const endCall = () => {
    setCallState("ended");
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const nextStep = () => {
    if (currentStep < SCRIPT_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      endCall();
    }
  };

  const resetCall = () => {
    setCallState("idle");
    setCurrentStep(0);
    setTimer(0);
  };

  const stats = {
    total: logs.length,
    connected: logs.filter(l => l.status === "connected").length,
    collectionRate: 65,
    promisedAmount: logs.filter(l => l.outcome === "promised").reduce((sum, l) => sum + 22.1, 0),
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-800 border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">RoboCall Demo</p>
                <p className="text-xs text-orange-400">AI Voice Agent • Payment Reminder</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-dark-800/50 border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-white/40">Total: <span className="text-white font-semibold">{stats.total}</span></span>
              <span className="text-white/40">Connected: <span className="text-emerald-400 font-semibold">{stats.connected}</span></span>
              <span className="text-white/40">Collection: <span className="text-orange-400 font-semibold">{stats.collectionRate}%</span></span>
            </div>
            <span className="text-white/40">Promise: <span className="text-emerald-400 font-semibold">Rp {(stats.promisedAmount).toFixed(1)}jt</span></span>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto p-4">
        {/* Call UI */}
        {callState !== "ended" ? (
          <div className="glass-card p-6 mb-6">
            {/* Caller ID */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 mx-auto flex items-center justify-center mb-4 animate-pulse">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">{callState === "calling" ? "Memanggil..." : callState === "connected" ? "RoboCall Aktif" : "RoboCall Demo"}</h2>
              <p className="text-white/50 text-sm mt-1">
                {callState === "calling" ? "+62 811-2345-6789" : callState === "connected" ? `Ahmad Wijaya • PT Hero • ${formatTime(timer)}` : "Klik tombol untuk memulai demo"}
              </p>
              {callState === "calling" && <div className="mt-2"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /><span className="text-xs text-emerald-400">Merangkai panggilan...</span></div></div>}
            </div>

            {/* Script */}
            {callState === "connected" && (
              <div className="bg-dark-700 rounded-xl p-4 mb-4 max-h-64 overflow-y-auto">
                <p className="text-xs text-white/40 mb-3 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Script Conversation</p>
                {SCRIPT_STEPS.slice(0, currentStep + 1).map((step, i) => (
                  <div key={i} className={cn("mb-3 last:mb-0", step.speaker === "user" && "text-right")}>
                    <div className={cn("inline-block max-w-[90%] px-3 py-2 rounded-xl text-sm", step.speaker === "bot" ? "bg-dark-600 text-white/80" : "bg-brand-500/80 text-white")}>
                      <span className={cn("text-xs font-medium mr-1", step.speaker === "bot" ? "text-orange-400" : "text-emerald-300")}>{step.speaker === "bot" ? "🤖 Aiko" : "👤 User"}</span>
                      {step.text}
                    </div>
                  </div>
                ))}
                {currentStep < SCRIPT_STEPS.length - 1 && SCRIPT_STEPS[currentStep + 1].speaker === "user" && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-white/40 text-center mb-2">Langkah berikutnya:</p>
                    <button onClick={nextStep} className="w-full py-2 rounded-lg bg-dark-600 text-sm text-white/70 hover:bg-dark-500 transition-colors">
                      Lanjut ke "{SCRIPT_STEPS[currentStep + 1].text.replace("[", "").replace("]", "")}"
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {callState === "idle" && (
                <button onClick={startCall} className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform">
                  <Phone className="w-7 h-7 text-white" />
                </button>
              )}
              {callState === "calling" && (
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-amber-500 animate-ping" />
                </div>
              )}
              {callState === "connected" && (
                <>
                  <button onClick={() => setMuted(m => !m)} className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", muted ? "bg-red-500/20 border border-red-500 text-red-400" : "bg-dark-600 text-white/60 hover:bg-dark-500")}>
                    {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button onClick={endCall} className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-105 transition-transform">
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>
                  <button onClick={() => setSpeakerOn(s => !s)} className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", speakerOn ? "bg-dark-600 text-white/60 hover:bg-dark-500" : "bg-amber-500/20 border border-amber-500 text-amber-400")}>
                    {speakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>

            {/* Timer */}
            {callState === "connected" && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-lg font-mono text-white">{formatTime(timer)}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Ended State */
          <div className="glass-card p-6 mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-emerald-400">Panggilan Selesai</h2>
            <p className="text-white/50 text-sm mt-2">Demo RoboCall selesai. Data tidak disimpan.</p>
            <button onClick={resetCall} className="mt-4 px-6 py-2 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-400 transition-colors inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />Demo Ulang
            </button>
          </div>
        )}

        {/* Call Logs */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="font-semibold text-sm">📞 Riwayat Panggilan (Demo)</h3>
          </div>
          <div className="divide-y divide-white/5">
            {logs.map(log => (
              <div key={log.id} className="p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", log.status === "connected" ? "bg-emerald-500/10" : log.status === "no_answer" ? "bg-amber-500/10" : "bg-red-500/10")}>
                  {log.status === "connected" ? <Phone className="w-4 h-4 text-emerald-400" /> : log.status === "no_answer" ? <AlertCircle className="w-4 h-4 text-amber-400" /> : <PhoneOff className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{log.customer}</p>
                  <p className="text-xs text-white/40 truncate">{log.company} • {log.amount}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={cn("text-xs px-2 py-0.5 rounded-full inline-block mb-1", log.outcome === "promised" ? "bg-emerald-500/10 text-emerald-400" : log.outcome === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400")}>
                    {log.outcome === "promised" ? "💰 Promised" : log.outcome === "pending" ? "⏳ Pending" : "📞 Callback"}
                  </div>
                  <p className="text-xs text-white/30">{log.status === "connected" ? formatTime(log.duration) : log.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
          <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Tentang Demo</h4>
          <ul className="text-xs text-white/50 space-y-1">
            <li>• RoboCall menggunakan AI voice agent dengan script conversation</li>
            <li>• IVR menu: Reminder → Konfirmasi → Janji Bayar → Escalation</li>
            <li>• Koneksi ke WhatsApp jika customer ingin chat lebih lanjut</li>
            <li>• Tidak ada panggilan nyata dalam demo ini</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
