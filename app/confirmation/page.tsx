"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, MessageSquare, Calendar, ArrowRight, Clock } from "lucide-react";
import { Button, Badge } from "@/components/ui/Button";

export default function ConfirmationPage() {
  useEffect(() => {
    const demos = sessionStorage.getItem("growthai_demo_history");
    if (demos) {
      sessionStorage.removeItem("growthai_demo_history");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center section-padding">
      <div className="absolute inset-0 hero-pattern grid-bg opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl"
      >
        <div className="glass-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-2">Pendaftaran Berhasil!</h1>
          <p className="text-white/50 mb-8">
            Terima kasih telah mendaftar. Sales team kami akan menghubungi Anda segera.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-dark-700/50 rounded-xl p-4 text-left">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-brand-400" />
                <span className="font-medium text-white">WhatsApp</span>
              </div>
              <p className="text-sm text-white/50">
                Anda akan menerima konfirmasi via WhatsApp dalam beberapa menit.
              </p>
            </div>
            <div className="bg-dark-700/50 rounded-xl p-4 text-left">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="font-medium text-white">Response Time</span>
              </div>
              <p className="text-sm text-white/50">
                Sales akan menghubungi dalam 1x24 jam kerja.
              </p>
            </div>
          </div>

          <div className="bg-brand-500/5 border border-brand-500/10 rounded-xl p-4 mb-8 text-left">
            <h3 className="font-semibold text-white mb-2">Apa selanjutnya?</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">1.</span>
                Cek WhatsApp untuk konfirmasi pendaftaran
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">2.</span>
                Sales team akan menghubungi untuk scheduling demo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">3.</span>
                Dapatkan akses sandbox untuk mencoba secara langsung
              </li>
            </ul>
          </div>

          <Link href="/">
            <Button className="w-full" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              Kembali ke Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
