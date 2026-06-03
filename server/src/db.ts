import { Deal, DealInput, Stage, STAGES } from "./types";

// In-memory store seeded at startup. The repository functions below are the
// single point of data access, so swapping in SQLite or Postgres later is a
// one-file change without touching the route layer.
let deals: Deal[] = [];
let nextId = 1;

function seed(): void {
  const sample: DealInput[] = [
    { name: "Exterior repaint", company: "Birch & Co", value: 8200, stage: "Lead", owner: "Youssef" },
    { name: "Office interior", company: "Northvale Realty", value: 15400, stage: "Contacted", owner: "Sam" },
    { name: "Condo common areas", company: "Riverside HOA", value: 23900, stage: "Quoted", owner: "Youssef" },
    { name: "Warehouse coating", company: "Lansing Logistics", value: 41000, stage: "Quoted", owner: "Priya" },
    { name: "Townhouse exterior", company: "Maple Grove Dev", value: 12750, stage: "Won", owner: "Sam" },
    { name: "Retail storefront", company: "Glebe Goods", value: 6800, stage: "Won", owner: "Youssef" },
    { name: "School gym", company: "OCDSB", value: 33500, stage: "Lost", owner: "Priya" },
  ];
  deals = sample.map((d) => ({ ...d, id: nextId++, createdAt: new Date().toISOString() }));
}
seed();

export function listDeals(): Deal[] {
  return [...deals].sort((a, b) => a.id - b.id);
}

export function getDeal(id: number): Deal | undefined {
  return deals.find((d) => d.id === id);
}

export function createDeal(input: DealInput): Deal {
  const deal: Deal = { ...input, id: nextId++, createdAt: new Date().toISOString() };
  deals.push(deal);
  return deal;
}

export function updateDeal(id: number, patch: Partial<DealInput>): Deal | undefined {
  const deal = getDeal(id);
  if (!deal) return undefined;
  Object.assign(deal, patch);
  return deal;
}

export function deleteDeal(id: number): boolean {
  const before = deals.length;
  deals = deals.filter((d) => d.id !== id);
  return deals.length < before;
}

export function stats() {
  const isOpen = (s: Stage) => s !== "Won" && s !== "Lost";
  const openValue = deals.filter((d) => isOpen(d.stage)).reduce((sum, d) => sum + d.value, 0);
  const wonValue = deals.filter((d) => d.stage === "Won").reduce((sum, d) => sum + d.value, 0);
  const wonCount = deals.filter((d) => d.stage === "Won").length;
  const lostCount = deals.filter((d) => d.stage === "Lost").length;
  const closed = wonCount + lostCount;
  const winRate = closed === 0 ? 0 : Math.round((wonCount / closed) * 100);

  const byStage = STAGES.map((stage) => {
    const inStage = deals.filter((d) => d.stage === stage);
    return {
      stage,
      count: inStage.length,
      value: inStage.reduce((sum, d) => sum + d.value, 0),
    };
  });

  return { totalDeals: deals.length, openValue, wonValue, winRate, byStage };
}
