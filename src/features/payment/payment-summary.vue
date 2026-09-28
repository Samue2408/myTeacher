<template>
  <main class="summary-page">
    <section v-if="!draft" class="missing-card">
      <span class="material-icons-outlined">event_busy</span>
      <h1>No hay una reserva pendiente</h1>
      <p>Selecciona una clase y un horario antes de continuar.</p>
      <button type="button" @click="router.push('/search')">Buscar clases</button>
    </section>
    <section v-else class="summary-card">
      <button class="back" type="button" @click="router.back"><span class="material-icons-outlined">arrow_back</span> Volver a la reserva</button>
      <p class="eyebrow">Paso 2 de 3</p>
      <h1>Resumen del pago</h1>
      <p class="subtitle">Revisa los datos de tu clase antes de continuar al pago.</p>

      <div class="class-heading">
        <span class="class-icon material-icons-outlined">school</span>
        <div><h2>{{ draft.subjectName }}</h2><p>Clase con {{ draft.tutorName }}</p></div>
      </div>

      <dl class="details">
        <div><dt><span class="material-icons-outlined">event</span>Fecha</dt><dd>{{ formattedDate }}</dd></div>
        <div><dt><span class="material-icons-outlined">schedule</span>Horario</dt><dd>{{ draft.startTime }} - {{ draft.endTime }} ({{ draft.durationHours }} {{ draft.durationHours === 1 ? 'hora' : 'horas' }})</dd></div>
        <div><dt><span class="material-icons-outlined">{{ draft.type === 'Virtual' ? 'videocam' : 'location_on' }}</span>Modalidad</dt><dd>{{ draft.type }}<small v-if="draft.type === 'Presencial'">{{ draft.location }}</small></dd></div>
      </dl>

      <div class="balance-choice">
        <div><label for="balance-discount">Usar saldo a favor</label><small>Disponible: {{ formatCurrency(availableBalance) }}</small></div>
        <input id="balance-discount" v-model.number="discount" type="number" min="0" :max="maxDiscount" step="1" :disabled="maxDiscount === 0" @change="normalizeDiscount" />
      </div>
      <p v-if="appliedDiscount" class="discount-line"><span>Descuento de tu saldo</span><strong>-{{ formatCurrency(appliedDiscount) }}</strong></p>
      <div class="total"><span>Total a pagar</span><strong>{{ formatCurrency(totalToPay) }}</strong></div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="continue" type="button" :disabled="isSubmitting" @click="handlePayment">{{ isSubmitting ? 'Preparando reserva...' : 'Continuar al pago' }} <span class="material-icons-outlined">arrow_forward</span></button>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { BookingsService } from "@/api/bookings.service";
import { useBookingsStore } from "@/stores/bookingsStore";
import { useUserStore } from "@/stores/userStore";  

const userStore = useUserStore();
const bookingsStore = useBookingsStore();

const router = useRouter();
const draft = ref(null);
const discount = ref(0);
const classPrice = ref(0);
const isSubmitting = ref(false);
const error = ref('');

onMounted(() => {
  try {
    draft.value = JSON.parse(localStorage.getItem("bookingDraft") || "null");
    if (draft.value) {
      classPrice.value = Number(draft.value.price || 0) + Number(draft.value.discount || 0);
      discount.value = Number(draft.value.discount || 0);
    }
  }
  catch { localStorage.removeItem("bookingDraft"); }
});

const availableBalance = computed(() => Math.max(0, Number(userStore.currentUser?.balance || 0)));
const maxDiscount = computed(() => Math.min(classPrice.value, availableBalance.value));
const appliedDiscount = computed(() => Math.min(maxDiscount.value, Math.max(0, Number(discount.value) || 0)));
const totalToPay = computed(() => Math.max(0, classPrice.value - appliedDiscount.value));

const normalizeDiscount = () => { discount.value = appliedDiscount.value; };

const createJitsiLink = () => {
  const roomId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  return `https://meet.jit.si/myteacher-${roomId}`;
};

const refreshBookings = async () => {
  const studentId = userStore.currentUser?._id;
  if (!studentId) return;
  await bookingsStore.refreshBookingsByStudent(studentId);
};

