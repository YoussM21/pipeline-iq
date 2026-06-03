export const STAGES = ["Lead", "Contacted", "Quoted", "Won", "Lost"] as const;
export type Stage = (typeof STAGES)[number];

export interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  stage: Stage;
  owner: string;
  createdAt: string;
}

export type DealInput = Omit<Deal, "id" | "createdAt">;

export interface StageStat {
  stage: Stage;
  count: number;
  value: number;
}

export interface Stats {
  totalDeals: number;
  openValue: number;
  wonValue: number;
  winRate: number;
  byStage: StageStat[];
}
