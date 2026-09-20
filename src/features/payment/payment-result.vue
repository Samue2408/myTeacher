<template>
  <main class="payment-result-page">
    <section class="result-card">
      <!-- Estado: confirmando el pago -->
      <div v-if="checking" class="state">
        <span class="spinner" />
        <h1>{{ mensajeInicial }}</h1>
        <p>Estamos confirmando el pago con Mercado Pago. No cierres esta ventana.</p>
      </div>

      <!-- Estado: pago confirmado -->
      <div v-else-if="isPaid" class="state success">
        <span class="material-icons-outlined status-icon">check_circle</span>
        <h1>¡Pago confirmado!</h1>
        <p v-if="booking?.tutorName">
          Tu clase con <strong>{{ booking.tutorName }}</strong> quedó reservada.
        </p>
        <p v-else>Tu clase quedó reservada.</p>
        <dl v-if="booking" class="details">
          <div v-if="booking.date">
            <dt>Fecha</dt>
            <dd>{{ formattedDate }}</dd>
          </div>
          <div v-if="booking.startTime">
            <dt>Horario</dt>
            <dd>{{ booking.startTime }} - {{ booking.endTime }}</dd>
          </div>
        </dl>
        <button class="primary" type="button" @click="router.push('/bookings')">Ver mis reservas</button>
      </div>

      <!-- Estado: pago rechazado -->
      <div v-else-if="mpStatus === 'rejected'" class="state rejected">
        <span class="material-icons-outlined status-icon">error_outline</span>
        <h1>Tu pago fue rechazado</h1>
        <p>No se pudo procesar el pago. Puedes intentarlo de nuevo con otro medio de pago.</p>
        <button class="primary" type="button" @click="router.back()">Reintentar pago</button>
        <button class="secondary" type="button" @click="router.push('/bookings')">Ir a Mis reservas</button>
      </div>

      <!-- Estado: pendiente / sin confirmar todavía -->
      <div v-else class="state pending">
        <span class="material-icons-outlined status-icon">schedule</span>
        <h1>Estamos confirmando tu pago</h1>
        <p>Puede tardar unos minutos más. Te avisaremos, o revisa el estado en Mis reservas.</p>
        <button class="primary" type="button" @click="router.push('/bookings')">Ir a Mis reservas</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BookingsService } from '@/api/bookings.service';

const route = useRoute();
const router = useRouter();

const bookingId = route.query.external_reference;
const mpStatus = route.query.status || route.query.collection_status;

const mensajeInicial = computed(() => {
  if (mpStatus === 'rejected') return 'Revisando tu pago...';
  if (mpStatus === 'pending') return 'Tu pago está pendiente';
  return 'Confirmando tu pago...';
});

const booking = ref(null);
const checking = ref(true);
const isPaid = computed(() => booking.value && booking.value.status !== 'Pendiente por pago');

let pollTimer = null;
let attempts = 0;
const MAX_ATTEMPTS = 10; // ~20s con intervalo de 2s

async function poll() {
  attempts++;
  try {
    booking.value = await BookingsService.getById(bookingId);
  } catch (e) {
    // reintenta en el próximo ciclo
  }

  const resuelto = isPaid.value || mpStatus === 'rejected';
  if (resuelto || attempts >= MAX_ATTEMPTS) {
    checking.value = false;
    clearInterval(pollTimer);
  }
}

const formattedDate = computed(() =>
  booking.value?.date &&
  new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(
    new Date(`${String(booking.value.date).slice(0, 10)}T12:00:00`)
  )
);

onMounted(() => {
  if (!bookingId) {
    checking.value = false;
    return;
  }
  poll();
  pollTimer = setInterval(poll, 2000);
});

onBeforeUnmount(() => clearInterval(pollTimer));
</script>

<style scoped>
.payment-result-page {
  min-height: calc(100vh - 8vh);
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: #f6f8fc;
  font-family: Inter, sans-serif;
  color: #252b36;
}

.result-card {
  width: min(100%, 480px);
  box-sizing: border-box;
  padding: 40px 32px;
  background: #fff;
  border: 1px solid #e5e9f0;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 42, 55, 0.05);
  text-align: center;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.state h1 {
  margin: 18px 0 8px;
  font-size: 22px;
}

.state p {
  margin: 0 0 4px;
  color: #707987;
  font-size: 14px;
  line-height: 1.5;
}

.status-icon {
  font-size: 56px;
}

.success .status-icon {
  color: #147749;
}

.pending .status-icon {
  color: #a45e00;
}

.rejected .status-icon {
  color: #c42b2b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #dce4f2;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.details {
  display: grid;
  gap: 0;
  width: 100%;
  margin: 20px 0 4px;
  text-align: left;
}

.details div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #edf0f3;
}

.details dt {
  color: #707987;
  font-size: 13px;
}

.details dd {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  text-transform: capitalize;
}

.primary,
.secondary {
  width: 100%;
  margin-top: 14px;
  padding: 13px;
  border: 0;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.primary {
  background: var(--color-primary);
  color: #fff;
}

.secondary {
  background: #f0f3f8;
  color: var(--color-primary);
}

@media (max-width: 600px) {
  .result-card {
    padding: 28px 20px;
  }
}
</style>