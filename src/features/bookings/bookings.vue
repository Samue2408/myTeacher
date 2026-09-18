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
            <div>
              <button v-if="(booking.status == 'Pendiente por pago' || env != 'development')" class="clear-filters" @click="handlePayment(booking._id)">Pagar</button>
              <button  class="details-button" type="button" @click="selectedBooking = booking">Ver detalles</button>
            </div>
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

    <div v-if="selectedBooking" class="modal-overlay" @click.self="closeDetails">
      <section class="details-modal" role="dialog" aria-modal="true" aria-labelledby="booking-details-title">
        <button class="close-button" type="button" aria-label="Cerrar detalles" @click="closeDetails">
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

        <section v-if="canManageReview" class="review-section" aria-labelledby="review-title">
          <div class="review-heading"><p class="eyebrow">Tu experiencia</p><h3 id="review-title">Reseña de la clase</h3></div>
          <div v-if="isReviewLoading" class="review-loading" aria-live="polite"><span class="spinner" /> Cargando reseña...</div>
          <template v-else-if="currentReview && !isEditingReview">
            <ReviewDetails :review="currentReview" />
            <div class="review-actions"><button type="button" class="review-secondary" @click="startEditReview">Editar</button><button type="button" class="review-delete" :disabled="isReviewSaving" @click="removeReview">Eliminar</button></div>
          </template>
          <form v-else class="review-form" @submit.prevent="submitReview">
            <p class="review-help">{{ isEditingReview ? 'Actualiza tu valoración de esta clase.' : 'Comparte cómo fue tu experiencia con el tutor.' }}</p>
            <div class="star-picker" role="radiogroup" aria-label="Calificación">
              <button v-for="star in 5" :key="star" type="button" class="material-icons-outlined" :class="{ active: star <= reviewForm.rating }" role="radio" :aria-checked="star === reviewForm.rating" :aria-label="`${star} ${star === 1 ? 'estrella' : 'estrellas'}`" @click="reviewForm.rating = star; reviewError = ''">star</button>
            </div>
            <label for="review-comments">Comentario</label>
            <textarea id="review-comments" v-model.trim="reviewForm.comments" maxlength="1000" placeholder="Cuéntanos sobre la clase" :disabled="isReviewSaving" />
            <p v-if="reviewError" class="review-error" role="alert">{{ reviewError }}</p>
            <div class="review-actions"><button v-if="isEditingReview" type="button" class="review-secondary" :disabled="isReviewSaving" @click="cancelEditReview">Cancelar</button><button type="submit" class="review-submit" :disabled="isReviewSaving">{{ isReviewSaving ? 'Guardando...' : isEditingReview ? 'Guardar cambios' : 'Enviar reseña' }}</button></div>
          </form>
        </section>

        <a v-if="selectedBooking.type === 'Virtual' && selectedBooking.videoCallLink" :href="selectedBooking.videoCallLink" target="_blank" rel="noopener" class="join-button">Unirse a la videollamada</a>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import ComboBox from "@/shared/components/comboBox.vue";
import ReviewDetails from "@/shared/components/ReviewDetails.vue";
import { useBookingsStore } from "@/stores/bookingsStore";
import { useReviewsStore } from "@/stores/reviewsStore";
import { useUserStore } from "@/stores/userStore";
import type { BookingsType } from "@/types/bookings";
import { useRouter } from "vue-router";

const bookingsStore = useBookingsStore();
const reviewsStore = useReviewsStore();
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const { isLoadingStudent: isLoading } = storeToRefs(bookingsStore);
const { currentReview, isLoading: isReviewLoading, isSaving: isReviewSaving } = storeToRefs(reviewsStore);

const statusFilter = ref("");
const tutorFilter = ref("");
const selectedBooking = ref<BookingsType | null>(null);
const isEditingReview = ref(false);
const reviewError = ref("");
const reviewForm = ref({ rating: 0, comments: "" });
const bookings = computed<BookingsType[]>(() => [...(bookingsStore.studentBookings ?? [])].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}));

const router = useRouter();
const statusOptions = [
  { label: "Todos los estados", value: "" },
  { label: "Pendientes por aceptar", value: "Pendiente por aceptar" },
  { label: "Pendientes por pago", value: "Pendiente por pago" },
  { label: "Aceptadas", value: "Aceptada" },
  { label: "Completadas", value: "Completada" },
  { label: "Canceladas", value: "Cancelada" },
];

const getTutorName = (booking: BookingsType) => booking.tutor?.name || "Tutor no disponible";

const tutorOptions = computed(() => {
  const names = [...new Set(bookings.value.map(getTutorName).filter((name) => name !== "Tutor no disponible"))];
  return [{ label: "Todos los tutores", value: "" }, ...names.map((name) => ({ label: name, value: name }))];
});

const filteredBookings = computed(() => bookings.value.filter((booking) =>
  (!statusFilter.value || booking.status === statusFilter.value) &&
  (!tutorFilter.value || getTutorName(booking) === tutorFilter.value)
));
const env = import.meta.env.VITE_ENV;

const handlePayment = (id: string) => {
  if(env == "development") {
    router.push('/payment')
  } else {
    router.push(`/payment/mercado-pago/${id}`)
  }
}

const hasActiveFilters = computed(() => Boolean(statusFilter.value || tutorFilter.value));
const clearFilters = () => { statusFilter.value = ""; tutorFilter.value = ""; };
const isStudent = computed(() => ["estudiante", "student"].includes(String(currentUser.value?.role || "").toLocaleLowerCase()));
const isCompletedBooking = (booking: BookingsType) => booking.status.toLocaleLowerCase("es-CO") === "completada";
const canManageReview = computed(() => Boolean(selectedBooking.value && isStudent.value && isCompletedBooking(selectedBooking.value)));

