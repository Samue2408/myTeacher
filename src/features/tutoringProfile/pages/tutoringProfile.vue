<template>
  <div v-if="loading" :style="styles.loading">
    <div :style="styles.spinner"></div>
  </div>

  <div v-else-if="!tutor" class="not-found">
    No se encontró el tutor.
  </div>

  <div v-else :style="styles.container">
    <!-- Sidebar -->
    <aside :style="styles.sidebar">
      <button :style="styles.backButton" @click="goBack">← Volver</button>

      <img :src="tutor.img" :alt="tutor.name" :style="styles.avatar" />
      <h2 :style="styles.name">{{ tutor.name }}</h2>

      <p :style="styles.label">Materia</p>
      <p :style="styles.value">{{ tutor.subject }}</p>

      <p :style="styles.label">Nivel</p>
      <p :style="styles.value">{{ tutor.description }}</p>

      <p :style="styles.label">Correo institucional</p>
      <p :style="styles.value">{{ tutor.workEmail }}</p>

      <p :style="styles.label">Correo personal</p>
      <p :style="styles.value">{{ tutor.privateEmail }}</p>

      <p :style="styles.label">Teléfono</p>
      <p :style="styles.value">{{ tutor.phone }}</p>

      <button :style="styles.viewButton">Ver todos los campos</button>
    </aside>

    <!-- Main content -->
    <main :style="styles.main">
      <!-- Tabs -->
      <nav :style="styles.tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :style="[styles.tab, activeTab === tab ? styles.activeTab : {}]"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </nav>

      <!-- Resumen -->
      <div v-if="activeTab === 'Resumen'">
        <div :style="styles.cardsContainer">
          <div :style="styles.card">
            <p :style="styles.cardTitle">Progreso del perfil</p>
            <p :style="styles.cardValue">{{ tutor.progress }}% completado</p>
          </div>
          <div :style="styles.card">
            <p :style="styles.cardTitle">Horas enseñadas este mes</p>
            <p :style="styles.cardValue">{{ tutor.hoursThisMonth }}h</p>
          </div>
        </div>

        <div :style="styles.highlightCard">
          <p style="color: #666; margin-bottom: 6px;">Un dato importante...</p>
          <h3 style="margin-bottom: 12px;">
            {{ tutor.name }} está disponible para tutorías en <strong>{{ tutor.subject }}</strong>
          </h3>
          <button :style="styles.primaryButton">Agendar tutoría</button>
        </div>

        <div :style="styles.footer">
          <p><strong>Estado:</strong> {{ tutor.status }}</p>
          <p><strong>Creado:</strong> {{ tutor.created }}</p>
          <p><strong>Actualizado:</strong> {{ tutor.updated }}</p>
        </div>
      </div>

      <!-- Actividades -->
      <div v-else-if="activeTab === 'Actividades'" :style="styles.section">
        <h3 :style="styles.sectionTitle">Actividades del tutor</h3>
        <ul :style="styles.list">
          <li v-for="(a, i) in activities" :key="i" :style="styles.listItem">
            <strong>{{ a.title }}</strong> — {{ a.date }}  
            <p :style="styles.itemDescription">{{ a.description }}</p>
          </li>
        </ul>
      </div>

      <!-- Horarios -->
      <div v-else-if="activeTab === 'Horarios'" :style="styles.section">
        <h3 :style="styles.sectionTitle">Horarios disponibles</h3>
        <table :style="styles.table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Hora</th>
              <th>Disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(h, i) in schedule" :key="i">
              <td>{{ h.day }}</td>
              <td>{{ h.time }}</td>
              <td>{{ h.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Documentos -->
      <div v-else-if="activeTab === 'Documentos'" :style="styles.section">
        <h3 :style="styles.sectionTitle">Documentos compartidos</h3>
        <div v-if="documents.length" :style="styles.docsContainer">
          <div v-for="(doc, i) in documents" :key="i" :style="styles.docCard">
            <p><strong>{{ doc.name }}</strong></p>
            <p :style="styles.docType">{{ doc.type }}</p>
            <button :style="styles.primaryButton">Ver documento</button>
          </div>
        </div>
        <p v-else :style="styles.emptyText">No hay documentos disponibles.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTutorsStore } from "@/stores/tutorsStore";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const tutorsStore = useTutorsStore();
const { tutors, loading } = storeToRefs(tutorsStore);

const tutor = ref({});
const activeTab = ref("Resumen");
const tabs = ["Resumen", "Actividades", "Horarios", "Documentos"];

const activities = ref([
  { title: "Clase de repaso de Cálculo", date: "15 Oct 2025", description: "Sesión enfocada en integrales dobles." },
  { title: "Taller de funciones", date: "18 Oct 2025", description: "Revisión de límites y continuidad." },
]);

const schedule = ref([
  { day: "Lunes", time: "8:00 - 10:00", status: "Disponible" },
  { day: "Martes", time: "14:00 - 16:00", status: "Ocupado" },
  { day: "Miércoles", time: "10:00 - 12:00", status: "Disponible" },
]);

const documents = ref([
  { name: "Guía de ejercicios", type: "PDF" },
  { name: "Taller de límites", type: "Word" },
]);

const goBack = () => router.back();

onMounted(async () => {
  if (!tutors.value.length) await tutorsStore.fetchTutors();
  const id = Number(route.params.id);
  tutor.value = tutorsStore.getTutorById(id) || {};
  tutor.value = {
    ...tutor.value,
    workEmail: "amccoy@virtuslab.com",
    privateEmail: "arlene.mccoy@gmail.com",
    phone: "+57 320 555 7788",
    status: "Disponible",
    created: "February 24, 2023",
    updated: "October 20, 2025",
    progress: 85,
    hoursThisMonth: 12,
    bio: "Apasionada por enseñar matemáticas complejas de forma sencilla. Con más de 5 años de experiencia guiando estudiantes universitarios.",
  };
});
  
const styles = {
  container: {
    display: "flex",
    fontFamily: "Inter, sans-serif",
    height: "100vh",
    backgroundColor: "#fafafa",
    color: "#333",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#fff",
    borderRight: "1px solid #eee",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  backButton: {
    border: "none",
    background: "none",
    color: "#537FD5",
    fontSize: "15px",
    cursor: "pointer",
    marginBottom: "16px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "12px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  label: { fontSize: "13px", color: "#777", marginTop: "10px", marginBottom: "2px" },
  value: { fontSize: "14px", fontWeight: "500" },
  viewButton: {
    marginTop: "20px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "13px",
  },
  main: { flex: 1, padding: "30px", overflowY: "auto" },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "1px solid #eee",
  },
  tab: {
    background: "none",
    border: "none",
    padding: "10px 18px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#666",
    transition: "all 0.2s",
  },
  activeTab: {
    borderBottom: "2px solid #537FD5",
    color: "#537FD5",
    fontWeight: "600",
  },
  cardsContainer: { display: "flex", gap: "20px", marginBottom: "25px" },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    flex: 1,
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  cardTitle: { color: "#777", fontSize: "14px", marginBottom: "6px" },
  cardValue: { fontSize: "18px", fontWeight: "600" },
  highlightCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: "25px",
  },
  primaryButton: {
    backgroundColor: "#537FD5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "14px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    color: "#555",
    fontSize: "13px",
    borderTop: "1px solid #eee",
    paddingTop: "15px",
  },
  loading: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  spinner: {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #537FD5",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 1s linear infinite",
  },
  section: { backgroundColor: "#fff", padding: "24px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "15px" },
  list: { listStyle: "none", padding: "0", margin: "0" },
  listItem: { padding: "10px 0", borderBottom: "1px solid #eee" },
  itemDescription: { color: "#777", fontSize: "13px", marginTop: "4px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  docsContainer: { display: "flex", gap: "16px", flexWrap: "wrap" },
  docCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "14px",
    minWidth: "180px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  docType: { color: "#777", fontSize: "13px", margin: "6px 0" },
  emptyText: { color: "#777", fontStyle: "italic" },
};
</script>
y