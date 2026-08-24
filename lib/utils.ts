import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  const visible = phone.slice(-4);
  const masked = "*".repeat(phone.length - 6);
  const prefix = phone.slice(0, 2);
  return `${prefix}${masked}${visible}`;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  const masked = "*".repeat(Math.max(user.length - 2, 3));
  return `${visible}${masked}@${domain}`;
}

export function formatDate(date: string | Date, locale = "id-ID"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export function formatCurrency(amount: number, currency = "IDR"): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashPhone(phone: string): string {
  let hash = 0;
  for (let i = 0; i < phone.length; i++) {
    const char = phone.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDate(date);
}

export function getStatusColor(status: string): { text: string; bg: string; border: string } {
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    new: { text: "text-brand-400", bg: "bg-brand-500/10", border: "border-brand-500/20" },
    contacted: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    qualified: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    converted: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    lost: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    pending: { text: "text-white/60", bg: "bg-white/5", border: "border-white/10" },
    contacted_lead: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    meeting_booked: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    qualified_opportunity: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    disqualified: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    nurture: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  };
  return colors[status] ?? colors.new;
}

export function getDispositionLabel(disposition: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    contacted: "Sudah Dihubungi",
    meeting_booked: "Meeting Terjadwal",
    qualified_opportunity: "Qualified Opportunity",
    disqualified: "Disqualified",
    nurture: "Nurture",
  };
  return labels[disposition] ?? disposition;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: "Baru",
    contacted: "Sudah Dihubungi",
    qualified: "Qualified",
    converted: "Konversi",
    lost: "Lost",
  };
  return labels[status] ?? status;
}

export function getIntentColor(intent: string): string {
  const colors: Record<string, string> = {
    high: "text-emerald-400 bg-emerald-500/10",
    medium: "text-amber-400 bg-amber-500/10",
    low: "text-rose-400 bg-rose-500/10",
  };
  return colors[intent] ?? colors.medium;
}

export function getUseCaseLabel(useCase: string): string {
  const labels: Record<string, string> = {
    consumer_engagement: "Engagement Konsumen",
    distributor_operations: "Operasi Distributor",
    customer_service: "Customer Service",
    trade_promotion: "Trade Promotion",
    order_management: "Manajemen Pesanan",
    payment_collection: "Penagihan",
    loyalty_program: "Program Loyalty",
    other: "Lainnya",
  };
  return labels[useCase] ?? useCase;
}

export function getVolumeLabel(volume: string): string {
  const labels: Record<string, string> = {
    "1k_10k": "1K - 10K/bulan",
    "10k_50k": "10K - 50K/bulan",
    "50k_100k": "50K - 100K/bulan",
    "100k_500k": "100K - 500K/bulan",
    "500k_plus": "500K+/bulan",
    not_sure: "Belum pasti",
  };
  return labels[volume] ?? volume;
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
