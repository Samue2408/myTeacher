<template>
  <template v-if="dashboardStore.isLoading">
    <div class="cards">

      <div v-for="n in 4" :key="n">
        <Cards :skeleton="true" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="cards">

      <Cards title="Estudiantes" :value="dashboardStore.dashboard.students.toString()"
        :indicator-num="dashboardStore.dashboard.diferenceStudents" subtitle="Alumnos Atendidos" />
      <Cards title="Ingresos" :value=formatCurrency(dashboardStore.dashboard.income)
        :indicator-icon="dashboardStore.dashboard.diferenceIncomePercentage >= 0 ? 'call_made' : 'call_received'"
        :indicator-num="dashboardStore.dashboard.diferenceIncomePercentage" subtitle="Ganancias obtenidas" />
      <Cards title="Clases Canceladas" :value="dashboardStore.dashboard.canceledClasses.toString()"
        :indicator-num="dashboardStore.dashboard.diferenceCanceledClasses" :invert-condition-value="true"
        subtitle="Sesiones no realizadas" />
      <Cards title="Solicitudes pendientes" :value="dashboardStore.dashboard.pendingRequests.toString()"
        indicator-icon="visibility" subtitle="Reservas en espera" />
    </div>
  </template>

  <!-- <div class="highlight">
        <p>
        {{ currentUser.name }} está disponible para tutorías en
        <strong>{{ tutor.subject }}</strong
        >.
        </p>
        <button class="primary">Agendar tutoría</button>
    </div> -->

</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useDashboardSync } from "@/composables/useDashboardSync";
import { useUserStore } from "@/stores/userStore";
import Cards from "./cards.vue";

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
.cards {
  display: flex;
  gap: 20px;
}
</style>