<template>
  <main class="search-page">
    <button class="filters-toggle" type="button" @click="mobileFiltersOpen = !mobileFiltersOpen">
      <span class="material-icons-outlined">tune</span> Filtros
    </button>
    <div class="content">
      <aside class="filters" :class="{ open: mobileFiltersOpen }">
        <div class="filters-title"><h1>Encuentra tu clase</h1><button type="button" @click="resetFilters">Limpiar</button></div>
        <div class="filter-group"><label>Modalidad para la reserva</label><div class="tabs"><button v-for="option in modalities" :key="option.value" :class="{ active: filters.modality === option.value }" @click="filters.modality = option.value">{{ option.label }}</button></div></div>
        <div class="filter-group"><label>Nivel educativo</label><div class="chips"><label v-for="level in levels" :key="level.value"><input v-model="filters.education" type="checkbox" :value="level.value" /><span>{{ level.label }}</span></label></div></div>
        <div class="filter-group"><label>Calificación mínima: {{ filters.ranking.toFixed(1) }}</label><input v-model.number="filters.ranking" type="range" min="0" max="5" step="0.5" /></div>
        <div class="filter-group"><label>Ordenar resultados</label><ComboBox v-model="filters.orderBy" :items="orders" placeholder="Relevancia" /></div>
      </aside>
      <ResultsSearch :filters="filters" />
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import ComboBox from "@/shared/components/comboBox.vue";
import ResultsSearch from "@/components/search/results_search.vue";
const mobileFiltersOpen = ref(false);
const initialFilters = () => ({ modality: "", education: [], ranking: 0, orderBy: "relevancia" });
const filters = reactive(initialFilters());
const resetFilters = () => Object.assign(filters, initialFilters());
const modalities = [{ label: "Todas", value: "" }, { label: "Virtual", value: "Virtual" }, { label: "Presencial", value: "Presencial" }];
const levels = [
  { label: "General", value: "general" },
  { label: "Postgrado", value: "postgrado" },
  { label: "Universidad", value: "universitaria" },
  { label: "Secundaria", value: "secundaria" },
  { label: "Primaria", value: "primaria" },
];
const orders = [{ label: "Relevancia", value: "relevancia" }, { label: "Menor precio", value: "precio-asc" }, { label: "Mayor precio", value: "precio-desc" }, { label: "Mejor calificación", value: "rating" }];
</script>

<style scoped>
.search-page { min-height: calc(100vh - 8vh); padding: 28px; background: #f7f9fc; font-family: Inter, sans-serif; }.content { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 22px; max-width: 1400px; margin: auto; }.filters { align-self: start; padding: 20px; background: #fff; border: 1px solid #e8ebf0; border-radius: 16px; }.filters-title { display: flex; justify-content: space-between; align-items: center; gap: 8px; }.filters h1 { margin: 0; font-size: 20px; }.filters-title button { border: 0; background: transparent; color: var(--color-primary); cursor: pointer; font-size: 12px; font-weight: 700; }.filter-group { margin-top: 24px; }.filter-group > label { display: block; margin-bottom: 10px; color: #424957; font-size: 13px; font-weight: 700; }.tabs { display: grid; grid-template-columns: repeat(3, 1fr); padding: 3px; border-radius: 9px; background: #eef2f8; }.tabs button { padding: 8px 3px; border: 0; border-radius: 7px; background: transparent; color: #687181; font-size: 12px; cursor: pointer; }.tabs button.active { color: #fff; background: var(--color-primary); font-weight: 700; }.chips { display: flex; flex-wrap: wrap; gap: 8px; }.chips label { cursor: pointer; }.chips input { position: absolute; opacity: 0; }.chips span { display: block; padding: 7px 9px; border: 1px solid #dce1e8; border-radius: 99px; color: #5f6876; font-size: 12px; }.chips input:checked + span { color: var(--color-primary); border-color: var(--color-primary); background: #edf3ff; font-weight: 700; }input[type=range] { width: 100%; accent-color: var(--color-primary); }.filters-toggle { display: none; }@media(max-width:800px){.search-page{padding:16px}.content{display:block}.filters-toggle{display:flex;align-items:center;gap:6px;margin-bottom:12px;padding:10px 14px;border:0;border-radius:8px;background:#e9f0ff;color:var(--color-primary);font-weight:700}.filters{display:none;margin-bottom:16px}.filters.open{display:block}}
</style>
