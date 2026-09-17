<script setup>
/**
 * SlotTimeSelector
 * -----------------
 * Dos combo boxes conectados:
 *  1) Hora de inicio  -> generada a partir de availableSlots, en pasos de `stepMinutes`
 *  2) Duración        -> depende de cuánto tiempo queda en el slot desde la hora elegida
 *
 * Uso:
 * <SlotTimeSelector
 *    :available-slots="availableSlots"
 *    :step-minutes="30"
 *    v-model:start-time="horaInicio"
 *    v-model:duration="duracion"
 * />
 */
import { ref, computed, watch } from 'vue'

const props = defineProps({
  availableSlots: {
    type: Array,
    required: true,
    // [{ startTime: '09:20', endTime: '11:20' }, ...]
  },
  stepMinutes: {
    type: Number,
    default: 30, // usa 60 si quieres pasos de 1h
  },
  minDuration: {
    type: Number,
    default: 30, // duración mínima permitida
  },
})

const emit = defineEmits(['update:startTime', 'update:duration'])

// --- Helpers de tiempo ---
function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// --- Estado interno (hora y duración seleccionadas) ---
const selectedStartTime = ref(null)
const selectedDuration = ref(null)

// --- 1. Opciones de hora de inicio, derivadas de los slots ---
const startTimeOptions = computed(() => {
  const opciones = []

  props.availableSlots.forEach((slot) => {
    const inicio = timeToMinutes(slot.startTime)
    const fin = timeToMinutes(slot.endTime)
    const paso = props.stepMinutes

    // Redondea hacia arriba al múltiplo de "paso" más cercano
    let t = Math.ceil(inicio / paso) * paso

    // Solo se ofrece la hora si al menos cabe la duración mínima
    while (t + props.minDuration <= fin) {
      opciones.push(minutesToTime(t))
      t += paso
    }
  })

  return opciones
})

// --- 2. Minutos restantes en el slot que contiene la hora elegida ---
function minutosDisponibles(horaInicio) {
  if (!horaInicio) return 0
  const inicioSel = timeToMinutes(horaInicio)

  const slot = props.availableSlots.find(
    (s) => inicioSel >= timeToMinutes(s.startTime) && inicioSel < timeToMinutes(s.endTime)
  )

  if (!slot) return 0
  return timeToMinutes(slot.endTime) - inicioSel
}

// --- 3. Opciones de duración, dependientes de la hora elegida ---
const durationOptions = computed(() => {
  const maxMin = minutosDisponibles(selectedStartTime.value)
  const opciones = []

  for (let d = props.stepMinutes; d <= maxMin; d += props.stepMinutes) {
    opciones.push(d)
  }

  return opciones
})

// --- Si cambia la hora de inicio y la duración elegida ya no cabe, se ajusta ---
watch(startTimeOptions, (nuevasOpciones) => {
  if (selectedStartTime.value && !nuevasOpciones.includes(selectedStartTime.value)) {
    selectedStartTime.value = null
  }
})

watch(selectedStartTime, () => {
  const opciones = durationOptions.value
  if (!opciones.includes(selectedDuration.value)) {
    // Si la duración actual ya no cabe, selecciona la máxima disponible (o null si no hay ninguna)
    selectedDuration.value = opciones.length ? opciones[opciones.length - 1] : null
  }
  emit('update:startTime', selectedStartTime.value)
  emit('update:duration', selectedDuration.value)
})

watch(selectedDuration, () => {
  emit('update:duration', selectedDuration.value)
})

function formatDuration(mins) {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}
</script>

<template>
  <div class="slot-time-selector">
    <label class="field">
      <span class="field-label">Hora de inicio</span>
      <select v-model="selectedStartTime" class="field-select">
        <option :value="null" disabled>Selecciona una hora</option>
        <option v-for="hora in startTimeOptions" :key="hora" :value="hora">
          {{ hora }}
        </option>
      </select>
    </label>

    <label class="field">
      <span class="field-label">Duración</span>
      <select
        v-model="selectedDuration"
        class="field-select"
        :disabled="!selectedStartTime || durationOptions.length === 0"
      >
        <option :value="null" disabled>Selecciona duración</option>
        <option v-for="dur in durationOptions" :key="dur" :value="dur">
          {{ formatDuration(dur) }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.slot-time-selector {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 180px;
}

.field-label {
  font-size: 0.85rem;
  color: #444;
}

.field-select {
  padding: 0.5rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  background: #fff;
}

.field-select:disabled {
  background: #f2f2f2;
  color: #999;
  cursor: not-allowed;
}
</style>