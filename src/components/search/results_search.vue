<template>
  <div class="crm-container">
    <aside class="crm-sidebar">
      <div class="sidebar-top">
        <p class="results-count">Resultados ({{ teachers.length }})</p>
        <span class="muted">Precios por hora de servicio</span>
      </div>

      <div class="results-list">
        <div
          v-for="teacher in teachers"
          :key="teacher.id"
          class="crm-item"
          :class="{ active: selectedTeacher?.id === teacher.id }"
          @click="selectTeacher(teacher)"
        >
          <img :src="teacher.img" alt="foto" class="avatar" />
          <div class="info">
            <p class="name">{{ teacher.name }}</p>
            <p class="subject">
              {{ teacher.subject }} · {{ teacher.description }}
            </p>
          </div>

          <div class="meta">
            <div class="price">${{ teacher.price.toLocaleString() }}</div>
            <div class="chev">›</div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button class="page-btn" :disabled="page === 1" @click="page--">
          ‹
        </button>
        <span class="page-num">{{ page }}</span>
        <button class="page-btn" @click="page++">›</button>
      </div>
    </aside>

    <main class="crm-detail" v-if="selectedTeacher">
      <header class="detail-header">
        <div class="header-top">
          <span class="tag">Precios por hora de servicio</span>
          <span class="dot">·</span>
          <span class="salary">{{ Number(selectedTeacher.price) }} / hr</span>
          <span class="date">Jueves 12 sept, 4:17 p. m.</span>
        </div>

        <div class="header-main">
          <h2 class="name-main">{{ selectedTeacher.name }}</h2>

          <div class="header-actions">
            <button
              class="btn-primary"
              :disabled="!startDate"
              @click="redirectPayment()"
            >
              Reservar clase
            </button>

            <button class="btn-ghost" @click="redirectProfile">
              Ver perfil
            </button>
          </div>
        </div>
      </header>

      <nav class="tabs">
        <button
          class="tab"
          @click="selectTab('information')"
          :class="{ active: selectedTab == 'information' }"
        >
          Información
        </button>
        <button
          class="tab"
          @click="selectTab('availability')"
          :class="{ active: selectedTab == 'availability' }"
        >
          Horario de Disponibilidad
        </button>
      </nav>

      <section class="contact-info" v-if="selectedTab == 'information'">
        <div class="left-col">
          <div class="info-item">
            <span class="label">Disponibilidad</span>
            <span class="value badge-green">
              Completo <strong>100%</strong>
            </span>
          </div>

          <div class="info-item">
            <span class="label">Teléfono</span>
            <span class="value">{{ selectedTeacher.phone }}</span>
          </div>

          <div class="info-item">
            <span class="label">Correo</span>
            <div class="email-field">
              <span>{{ selectedTeacher.email }}</span>
              <div class="icons">
                <button
                  title="Copiar"
                  class="icon-btn"
                  @click="copyEmail(selectedTeacher.email)"
                >
                  <span class="material-icons-outlined">copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="right-col">
          <div class="calendar-section">
            <CalendarMonth
              :tooltips="{
                '2025-11-04': 'Evento importante',
                '2025-11-05': 'Entrega de proyecto',
              }"
              @dateSelected="onDateSelected"
            />
          </div>
        </div>
      </section>

      <div class="calendar-availability" v-if="selectedTab == 'availability'">
        <ScheduleView
          :availabilities="tutorAvailabilities"
          :highlightedDates="['2025-03-14', '2025-03-18']"
          tutor-id="6712abf4e5a01cc4c8a61b09"
          view-mode="week"
          start-date="2025-03-11"
        />
      </div>
    </main>

    <main class="crm-detail empty" v-else>
      <div class="empty-box">
        <p>Selecciona un tutor a la izquierda para ver su detalle</p>
      </div>
    </main>
  </div>
</template>

<script>
import CalendarMonth from "@/shared/components/CalendarMonth.vue";
import ScheduleView from "@/shared/components/ScheduleView.vue";