const handlePayment = async () => {
  if (isSubmitting.value) return;
  error.value = '';
  normalizeDiscount();
  isSubmitting.value = true;
  const env = import.meta.env.VITE_ENV;

  try {
    draft.value = { ...draft.value, price: totalToPay.value, discount: appliedDiscount.value };

    if (env === 'development') {
      localStorage.setItem('bookingDraft', JSON.stringify(draft.value));
      router.push('/payment');
      return;
    }

    const { tutorName, subjectName, hourlyRate, durationHours, ...payload } = draft.value;
    const bookingPayload = {
      ...payload,
      ...(draft.value.type === 'Virtual' ? { videoCallLink: createJitsiLink() } : {}),
    };
    const created = await BookingsService.createBooking(bookingPayload);
    if (!created?._id) throw new Error('No se pudo crear la reserva.');

    if (appliedDiscount.value > 0) {
      await userStore.adjustBalance(userStore.currentUser?._id, -appliedDiscount.value);
    }

    await refreshBookings();
    localStorage.removeItem('bookingDraft');
    router.push(`/payment/mercado-pago/${created._id}`);
  } catch (paymentError) {
    error.value = paymentError?.message || 'No pudimos preparar el pago. Inténtalo nuevamente.';
  } finally {
    isSubmitting.value = false;
  }
}

const formattedDate = computed(() => draft.value && new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${draft.value.date}T12:00:00`)));
const formatCurrency = amount => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount || 0);
</script>

<style scoped>
.summary-page{min-height:calc(100vh - 8vh);display:grid;place-items:center;padding:32px 20px;background:#f6f8fc;font-family:Inter,sans-serif;color:#252b36}.summary-card,.missing-card{width:min(100%,620px);box-sizing:border-box;padding:32px;background:#fff;border:1px solid #e5e9f0;border-radius:16px;box-shadow:0 8px 24px rgba(31,42,55,.05)}.back{display:flex;align-items:center;gap:5px;padding:0;margin-bottom:28px;border:0;background:none;color:var(--color-primary);cursor:pointer;font-weight:700}.back .material-icons-outlined{font-size:17px}.eyebrow{margin:0 0 7px;color:var(--color-primary);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}h1,h2,p{margin-top:0}.summary-card h1{margin-bottom:7px;font-size:30px}.subtitle{margin-bottom:28px;color:#707987;font-size:14px}.class-heading{display:flex;align-items:center;gap:13px;padding-bottom:22px;border-bottom:1px solid #edf0f3}.class-icon{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;color:#fff;background:var(--color-primary)}.class-heading h2{margin:0 0 4px;font-size:18px}.class-heading p{margin:0;color:#707987;font-size:13px}.details{display:grid;gap:0;margin:8px 0 22px}.details div{display:flex;justify-content:space-between;gap:20px;padding:15px 0;border-bottom:1px solid #edf0f3}.details dt{display:flex;align-items:center;gap:8px;color:#707987;font-size:13px}.details dt .material-icons-outlined{font-size:18px;color:var(--color-primary)}.details dd{margin:0;text-align:right;font-size:13px;font-weight:700}.details dd small{display:block;margin-top:4px;color:#707987;font-size:11px;font-weight:400}.total{display:flex;justify-content:space-between;align-items:center;padding:18px 0;color:#596474;font-size:14px}.total strong{color:#07856c;font-size:21px}.continue,.missing-card button{display:flex;justify-content:center;align-items:center;gap:7px;width:100%;padding:13px;border:0;border-radius:9px;background:var(--color-primary);color:#fff;font-size:14px;font-weight:800;cursor:pointer}.continue .material-icons-outlined{font-size:18px}.missing-card{text-align:center}.missing-card .material-icons-outlined{color:#9da6b3;font-size:54px}.missing-card h1{font-size:22px}.missing-card p{color:#707987}.missing-card button{margin-top:22px}@media(max-width:600px){.summary-card,.missing-card{padding:24px 18px}.summary-card h1{font-size:26px}.details div{align-items:flex-start;flex-direction:column;gap:6px}.details dd{text-align:left}}
</style>

<style scoped>
.balance-choice{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:15px 0;border-top:1px solid #edf0f3}.balance-choice label,.balance-choice small{display:block}.balance-choice label{font-size:13px;font-weight:700}.balance-choice small{margin-top:4px;color:#707987;font-size:11px}.balance-choice input{box-sizing:border-box;width:150px;padding:10px;border:1px solid #dce2e9;border-radius:7px;font:inherit;text-align:right}.balance-choice input:disabled{background:#f5f6f8}.discount-line{display:flex;justify-content:space-between;margin:0;color:#07856c;font-size:13px}.discount-line strong{font-weight:700}.error{margin:8px 0 0;color:#c42b2b;font-size:13px}.continue:disabled{opacity:.7;cursor:wait}
</style>
