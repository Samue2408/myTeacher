<template>
  <section class="search-results">
    <div class="results-heading">
      <div>
        <p class="eyebrow">Resultados</p>
        <h2>{{ filteredSubjects.length }} clases disponibles</h2>
      </div>
      <p>Elige un tutor y reserva en pocos pasos.</p>
    </div>
    <div v-if="loading" class="loading"><span class="spinner" /> Buscando clases...</div>
    <div v-else-if="!filteredSubjects.length" class="empty"><span class="material-icons-outlined">search_off</span>
      <h3>No hay resultados con estos filtros</h3>
      <p>Prueba otra materia o modifica los filtros.</p>
    </div>
    <div v-else class="result-layout">
      <div class="cards"><button v-for="subject in filteredSubjects" :key="subject.id" class="teacher-card"
          :class="{ selected: selectedSubject?.id === subject.id }" @click="selectSubject(subject)"><span
            class="avatar">{{ subject.tutor?.name?.[0] || 'T' }}</span><span class="teacher-data"><strong>{{
              subject.tutor?.name || 'Tutor' }}</strong><small>{{ subject.name }} · {{ subject.level || 'General'
              }}</small><span class="rating">★ {{ subject.tutor?.reputation?.rating || 'Sin calificación'
              }}</span></span><span class="price">{{ formatCurrency(subject.price) }}<small>/
              hora</small></span></button></div>
      <aside v-if="selectedSubject" class="booking-panel">
        <p class="eyebrow">Paso 1 de 2</p>
        <h2>Reserva tu clase</h2>
        <p class="class-name">{{ selectedSubject.name }} con {{ selectedSubject.tutor?.name }}</p>
        <div class="mode-options"><button v-for="mode in ['Virtual', 'Presencial']" :key="mode"
            :class="{ active: booking.type === mode }" @click="booking.type = mode"><span
              class="material-icons-outlined">{{ mode === 'Virtual' ? 'videocam' : 'location_on' }}</span>{{ mode
              }}</button></div>
        <label v-if="booking.type === 'Presencial'" class="location-field"><span>Dirección o lugar de
            encuentro</span><input v-model.trim="booking.location" type="text"
            placeholder="Ej. Calle 72 #10-34, Bogotá" /></label>
        <div v-if="activeAvailabilities.length" class="availability-info"><span
            class="material-icons-outlined">schedule</span>
          <div><strong>Disponibilidad del docente</strong>
            <p>Información de referencia; confirma un horario dentro de estos rangos.</p>
            <ul>
              <li v-for="availability in activeAvailabilities" :key="availability._id || availability.id"><span>{{
                availabilityLabel(availability) }}</span><b>{{ availability.startTime }} - {{ availability.endTime
                  }}</b></li>
            </ul>
          </div>
        </div>
        <div class="selection"><span class="material-icons-outlined">event</span>
          <div><small>Fecha y hora</small><strong v-if="booking.date && booking.startTime">{{ formatBookingDate }} · {{ booking.startTime }}
              - {{ booking.endTime }}</strong><strong v-else>Selecciona una fecha y un horario</strong></div>
        </div>
        <label class="date-field"><span>Fecha de la clase</span><input v-model="booking.date" type="date" :min="minimumDate" @change="loadAvailability" /></label>
        <div v-if="availabilityLoading" class="availability-loading"><span class="spinner" /> Consultando horarios disponibles...</div>
        <div v-else-if="booking.date && availableHours.length" class="schedule-fields">
          <label><span>Hora de inicio</span><select v-model="booking.startTime"><option value="" disabled>Selecciona una hora</option><option v-for="hour in availableHours" :key="hour" :value="hour">{{ hour }}</option></select></label>
          <label><span>Duración</span><select v-model.number="booking.duration"><option v-for="duration in durationOptions" :key="duration" :value="duration">{{ duration }} {{ duration === 1 ? 'hora' : 'horas' }}</option></select></label>
        </div>
        <p v-else-if="booking.date" class="empty-schedule">No hay horarios disponibles para esta fecha. Prueba con otro día.</p>
        <p v-if="booking.date" class="price-summary">{{ formatCurrency(selectedSubject.price) }} / hora × {{
          durationHours }} {{ durationHours === 1 ? 'hora' : 'horas' }} = <strong>{{ formatCurrency(totalPrice)
          }}</strong></p>
        <p v-if="scheduleError" class="error">{{ scheduleError }}</p>
        <button class="continue" :disabled="!booking.date || !booking.duration || !booking.startTime" @click="continueToPayment">Continuar al pago · {{
          formatCurrency(totalPrice) }}</button>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchStore } from "@/stores/searchStore";
