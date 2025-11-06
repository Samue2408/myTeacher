<template>
  <div class="header">
        <h3>Soy tutor de estas materias</h3>
        <button>Agregar nueva materia <span class="add material-icons">add</span></button>
    </div>
    <div class="calendar-grid">
        <div v-if="subjectsStore.errorMessage" class="error-message">
            {{ subjectsStore.errorMessage }}...
        </div>
        <template v-else-if="loading">
            <div v-for="n in 6" :key="n" class="calendar-cell">
                <div>
                    <div class="category">
                        <p class="skltn skltn-text"></p>
                    </div>
                    <h4 class="skltn skltn-text"></h4>
                </div>
                <p class="description skltn skltn-text"></p>
                <div>
                    <hr>
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
            </div>
        </template>

        <template v-else>
        <div
        v-for="(h, i) in subjects"
        :key="i"
        :class="[
            'calendar-cell'
        ]"
        >
            <div>
                <div class="category">
                    <p :class="h.educationLevel.toLowerCase()">{{ h.educationLevel }}</p>
                </div>
                <h4>{{ h.name }}</h4>
            </div>
            <p class="description">{{ h.description ?? 'Sin descripción'  }}</p>
            <div>
                <hr>
                <div class="price-actions">
                    <span>{{ formatCurrency(h.price) }}</span>
                    <form class="actions">
                        <button><span class="delete material-icons">delete</span></button>
                        <button><span class="edit material-icons">edit</span></button>
                    </form>
                </div>
            </div>
        </div>

        </template>
    </div>
</template>

<script setup>
import { useSubjectsStore } from "@/stores/subjectStore";
import { onMounted, ref, defineProps } from "vue";
const subjectsStore = useSubjectsStore();
const subjects = ref([]);
const loading = ref(true);
const loadedOnce = ref(false);


const $props = defineProps({
    tutorId: String
})

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value)
}


onMounted(async () => {
  if (loadedOnce.value) return;
  loading.value = true;
  await subjectsStore.fetchSubjectsByTutor($props.tutorId);
  subjects.value = [...subjectsStore.SubjectsTutor];
  loading.value = false;
  loadedOnce.value = true;
});

</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header .add {
    font-size: 18px;
    border-radius: 25%;
    padding: 5px;
    color: white;
    background-color: #08B294;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.calendar-grid .error-message {
    color: var(--color-muted);
    font-size: 15px;
}

.calendar-cell {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #EEEEEE;
    padding: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    transition: 0.3s;
}
.calendar-cell h4 {
    text-transform: uppercase;
}
.calendar-cell p {
    text-transform: capitalize;
    font-size: 12px;
}

.calendar-cell .description {
    font-size: 12px;
    color: var(--color-muted);
    margin-block: 10px;
}
.calendar-cell .category {
    display: flex;
    margin-block: 5px;
}

.calendar-cell .category p {
    font-weight: 600;
    border-radius: 6px;
}

.calendar-cell .category .universidad {
    color: rgb(27, 79, 114);
    /* background-color: rgba(27, 79, 114, 0.10); */
}

.calendar-cell .category .secundaria {
    color: #5d5dd9;
    /* background-color: #E9EAFF; */
}

.calendar-cell .category .general {
    color: #dc8323;
    /* background-color: #FCF7EB; */
}

.calendar-cell hr {
    border: 1px solid #EEEEEE;
    margin-bottom: 10px;
}

.calendar-cell .price-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.calendar-cell .price-actions > span {
    color: #08B294;
    font-weight: 600;
}

.calendar-cell .price-actions .actions {
    display: flex;
    gap: 8px;
}

.calendar-cell .price-actions .actions span{
    font-size: 18px;
    border-radius: 25%;
    padding: 5px;
    color: white;
}

.calendar-cell .price-actions .actions .delete {
    background-color: #EE332D;
}

.calendar-cell .price-actions .actions .edit {    
    background-color: var(--color-primary);
}



.calendar-cell:hover {
  transform: translateY(-2px);
}

</style>
