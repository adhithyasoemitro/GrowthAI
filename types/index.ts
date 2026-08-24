export type DemoType = "whatsapp_chat" | "ai_chatbot" | "robocall" | "sms" | "email";

export interface DemoStep {
  id: string;
  type: "user_input" | "bot_response" | "system" | "integration" | "outcome";
  content: string;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface DemoScenario {
  id: string;
  type: DemoType;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
  gradient: string;
  badge: string;
  badgeColor: string;
  persona: string;
  personaPosition: string;
  kpis: { label: string; value: string; unit: string }[];
  integrations: { name: string; logo: string }[];
  steps: DemoStep[];
  services: { id: string; name: string; description: string }[];
  estimatedTime: number;
  ctaLabel: string;
  ctaLabelEn: string;
}

export interface DemoSession {
  id: string;
  sessionId: string;
  demoType: DemoType;
  currentStep: number;
  totalSteps: number;
  steps: DemoStep[];
  startedAt: Date;
  completedAt?: Date;
  outcome?: string;
  metadata?: Record<string, unknown>;
}

export interface Lead {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  whatsapp: string;
  useCase: string;
  volumeRange: string;
  followUpPref: string;
  demoHistory: string[];
  leadScore: number;
  scoreBreakdown: Record<string, number>;
  intent: "high" | "medium" | "low";
  status: string;
  disposition: string;
  otpVerified: boolean;
  createdAt: string;
  updatedAt: string;
  events?: Event[];
}

export interface Event {
  id: string;
  leadId: string;
  event: string;
  category: string;
  meta: Record<string, unknown>;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  avgLeadScore: number;
  demoCompletions: number;
  otpVerificationRate: number;
  conversionRate: number;
  topUseCases: { useCase: string; count: number }[];
  leadsByDay: { date: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
  trafficSources: { source: string; count: number }[];
}

export interface ChatMessage {
  id: string;
  type: "user" | "bot" | "system" | "integration";
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface RobocallState {
  status: "idle" | "dialing" | "ringing" | "connected" | "speaking" | "completed" | "failed";
  transcript: { speaker: "agent" | "recipient"; text: string; time: number }[];
  duration: number;
  outcome?: string;
}

export interface OTPSession {
  phone: string;
  correlationId: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

export type UserIntent = "consumer_engagement" | "distributor_operations" | "customer_service" | "trade_promotion" | "order_management" | "payment_collection" | "loyalty_program" | "other";

export const USER_INTENTS: { id: UserIntent; label: string; labelEn: string; icon: string; description: string }[] = [
  { id: "consumer_engagement", label: "Engagement Konsumen", labelEn: "Consumer Engagement", icon: "👥", description: "Loyalty, onboarding, customer service" },
  { id: "distributor_operations", label: "Operasi Distributor", labelEn: "Distributor Operations", icon: "🏭", description: "Stock alert, order confirmation, payment" },
  { id: "customer_service", label: "Customer Service", labelEn: "Customer Service", icon: "💬", description: "Omnichannel inbox, AI chatbot" },
  { id: "trade_promotion", label: "Trade Promotion", labelEn: "Trade Promotion", icon: "🎁", description: "Promo broadcast, discount campaigns" },
  { id: "order_management", label: "Manajemen Pesanan", labelEn: "Order Management", icon: "📦", description: "Chat commerce, order tracking" },
  { id: "payment_collection", label: "Penagihan", labelEn: "Payment Collection", icon: "💳", description: "RoboCall reminder, payment confirmation" },
  { id: "loyalty_program", label: "Program Loyalty", labelEn: "Loyalty Program", icon: "⭐", description: "Points, rewards, member management" },
  { id: "other", label: "Lainnya", labelEn: "Other", icon: "🔧", description: "Custom use case" },
];

export const USE_CASE_LABELS: Record<UserIntent, string> = {
  consumer_engagement: "Engagement Konsumen",
  distributor_operations: "Operasi Distributor & Retailer",
  customer_service: "Customer Service & Omnichannel",
  trade_promotion: "Trade Promotion & Campaign",
  order_management: "Manajemen Pesanan & Chat Commerce",
  payment_collection: "Penagihan & RoboCall",
  loyalty_program: "Program Loyalty & Rewards",
  other: "Use Case Lainnya",
};

export const VOLUME_LABELS: Record<string, string> = {
  "1k_10k": "1.000 - 10.000 pesan/bulan",
  "10k_50k": "10.000 - 50.000 pesan/bulan",
  "50k_100k": "50.000 - 100.000 pesan/bulan",
  "100k_500k": "100.000 - 500.000 pesan/bulan",
  "500k_plus": "500.000+ pesan/bulan",
  "not_sure": "Belum pasti",
};

export const FOLLOWUP_LABELS: Record<string, string> = {
  schedule_demo: "Jadwalkan Demo dengan Sales",
  free_trial: "Akses Free Trial Sandbox",
  sales_call: "Hubungi Sales untuk Konsultasi",
  documentation: "Kirim Dokumentasi Produk",
  pricing_quote: "Minta Penawaran Harga",
};
