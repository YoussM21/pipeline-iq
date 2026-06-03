<script setup lang="ts">
import { useDealsStore } from "../stores/deals";
import { STAGES } from "../types";
import type { Deal, Stage } from "../types";

const props = defineProps<{ deal: Deal }>();
const emit = defineEmits<{ (e: "edit", deal: Deal): void }>();
const store = useDealsStore();
const fmt = (n: number) => "$" + n.toLocaleString();

function onStageChange(e: Event) {
  store.moveDeal(props.deal.id, (e.target as HTMLSelectElement).value as Stage);
}
</script>

<template>
  <div class="card" draggable="true" @dragstart="(e) => e.dataTransfer?.setData('dealId', String(deal.id))">
    <div class="name">{{ deal.name }}</div>
    <div class="company">{{ deal.company }}</div>
    <div class="row">
      <span class="val">{{ fmt(deal.value) }}</span>
      <select :value="deal.stage" @change="onStageChange">
        <option v-for="s in STAGES" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>
    <div class="owner">Owner: {{ deal.owner }}</div>
    <div class="row" style="margin-top: 8px;">
      <button class="link" @click="emit('edit', deal)">Edit</button>
      <button class="btn danger" @click="store.removeDeal(deal.id)">Delete</button>
    </div>
  </div>
</template>
