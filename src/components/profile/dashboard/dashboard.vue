<template>
  <template v-if="dashboardStore.isLoading">
    <div class="stats-cards">
      <StatsCards v-for="n in 4" :key="n" :skeleton="true" />
    </div>
  </template>
  <template v-else>
    <div class="stats-cards">
      <StatsCards title="Estudiantes" :value="dashboardStore.dashboard.students.toString()"
        :indicator-num="dashboardStore.dashboard.diferenceStudents" subtitle="Alumnos Atendidos" />
      <StatsCards title="Ingresos" :value=formatCurrency(dashboardStore.dashboard.income)
        :indicator-icon="dashboardStore.dashboard.diferenceIncomePercentage >= 0 ? 'call_made' : 'call_received'"
        :indicator-num="dashboardStore.dashboard.diferenceIncomePercentage" subtitle="Ganancias obtenidas" />
      <StatsCards title="Clases Canceladas" :value="dashboardStore.dashboard.canceledClasses.toString()"
        :indicator-num="dashboardStore.dashboard.diferenceCanceledClasses" :invert-condition-value="true"
        subtitle="Sesiones no realizadas" />
      <StatsCards title="Solicitudes pendientes" :value="dashboardStore.dashboard.pendingRequests.toString()"
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
        <div class="bookings-cards">
          <BookingsCards />
          <BookingsCards />
        </div>
      </template>
  </div>

</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useDashboardSync } from "@/composables/useDashboardSync";
import { useUserStore } from "@/stores/userStore";
import StatsCards from "./statsCards.vue";
import BookingsCards from "./bookingsCards.vue";

const dashboardStore = useDashboardStore();
const userStore = useUserStore();
const tutorId = userStore.currentUser?._id;

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
}

.bookings-cards {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;  
  width: 25%;
}
</style>