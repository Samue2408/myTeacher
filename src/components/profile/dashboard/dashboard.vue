<template>
  <template v-if="dashboardStore.isLoading">
    <div class="stats-cards">
      <StatsCards v-for="n in 4" :key="n" :skeleton="true" />
    </div>
  </template>
  <template v-else>
    <div class="stats-cards">
      <StatsCards title="Estudiantes" :value="dashboard.stats.students.toString()"
        :indicator-num="dashboard.stats.diferenceStudents" subtitle="Alumnos Atendidos" />
      <StatsCards title="Ingresos" :value=formatCurrency(dashboard.stats.income)
        :indicator-icon="dashboard.stats.diferenceIncomePercentage >= 0 ? 'call_made' : 'call_received'"
        :indicator-num="dashboard.stats.diferenceIncomePercentage" subtitle="Ganancias obtenidas" />
      <StatsCards title="Clases Canceladas" :value="dashboard.stats.canceledClasses.toString()"
        :indicator-num="dashboard.stats.diferenceCanceledClasses" :invert-condition-value="true"
        subtitle="Sesiones no realizadas" />
      <StatsCards title="Solicitudes pendientes" :value="dashboard.stats.pendingRequests.toString()"
        indicator-icon="visibility" subtitle="Reservas en espera" />
    </div>
  </template>

  <div class="content-bottom">
      <template v-if="dashboardStore.isLoading">
        <div class="bookings-cards">
          <div v-for="n in 2" :key="n">
            <BookingsCards :skeleton="true" />
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="dashboard.nextBookings.length > 0" class="bookings-cards">
          <BookingsCards v-for="booking in dashboard.nextBookings" :booking="booking" />
        </div>
        <div v-else class="bookings-cards">
          <div class="empty-card">
            <div class="emoji">🎯</div>
            <h3>¡Sin reservas por ahora!</h3>
            <p>Pero no te preocupes, tu perfil está listo para brillar. Sigue promocionando tus clases y pronto tendrás estudiantes esperando por ti.</p>
            <div class="decoration">
              <span>✨</span>
              <span>📚</span>
              <span>💡</span>
            </div>
          </div>
        </div>
        <div class="graph">
          <BookingChart :data="dashboard.students" />
        </div>
      </template>
  </div>

</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useDashboardSync } from "@/composables/useDashboardSync";
import { useUserStore } from "@/stores/userStore";
import StatsCards from "./statsCards.vue";
import BookingsCards from "./bookingsCards.vue";
import BookingChart from "./BookingChart.vue";

const dashboardStore = useDashboardStore();
const userStore = useUserStore();
const tutorId = userStore.currentUser?._id;
const { dashboard } = storeToRefs(dashboardStore)


function formatCurrency(value: any) {

  const format = (num: number) =>
    Number.isInteger(num) ? num.toString() : num.toFixed(1);

  if (value >= 1_000_000) {
    return `$${format(value / 1_000_000)}M`;
  }
  if (value >= 1_000) {
    return `$${format(value / 1_000)}K`;
  }
  return `$${value}`;

}

onMounted(async () => {
  if (tutorId) {
    await dashboardStore.fetchById(tutorId);
    useDashboardSync(tutorId); // 🔁 activa sincronización automática
  }
});
</script>

<style scoped>
.stats-cards {
  display: flex;
  gap: 20px;
}
.content-bottom {
  display: flex;
  gap: 20px;
}

.bookings-cards {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;  
  width: 24%;
  height: 450px;
}

.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border-radius: 12px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  height: 100%;
}

.empty-card .emoji {
  font-size: 48px;
  animation: bounce 2s infinite;
}

.empty-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.empty-card p {
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  max-width: 280px;
  line-height: 1.5;
  opacity: 0.95;
}

.empty-card .decoration {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-size: 24px;
}

.empty-card .decoration span {
  animation: float 3s ease-in-out infinite;
}

.empty-card .decoration span:nth-child(2) {
  animation-delay: 0.2s;
}

.empty-card .decoration span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.graph {
  flex: 1;
  display: flex;
  align-items: center;
}
</style>