export default {
  name: "CrmCombined",
  components: {
    CalendarMonth,
    ScheduleView,
  },
  data() {
    return {
      page: 1,
      selectedTeacher: null,
      teachers: [
        {
          id: 1,
          name: "Laura Gómez",
          description: "Educación Superior",
          subject: "Matemáticas",
          price: 35000,
          img: "https://randomuser.me/api/portraits/women/44.jpg",
          phone: "+57 310 458 9276",
          email: "laura.gomez@teacher.com",
        },
        {
          id: 2,
          name: "Carlos Ramírez",
          description: "Secundaria",
          subject: "Física",
          price: 40000,
          img: "https://randomuser.me/api/portraits/men/32.jpg",
          phone: "+57 301 722 6435",
          email: "carlos.ramirez@teacher.com",
        },
        {
          id: 3,
          name: "Ana Torres",
          description: "Primaria",
          subject: "Lengua y Literatura",
          price: 30000,
          img: "https://randomuser.me/api/portraits/women/68.jpg",
          phone: "+57 315 839 2471",
          email: "ana.torres@teacher.com",
        },
        {
          id: 4,
          name: "Julián Pérez",
          description: "Primaria",
          subject: "Informática",
          price: 45000,
          img: "https://randomuser.me/api/portraits/men/12.jpg",
          phone: "+57 316 204 5539",
          email: "julian.perez@teacher.com",
        },
        {
          id: 5,
          name: "Sofía Hernández",
          description: "Educación Superior",
          subject: "Inglés",
          price: 38000,
          img: "https://randomuser.me/api/portraits/women/26.jpg",
          phone: "+57 320 994 3178",
          email: "sofia.hernandez@teacher.com",
        },
      ],

      startDate: null,
      endDate: null,
      today: new Date(),
      selectedTab: "information",
      tutorAvailabilities: [
        {
          _id: "a1",
          tutorId: "6712abf4e5a01cc4c8a61b09",
          date: "2025-03-11",
          startTime: "08:00",
          endTime: "12:00",
          isRecurring: false,
          active: true,
        },
        {
          _id: "a2",
          tutorId: "6712abf4e5a01cc4c8a61b09",
          date: "2025-03-14",
          startTime: "14:00",
          endTime: "18:00",
          isRecurring: false,
          active: true,
        },
        {
          _id: "a3",
          tutorId: "6712abf4e5a01cc4c8a61b09",
          dayOfWeek: "Monday",
          startTime: "09:00",
          endTime: "11:00",
          isRecurring: true,
          active: true,
        },
        {
          _id: "a4",
          tutorId: "6712abf4e5a01cc4c8a61b09",
          dayOfWeek: "Wednesday",
          startTime: "13:00",
          endTime: "17:00",
          isRecurring: true,
          active: false, 
        },
      ],
    };
  },
  mounted() {
    this.selectedTeacher = this.teachers[0];
  },
  methods: {
    selectTeacher(teacher) {
      this.selectedTeacher = teacher;
    },
    redirectPayment() {
      this.$router.push("/payment");
    },

    redirectProfile() {
      this.$router.push(`/profile/${this.selectedTeacher?.id}`);
    },

    selectTab(tab) {
      this.selectedTab = tab;
    },

    copyEmail(email) {
      navigator.clipboard?.writeText(email).then(() => {
        alert("Correo copiado: " + email);
      });
    },
    onDateSelected(date) {
      // Acá validamos que sino hay fecha de inicio o ya hay un rango completo, reinicia
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = date;
        this.endDate = null;
      }
      // En este bloque si ya hay inicio y la nueva es después, define el fin
      else if (this.startDate && !this.endDate && date > this.startDate) {
        this.endDate = date;
      }

      // Si la nueva es antes, se reinicia
      else {
        this.startDate = date;
        this.endDate = null;
      }

      const formattedDate = this.startDate.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const tutorInfo = {
        id: this.selectedTeacher.id,
        name: this.selectedTeacher.name,
        subject: this.selectedTeacher.subject,
        description: this.selectedTeacher.description,
        price: this.selectedTeacher.price,
        img: this.selectedTeacher.img,
        email: this.selectedTeacher.email,
        phone: this.selectedTeacher.phone,
        date: formattedDate,
      };

      localStorage.setItem("tutorReserva", JSON.stringify(tutorInfo));
    },
  },
};
</script>

<style scoped>
.crm-container {
  display: flex;
  gap: 18px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  height: calc(100vh - 14vh);
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
  padding: 12px;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
}

.crm-sidebar {
  width: 320px;
  background: #fafafa;
  border-right: 1px solid #eef2f6;
  display: flex;
  flex-direction: column;
  padding: 14px;
  gap: 12px;
}

