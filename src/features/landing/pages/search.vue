<template>
  <main>
    <div class="content">
      <button class="filters-sm">
        <span class="material-icons-outlined">tune</span>
        Filtros
      </button>

      <aside class="filters-lg">
        <header>
          <h3>Filtros</h3>
        </header>

        <div class="filter-group">
          <label>Nivel educativo</label>
          <ComboBox
            v-model="filters.level"
            :items="levels"
            placeholder="Seleccionar"
          />
        </div>

        <div class="filter-group">
          <label>Materia</label>
          <ComboBox
            v-model="filters.subject"
            :items="subjects"
            placeholder="Seleccionar"
          />
        </div>

        <div class="filter-group">
          <label>Ordenar por</label>
          <ComboBox
            v-model="filters.order"
            :items="orders"
            placeholder="Relevancia"
          />
        </div>

        <div class="filter-group">
          <label>Rango de precios</label>
          <div class="chip-group">
            <label v-for="range in priceRanges" :key="range.value" class="chip">
              <input
                type="checkbox"
                :value="range.value"
                v-model="filters.price"
              />
              <span>{{ range.label }}</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <label>Modalidad</label>
          <div class="chip-group radio">
            <label
              v-for="option in modalities"
              :key="option.value"
              class="chip radio"
            >
              <input
                type="radio"
                name="modality"
                :value="option.value"
                v-model="filters.modality"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>
      </aside>

      <results_search />
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import results_search from "@/components/search/results_search.vue";
import ComboBox from "@/shared/components/comboBox.vue";

const filters = ref({
  level: null,
  subject: null,
  price: [],
  modality: null,
  order: null,
});

const levels = [
  { label: "Todos", value: "" },
  { label: "Primaria", value: "primaria" },
  { label: "Secundaria", value: "secundaria" },
  { label: "Educación Superior", value: "superior" },
];

const subjects = [
  { label: "Todas", value: "" },
  { label: "Matemáticas", value: "matematicas" },
  { label: "Lengua y Literatura", value: "lengua" },
  { label: "Física", value: "fisica" },
  { label: "Inglés", value: "ingles" },
  { label: "Informática", value: "informatica" },
];

const orders = [
  { label: "Relevancia", value: "relevancia" },
  { label: "Precio más bajo", value: "menor-precio" },
  { label: "Precio más alto", value: "mayor-precio" },
  { label: "Popularidad", value: "popularidad" },
];

const priceRanges = [
  { label: "$0 – $30.000", value: "0-30000" },
  { label: "$30.000 – $50.000", value: "30000-50000" },
  { label: "$50.000+", value: "50000+" },
];

const modalities = [
  { label: "Presencial", value: "presencial" },
  { label: "Virtual", value: "virtual" },
];
</script>

<style scoped>
main {
  padding: 24px;
  background: linear-gradient(
    180deg,
    rgba(245, 247, 255, 0.9) 0%,
    #ffffff 100%
  );
  height: calc(100vh - 8vh);
  font-family: "Inter", sans-serif;
}

.filters-lg {
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 12px;
  box-sizing: border-box;
  display: none;
  transition: all 0.3s ease;
}

.filters-lg header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.header-icon {
  color: var(--color-primary);
  font-size: 22px;
}

.filters-lg h3 {
  color:var(--color-primary);
  font-weight: 700;
  font-size: 18px;
}

.filter-group {
  margin-bottom: 26px;
}

.filter-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #444;
  margin-bottom: 10px;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border: 1px solid #e2e6ff;
  color: #333;
  font-weight: 500;
  border-radius: 20px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f7ff;
}

.chip input {
  display: none;
}

.chip span {
  pointer-events: none;
}

.chip:hover {
  background: #ebf0ff;
}

.chip input:checked + span {
  color: var(--color-primary);
  font-weight: 700;
}


.filters-sm {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 600;
  background: #eef2ff;
  border-radius: 12px;
  padding: 10px 18px;
  margin-bottom: 12px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.filters-sm:hover {
  background: #e0e6ff;
}

.material-icons-outlined {
  font-size: 20px;
}

@media (min-width: 700px) {
  .content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 30px;
  }

  .filters-lg {
    display: block;
  }

  .filters-sm {
    display: none;
  }
}
</style>
