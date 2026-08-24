import Link from "next/link";
import { CheckCircle, MessageSquare, Clock, ArrowRight } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Pendaftaran Berhasil!</h1>
        <p className="text-gray-500 mb-8">
          Terima kasih telah mendaftar. Sales team kami akan menghubungi Anda segera.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              <span className="font-semibold text-gray-900">WhatsApp</span>
            </div>
            <p className="text-sm text-gray-500">
              Konfirmasi akan dikirim via WhatsApp dalam beberapa menit.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-gray-900">Response Time</span>
            </div>
            <p className="text-sm text-gray-500">
              Sales akan menghubungi dalam 1x24 jam kerja.
            </p>
          </div>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Apa selanjutnya?</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-brand-600 font-bold">1.</span>
              Cek WhatsApp untuk konfirmasi pendaftaran
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-600 font-bold">2.</span>
              Sales team akan menghubungi untuk scheduling demo
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-600 font-bold">3.</span>
              Dapatkan akses sandbox untuk mencoba secara langsung
            </li>
          </ol>
        </div>

        <Link href="/" className="btn-primary inline-flex">
          Kembali ke Home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
