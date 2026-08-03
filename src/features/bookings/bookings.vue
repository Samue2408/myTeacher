<template>
  <main class="reservas-container">
    <header class="reservas-header">
      <div>
        <p class="eyebrow">Mis clases</p>
        <h1>Mis reservas</h1>
        <p class="subtitle">Consulta el estado y los detalles de cada clase reservada.</p>
      </div>

      <div class="filters" aria-label="Filtros de reservas">
        <ComboBox v-model="statusFilter" :items="statusOptions" placeholder="Todos los estados" />
        <ComboBox v-model="tutorFilter" :items="tutorOptions" placeholder="Todos los tutores" />
      </div>
    </header>

    <section v-if="isLoading" class="loading-state" aria-live="polite">
      <span class="spinner" /> Cargando reservas...
    </section>

    <template v-else>
      <p class="results-count">{{ filteredBookings.length }} {{ filteredBookings.length === 1 ? 'reserva encontrada' : 'reservas encontradas' }}</p>

      <transition-group v-if="filteredBookings.length" name="fade" tag="section" class="reservas-grid">
        <article v-for="booking in filteredBookings" :key="booking._id" class="reserva-card">
          <div class="reserva-header">
            <div class="tutor">
              <div class="avatar" aria-hidden="true">{{ getTutorName(booking).charAt(0).toUpperCase() }}</div>
              <div>
                <p class="label">Tutor</p>
                <h2>{{ getTutorName(booking) }}</h2>
                <p class="subject"><span class="material-icons-outlined">school</span>{{ booking.subject?.name || 'Materia no disponible' }}</p>
              </div>
            </div>
            <span :class="['status', statusClass(booking.status)]">{{ booking.status }}</span>
          </div>

          <div class="booking-summary">
            <div>
              <span class="material-icons-outlined">calendar_today</span>
              <p><small>Fecha</small><strong>{{ formatDate(booking.date) }}</strong></p>
            </div>
            <div>
              <span class="material-icons-outlined">schedule</span>
              <p><small>Horario</small><strong>{{ booking.startTime }} - {{ booking.endTime }}</strong></p>
            </div>
            <div>
              <span class="material-icons-outlined">{{ booking.type === 'Virtual' ? 'videocam' : 'location_on' }}</span>
              <p><small>Modalidad</small><strong>{{ booking.type }}</strong></p>
            </div>
          </div>

          <footer class="reserva-footer">
            <strong class="price">{{ formatCurrency(booking.price) }}</strong>
            <button class="details-button" type="button" @click="selectedBooking = booking">Ver detalles</button>
          </footer>
        </article>
      </transition-group>

      <section v-else class="no-data">
        <span class="material-icons-outlined">event_busy</span>
        <h2>No encontramos reservas</h2>
        <p>{{ hasActiveFilters ? 'Prueba cambiando o limpiando los filtros.' : 'Aún no tienes reservas registradas.' }}</p>
        <button v-if="hasActiveFilters" type="button" class="clear-filters" @click="clearFilters">Limpiar filtros</button>
      </section>
    </template>

    <div v-if="selectedBooking" class="modal-overlay" @click.self="selectedBooking = null">
      <section class="details-modal" role="dialog" aria-modal="true" aria-labelledby="booking-details-title">
        <button class="close-button" type="button" aria-label="Cerrar detalles" @click="selectedBooking = null">
          <span class="material-icons-outlined">close</span>
        </button>
        <p class="eyebrow">Detalle de la reserva</p>
        <h2 id="booking-details-title">{{ selectedBooking.subject?.name || 'Clase reservada' }}</h2>
        <span :class="['status', statusClass(selectedBooking.status)]">{{ selectedBooking.status }}</span>

        <dl class="details-list">
          <div><dt>Tutor</dt><dd>{{ getTutorName(selectedBooking) }}</dd></div>
          <div><dt>Fecha</dt><dd>{{ formatDate(selectedBooking.date) }}</dd></div>
          <div><dt>Horario</dt><dd>{{ selectedBooking.startTime }} - {{ selectedBooking.endTime }}</dd></div>
          <div><dt>Modalidad</dt><dd>{{ selectedBooking.type }}</dd></div>
          <div><dt>Ubicación</dt><dd>{{ selectedBooking.location || 'Por confirmar' }}</dd></div>
          <div><dt>Valor de la clase</dt><dd>{{ formatCurrency(selectedBooking.price) }}</dd></div>
          <div><dt>Reseñas</dt><dd>{{ selectedBooking.reviewsCount || 0 }}</dd></div>
        </dl>

        <a v-if="selectedBooking.type === 'Virtual' && selectedBooking.videoCallLink" :href="selectedBooking.videoCallLink" target="_blank" rel="noopener" class="join-button">Unirse a la videollamada</a>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import ComboBox from "@/shared/components/comboBox.vue";
