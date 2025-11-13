<template>    
    <div class="cards">
        <template v-if="dashboardStore.isLoading">
            <div v-for="n in 6" :key="n" class="subjects-cell">
                <div>
                    <div class="category">
                        <p class="skltn skltn-text"></p>
                    </div>
                    <h4 class="skltn skltn-text"></h4>
                </div>
                <p class="description skltn skltn-text"></p>
                <div>
                    <hr>
                    <div class="price-actions">
                        <span class="skltn skltn-text" style="width: 60px"></span>
                        <div class="actions">
                            <span class="skltn skltn-text" style="width: 20px; height: 20px"></span>
                            <span class="skltn skltn-text" style="width: 20px; height: 20px; margin-left: 8px"></span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>

            <div class="card">
            <h3>Estudiantes</h3>
            <div class="value">
                <h2>10</h2> 
                <div class="indicator positive">
                <span>+3</span>
                </div>
            </div>
            <p>Alumnos atendidos</p>
            <!-- <div class="progress-bar">
                <div
                class="progress"
                :style="{ width: tutor.progress + '%' }"
                ></div>
            </div> -->
            </div>
    
            <div class="card">
            <h3>Ingresos</h3>
            <div class="value">
                <h2>$300k</h2> 
                <div class="indicator positive">
                <span class="material-icons-outlined">call_made</span>
                </div>
            </div>
            <p>Ganancias obtenidas</p>
            </div>

            <div class="card">
            <h3>Clases canceladas</h3>
            <div class="value">
                <h2>5</h2> 
                <div class="indicator negative">
                <span>+3</span>
                </div>
            </div>
            <p>Sesiones no realizadas</p>
            </div>
            
            <div class="card">
            <h3>Solicitudes pendientes</h3>
            <div class="value">
                <h2>3</h2> 
                <div class="indicator warning">
                <span class="material-icons-outlined">visibility</span>
                </div>
            </div>
            <p>Reservas en espera</p>
            </div>
        </template>
    </div>

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

const dashboardStore = useDashboardStore();
const userStore = useUserStore();
const tutorId = userStore.currentUser?._id;

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
.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.card h3 {
  font-size: 15px;
  color: #222;
  margin-bottom: 10px;
}

.value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.value h2 {
  font-size: 48px;
  font-weight: 600;
  color: #222;
}

.value .indicator {
  border-radius: 50%;
  padding: 5px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.value .indicator span {
  font-weight: 800;
  font-size: 12px;
}

.value .indicator.positive {
  background-color: #DCF4F0;
  color: #08B294;
}

.value .indicator.negative {
  background-color: #FCDCDB;
  color: #EE332D;
}

.value .indicator.warning {
  background-color: #FCFAE3;
  color: #CEBD00;
}

.card p {
  font-size: 13px;
  font-weight: 200;
  color: #222;

}
</style>