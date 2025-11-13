<template>
  <div class="modal-overlay">
    <div class="modal-content">        
        <h2>{{ subjectToEdit ? 'Actualizar' : 'Agregar' }} una <span>Materia</span></h2>
        <p>Completa la información para guardarla</p>

        <form @submit.prevent="subjectToEdit ? updateSubject() : createSubject()">       
            <InputDefault 
              placeholder="Nombre de la materia" 
              type="text" 
              v-model="subjectName" 
              id="name" 
              name="name" 
              :styles="inputStyle"
            />
            
            <textarea 
              name="description" 
              id="description" 
              v-model="subjectDescription" 
              placeholder="Descripción detallada de la materia">
            </textarea>
    
            <ComboBox 
              name="educationLevel" 
              id="educationLevel" 
              v-model="subjectLevel" 
              placeholder="Nivel de educación" 
              :items="educationLevels" 
              :styles="inputStyle"
            />
            
            <InputDefault 
              icon="attach_money" 
              placeholder="Precio por hora" 
              type="number" 
              v-model="subjectPrice" 
              id="price" 
              name="price" 
              :styles="inputStyle"
            />
    
            <div class="modal-actions">
                <span class="cancel-btn" @click="handleCloseModal">Cancelar</span>
                <button class="save-btn" type="submit">
                  {{ subjectToEdit ? 'Actualizar' : 'Guardar' }}
                </button>
            </div>
        </form>
    </div>
  </div>
</template>

<script setup>
import { useSubjectsStore } from "@/stores/subjectStore";
import { useUserStore } from "@/stores/userStore";
import ComboBox from "@/shared/components/comboBox.vue";
import InputDefault from "@/shared/components/input.vue";
import { ref, defineEmits, watch } from "vue";

// Stores
const subjectsStore = useSubjectsStore();
const userStore = useUserStore();

// Props y eventos
const props = defineProps({
  subjectToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["close"]);

// Campos del formulario
const subjectName = ref("");
const subjectDescription = ref("");
const subjectLevel = ref("");
const subjectPrice = ref("");

// --- Funciones auxiliares ---
const resetForm = () => {
  subjectName.value = "";
  subjectDescription.value = "";
  subjectLevel.value = "";
  subjectPrice.value = "";
};

// Rellenar formulario si hay una materia para editar
watch(
  () => props.subjectToEdit,
  (newSubject) => {
    if (newSubject) {
      subjectName.value = newSubject.name || "";
      subjectDescription.value = newSubject.description || "";
      subjectLevel.value = newSubject.educationLevel || "";
      subjectPrice.value = newSubject.price || "";
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// Opciones de nivel educativo
const educationLevels = [
  { label: "General", value: "General" },
  { label: "Profesional", value: "Postgraduate" },
  { label: "Universidad", value: "University" },
  { label: "Secundaria", value: "Secundary" },
  { label: "Primaria", value: "Primary" },
];

const inputStyle = "white";



const handleCloseModal = () => {
  resetForm();
  emit("close");
};

// --- Crear materia ---
const createSubject = async () => {
  const newSubject = {
    name: subjectName.value,
    educationLevel: subjectLevel.value,
    description: subjectDescription.value,
    price: parseInt(subjectPrice.value),
    tutorId: userStore.currentUser?._id,
  };

  await subjectsStore.createSubject(newSubject);
  handleCloseModal();
};

// --- Actualizar materia ---
const updateSubject = async () => {
  const updatedSubject = {
    _id: props.subjectToEdit._id,
    name: subjectName.value,
    educationLevel: subjectLevel.value,
    description: subjectDescription.value,
    price: parseInt(subjectPrice.value),
    tutorId: userStore.currentUser?._id,
  };

  await subjectsStore.updateSubject(updatedSubject);
  handleCloseModal();
  await subjectsStore.refreshSubjectsByTutor(userStore.currentUser?._id);
};
</script>

<style scoped>
/* Fondo oscuro */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fade-overlay 0.3s ease;
}

@keyframes fade-overlay {
    0% {
        opacity: .5;
    }
    100% {
        opacity: 100%;
    }
}

/* Caja del modal */
.modal-content {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(245, 247, 252, 1) 38%
    );
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  text-align: center;
  animation: scale-modal .4s ease;
}

@keyframes scale-modal {
    0% {
        scale: .8;
    }
    80% {
        scale: 1.1;
    }
    100% {
        scale: 1;
    }
}

.modal-content .input-icon {
  font-size: 60px;
  margin: auto;
  color: var(--color-primary);;
}

.modal-content h2 {
    font-size: 24px;
}

.modal-content h2 span {
    color: var(--color-primary);
}

.modal-content p {
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 28px;
}

.modal-content label {
    text-align: start;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 28px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

form textarea {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  width: 100%;
  font-size: 14px;
  color: #333;
  outline: none;
  resize: none;
}

/* Botones */
form .modal-actions {
  margin-top: 1.5rem;
  margin-bottom: .3rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.modal-actions button, .modal-actions span {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.save-btn {
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.cancel-btn {
    background-color: var(--color-border);
    font-size: 14px;
}
</style>
