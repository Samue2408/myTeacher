<template>
  <div v-if="loading" class="loading">
    <div class="spinner"></div>
  </div>

  <div v-else-if="!currentUser" class="not-found">No se encontró el usuario.</div>

  <div v-else class="dashboard">
    <aside class="sidebar">
      <button class="back" @click="goBack">← Volver</button>
      <img v-if="currentUser.img" :src="currentUser.img" :alt="currentUser.name" class="profilePic" />
      <div v-else class="avatar"><span>{{ currentUser.name[0] }}</span></div>
      <div class="name">
        <h2>{{ currentUser.name }}</h2><span v-if="currentUser?.validatedTeacher" class="material-icons-outlined">verified_user</span>
      </div>

      <div class="info">
        <div class="info-item">
          <label>Popularidad</label>
          <p>{{ currentUser.reputation.rating }}</p>
        </div>
        <div class="info-item">
          <label>Correo personal</label>
          <p>{{ currentUser.email }}</p>
        </div>
        <div class="info-item">
          <label>Teléfono</label>
          <p>{{ currentUser.phone }}</p>
        </div>
      </div>

      <button class="outline">Editar Perfil</button>

      <button class="logout outline" @click="handleLogout">Cerrar Sesión</button>
    </aside>

    <main class="main">
      <nav class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </nav>

      <section v-if="activeTab === 'Resumen'" class="section">
        <div class="cards">
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
                <span class="material-icons-outlined">call_made</span>
              </div>
            </div>
            <p>Reservas en espera</p>
          </div>
        </div>

        <!-- <div class="highlight">
          <p>
            {{ currentUser.name }} está disponible para tutorías en
            <strong>{{ tutor.subject }}</strong
            >.
          </p>
          <button class="primary">Agendar tutoría</button>
        </div> -->
      </section>

      <section v-else-if="activeTab === 'Actividades'" class="section">
        <h3>Actividades recientes</h3>
        <ul class="activity-timeline">
          <li v-for="(a, i) in activities" :key="i" class="activity-item">
            <!-- <div class="activity-icon"></div> -->
            <div class="activity-content">
              <div class="activity-header">
                <h4>{{ a.title }}</h4>
                <span class="activity-date">{{ a.date }}</span>
              </div>
              <p>{{ a.description }}</p>
            </div>
          </li>
        </ul>
      </section>

      
    <section v-else-if="activeTab === 'Materias a Impartir'" class="section calendar-section">
      <Subjects  />
    </section>
      
      



      <section v-else-if="activeTab === 'Documentos'" class="section">
        <h3>Documentos compartidos</h3>
        <div v-if="documents.length" class="docs">
          <div v-for="(doc, i) in documents" :key="i" class="doc">
            <p>
              <strong>{{ doc.name }}</strong>
            </p>
            <p class="type">{{ doc.type }}</p>
            <button class="primary small">Ver documento</button>
          </div>
        </div>
        <p v-else class="empty">No hay documentos disponibles.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import Subjects from "@/components/profile/subjects.vue";

const auth = useAuthStore()

const route = useRoute();
const router = useRouter();
const usersStore = useUserStore();
const { currentUser, allUsers } = storeToRefs(usersStore);


const tutor = ref({});
const activeTab = ref("Resumen");
const tabs = ["Resumen", "Materias a Impartir", "Actividades", "Documentos"];

const activities = ref([
  {
    title: "Clase de repaso de Cálculo",
    date: "15 Oct 2025",
    description: "Sesión enfocada en integrales dobles.",
  },
  {
    title: "Taller de funciones",
    date: "18 Oct 2025",
    description: "Revisión de límites y continuidad.",
  },
]);

const schedule = ref([
  { day: "Lunes", time: "8:00 - 10:00", status: "Disponible" },
  { day: "Martes", time: "14:00 - 16:00", status: "Ocupado" },
  { day: "Miércoles", time: "10:00 - 12:00", status: "Disponible" },
  { day: "Jueves", time: "15:00 - 17:00", status: "Disponible" },
  { day: "Viernes", time: "9:00 - 11:00", status: "Ocupado" },
]);

const documents = ref([
  { name: "Guía de ejercicios", type: "PDF" },
  { name: "Taller de límites", type: "Word" },
]);

const goBack = () => router.back();
function handleLogout() {
  auth.logout()
  router.push({path: '/'})
}



onMounted(async () => {
  
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

.dashboard {
  display: flex;
  height: calc(100vh - 8vh);
  background: #f9f9fb;
  color: #222;
  font-family: "Inter", sans-serif;
}

.sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.back {
  background: none;
  border: none;
  color: #4a6cf7;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
}

.profilePic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  align-self: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #08B294;
  margin-inline: auto;
}
.avatar span {
  padding: 0;
  margin: 0;
  color: #fff;
  font-size: 55px;
  font-weight: 600;
}

.name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 4px;
}
.name h2 {
  font-size: 19px;
  font-weight: 600;
}

.name span {
  color: #08B294;
  font-size: 19px;
  
}

.info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-item label {
  font-size: 13px;
  color: #7c7c7c;
}

.info-item p {
  font-size: 14.5px;
  color: #222;
  font-weight: 500;
}

.outline {
  border: 1px solid #ddd;
  background: transparent;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.outline:hover {
  background: #f5f6fa;
}

.logout {
  margin-top: auto;
  color: #EE332D;
  font-weight: 800;
}

.logout:hover {
 background-color: #FCDCDB;
}

.main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.tabs button {
  background: none;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tabs button.active {
  color: #4a6cf7;
  border-color: #4a6cf7;
  font-weight: 600;
}

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

.progress-bar {
  background: #f0f0f0;
  border-radius: 8px;
  height: 6px;
  margin-top: 8px;
}
.progress {
  height: 100%;
  background: #4a6cf7;
  border-radius: 8px;
}

.highlight {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.highlight p {
  font-size: 15px;
}
.primary {
  background: #4a6cf7;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
}
.primary.small {
  padding: 6px 10px;
  font-size: 13px;
}
.primary:hover {
  background: #3e5de6;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  position: relative;
  padding-left: 20px;
}
.activity-timeline::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e4ec;
}
.activity-item {
  display: flex;
  align-items: flex-start;
  position: relative;
}
.activity-icon {
  width: 14px;
  height: 14px;
  background: #4a6cf7;
  border-radius: 50%;
  margin-right: 12px;
  position: relative;
  top: 4px;
  flex-shrink: 0;
}
.activity-content {
  background: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  width: 100%;
  transition: 0.25s;
}
.activity-content:hover {
  transform: translateX(3px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.activity-header h4 {
  font-size: 15px;
  font-weight: 600;
  color: #222;
}
.activity-date {
  font-size: 13px;
  color: #7c7c7c;
}
.activity-content p {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.calendar-cell {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: 0.3s;
}
.calendar-cell.available {
  background: #e9f6ef;
  color: #1f7a44;
  border: 1px solid #aee0c1;
}
.calendar-cell.busy {
  background: #fbecec;
  color: #c0392b;
  border: 1px solid #f5b7b1;
}
.calendar-cell:hover {
  transform: translateY(-2px);
}

.docs {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.doc {
  background: #fff;
  border-radius: 8px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  width: 180px;
}
.doc .type {
  color: #777;
  font-size: 13px;
}
.empty {
  color: #777;
  font-style: italic;
  margin-top: 10px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 8vh);
}
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #eee;
  border-top-color: #4a6cf7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
