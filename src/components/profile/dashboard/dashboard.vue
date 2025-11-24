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
        <div class="bookings-cards">
          <BookingsCards />
          <BookingsCards />
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
}

.bookings-cards {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;  
  width: 30%;
}
</style>