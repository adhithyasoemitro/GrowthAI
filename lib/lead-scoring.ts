import { LeadRegistration } from "./validations";

export interface ScoreBreakdown {
  companySize: number;
  useCase: number;
  volume: number;
  position: number;
  demoCompletion: number;
  total: number;
}

const POSITION_WEIGHTS: Record<string, number> = {
  "ceo": 25,
  "cfo": 20,
  "cmo": 25,
  "cco": 20,
  "cto": 20,
  "chief": 25,
  "director": 18,
  "head": 15,
  "manager": 10,
  "supervisor": 5,
  "specialist": 3,
  "coordinator": 3,
  "associate": 2,
  "intern": 1,
};

const USECASE_WEIGHTS: Record<string, number> = {
  payment_collection: 30,
  order_management: 28,
  trade_promotion: 25,
  distributor_operations: 25,
  consumer_engagement: 22,
  loyalty_program: 20,
  customer_service: 18,
};

const VOLUME_WEIGHTS: Record<string, number> = {
  "500k_plus": 30,
  "100k_500k": 25,
  "50k_100k": 20,
  "10k_50k": 15,
  "1k_10k": 10,
  "not_sure": 5,
};

const COMPANY_SIZE_RANGES: Record<string, [number, number]> = {
  "500k_plus": [5001, Infinity],
  "100k_500k": [1001, 5000],
  "50k_100k": [501, 1000],
  "10k_50k": [51, 500],
  "1k_10k": [1, 50],
};

export function scorePosition(position: string): number {
  const lower = position.toLowerCase();
  for (const [key, weight] of Object.entries(POSITION_WEIGHTS)) {
    if (lower.includes(key)) return weight;
  }
  return 5;
}

export function scoreUseCase(useCase: string): number {
  return USECASE_WEIGHTS[useCase] ?? 15;
}

export function scoreVolume(volumeRange: string): number {
  return VOLUME_WEIGHTS[volumeRange] ?? 10;
}

export function calculateLeadScore(
  data: LeadRegistration & { demoHistory?: string[] }
): ScoreBreakdown {
  const position = scorePosition(data.position);
  const useCase = scoreUseCase(data.useCase);
  const volume = scoreVolume(data.volumeRange);
  
  const demoCount = (data.demoHistory || []).length;
  const demoCompletion = Math.min(demoCount * 10, 20);
  
  const companySize = Math.round((position + useCase + volume) / 15);
  
  const total = Math.min(
    companySize + useCase + volume + position + demoCompletion,
    100
  );

  return {
    companySize: Math.round(companySize),
    useCase,
    volume,
    position,
    demoCompletion,
    total,
  };
}

export function getLeadGrade(score: number): { grade: string; color: string; bgColor: string } {
  if (score >= 80) {
    return { grade: "A", color: "text-emerald-400", bgColor: "bg-emerald-500/10" };
  }
  if (score >= 60) {
    return { grade: "B", color: "text-brand-400", bgColor: "bg-brand-500/10" };
  }
  if (score >= 40) {
    return { grade: "C", color: "text-amber-400", bgColor: "bg-amber-500/10" };
  }
  return { grade: "D", color: "text-rose-400", bgColor: "bg-rose-500/10" };
}

export function getIntentLabel(intent: string): string {
  const labels: Record<string, string> = {
    high: "High Intent",
    medium: "Medium Intent",
    low: "Low Intent",
  };
  return labels[intent] ?? intent;
}

export function determineIntent(scoreBreakdown: ScoreBreakdown): "high" | "medium" | "low" {
  if (scoreBreakdown.total >= 70) return "high";
  if (scoreBreakdown.total >= 40) return "medium";
  return "low";
}
