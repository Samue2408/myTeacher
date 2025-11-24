<template>
  <div class="modal-overlay">
    <div class="modal-content">        
        <h2>{{ availabilityToEdit ? 'Actualizar' : 'Agregar' }} <span>Disponilidad</span></h2>
        <p>Completa la información para guardarla</p>

        <form @submit.prevent="availabilityToEdit ? updateAvailability() : createAvailability()">   
            <div v-if="!availabilityToEdit" class="toggle-container">
                <label class="toggle-switch">
                    <input type="checkbox" v-model="availabilityRecurrent" />
                    <span class="slider">
                        <span class="toggle-label left" :class="{ active: !availabilityRecurrent }">Puntual</span>
                        <span class="toggle-label right" :class="{ active: availabilityRecurrent }">Recurrente</span>
                        <span class="slider-ball"></span>
                    </span>
                </label>
            </div>
            <ComboBox 
              placeholder="Día de la semana" 
              type="text" 
              v-model="availabilityDayOfWeek" 
              id="name" 
              :items="dayOfWeeks" 
              :styles="inputStyle"
              v-if="availabilityRecurrent"
            />
            
            <InputDefault 
              :key="`date-${availabilityDate}`"
              type="date" 
              v-model="availabilityDate" 
              id="date" 
              name="date" 
              :styles="inputStyle"
              v-else
            />
            <div class="times">
                <div>
                    <label for="startTime">Comienzo</label>
                    <InputDefault 
                    :key="`from-${availabilityFrom}`"
                    type="time" 
                    v-model="availabilityFrom" 
                    id="startTime" 
                    name="startTime" 
                    :styles="inputStyle"
                    />
                </div>
                <div>
                    <label for="endTime">Final</label>
                    <InputDefault 
                      :key="`to-${availabilityTo}`"
                      type="time" 
                      v-model="availabilityTo" 
                      id="endTime" 
                      name="endTime" 
                      :styles="inputStyle"
                    />
                </div>
            </div>
            <div v-if="timeValidationError" class="time-error-alert">
                {{ timeValidationError }}
            </div>
            <div class="active-toggle">
                <label class="checkbox-label">
                    <input type="checkbox" v-model="availabilityActive" />
                    <span class="checkmark"></span>
                    <span>Activo</span>
                </label>
            </div>
    
            <div class="modal-actions">
                <span class="cancel-btn" @click="handleCloseModal">Cancelar</span>
                <button class="save-btn" type="submit">
                  {{ availabilityToEdit ? 'Actualizar' : 'Guardar' }}
                </button>
            </div>
        </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useAvailabilitiesStore } from "@/stores/availabilitiesStore";
import InputDefault from "@/shared/components/input.vue";
import ComboBox from "@/shared/components/comboBox.vue";

// Stores
const availabilitiesStore = useAvailabilitiesStore();
const userStore = useUserStore();
const emit = defineEmits(["close"]);

// Props y eventos
const props = defineProps({
  availabilityToEdit: {
    type: Object,
    default: null
  }
});


// Opciones de nivel educativo
const dayOfWeeks = [
  { label: "Lunes", value: "Lunes" },
  { label: "Martes", value: "Martes" },
  { label: "Miercoles", value: "Miercoles" },
  { label: "Jueves", value: "Jueves" },
  { label: "Viernes", value: "Viernes" },
  { label: "Sábado", value: "Sábado" },
  { label: "Domingo", value: "Domingo" },
];

// Campos del formulario
const availabilityRecurrent = ref(true)
const availabilityDayOfWeek = ref("");
const availabilityActive = ref(true);
const availabilityFrom = ref("");
const availabilityTo = ref("");
const availabilityDate = ref("");
const timeValidationError = ref("");

// --- Funciones auxiliares ---
const resetForm = () => {
  availabilityDate.value = "" 
  availabilityDayOfWeek.value = "";
  availabilityActive.value = true;
  availabilityFrom.value = "";
  availabilityTo.value = "";
  availabilityRecurrent.value = true;

};

