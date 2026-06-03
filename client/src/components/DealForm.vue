<script setup lang="ts">
import { reactive, ref } from "vue";
import { useDealsStore } from "../stores/deals";
import { STAGES } from "../types";
import type { Deal, DealInput, Stage } from "../types";

const props = defineProps<{ deal: Deal | null }>();
const emit = defineEmits<{ (e: "close"): void }>();
const store = useDealsStore();

const form = reactive<DealInput>({
  name: props.deal?.name ?? "",
  company: props.deal?.company ?? "",
  value: props.deal?.value ?? 0,
  stage: (props.deal?.stage ?? "Lead") as Stage,
  owner: props.deal?.owner ?? "",
});
const error = ref<string | null>(null);
const saving = ref(false);

async function save() {
  error.value = null;
  if (!form.name.trim() || !form.company.trim() || !form.owner.trim()) {
    error.value = "Name, company, and owner are required.";
    return;
  }
  saving.value = true;
  try {
    if (props.deal) await store.editDeal(props.deal.id, { ...form });
    else await store.addDeal({ ...form });
    emit("close");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal">
      <h2>{{ deal ? "Edit deal" : "New deal" }}</h2>
      <div class="field">
        <label>Deal name</label>
        <input v-model="form.name" placeholder="Exterior repaint" />
      </div>
      <div class="field">
        <label>Company</label>
        <input v-model="form.company" placeholder="Birch & Co" />
      </div>
      <div class="field">
        <label>Value (CAD)</label>
        <input type="number" min="0" v-model.number="form.value" />
      </div>
      <div class="field">
        <label>Stage</label>
        <select v-model="form.stage">
          <option v-for="s in STAGES" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="field">
        <label>Owner</label>
        <input v-model="form.owner" placeholder="Youssef" />
      </div>
      <div v-if="error" class="err" style="color: var(--red); font-size: 13px;">{{ error }}</div>
      <div class="modal-actions">
        <button class="btn ghost" @click="emit('close')">Cancel</button>
        <button class="btn" :disabled="saving" @click="save">{{ saving ? "Saving…" : "Save" }}</button>
      </div>
    </div>
  </div>
</template>
