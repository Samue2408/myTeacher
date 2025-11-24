<template>
  <div class="bookings-container">
    <!-- Columna 1: Reservas Aceptadas/Completadas -->
    <div class="bookings-column">
      <h4 class="column-title">Historial de Reservas</h4>
      <ul class="bookings-timeline" v-if="bookingsStore.acceptedBookings.length > 0">
        <BookingCard
          v-for="booking in bookingsStore.acceptedBookings"
          :key="booking._id"
          :booking="booking"
        />
      </ul>
      <p v-else class="empty-message">No hay reservas completadas.</p>
    </div>

    <!-- Columna 2: Reservas Pendientes -->
    <div class="bookings-column pending">
      <h4 class="column-title">Pendientes de Aceptar</h4>
      <ul class="bookings-timeline" v-if="bookingsStore.pendingBookings.length > 0">
        <PendingBookingCard
          v-for="booking in bookingsStore.pendingBookings"
          :key="booking._id"
          :booking="booking"
          :isLoading="isLoading"
          @accept="handleAccept"
          @reject="handleReject"
        />
      </ul>
      <p v-else class="empty-message">No hay reservas pendientes.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userStore";
import { useBookingsStore } from "@/stores/bookingsStore";
import BookingCard from "./BookingCard.vue";
import PendingBookingCard from "./PendingBookingCard.vue";

const userStore = useUserStore();
const bookingsStore = useBookingsStore();
const { isLoading } = storeToRefs(bookingsStore);

// Aceptar booking
const handleAccept = async (booking) => {
  await bookingsStore.acceptBooking(booking._id);
};

// Rechazar booking
const handleReject = async (booking) => {
  await bookingsStore.rejectBooking(booking._id);
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

/* Responsive */
@media (max-width: 768px) {
  .bookings-container {
    grid-template-columns: 1fr;
  }
}
</style>
