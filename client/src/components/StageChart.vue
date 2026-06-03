<script setup lang="ts">
import { computed } from "vue";
import { useDealsStore } from "../stores/deals";

const store = useDealsStore();
const bars = computed(() => store.stats?.byStage ?? []);
const max = computed(() => Math.max(1, ...bars.value.map((b) => b.value)));
const colors: Record<string, string> = {
  Lead: "#5b8cff", Contacted: "#7c6cff", Quoted: "#ffb454", Won: "#3ecf8e", Lost: "#ff6b6b",
};
const fmt = (n: number) => "$" + n.toLocaleString();
</script>

<template>
  <div class="chart">
    <h3>Value by stage</h3>
    <svg :viewBox="`0 0 500 ${bars.length * 34 + 6}`" width="100%" :height="bars.length * 34 + 6">
      <g v-for="(b, i) in bars" :key="b.stage" :transform="`translate(0 ${i * 34 + 4})`">
        <text x="0" y="14" fill="#9aa3b2" font-size="12">{{ b.stage }}</text>
        <rect x="80" y="3" :width="(b.value / max) * 320" height="16" rx="4" :fill="colors[b.stage]" />
        <text :x="80 + (b.value / max) * 320 + 8" y="16" fill="#e6e8ec" font-size="11">{{ fmt(b.value) }}</text>
      </g>
    </svg>
  </div>
</template>