// Helper: formatea un Date (o string) a 'YYYY-MM-DD' compatible con input[type=date]
const formatDateToInput = (d) => {
  if (!d) return "";
  // Si ya es Date
  if (d instanceof Date) {
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  if (typeof d === 'string') {
    // Caso ISO 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:MM:SS'
    const isoMatch = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

    // Caso visual como 'DD/MM/YYYY' -> convertir a 'YYYY-MM-DD'
    const ddmmMatch = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmMatch) return `${ddmmMatch[3]}-${ddmmMatch[2]}-${ddmmMatch[1]}`;

    // Fallback: parsear y usar componentes UTC para evitar desfases por zona horaria
    const dateObj = new Date(d);
    if (!isNaN(dateObj.getTime())) {
      const yyyy = dateObj.getUTCFullYear();
      const mm = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getUTCDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return "";
  }

  return "";
};

// Rellenar formulario si hay una materia para editar
watch(
  () => props.availabilityToEdit,
  (newAvailability) => {
    if (newAvailability) {
      // establecer primero si es recurrente para mostrar/ocultar los inputs correctamente
      availabilityRecurrent.value = !!newAvailability.isRecurring;
      availabilityDate.value = newAvailability.date ? formatDateToInput(newAvailability.date) : "";
      availabilityDayOfWeek.value = newAvailability.dayOfWeek || "";
      availabilityActive.value = typeof newAvailability.active === 'boolean' ? newAvailability.active : false;
      availabilityFrom.value = newAvailability.startTime || "";
      availabilityTo.value = newAvailability.endTime || "";
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const inputStyle = "white";

// Validar horas
const validateTimes = () => {
  if (availabilityFrom.value && availabilityTo.value) {
    if (availabilityFrom.value >= availabilityTo.value) {
      timeValidationError.value = "La hora de comienzo no puede ser mayor o igual que la hora final";
      return false;
    } else {
      timeValidationError.value = "";
      return true;
    }
  }
  timeValidationError.value = "";
  return true;
};

// Watcher para validar horas en tiempo real
watch([availabilityFrom, availabilityTo], () => {
  validateTimes();
});

const handleCloseModal = () => {
  resetForm();
  emit("close");
};

// --- Crear materia ---
const createAvailability = async () => {
  if (!validateTimes()) return;
  
  const newAvailability = {
    tutorId: userStore.currentUser?._id,
    date: !availabilityRecurrent.value ? availabilityDate.value : "",
    dayOfWeek: availabilityRecurrent.value ? availabilityDayOfWeek.value : "",
    startTime: availabilityFrom.value,
    endTime: availabilityTo.value,
    isRecurring: availabilityRecurrent.value,
    active: availabilityActive.value,
  };

  await availabilitiesStore.createAvailability(newAvailability);
  handleCloseModal();
};

// --- Actualizar materia ---
const updateAvailability = async () => {
  if (!validateTimes()) return;
  
  const updatedAvailability = {
    _id: props.availabilityToEdit._id,
    tutorId: userStore.currentUser?._id,
    date: availabilityDate.value,
    dayOfWeek: availabilityDayOfWeek.value,
    startTime: availabilityFrom.value,
    endTime: availabilityTo.value,
    isRecurring: availabilityRecurrent.value,
    active: availabilityActive.value,
  };

  await availabilitiesStore.updateAvailability(updatedAvailability);
  handleCloseModal();
  await availabilitiesStore.refreshAvailabilitysByTutor(userStore.currentUser?._id);
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
  text-align: center;
  font-size: 24px;
}

.modal-content h2 span {
  color: var(--color-primary);
}

.modal-content p {
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 28px;
    text-align: center;
}

.modal-content label {
    font-weight: 600;
    color: var(--color-muted);
}
.modal-content form .times label {
    font-size: 12px;
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

form .times {
    display: flex;
    gap: 20px;
    margin-top: 10px;
}

form .times div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
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

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* Toggle Switch Styles */
.toggle-switch {
  position: relative;
  display: inline-flex;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch .slider {
  position: relative;
  cursor: pointer;
  background-color: #e0e0e0;
  transition: background-color 0.3s;
  border-radius: 50px;
  width: 200px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-switch .slider-ball {
  position: absolute;
  width: 50%;
  height: 38px;
  background-color: var(--color-primary);
  border-radius: 50px;
  top: 3px;
  left: 3px;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.toggle-switch input:checked + .slider .slider-ball {
  left: 48.7%;
}

.toggle-switch .toggle-label {
  position: absolute;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  width: 80px;
  text-align: center;
  z-index: 2;
}

.toggle-switch .toggle-label.left {
  left: 12px;
  color: #666;
}

.toggle-switch .toggle-label.right {
  right: 12px;
  color: #666;
}

.toggle-switch .toggle-label.active {
  color: white;
}


.toggle-switch .slider:hover {
  opacity: 0.9;
}

/* Estilos para alerta de validación de horas */
.time-error-alert {
  background-color: #fee;
  color: #c33;
  border-left: 3px solid #c33;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para el toggle de Activo */
.active-toggle {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-inline: auto;
  margin-top: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background-color: white;
  transition: all 0.3s ease;
  position: relative;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  display: block;
}

.checkbox-label:hover .checkmark {
  border-color: var(--color-primary);
  box-shadow: 0 0 8px rgba(var(--color-primary-rgb), 0.2);
}
</style>
