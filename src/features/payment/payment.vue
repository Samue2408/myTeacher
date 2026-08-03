<template>
  <main class="payment-page">
    <section v-if="success" class="success-card"><span class="material-icons-outlined">check_circle</span><h1>¡Pago confirmado!</h1><p>Tu reserva quedó registrada y podrás verla desde “Mis reservas”.</p><button @click="goToBookings">Ver mis reservas</button></section>
    <section v-else-if="!draft" class="missing-card"><span class="material-icons-outlined">event_busy</span><h1>No hay una reserva pendiente</h1><p>Selecciona una clase y un horario antes de ir al pago.</p><button @click="router.push('/search')">Buscar clases</button></section>
    <div v-else class="payment-layout">
      <section class="payment-form"><button class="back" @click="router.back()"><span class="material-icons-outlined">arrow_back</span> Volver a la reserva</button><p class="eyebrow">Paso 2 de 2</p><h1>Finaliza tu pago</h1><p class="subtitle">Esta es una simulación: no se procesará ningún cobro real.</p>
        <div class="methods"><label v-for="method in methods" :key="method.value" :class="{ selected: paymentMethod === method.value }"><input v-model="paymentMethod" type="radio" :value="method.value" /><span class="material-icons-outlined">{{ method.icon }}</span><span>{{ method.label }}</span></label></div>
        <form @submit.prevent="pay"><template v-if="paymentMethod === 'card'"><label>Número de tarjeta<input v-model="card.number" inputmode="numeric" maxlength="19" placeholder="1234 5678 9012 3456" @input="formatCard" /></label><div class="form-row"><label>Nombre en la tarjeta<input v-model.trim="card.name" placeholder="Nombre completo" /></label><label>Vencimiento<input v-model="card.expiry" maxlength="5" placeholder="MM/AA" @input="formatExpiry" /></label><label>CVV<input v-model="card.cvv" inputmode="numeric" maxlength="4" placeholder="123" /></label></div></template><p v-else class="alternative-note">Al confirmar simularemos la autorización mediante {{ paymentMethod === 'pse' ? 'PSE' : 'billetera digital' }}.</p><p v-if="error" class="error">{{ error }}</p><button class="pay-button" :disabled="paying">{{ paying ? 'Confirmando pago...' : `Pagar ${formatCurrency(draft.price)}` }}</button></form><p class="security"><span class="material-icons-outlined">lock</span> Pago simulado y seguro. No guardamos datos de tarjeta.</p></section>
      <aside class="summary"><p class="eyebrow">Resumen de reserva</p><h2>{{ draft.subjectName }}</h2><p class="tutor">con {{ draft.tutorName }}</p><dl><div><dt>Fecha</dt><dd>{{ formattedDate }}</dd></div><div><dt>Horario</dt><dd>{{ draft.startTime }} - {{ draft.endTime }}</dd></div><div><dt>Modalidad</dt><dd>{{ draft.type }}</dd></div></dl><div class="total"><span>Total a pagar</span><strong>{{ formatCurrency(draft.price) }}</strong></div></aside>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { BookingsService } from "@/api/bookings.service";
import { useUserStore } from "@/stores/userStore";
import { useBookingsStore } from "@/stores/bookingsStore";

const router = useRouter();
const userStore = useUserStore();
const bookingsStore = useBookingsStore();

const draft = ref(null), success = ref(false), paymentMethod = ref('card'), paying = ref(false), error = ref('');
const card = ref({ number:'', name:'', expiry:'', cvv:'' });
const methods = [{ value:'card',label:'Tarjeta de crédito o débito',icon:'credit_card'},{value:'pse',label:'PSE',icon:'account_balance'},{value:'wallet',label:'Billetera digital',icon:'account_balance_wallet'}];

onMounted(() => {
  try { draft.value = JSON.parse(localStorage.getItem('bookingDraft') || 'null'); } catch { localStorage.removeItem('bookingDraft'); }
});