import { useUserStore } from "@/stores/userStore";
import { AvailabilityService } from "@/api/availability.service";

const props = defineProps({ filters: { type: Object, required: true } });
const router = useRouter(), route = useRoute(), searchStore = useSearchStore(), userStore = useUserStore();
const selectedSubject = ref(null), scheduleError = ref("");
const booking = ref({ type: "Virtual", location: "", date: "", startTime: "", endTime: "", duration: 1 });
const loading = computed(() => searchStore.loading), subjects = computed(() => searchStore.results || []);
const normalized = (value) => String(value || "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const filteredSubjects = computed(() => [...subjects.value].filter(s => (!props.filters.education.length || props.filters.education.some(level => normalized(s.level).includes(level))) && (!props.filters.ranking || Number(s.tutor?.reputation?.rating || 0) >= props.filters.ranking)).sort((a, b) => props.filters.orderBy === 'precio-asc' ? a.price - b.price : props.filters.orderBy === 'precio-desc' ? b.price - a.price : props.filters.orderBy === 'rating' ? Number(b.tutor?.reputation?.rating || 0) - Number(a.tutor?.reputation?.rating || 0) : 0));
const selectSubject = (subject) => { selectedSubject.value = subject; booking.value = { type: "Virtual", location: "", date: "", startTime: "", endTime: "", duration: 1 }; availableHours.value = []; scheduleError.value = ""; };
watch(filteredSubjects, values => { if (!values.some(s => s.id === selectedSubject.value?.id)) selectedSubject.value = values[0] || null; }, { immediate: true });
watch(() => props.filters.modality, (modality) => { if (modality) booking.value.type = modality; });
const minimumDate = new Date().toISOString().slice(0, 10);
const availabilityLoading = ref(false);
const availableSlots = ref([]); 

const stepMinutes = 60;
const minDuration = 60;

const loadAvailability = async () => {

  
  booking.value.startTime = "";
  booking.value.endTime = "";
  scheduleError.value = "";
  availableSlots.value = [];

  if (!booking.value.date) return;

  availabilityLoading.value = true;
  try {
    const response = await AvailabilityService.getAvailabilitiesByDate(
      selectedSubject.value.tutor.id,
      booking.value.date
    );
    console.log(response)
    availableSlots.value = response.availableSlots || [];
  } finally {
    availabilityLoading.value = false;
  }
};

// --- Helpers de tiempo ---
function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// --- Horas de inicio disponibles (ahora sí un computed real que se lee) ---
const availableHours = computed(() => {
  const opciones = [];
  availableSlots.value.forEach((slot) => {
    const inicio = timeToMinutes(slot.startTime);
    const fin = timeToMinutes(slot.endTime);
    let t = Math.ceil(inicio / stepMinutes) * stepMinutes;
    while (t + minDuration <= fin) {
      opciones.push(minutesToTime(t));
      t += stepMinutes;
    }
  });
  return opciones;
});

function minutosDisponibles(horaInicio) {
  if (!horaInicio) return 0;
  const inicioSel = timeToMinutes(horaInicio);
  const slot = availableSlots.value.find(
    (s) => inicioSel >= timeToMinutes(s.startTime) && inicioSel < timeToMinutes(s.endTime)
  );
  if (!slot) return 0;
  return timeToMinutes(slot.endTime) - inicioSel;
}

// --- Duraciones disponibles, en HORAS (para cuadrar con el resto del componente) ---
const durationOptions = computed(() => {
  const maxMin = minutosDisponibles(booking.value.startTime); // antes: booking.value.date
  const maxHoras = Math.floor(maxMin / 60);
  const opciones = [];
  for (let h = 1; h <= maxHoras; h++) opciones.push(h);
  return opciones;
});

// Si cambia la hora de inicio y la duración ya elegida no cabe, se ajusta sola
watch(() => booking.value.startTime, () => {
  if (!durationOptions.value.includes(booking.value.duration)) {
    booking.value.duration = durationOptions.value[0] ?? 1;
  }
});

const formatCurrency = value => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);
const formatBookingDate = computed(() => booking.value.date && new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${booking.value.date}T12:00:00`)));
const durationHours = computed(() => Number(booking.value.duration) || 0);
watch(() => [booking.value.startTime, booking.value.duration], () => { if (!booking.value.startTime) { booking.value.endTime = ""; return; } const [hours, minutes] = booking.value.startTime.split(':').map(Number); const endMinutes = hours * 60 + minutes + durationHours.value * 60; booking.value.endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`; });
const totalPrice = computed(() => (selectedSubject.value?.price || 0) * durationHours.value);
const activeAvailabilities = computed(() => (selectedSubject.value?.tutor?.availabilities || []).filter(availability => availability.active));
const availabilityLabel = availability => availability.isRecurring ? availability.dayOfWeek || 'Horario recurrente' : availability.date ? new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(new Date(`${String(availability.date).slice(0, 10)}T12:00:00`)) : 'Horario disponible';
const continueToPayment = () => { if (!userStore.userId) return router.push('/user/login'); if (!booking.value.date || !booking.value.startTime || !booking.value.endTime) { scheduleError.value = 'Selecciona una fecha y un horario disponible.'; return; } if (booking.value.type === 'Presencial' && !booking.value.location) { scheduleError.value = 'Ingresa la dirección o el lugar de encuentro para la clase presencial.'; return; } const subject = selectedSubject.value; const draft = { studentId: userStore.userId, tutorId: subject.tutor?.id, subjectId: subject.id, tutorName: subject.tutor?.name, subjectName: subject.name, type: booking.value.type, location: booking.value.type === 'Presencial' ? booking.value.location : 'Virtual', status: 'Pendiente por pago', date: booking.value.date, startTime: booking.value.startTime, endTime: booking.value.endTime, hourlyRate: subject.price, durationHours: durationHours.value, price: totalPrice.value }; localStorage.setItem('bookingDraft', JSON.stringify(draft)); router.push('/payment/summary'); };
onMounted(async () => { const query = String(route.query.q || searchStore.lastQuery || '').trim(); if (query && !searchStore.results.length) await searchStore.search(query); });
</script>

