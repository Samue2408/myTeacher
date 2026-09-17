<template>
  <div class="bookings-container">
    <!-- Columna 1: Reservas Aceptadas/Completadas -->
    <div class="bookings-column">
      <h4 class="column-title">Historial de Reservas</h4>
      <ul class="bookings-timeline" v-if="paginatedAcceptedBookings.length > 0">
        <BookingCard
          v-for="booking in paginatedAcceptedBookings"
          :key="booking._id"
          :booking="booking"
          :isLoading="isLoading"
          @complete="handleComplete"
          @review="openReview"
        />
      </ul>
      <p v-else class="empty-message">No hay reservas completadas.</p>
      <div v-if="acceptedPages > 1" class="pagination">
        <button type="button" :disabled="acceptedPage === 1" @click="acceptedPage--"><span class="material-icons-outlined">chevron_left</span></button>
        <span>Página {{ acceptedPage }} de {{ acceptedPages }}</span>
        <button type="button" :disabled="acceptedPage === acceptedPages" @click="acceptedPage++"><span class="material-icons-outlined">chevron_right</span></button>
      </div>
    </div>

    <!-- Columna 2: Reservas Pendientes -->
    <div class="bookings-column pending">
      <h4 class="column-title">Pendientes de Aceptar</h4>
      <ul class="bookings-timeline" v-if="paginatedPendingBookings.length > 0">
        <BookingCard
          v-for="booking in paginatedPendingBookings"
          :key="booking._id"
          :booking="booking"
          :pending="true"
          :isLoading="isLoading"
          @accept="handleAccept"
          @reject="handleReject"
        />
      </ul>
      <p v-else class="empty-message">No hay reservas pendientes.</p>
      <div v-if="pendingPages > 1" class="pagination">
        <button type="button" :disabled="pendingPage === 1" @click="pendingPage--"><span class="material-icons-outlined">chevron_left</span></button>
        <span>Página {{ pendingPage }} de {{ pendingPages }}</span>
        <button type="button" :disabled="pendingPage === pendingPages" @click="pendingPage++"><span class="material-icons-outlined">chevron_right</span></button>
      </div>
    </div>
    <ScrollToTop />

    <div v-if="reviewBooking" class="review-modal-overlay" @click.self="closeReview">
      <section class="review-modal" role="dialog" aria-modal="true" aria-labelledby="received-review-title">
        <button class="review-close" type="button" aria-label="Cerrar reseña" @click="closeReview"><span class="material-icons-outlined">close</span></button>
        <p class="review-eyebrow">Reseña recibida</p>
        <h4 id="received-review-title">{{ reviewBooking.subject?.name || 'Clase completada' }}</h4>
        <p class="review-student">Opinión de {{ reviewBooking.student?.name || 'tu estudiante' }}</p>
        <div v-if="isReviewLoading" class="review-loading"><span class="review-spinner" /> Cargando reseña...</div>
        <ReviewDetails v-else-if="currentReview" :review="currentReview" />
        <p v-else class="no-review">Este estudiante aún no ha dejado una reseña para esta clase.</p>
      </section>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userStore";
import { useBookingsStore } from "@/stores/bookingsStore";
import { useReviewsStore } from "@/stores/reviewsStore";
import BookingCard from "./BookingCard.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import ReviewDetails from "@/shared/components/ReviewDetails.vue";
import type { BookingsType } from "@/types/bookings";

const userStore = useUserStore();
const bookingsStore = useBookingsStore();
const reviewsStore = useReviewsStore();
const { isLoading } = storeToRefs(bookingsStore);
const { currentReview, isLoading: isReviewLoading } = storeToRefs(reviewsStore);
const reviewBooking = ref<BookingsType | null>(null);
const pageSize = 5;
const acceptedPage = ref(1);
const pendingPage = ref(1);
const acceptedPages = computed(() => Math.max(1, Math.ceil(bookingsStore.acceptedBookings.length / pageSize)));
const pendingPages = computed(() => Math.max(1, Math.ceil(bookingsStore.pendingBookings.length / pageSize)));
const paginatedAcceptedBookings = computed(() => bookingsStore.acceptedBookings.slice((acceptedPage.value - 1) * pageSize, acceptedPage.value * pageSize));
const paginatedPendingBookings = computed(() => bookingsStore.pendingBookings.slice((pendingPage.value - 1) * pageSize, pendingPage.value * pageSize));
watch(acceptedPages, (pages) => { if (acceptedPage.value > pages) acceptedPage.value = pages; });
watch(pendingPages, (pages) => { if (pendingPage.value > pages) pendingPage.value = pages; });

// Aceptar booking
const handleAccept = async (booking) => {
  await bookingsStore.acceptBooking(booking._id);
};

// Rechazar booking
const handleReject = async (booking) => {
  await bookingsStore.rejectBooking(booking._id);
};

const handleComplete = async (booking) => {
  await bookingsStore.completeBooking(booking._id);
};

const openReview = async (booking: BookingsType) => {
  reviewBooking.value = booking;
  await reviewsStore.fetchByBooking(booking._id);
};

const closeReview = () => {
  reviewBooking.value = null;
  reviewsStore.clearCurrentReview();
};

// Cargar bookings al montar el componente
onMounted(async () => {
  if (userStore.currentUser?._id) {
    await bookingsStore.fetchBookingsByTutor(userStore.currentUser._id);
  }
});
</script>

<style scoped>
.bookings-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
}

.bookings-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

.bookings-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  padding-left: 20px;
  list-style: none;
  margin: 0;
  padding: 0 20px;
}

.bookings-timeline::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e4ec;
}

.empty-message {
  text-align: center;
  color: #999;
  font-size: 14px;
  font-style: italic;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.pagination { display: flex; align-items: center; justify-content: center; gap: 10px; color: #697383; font-size: 12px; }
.pagination button { display: grid; place-items: center; width: 30px; height: 30px; border: 1px solid #dce2ea; border-radius: 7px; background: #fff; color: var(--color-primary); cursor: pointer; }
.pagination button:disabled { opacity: .45; cursor: not-allowed; }
.pagination .material-icons-outlined { font-size: 18px; }
.review-modal-overlay { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(16, 24, 40, .52); }
.review-modal { position: relative; width: min(100%, 420px); padding: 26px; border-radius: 14px; background: #fff; box-shadow: 0 16px 40px rgba(16, 24, 40, .2); }
.review-close { position: absolute; top: 12px; right: 12px; display: grid; padding: 4px; border: 0; background: transparent; color: #68758a; cursor: pointer; }
.review-eyebrow { margin: 0 0 4px; color: var(--color-primary); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.review-modal h4 { margin: 0; color: #252b34; font-size: 19px; }.review-student { margin: 6px 0 0; color: #727b88; font-size: 13px; }
.review-loading { display: flex; align-items: center; gap: 9px; min-height: 80px; color: #737b88; font-size: 13px; }.review-spinner { width: 18px; height: 18px; border: 2px solid #dce4f2; border-top-color: var(--color-primary); border-radius: 50%; animation: spin .8s linear infinite; }
.no-review { margin: 20px 0 0; padding: 14px; border-radius: 8px; background: #f6f8fa; color: #687383; font-size: 13px; line-height: 1.5; }@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 768px) {
  .bookings-container {
    grid-template-columns: 1fr;
  }
}
</style>