const formattedDate = computed(() => draft.value && new Intl.DateTimeFormat('es-CO',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${draft.value.date}T12:00:00`)));
const formatCurrency = amount => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(amount || 0);
const formatCard = () => card.value.number = card.value.number.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
const formatExpiry = () => card.value.expiry = card.value.expiry.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2');
const validCard = () => card.value.number.replace(/\s/g,'').length === 16 && card.value.name.length > 2 && /^\d{2}\/\d{2}$/.test(card.value.expiry) && /^\d{3,4}$/.test(card.value.cvv);

const refreshBookings = async () => {
  const studentId = userStore.currentUser?._id;
  if (!studentId) return;
  await bookingsStore.refreshBookingsByStudent(studentId);
};

const goToBookings = async () => {
  await refreshBookings();
  router.push('/bookings');
};

const createJitsiLink = () => {
  const roomId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  return `https://meet.jit.si/myteacher-${roomId}`;
};

const pay = async () => {
  error.value = '';
  if (paymentMethod.value === 'card' && !validCard()) {
    error.value = 'Completa los datos de tarjeta con información válida de prueba.';
    return;
  }

  paying.value = true;
  try {
    const { tutorName, subjectName, hourlyRate, durationHours, ...payload } = draft.value;
    const bookingPayload = {
      ...payload,
      ...(draft.value.type === 'Virtual' ? { videoCallLink: createJitsiLink() } : {}),
    };
    const created = await BookingsService.createBooking(bookingPayload);
    if (!created?._id) throw new Error();

    await refreshBookings();
    localStorage.removeItem('bookingDraft');
    success.value = true;
  } catch {
    error.value = 'No pudimos registrar la reserva. Inténtalo nuevamente.';
  } finally {
    paying.value = false;
  }
};
</script>

<style scoped>
.payment-page{min-height:calc(100vh - 8vh);display:grid;place-items:center;padding:32px 20px;background:#f6f8fc;font-family:Inter,sans-serif;color:#252b36}.payment-layout{display:grid;grid-template-columns:minmax(0,580px) minmax(300px,390px);gap:22px;width:min(100%,1000px)}.payment-form,.summary,.success-card,.missing-card{background:#fff;border:1px solid #e5e9f0;border-radius:16px;box-shadow:0 8px 24px rgba(31,42,55,.05)}.payment-form{padding:30px}.back{display:flex;align-items:center;gap:5px;padding:0;margin-bottom:24px;border:0;background:none;color:var(--color-primary);cursor:pointer;font-weight:700}.back .material-icons-outlined{font-size:17px}.eyebrow{margin:0 0 7px;color:var(--color-primary);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}h1,h2,p{margin-top:0}.payment-form h1{margin-bottom:7px;font-size:28px}.subtitle,.tutor{color:#707987;font-size:14px}.methods{display:grid;gap:9px;margin:24px 0}.methods label{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #dde3eb;border-radius:9px;cursor:pointer;font-size:14px}.methods label.selected{border-color:var(--color-primary);background:#f0f5ff;color:var(--color-primary);font-weight:700}.methods input{accent-color:var(--color-primary); width: 5%}.methods .material-icons-outlined{font-size:19px}form>label,.form-row label{display:flex;flex-direction:column;gap:6px;color:#4f5968;font-size:12px;font-weight:700}input{box-sizing:border-box;width:100%;padding:11px;border:1px solid #dce2e9;border-radius:7px;outline:none;font:inherit}.form-row{display:grid;grid-template-columns:1.6fr .7fr .55fr;gap:10px;margin-top:12px}.alternative-note{padding:14px;border-radius:8px;background:#f5f7fb;color:#5f6876;font-size:13px}.pay-button,.success-card button,.missing-card button{width:100%;margin-top:22px;padding:13px;border:0;border-radius:9px;background:var(--color-primary);color:#fff;font-size:14px;font-weight:800;cursor:pointer}.pay-button:disabled{opacity:.7;cursor:wait}.error{margin:15px 0 0;color:#c43232;font-size:13px}.security{display:flex;justify-content:center;align-items:center;gap:5px;margin:16px 0 0;color:#78818f;font-size:12px}.security .material-icons-outlined{font-size:15px}.summary{align-self:start;padding:28px}.summary h2{margin-bottom:5px;font-size:21px}.summary dl{margin:26px 0}.summary dl div{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #edf0f4}.summary dt{color:#747d8b;font-size:13px}.summary dd{margin:0;font-size:13px;font-weight:700}.total{display:flex;justify-content:space-between;align-items:center;padding-top:4px}.total span{font-weight:700}.total strong{color:#00866f;font-size:20px}.success-card,.missing-card{max-width:450px;padding:40px;text-align:center}.success-card>.material-icons-outlined,.missing-card>.material-icons-outlined{font-size:58px;color:#08a185}.missing-card>.material-icons-outlined{color:#8b94a1}.success-card h1,.missing-card h1{margin:10px 0}.success-card p,.missing-card p{color:#6f7886}.success-card button,.missing-card button{max-width:240px}@media(max-width:760px){.payment-page{align-items:start;padding:20px 14px}.payment-layout{grid-template-columns:1fr}.summary{order:-1}.payment-form,.summary{padding:22px}.form-row{grid-template-columns:1fr}.payment-form h1{font-size:24px}}
</style>
