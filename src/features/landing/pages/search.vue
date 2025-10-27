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
          <label>Modalidad</label>
          <div class="tabs">
            <div class="tab-slider" :style="sliderStyle"></div>
            <button
              v-for="(option, index) in allModalities"
              :key="option.value"
              class="tab"
              :class="{ active: filters.modality === option.value }"
              @click="selectTab(index, option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>Nivel de educación</label>
          <div class="chip-group">
            <label
              v-for="range in LevelEducations"
              :key="range.value"
              class="chip"
            >
              <input
                type="checkbox"
                :value="range.value"
                v-model="filters.education"
              />
              <span class="material-icons-outlined icon">{{ range.icon }}</span>
              <span class="material-icons-outlined icon-checked">check</span>
              <span>{{ range.label }}</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <label>Ordenar por</label>
          <div class="dropdowns">
            <ComboBox
              v-model="filters.orderBy"
              :items="orders"
              placeholder="Seleccionar"
            />
            <ComboBox
              v-model="filters.orderDir"
              :items="orderDirections"
              placeholder="Asc/Desc"
            />
          </div>
        </div>

        <div class="filter-group">
          <label>Ranking de tutores</label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            v-model="filters.ranking"
          />
          <span>{{ filters.ranking }}</span>
        </div>
      </aside>

      <results_search />
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import results_search from "@/components/search/results_search.vue";
import ComboBox from "@/shared/components/comboBox.vue";

const filters = ref({
  level: null,
  subject: null,
  education: [],
  modality: "",
  orderBy: null,
  orderDir: "desc",
  ranking: 4.5,
});

const activeIndex = ref(0);
const allModalities = [
  { label: "Todas", value: "" },
  { label: "Presencial", value: "presencial" },
  { label: "Virtual", value: "virtual" },
];
const selectTab = (index, value) => {
  activeIndex.value = index;
  filters.value.modality = value;
};
const sliderStyle = computed(() => ({
  transform: `translateX(${activeIndex.value * 100}%)`,
}));

const orders = [
  { label: "Relevancia", value: "relevancia" },
  { label: "Precio", value: "precio" },
  { label: "Popularidad", value: "popularidad" },
  { label: "Ranking de tutores", value: "ranking" },
];
const orderDirections = [
  { label: "ASC", value: "asc" },
  { label: "DESC", value: "desc" },
];

const LevelEducations = [
  { label: "Primaria", value: "primary", icon: "book" },
  { label: "Secundaria", value: "secondary", icon: "menu_book" },
  {
    label: "Educación superior",
    value: "higher_education",
    icon: "local_library",
  },
  { label: "Profesional", value: "professional", icon: "school" },
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
  padding: 12px;
  display: none;
  transition: all 0.3s ease;
}

.filters-lg header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.filters-lg h3 {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 18px;
}

.filter-group {
  margin-bottom: 26px;
}

.filter-group label {
  display: flex;
  align-items: center;
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
  border: 1px solid #EEEEEE;
  border-radius: 20px;
  padding: 8px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  transition: all 0.2s ease;
}

.chip input {
  display: none;
}

.chip span {
  pointer-events: none;
  font-weight: 300;
  transition: 0.5s ease;
  color: #616161;
  font-weight: 400;
}
.chip .icon-checked {
  display: none;
  opacity: 0;
  background-color: var(--color-primary);
  border-radius: 99px;
  padding: 2px;
  font-size: 15px;
}

.chip:hover {
  background: #ebf0ff;
}

.chip:has(input:checked) {
  box-shadow: 1px 1px 2px 0 rgba(0,0,0,0.16);
  border: 1.2px solid #EEEEEE;

}
.chip input:checked ~ span {
  color: #060606;
}

.chip input:checked ~ .icon {
  display: none;
}
.chip input:checked ~ .icon-checked {
  display: block;
  opacity: 1;
  color: #fff;
}


.tabs {
  position: relative;
  display: flex;
  background-color: #f5f7ff;
  border-radius: 100px;
  overflow: hidden;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  cursor: pointer;
  z-index: 1;
  transition: color 0.3s ease;
  font-size: 0.8rem;
}

.tab.active {
  font-weight: 700;
  color: #fff;
}

.tab-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% / 3);
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 100px;
  transition: transform 0.3s ease;
  z-index: 0;
}

.dropdowns {
  display: flex;
  align-items: center;
}

.dropdowns .combo-box:first-of-type {
  width: 80%;
}

.dropdowns .combo-box:last-of-type {
  min-width: 20%;
  max-width: fit-content;
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

input[type="range"] {
  width: 100%;
  margin-top: 5px;
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
