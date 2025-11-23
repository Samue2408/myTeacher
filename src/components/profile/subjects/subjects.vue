<template>
    <div class="header">
        <h3>Soy tutor de estas materias</h3>
        <button @click="modalAddUpdate=true">Agregar</button>
    </div>
    <div class="subjects-grid">
        <template v-if="loading">
            <div v-for="n in 6" :key="n" class="subjects-cell">
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
                            <span class="skltn skltn-text" style="width: 20px; height: 20px"></span>
                            <span class="skltn skltn-text" style="width: 20px; height: 20px; margin-left: 8px"></span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-else-if="subjectsStore.hasSubjects">
            <div v-for="(h, i) in SubjectsTutor" :key="i" :class="[
                'subjects-cell',
            ]" :id="h._id">
                <div>
                    <div class="category">
                        <p :class="h.educationLevel.toLowerCase()">{{ h.educationLevel }}</p>
                    </div>
                    <h4>{{ h.name }}</h4>
                </div>
                <p class="description">{{ h.description ?? 'Sin descripción' }}</p>
                <div>
                    <hr>
                    <div class="price-actions">
                        <span>{{ formatCurrency(h.price) }}</span>
                        <div class="actions">
                            <button @click="deleteSubject(h._id)">
                                <span class="delete material-icons">delete</span>
                            </button>
                            <button @click="modalAddUpdate=true; subjectUpdate=h">
                                <span class="edit material-icons">edit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </template>
        <div v-else class="error-message">
            No se encontraron materias
        </div>
    </div>
    <ModalSubjects 
        v-if="modalAddUpdate" 
        @close="() => { modalAddUpdate = false; subjectUpdate = null }"
        :subject-to-edit="subjectUpdate"
    />
</template>


<script setup>
import { useSubjectsStore } from "@/stores/subjectStore";
import { onMounted, ref} from "vue";
import { storeToRefs } from "pinia";
import ModalSubjects from "./modalSubjects.vue";
const subjectsStore = useSubjectsStore();
const { SubjectsTutor, loading } = storeToRefs(subjectsStore);

const modalAddUpdate = ref(false)
const subjectUpdate = ref({})

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

const deleteSubject = async (idSubject) => {
    if (confirm('Seguro que deseas eliminar esta materia?')) {
        const classDelete = document.getElementById(idSubject)
        classDelete.classList.add('deleted')
        await subjectsStore.deleteSubject(idSubject);
        classDelete.classList.remove('deleted')
    }
}


onMounted(async () => {
    await subjectsStore.fetchSubjectsByTutor($props.tutorId);
});



</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header button {
    display: flex;
    align-items: center;
    gap: 5px;
    color: white;
    font-size: 14px;
    padding: 12px;
    background-color: #08B294;
    border-radius: 6px;
}

.header button .add {
    font-size: 18px;
}

.subjects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.subjects-grid .error-message {
    color: var(--color-muted);
    font-size: 15px;
}

.subjects-cell {
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

.subjects-cell.deleted {
    transform: translateY(-20px);
    opacity: 0;
    transition: 0.5s;
}

.subjects-cell h4 {
    text-transform: uppercase;
}

.subjects-cell p {
    font-size: 12px;
}

.subjects-cell .description {
    font-size: 12px;
    color: var(--color-muted);
    margin-block: 10px;
}

.subjects-cell .category {
    display: flex;
    margin-block: 5px;
}

.subjects-cell .category p {
    font-weight: 600;
    border-radius: 6px;
}

.subjects-cell .category .university {
    color: rgb(27, 79, 114);
    /* background-color: rgba(27, 79, 114, 0.10); */
}

.subjects-cell .category .secundary {
    color: #5d5dd9;
    /* background-color: #E9EAFF; */
}

.subjects-cell .category .general {
    color: #dc8323;
    /* background-color: #FCF7EB; */
}

.subjects-cell hr {
    border: 1px solid #EEEEEE;
    margin-bottom: 10px;
}

.subjects-cell .price-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.subjects-cell .price-actions>span {
    color: #08B294;
    font-weight: 600;
    font-size: 18px;
}

.subjects-cell .price-actions .actions {
    display: flex;
    gap: 8px;
}

.subjects-cell .price-actions .actions span {
    font-size: 18px;
    border-radius: 25%;
    padding: 5px;
    color: white;
}

.subjects-cell .price-actions .actions .delete {
    background-color: #EE332D;
}

.subjects-cell .price-actions .actions .edit {
    background-color: var(--color-primary);
}



.subjects-cell:hover {
    transform: translateY(-2px);
}
</style>
