<script setup lang="ts">
import { useDealsStore } from "../stores/deals";
import { STAGES } from "../types";
import type { Deal } from "../types";
import DealCard from "./DealCard.vue";

const store = useDealsStore();
defineEmits<{ (e: "edit", deal: Deal): void }>();
</script>

<template>
  <div class="board">
    <div class="column" v-for="stage in STAGES" :key="stage">
      <h2>{{ stage }} <span class="count">{{ store.byStage[stage].length }}</span></h2>
      <DealCard
        v-for="deal in store.byStage[stage]"
        :key="deal.id"
        :deal="deal"
        @edit="(d) => $emit('edit', d)"
      />
    </div>
  </div>
</template>
