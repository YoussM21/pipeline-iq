<script setup lang="ts">
import { computed } from "vue";
import { useDealsStore } from "../stores/deals";

const store = useDealsStore();
const fmt = (n: number) => "$" + n.toLocaleString();
const s = computed(() => store.stats);
</script>

<template>
  <div class="summary" v-if="s">
    <div class="metric">
      <div class="label">Open pipeline</div>
      <div class="value">{{ fmt(s.openValue) }}</div>
    </div>
    <div class="metric">
      <div class="label">Won value</div>
      <div class="value">{{ fmt(s.wonValue) }}</div>
    </div>
    <div class="metric">
      <div class="label">Win rate</div>
      <div class="value">{{ s.winRate }}%</div>
    </div>
    <div class="metric">
      <div class="label">Total deals</div>
      <div class="value">{{ s.totalDeals }}</div>
    </div>
  </div>
</template>