.sidebar-top .results-count {
  margin: 0;
  font-weight: 700;
}
.sidebar-top .muted {
  font-size: 12px;
  color: #8b9096;
}

.results-list {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 6px;
}

.crm-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}
.crm-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.04);
}
.crm-item.active {
  border-color: #dfe6ff;
  background: linear-gradient(180deg, #fbfbff, #fafaff);
  box-shadow: 0 6px 18px rgba(75, 99, 255, 0.08);
  border-left: 4px solid #4b63ff;
}

.crm-item.active .name {
  font-weight: 700;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50px;
  object-fit: cover;
}

.info {
  flex: 1;
}
.name {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
}
.subject,
.address {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.price {
  font-weight: 500;
  color: #10b981;
}
.chev {
  color: #c7c7d6;
  font-size: 18px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
  align-items: center;
}
.page-btn {
  border: none;
  background: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}
.page-num {
  font-weight: 600;
}

.crm-detail {
  flex: 1;
  padding: 22px;
  background: linear-gradient(180deg, #ffffff, #fbfbff);
  border-radius: 10px;
  overflow-y: auto;
}

.crm-detail.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-box {
  color: #6b7280;
  font-weight: 600;
}

.detail-header {
  border-bottom: 1px solid #eef2f6;
  padding-bottom: 16px;
  margin-bottom: 16px;
}
.header-top {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 13px;
}
.tag {
  background: #ffb44d;
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
}
.contract,
.salary {
  font-weight: 600;
  color: #374151;
}
.date {
  margin-left: auto;
  color: #9ca3af;
  font-size: 13px;
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}
.name-main {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.btn-primary {
  background: #4b63ff;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
}

.btn-primary:disabled {
  background: #cdd2f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-ghost {
  background: transparent;
  border: 1px solid #e6e9f6;
  color: #374151;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.contact-info {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  margin-top: 18px;
}
.left-col {
  display: flex;
  flex-direction: column;
  /* gap: 12px; */
  width: 100%;
}

.left-col .info-item {
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
}

.left-col .info-item label {
  font-weight: 600;
  color: #333;
  text-align: right;
}

.left-col .info-item span {
  text-align: left;
  color: #555;
}

.left-col .info-item .badge-green {
  color: white;
  width: fit-content;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.label {
  width: 120px;
  color: #6b7280;
  font-weight: 600;
}
.value {
  color: #111827;
  font-weight: 600;
}
.provider {
  display: flex;
  align-items: center;
  gap: 12px;
}
.provider img {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}
.link-view {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #4b63ff;
  cursor: pointer;
}

.badge-green {
  background: #10b981;
  color: #fff;
  padding: 6px 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
}

.email-field {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 420px;
}
.email-field input {
  flex: 1;
  border: 1px solid #e6e9f6;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fff;
}
.icon-btn {
  background: #f3f4f6;
  border: none;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
}

.icon-btn span {
  font-size: 0.8rem;
}

.quick-card {
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 10px;
  padding: 12px;
}

.tabs {
  display: flex;
  gap: 20px;
  margin-top: 18px;
  border-bottom: 1px solid #eef2f6;
  padding-bottom: 8px;
}
.tab {
  background: none;
  border: none;
  padding: 10px 0;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
  position: relative;
}
.tab.active {
  color: #4b63ff;
}
.tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #4b63ff;
  border-radius: 2px;
}

.documents {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.doc-section {
  background: #fbf9ff;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #f0edf9;
}
.doc-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.collapse {
  background: none;
  border: none;
  font-weight: 700;
  cursor: pointer;
}
.doc-title {
  font-weight: 800;
  color: #111827;
}
.badge {
  margin-left: 8px;
  background: #6c63ff;
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
}
.check {
  margin-left: auto;
  color: #10b981;
  font-weight: 700;
}

.doc-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #eee;
}
.doc-info {
  display: flex;
  gap: 12px;
  align-items: center;
}
.file-icon {
  font-size: 22px;
}
.filename {
  margin: 0;
  font-weight: 700;
}
.file-meta {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

@media (max-width: 1024px) {
  .crm-container {
    flex-direction: column;
    height: auto;
  }
  .crm-sidebar {
    width: 100%;
    order: 2;
  }
  .crm-detail {
    order: 1;
    width: 100%;
  }
  .contact-info {
    grid-template-columns: 1fr;
  }
}
</style>
