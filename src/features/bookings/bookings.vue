<template>
  <div class="reservas-container">
    <header class="reservas-header">
      <div class="filters">
        <combo-box
          v-model="statusFilter"
          :items="statusOptions"
          placeholder="Filtrar por estado"
        />
        <combo-box
          v-model="tutorFilter"
          :items="tutorOptions"
          placeholder="Filtrar por tutor"
          startItem
        />
      </div>
    </header>

    <transition-group name="fade" tag="section" class="reservas-grid">
      <div
        v-for="booking in filteredBookings"
        :key="booking.id"
        class="reserva-card"
      >
        <div class="reserva-header">
          <div class="tutor">
            <img :src="booking.tutor.img" alt="Tutor" />
            <div>
              <h3>{{ booking.tutor.name }}</h3>
              <p>{{ booking.tutor.subject }}</p>
            </div>
          </div>
          <span :class="['status', booking.status]">{{ statusLabel(booking.status) }}</span>
        </div>

        <div class="reserva-body">
          <div class="info">
            <div>
              <span>Fecha</span>
              <strong>{{ booking.date }}</strong>
            </div>
            <div>
              <span>Hora</span>
              <strong>{{ booking.time }}</strong>
            </div>
            <div>
              <span>Duración</span>
              <strong>{{ booking.duration }} min</strong>
            </div>
          </div>
          <div class="contact">
            <p>{{ booking.tutor.email }}</p>
            <p>{{ booking.tutor.phone }}</p>
          </div>
        </div>

        <div class="reserva-footer">
          <button class="btn" v-if="booking.status === 'upcoming'">Reprogramar</button>
          <button class="btn danger" v-if="booking.status === 'upcoming'">Cancelar</button>
          <button class="btn primary" v-if="booking.status === 'completed'">Ver Detalles</button>
        </div>
      </div>
    </transition-group>

    <div v-if="!filteredBookings.length" class="no-data">
      <img src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png" />
      <p>No tienes reservas activas.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import ComboBox from "@/shared/components/comboBox.vue"

const bookings = ref([
  {
    id: 1,
    tutor: {
      name: "Laura Gómez",
      subject: "Matemáticas",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      email: "laura.gomez@edutin.com",
      phone: "+57 310 458 9276"
    },
    date: "2025-11-02",
    time: "10:00 AM",
    duration: 60,
    status: "upcoming"
  },
  {
    id: 2,
    tutor: {
      name: "Carlos Ramírez",
      subject: "Física",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "carlos.ramirez@edutin.com",
      phone: "+57 301 722 6435"
    },
    date: "2025-10-10",
    time: "3:00 PM",
    duration: 45,
    status: "completed"
  },
  {
    id: 3,
    tutor: {
      name: "Sofía Hernández",
      subject: "Inglés",
      img: "https://randomuser.me/api/portraits/women/26.jpg",
      email: "sofia.hernandez@edutin.com",
      phone: "+57 320 994 3178"
    },
    date: "2025-09-18",
    time: "6:00 PM",
    duration: 60,
    status: "cancelled"
  }
])

const statusFilter = ref("")
const tutorFilter = ref("")

const statusOptions = [
  { label: "Todas", value: "" },
  { label: "Próximas", value: "upcoming" },
  { label: "Completadas", value: "completed" },
  { label: "Canceladas", value: "cancelled" }
]

const tutorOptions = bookings.value.map((b) => ({
  label: b.tutor.name,
  value: b.tutor.name,
  img: b.tutor.img
}))

const filteredBookings = computed(() =>
  bookings.value.filter((b) => {
    const matchStatus = !statusFilter.value || b.status === statusFilter.value
    const matchTutor = !tutorFilter.value || b.tutor.name === tutorFilter.value
    return matchStatus && matchTutor
  })
)

const statusLabel = (status) =>
  status === "upcoming"
    ? "Próxima"
    : status === "completed"
    ? "Completada"
    : "Cancelada"
</script>

<style scoped>
.reservas-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: "Inter", sans-serif;
  color: #1a1a1a;
}

.reservas-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.title-section h1 {
  font-size: 2.1rem;
  font-weight: 700;
  background: linear-gradient(90deg, #1b5ef1, #7b61ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-section p {
  color: #666;
  margin-top: 4px;
}

.filters {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 430px;
}

.reservas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.reserva-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(225, 225, 225, 0.6);
  border-radius: 20px;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}

.reserva-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
}

.reserva-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tutor {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.tutor img {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  object-fit: cover;
}

.tutor h3 {
  font-size: 1rem;
  font-weight: 600;
}

.tutor p {
  color: #666;
  font-size: 0.9rem;
}

.status {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status.upcoming {
  background: #edf2ff;
  color: #3452ff;
}

.status.completed {
  background: #e6f8f0;
  color: #0f924b;
}

.status.cancelled {
  background: #ffeaea;
  color: #e32b2b;
}

.reserva-body {
  margin: 1.2rem 0;
}

.info {
  display: flex;
  justify-content: space-between;
  color: #444;
  font-size: 0.88rem;
}

.info strong {
  display: block;
  margin-top: 2px;
  color: #000;
}

.contact {
  border-top: 1px dashed #ddd;
  margin-top: 1rem;
  padding-top: 0.8rem;
  font-size: 0.82rem;
  color: #666;
}

.reserva-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

.btn {
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #f3f4ff;
  border-color: #7b61ff;
  color: #7b61ff;
}

.btn.primary {
  background: linear-gradient(90deg, #1b5ef1, #7b61ff);
  color: #fff;
  border: none;
}

.btn.danger {
  color: #e32b2b;
  border-color: #e32b2b;
}

.no-data {
  text-align: center;
  margin-top: 4rem;
  color: #777;
}

.no-data img {
  width: 120px;
  opacity: 0.7;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