<style scoped>
.location-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  color: #515b69;
  font-size: 12px;
  font-weight: 700
}

.location-field input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border: 1px solid #dbe1e9;
  border-radius: 8px;
  font: inherit;
  outline-color: var(--color-primary)
}

.availability-info {
  display: flex;
  gap: 8px;
  padding: 11px;
  margin-bottom: 14px;
  border: 1px solid #dbe8e2;
  border-radius: 8px;
  background: #f5fbf8;
  color: #355246
}

.availability-info>.material-icons-outlined {
  color: #16845c;
  font-size: 18px
}

.availability-info strong {
  font-size: 12px
}

.availability-info p {
  margin: 3px 0 7px;
  font-size: 11px
}

.availability-info ul {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none
}

.availability-info li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px
}

.availability-info b {
  white-space: nowrap
}

.price-summary {
  margin: 12px 0 0;
  padding: 10px;
  border-radius: 8px;
  background: #f2f7ff;
  color: #516075;
  font-size: 12px
}

.price-summary strong {
  color: #07856c
}

.search-results {
  min-width: 0
}

.results-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 18px
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase
}

.results-heading h2,
.booking-panel h2 {
  margin: 0;
  color: #252b36
}

.results-heading>p {
  margin: 0;
  color: #717a89;
  font-size: 13px
}

