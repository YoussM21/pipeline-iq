import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "../api";
import type { Deal, DealInput, Stats, Stage } from "../types";
import { STAGES } from "../types";

export const useDealsStore = defineStore("deals", () => {
  const deals = ref<Deal[]>([]);
  const stats = ref<Stats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const search = ref("");
  const ownerFilter = ref("");

  const owners = computed(() => [...new Set(deals.value.map((d) => d.owner))].sort());

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    const o = ownerFilter.value;
    return deals.value.filter((d) => {
      if (o && d.owner !== o) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.company.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q);
    });
  });

  const byStage = computed<Record<Stage, Deal[]>>(() => {
    const groups = Object.fromEntries(STAGES.map((s) => [s, [] as Deal[]])) as Record<Stage, Deal[]>;
    for (const d of filtered.value) groups[d.stage].push(d);
    return groups;
  });

  async function refresh() {
    loading.value = true;
    error.value = null;
    try {
      const [d, s] = await Promise.all([api.listDeals(), api.getStats()]);
      deals.value = d;
      stats.value = s;
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function addDeal(input: DealInput) {
    await api.createDeal(input);
    await refresh();
  }

  async function editDeal(id: number, patch: Partial<DealInput>) {
    await api.updateDeal(id, patch);
    await refresh();
  }

  async function removeDeal(id: number) {
    await api.deleteDeal(id);
    await refresh();
  }

  async function moveDeal(id: number, stage: Stage) {
    await editDeal(id, { stage });
  }

  return { deals, stats, loading, error, search, ownerFilter, owners, filtered, byStage, refresh, addDeal, editDeal, removeDeal, moveDeal };
});