import { useBookingsStore } from "@/stores/bookingsStore";
import { useUserStore } from "@/stores/userStore";
import type { BookingsType } from "@/types/bookings";

const bookingsStore = useBookingsStore();
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const { isLoadingStudent: isLoading } = storeToRefs(bookingsStore);

const statusFilter = ref("");
const tutorFilter = ref("");
const selectedBooking = ref<BookingsType | null>(null);
const bookings = computed<BookingsType[]>(() => bookingsStore.studentBookings ?? []);

const statusOptions = [
  { label: "Todos los estados", value: "" },
  { label: "Pendientes", value: "Pendiente" },
  { label: "Aceptadas", value: "Aceptada" },
  { label: "Completadas", value: "Completada" },
  { label: "Canceladas", value: "Cancelada" },
];

const getTutorName = (booking: BookingsType) => booking.tutor?.[0]?.name || "Tutor no disponible";

const tutorOptions = computed(() => {
  const names = [...new Set(bookings.value.map(getTutorName).filter((name) => name !== "Tutor no disponible"))];
  return [{ label: "Todos los tutores", value: "" }, ...names.map((name) => ({ label: name, value: name }))];
});

const filteredBookings = computed(() => bookings.value.filter((booking) =>
  (!statusFilter.value || booking.status === statusFilter.value) &&
  (!tutorFilter.value || getTutorName(booking) === tutorFilter.value)
));

const hasActiveFilters = computed(() => Boolean(statusFilter.value || tutorFilter.value));
const clearFilters = () => { statusFilter.value = ""; tutorFilter.value = ""; };

const formatDate = (date: string) => new Intl.DateTimeFormat("es-CO", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
}).format(new Date(`${date.slice(0, 10)}T12:00:00`));

const formatCurrency = (amount: number) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0,
}).format(amount || 0);

