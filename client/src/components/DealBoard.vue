<script setup lang="ts">
import { ref } from "vue";
import { useDealsStore } from "../stores/deals";
import { STAGES } from "../types";
import type { Deal, Stage } from "../types";
import DealCard from "./DealCard.vue";

const store = useDealsStore();
defineEmits<{ (e: "edit", deal: Deal): void }>();

const dragOverStage = ref<Stage | null>(null);

function onDragOver(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
}

function onDragEnter(stage: Stage) {
  dragOverStage.value = stage;
}

function onDragLeave(e: DragEvent, stage: Stage) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
    if (dragOverStage.value === stage) dragOverStage.value = null;
  }
}

function onDrop(e: DragEvent, stage: Stage) {
  dragOverStage.value = null;
  const id = Number(e.dataTransfer?.getData("dealId"));
  if (!id) return;
  const deal = store.deals.find((d) => d.id === id);
  if (deal && deal.stage !== stage) store.moveDeal(id, stage);
}
</script>

<template>
  <div class="board">
    <div
      class="column"
      :class="{ 'drag-over': dragOverStage === stage }"
      v-for="stage in STAGES"
      :key="stage"
      @dragover="onDragOver"
      @dragenter="onDragEnter(stage)"
      @dragleave="onDragLeave($event, stage)"
      @drop="onDrop($event, stage)"
    >
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