const formatDate = (date: string) => new Intl.DateTimeFormat("es-CO", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
}).format(new Date(`${date.slice(0, 10)}T12:00:00`));

const formatCurrency = (amount: number) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0,
}).format(amount || 0);

const statusClass = (status: string) => `status-${status.toLocaleLowerCase("es-CO").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;

const resetReviewForm = () => { reviewForm.value = { rating: 0, comments: "" }; reviewError.value = ""; isEditingReview.value = false; };
const closeDetails = () => { selectedBooking.value = null; reviewsStore.clearCurrentReview(); resetReviewForm(); };
const startEditReview = () => {
  if (!currentReview.value) return;
  reviewForm.value = { rating: currentReview.value.rating, comments: currentReview.value.comments };
  reviewError.value = "";
  isEditingReview.value = true;
};
const cancelEditReview = () => resetReviewForm();
const validateReview = () => {
  if (!reviewForm.value.rating) return "Selecciona una calificación de 1 a 5 estrellas.";
  if (!reviewForm.value.comments.trim()) return "Escribe un comentario sobre la clase.";
  return "";
};
const submitReview = async () => {
  const validationError = validateReview();
  if (validationError || !selectedBooking.value) { reviewError.value = validationError; return; }
  const payload = { rating: reviewForm.value.rating, comments: reviewForm.value.comments.trim() };
  const saved = isEditingReview.value && currentReview.value
    ? await reviewsStore.updateReview(currentReview.value._id, payload)
    : await reviewsStore.createReview({ bookingId: selectedBooking.value._id, ...payload });
  if (saved) resetReviewForm();
};
const removeReview = async () => {
  if (!currentReview.value || !window.confirm("¿Seguro que deseas eliminar tu reseña?")) return;
  await reviewsStore.deleteReview(currentReview.value._id);
};

const loadBookings = (id?: string) => { if (id) bookingsStore.fetchBookingsByStudent(id); };
onMounted(() => loadBookings(currentUser.value?._id));
watch(() => currentUser.value?._id, loadBookings);
watch(selectedBooking, async (booking) => {
  resetReviewForm();
  reviewsStore.clearCurrentReview();
  if (booking && isStudent.value && isCompletedBooking(booking)) await reviewsStore.fetchByBooking(booking._id);
});
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
.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(16, 24, 40, .52); overflow-y: auto; }.details-modal { position: relative; width: min(100%, 500px); max-height: calc(100vh - 40px); padding: 28px; border-radius: 16px; background: #fff; overflow-y: auto; }.details-modal h2 { margin-bottom: 12px; font-size: 23px; }.close-button { position: absolute; top: 14px; right: 14px; display: grid; padding: 4px; border: 0; background: transparent; color: #68758a; cursor: pointer; }.details-list { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 24px 0; }.details-list div { padding: 10px 0; border-bottom: 1px solid #edf0f3; }.details-list dt { margin-bottom: 4px; color: #7b838f; font-size: 12px; }.details-list dd { margin: 0; color: #242933; font-size: 14px; font-weight: 600; }.join-button { display: block; text-align: center; }
.review-section { margin: 24px 0; padding: 20px; border: 1px solid #dfe8e6; border-radius: 12px; background: #fbfefd; }.review-heading .eyebrow { margin-bottom: 3px; font-size: 11px; }.review-heading h3 { margin: 0; font-size: 17px; }.review-loading { display: flex; align-items: center; gap: 9px; min-height: 72px; color: #737b88; font-size: 13px; }.review-loading .spinner { width: 18px; height: 18px; border-width: 2px; }.review-rating { display: flex; align-items: center; gap: 3px; margin: 16px 0 10px; }.review-rating .material-icons-outlined, .star-picker .material-icons-outlined { color: #d4d9df; }.review-rating .active, .star-picker .active { color: #f5b301; }.review-rating strong { margin-left: 5px; color: #4a5360; font-size: 13px; }.review-comment { margin: 0; color: #3f4650; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }.review-form { margin-top: 14px; }.review-help { margin: 0 0 12px; color: #69707d; font-size: 13px; }.star-picker { display: flex; gap: 3px; margin-bottom: 14px; }.star-picker button { padding: 0; border: 0; background: transparent; font-size: 29px; cursor: pointer; }.star-picker button:hover { transform: scale(1.08); }.review-form label { display: block; margin-bottom: 6px; color: #505966; font-size: 13px; font-weight: 700; }.review-form textarea { box-sizing: border-box; width: 100%; min-height: 88px; padding: 10px; resize: vertical; border: 1px solid #d8dee7; border-radius: 8px; color: #303743; font: inherit; font-size: 13px; }.review-form textarea:focus { outline: 2px solid rgba(8, 178, 148, .2); border-color: var(--color-primary); }.review-error { margin: 8px 0 0; color: #c42b2b; font-size: 12px; }.review-actions { display: flex; justify-content: flex-end; gap: 9px; margin-top: 14px; }.review-secondary, .review-delete, .review-submit { padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }.review-secondary { border: 1px solid #d8dee7; background: #fff; color: #4b5563; }.review-delete { border: 1px solid #f1c1c1; background: #fff; color: #c42b2b; }.review-submit { border: 0; background: var(--color-primary); color: #fff; }.review-actions button:disabled { cursor: wait; opacity: .65; }
.fade-enter-active, .fade-leave-active { transition: all .2s ease; }.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }@keyframes spin { to { transform: rotate(360deg); } }@media (max-width: 600px) { .reservas-container { padding: 32px 16px; }.filters { flex-direction: column; max-width: none; }.reservas-header h1 { font-size: 27px; }.details-list { grid-template-columns: 1fr; gap: 0; }.details-modal { padding: 24px 18px; }.review-section { padding: 16px; } }
</style>
