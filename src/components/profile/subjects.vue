<template>
  <h3>Soy tutor de estas materias</h3>
  <div class="calendar-grid">
    <template v-if="loading">
      <div v-for="n in 6" :key="n" class="calendar-cell">
        <div class="name">
          <p class="skltn skltn-text"></p>
          <h4 class="skltn skltn-text"></h4>
        </div>
        <p class="skltn skltn-text"></p>
        <div class="price-actions">
          <span class="skltn skltn-text" style="width: 60px"></span>
          <div class="actions">
            <span
              class="skltn skltn-text"
              style="width: 20px; height: 20px"
            ></span>
            <span
              class="skltn skltn-text"
              style="width: 20px; height: 20px; margin-left: 8px"
            ></span>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-for="(h, i) in subjects" :key="i" class="calendar-cell">
        <div class="name">
          <p>{{ h.educationLevel }}</p>
          <h4>{{ h.name }}</h4>
        </div>
        <p>{{ h.description ? h.description : "Sin decripción" }}</p>
        <div class="price-actions">
          <span>{{ formatCurrency(h.price) }}</span>
          <div class="actions">
            <span class="delete material-icons">delete_forever</span>
            <span class="edit material-icons">edit</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useSubjectsStore } from "@/stores/subjectStore";
import { onMounted, ref, watch } from "vue";
const subjectsStore = useSubjectsStore();
const subjects = ref([]);
const loading = ref(true);
const loadedOnce = ref(false);

function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}


onMounted(async () => {
  if (loadedOnce.value) return;
  loading.value = true;
  await subjectsStore.fetchAllSubjects();
  subjects.value = [...subjectsStore.subjects];
  loading.value = false;
  loadedOnce.value = true;
});

</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.calendar-cell {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: 0.3s;
  height: 155px;
}
.calendar-cell .name h4 {
  text-transform: uppercase;
}
.calendar-cell .name p {
  text-transform: capitalize;
  font-size: 12px;
}

.calendar-cell > p {
  font-size: 12px;
  color: var(--color-muted);
  margin-block: 10px;
}

.calendar-cell .price-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-cell .actions{
    display: flex;
}


.calendar-cell .price-actions > span {
  color: #08b294;
  font-weight: 600;
}

.calendar-cell .price-actions .actions span {
  font-size: 18px;
}

.calendar-cell .price-actions .actions .delete {
  background-color: #ee332d;
  border-radius: 50%;
  padding: 5px;
  color: white;
}

.calendar-cell .price-actions .actions .edit {
  border-radius: 50%;
  padding: 5px;
  background-color: var(--color-primary);
  color: white;
  margin-left: 8px;
}

.calendar-cell:hover {
  transform: translateY(-2px);
}
</style>