const statusClass = (status: string) => `status-${status.toLocaleLowerCase("es-CO").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;

const loadBookings = (id?: string) => { if (id) bookingsStore.fetchBookingsByStudent(id); };
onMounted(() => loadBookings(currentUser.value?._id));
watch(() => currentUser.value?._id, loadBookings);
</script>

<style scoped>
.reservas-container { max-width: 1200px; margin: 0 auto; padding: 48px 24px; color: #20242b; font-family: Inter, sans-serif; }
.reservas-header { display: flex; justify-content: space-between; align-items: end; gap: 24px; flex-wrap: wrap; margin-bottom: 28px; }
.eyebrow { margin: 0 0 6px; color: var(--color-primary); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
h1, h2, p { margin-top: 0; }.reservas-header h1 { margin-bottom: 6px; font-size: 32px; }.subtitle { margin-bottom: 0; color: #69707d; }.filters { display: flex; gap: 12px; width: min(100%, 480px); }.filters > * { flex: 1; }
.results-count { margin: 0 0 16px; color: #69707d; font-size: 14px; }.reservas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 20px; }
.reserva-card { display: flex; flex-direction: column; min-height: 250px; padding: 22px; background: #fff; border: 1px solid #e8eaf0; border-radius: 16px; box-shadow: 0 5px 16px rgba(32, 36, 43, .05); transition: transform .2s, box-shadow .2s; }.reserva-card:hover { transform: translateY(-3px); box-shadow: 0 12px 26px rgba(32, 36, 43, .09); }
.reserva-header, .tutor, .booking-summary > div, .reserva-footer { display: flex; align-items: center; }.reserva-header, .reserva-footer { justify-content: space-between; gap: 12px; }.tutor { gap: 11px; min-width: 0; }.avatar { flex: 0 0 44px; width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: #08b294; font-size: 18px; font-weight: 700; }.label { margin-bottom: 2px; color: #7d8490; font-size: 11px; }.tutor h2 { margin: 0; font-size: 16px; }.subject { display: flex; align-items: center; gap: 4px; margin: 4px 0 0; color: var(--color-primary); font-size: 13px; font-weight: 600; }.subject .material-icons-outlined { font-size: 15px; }
.status { flex: 0 0 auto; padding: 5px 9px; border-radius: 999px; font-size: 11px; font-weight: 700; }.status-pendiente { color: #a45e00; background: #fff3df; }.status-aceptada { color: #147749; background: #e5f7ed; }.status-completada { color: #155ab5; background: #e8f1ff; }.status-cancelada { color: #c42b2b; background: #ffebeb; }
.booking-summary { display: grid; gap: 14px; margin: 25px 0; padding: 16px 0; border-block: 1px solid #edf0f3; }.booking-summary > div { gap: 9px; }.booking-summary .material-icons-outlined { color: #68758a; font-size: 18px; }.booking-summary p { display: flex; align-items: baseline; justify-content: space-between; width: 100%; margin: 0; }.booking-summary small { color: #7b838f; font-size: 12px; }.booking-summary strong { font-size: 13px; }.reserva-footer { margin-top: auto; }.price { color: #08a185; font-size: 16px; }.details-button, .clear-filters, .join-button { border: 0; border-radius: 8px; padding: 9px 13px; color: #fff; background: var(--color-primary); font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; }.details-button:hover, .join-button:hover { filter: brightness(.94); }
.loading-state, .no-data { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 240px; color: #737b88; text-align: center; }.loading-state { flex-direction: row; gap: 10px; }.spinner { width: 22px; height: 22px; border: 3px solid #dce4f2; border-top-color: var(--color-primary); border-radius: 50%; animation: spin .8s linear infinite; }.no-data .material-icons-outlined { margin-bottom: 12px; color: #9da6b3; font-size: 54px; }.no-data h2 { margin-bottom: 7px; color: #373d46; font-size: 19px; }.no-data p { margin-bottom: 16px; }.clear-filters { background: #f0f3f8; color: var(--color-primary); }
.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(16, 24, 40, .52); }.details-modal { position: relative; width: min(100%, 500px); padding: 28px; border-radius: 16px; background: #fff; }.details-modal h2 { margin-bottom: 12px; font-size: 23px; }.close-button { position: absolute; top: 14px; right: 14px; display: grid; padding: 4px; border: 0; background: transparent; color: #68758a; cursor: pointer; }.details-list { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 24px 0; }.details-list div { padding: 10px 0; border-bottom: 1px solid #edf0f3; }.details-list dt { margin-bottom: 4px; color: #7b838f; font-size: 12px; }.details-list dd { margin: 0; color: #242933; font-size: 14px; font-weight: 600; }.join-button { display: block; text-align: center; }
.fade-enter-active, .fade-leave-active { transition: all .2s ease; }.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }@keyframes spin { to { transform: rotate(360deg); } }@media (max-width: 600px) { .reservas-container { padding: 32px 16px; }.filters { flex-direction: column; max-width: none; }.reservas-header h1 { font-size: 27px; }.details-list { grid-template-columns: 1fr; gap: 0; } }
</style>
