<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useDealsStore } from "./stores/deals";
import type { Deal } from "./types";
import SummaryBar from "./components/SummaryBar.vue";
import StageChart from "./components/StageChart.vue";
import DealBoard from "./components/DealBoard.vue";
import DealForm from "./components/DealForm.vue";

const store = useDealsStore();
const showForm = ref(false);
const editing = ref<Deal | null>(null);

onMounted(() => store.refresh());

function openNew() {
  editing.value = null;
  showForm.value = true;
}
function openEdit(deal: Deal) {
  editing.value = deal;
  showForm.value = true;
}
function close() {
  showForm.value = false;
  editing.value = null;
}
</script>

<template>
  <div class="app">
    <div class="topbar">
      <div class="brand">Pipeline<span>IQ</span></div>
      <div class="controls">
        <input class="search" v-model="store.search" placeholder="Search deals, companies, owners…" />
        <select class="owner-select" v-model="store.ownerFilter">
          <option value="">All owners</option>
          <option v-for="o in store.owners" :key="o" :value="o">{{ o }}</option>
        </select>
        <button class="btn" @click="openNew">+ New deal</button>
      </div>
    </div>

    <div v-if="store.error" class="banner">{{ store.error }}</div>

    <SummaryBar />
    <StageChart />
    <DealBoard @edit="openEdit" />

    <DealForm v-if="showForm" :deal="editing" @close="close" />
  </div>
</template>
