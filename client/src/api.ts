import type { Deal, DealInput, Stats } from "./types";

// Same-origin in production; dev requests are proxied by Vite to the API.
const BASE = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  listDeals: () => request<Deal[]>("/deals"),
  getStats: () => request<Stats>("/deals/stats"),
  createDeal: (input: DealInput) => request<Deal>("/deals", { method: "POST", body: JSON.stringify(input) }),
  updateDeal: (id: number, patch: Partial<DealInput>) =>
    request<Deal>(`/deals/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteDeal: (id: number) => request<void>(`/deals/${id}`, { method: "DELETE" }),
};
