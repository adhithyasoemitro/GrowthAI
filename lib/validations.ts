import { z } from "zod";

export const leadRegistrationSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  position: z.string().min(2, "Posisi minimal 2 karakter").max(100),
  company: z.string().min(2, "Perusahaan minimal 2 karakter").max(200),
  email: z.string().email("Format email tidak valid").max(200),
  whatsapp: z
    .string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Format nomor tidak valid"),
  useCase: z.enum([
    "consumer_engagement",
    "distributor_operations",
    "customer_service",
    "trade_promotion",
    "order_management",
    "payment_collection",
    "loyalty_program",
    "other",
  ]),
  volumeRange: z.enum([
    "1k_10k",
    "10k_50k",
    "50k_100k",
    "100k_500k",
    "500k_plus",
    "not_sure",
  ]),
  followUpPref: z.enum([
    "schedule_demo",
    "free_trial",
    "sales_call",
    "documentation",
    "pricing_quote",
  ]),
  demoHistory: z.array(z.string()).default([]),
  trafficSource: z.string().default("direct"),
  utmParams: z.record(z.string()).default({}),
  consentGiven: z.boolean().default(false),
});

export const otpRequestSchema = z.object({
  phone: z
    .string()
    .min(10, "Nomor terlalu pendek")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Format nomor tidak valid"),
  correlationId: z.string().optional(),
});

export const otpVerifySchema = z.object({
  phone: z.string().min(10).max(20),
  otpCode: z.string().length(6, "Kode OTP harus 6 digit"),
  correlationId: z.string(),
});

export const demoInputSchema = z.object({
  sessionId: z.string(),
  demoType: z.enum(["whatsapp_chat", "ai_chatbot", "robocall", "sms", "email"]),
  input: z.string().max(500).default(""),
  step: z.number().int().positive().default(1),
});

export const adminLeadUpdateSchema = z.object({
  leadId: z.string(),
  disposition: z.enum([
    "contacted",
    "meeting_booked",
    "qualified_opportunity",
    "disqualified",
    "nurture",
  ]).optional(),
  dispositionNote: z.string().max(500).optional(),
  assigneeId: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).optional(),
  intent: z.enum(["low", "medium", "high"]).optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LeadRegistration = z.infer<typeof leadRegistrationSchema>;
export type OTPRequest = z.infer<typeof otpRequestSchema>;
export type OTPVerify = z.infer<typeof otpVerifySchema>;
export type DemoInput = z.infer<typeof demoInputSchema>;
export type AdminLeadUpdate = z.infer<typeof adminLeadUpdateSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