.result-layout {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(360px, 440px);
  gap: 20px
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px
}

.teacher-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px;
  border: 1px solid #e3e7ed;
  border-radius: 12px;
  background: #fff;
  text-align: left;
  cursor: pointer
}

.teacher-card:hover,
.teacher-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 5px 14px rgba(35, 84, 182, .09)
}

.avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #08b294;
  color: #fff;
  font-weight: 800
}

.teacher-data {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 3px
}

.teacher-data small,
.price small {
  color: #727a88;
  font-size: 12px
}

.rating {
  color: #b27700;
  font-size: 12px
}

.price {
  display: flex;
  flex-direction: column;
  align-items: end;
  color: #00876f;
  font-weight: 800;
  font-size: 14px
}

.booking-panel {
  position: sticky;
  top: 86px;
  align-self: start;
  padding: 22px;
  background: #fff;
  border: 1px solid #e3e7ed;
  border-radius: 16px
}

.class-name {
  color: #697181;
  font-size: 14px
}

.mode-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 16px 0
}

.mode-options button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  border: 1px solid #dce2ea;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 13px
}

.mode-options button.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #edf3ff;
  font-weight: 700
}

.mode-options .material-icons-outlined {
  font-size: 17px
}

.selection {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px
}

.selection .material-icons-outlined {
  color: var(--color-primary)
}

.selection small,
.selection strong {
  display: block
}

.selection small {
  color: #77808d;
  font-size: 11px
}

.selection strong {
  font-size: 13px
}

.date-field,
.schedule-fields label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #515b69;
  font-size: 12px;
  font-weight: 700
}

.date-field {
  margin: 14px 0
}

.date-field input,
.schedule-fields select {
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #d5dce6;
  border-radius: 9px;
  outline: none;
  background: #fbfcfe;
  color: #252b36;
  font: inherit;
  transition: border-color .2s, box-shadow .2s, background .2s
}

.date-field input {
  color-scheme: light
}

.date-field input:focus,
.schedule-fields select:focus {
  border-color: var(--color-primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(35, 84, 182, .12)
}

.schedule-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px
}

.availability-loading,
.empty-schedule {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  margin: 14px 0;
  padding: 10px 12px;
  border-radius: 9px;
  background: #f5f7fb;
  color: #697181;
  font-size: 12px
}

.availability-loading .spinner {
  width: 14px;
  height: 14px;
  border-width: 2px
}

.empty-schedule {
  color: #a45e00;
  background: #fff8eb
}

.continue {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border: 0;
  border-radius: 9px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 800;
  cursor: pointer
}

.continue:disabled {
  opacity: .5;
  cursor: not-allowed
}

.error {
  color: #c42b2b;
  font-size: 12px
}

.loading,
.empty {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #747d8c;
  text-align: center
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #dbe5f8;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin .8s linear infinite
}

.empty .material-icons-outlined {
  font-size: 48px
}

@keyframes spin {
  to {
    transform: rotate(360deg)
  }
}

@media(max-width:1100px) {
  .result-layout {
    grid-template-columns: 1fr
  }

  .booking-panel {
    position: static
  }
}

@media(max-width:600px) {
  .results-heading {
    align-items: start;
    flex-direction: column
  }

  .teacher-card {
    padding: 11px
  }

  .booking-panel {
    padding: 16px
  }

  .schedule-fields {
    grid-template-columns: 1fr
  }
}
</style>
