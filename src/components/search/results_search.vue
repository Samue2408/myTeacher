<template>
  <div class="crm-container">
    <aside class="crm-sidebar">
      <div class="sidebar-top">
        <p class="results-count">Resultados ({{ subjects.length }})</p>
        <span class="muted">Precios por hora de servicio</span>
      </div>

      <div class="results-list">
        <div v-if="loading">
          <div v-for="n in 5" :key="n" class="crm-item skeleton">
            <div class="avatar skltn"></div>
            <div class="info">
              <p class="name skltn skltn-text"></p>
              <p class="subject skltn skltn-text"></p>
            </div>
            <div class="meta">
              <div class="price skltn skltn-text"></div>
            </div>
          </div>
        </div>

        <div v-else>
          <div
            v-for="subject in subjects"
            :key="subject.id"
            class="crm-item"
            :class="{ active: selectedSubject?.id === subject.id }"
            @click="selectTeacher(subject)"
          >
            <img
              v-if="subject.img"
              :src="subject.img"
              alt="foto"
              class="avatar"
            />
            <p
              class="letter-name-tutor"
              :style="{ backgroundColor: stringToHexColor(subject.tutor.name) }"
              v-if="!subject.tutor.img"
            >
              {{ subject.tutor.name[0] }}
            </p>
            <div class="info">
              <p class="name">{{ subject.tutor.name }}</p>
              <p class="subject">
                {{ subject.name }} · {{ subject.description }}
              </p>
            </div>
            <div class="meta">
              <div class="price">${{ subject.price.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="pagination">
        <button class="page-btn" :disabled="page === 1" @click="page--">
          ‹
        </button>
        <span class="page-num">{{ page }}</span>
        <button class="page-btn" @click="page++">›</button>
      </div> -->
    </aside>

    <main class="crm-detail" v-if="selectedSubject">
      <header class="detail-header">
        <div class="header-top">
          <span class="tag">Precios por hora de servicio</span>
          <span class="dot">·</span>
          <span class="salary"
            >{{ currencyPipe.transformCurrency(selectedSubject.price) }} /
            hr</span
          >
          <!-- <span class="date">Jueves 12 sept, 4:17 p. m.</span> -->
        </div>

        <div class="header-main">
          <h2 class="name-main">{{ selectedSubject.name }}</h2>

          <div class="header-actions">
            <button
              class="btn-primary"
              :disabled="!startDate"
              @click="createBooking()"
            >
              Reservar clase
            </button>

            <!-- <button class="btn-ghost" @click="redirectProfile">
              Ver perfil
            </button> -->
          </div>
        </div>
      </header>

      <!-- <nav class="tabs">
        <button
          class="tab"
          @click="selectTab('information')"
          :class="{ active: selectedTab == 'information' }"
        >
          General
        </button>
        <button
          class="tab"
          @click="selectTab('availability')"
          :class="{ active: selectedTab == 'availability' }"
        >
          Horario de Disponibilidad
        </button>
      </nav> -->

      <section class="contact-info" v-if="selectedTab == 'information'">
        <div class="left-col">
          <!-- <div class="info-item">
            <span class="label">Disponibilidad</span>
            <span class="value badge-green">
              Completo <strong>100%</strong>
            </span>
          </div> -->

          <div class="info-item">
            <span class="label">Teléfono</span>
            <span class="value">{{ selectedSubject.tutor.phone }}</span>
          </div>

          <div class="info-item">
            <span class="label">Correo</span>
            <div class="email-field">
              <span>{{ selectedSubject.tutor.email }}</span>
              <div class="icons">
                <button
                  title="Copiar"
                  class="icon-btn"
                  @click="copyEmail(selectedSubject.tutor.email)"
                >
                  <span class="material-icons-outlined">copy</span>
                </button>
              </div>
            </div>
          </div>
          <div class="info-item">
            <span class="label">Reputación</span>
            <span class="value">
              {{ getStars(selectedSubject.tutor.reputation?.rating || 0) }}
              ({{ selectedSubject.tutor.reputation?.rating || 0 }})
            </span>
          </div>

          <div class="info-item">
            <span class="label">Ubicación</span>
            <span class="value">
              {{
                selectedSubject.tutor.location?.city || "Ciudad no disponible"
              }},
              {{
                selectedSubject.tutor.location?.country || "País no disponible"
              }}
            </span>
          </div>

          <div class="type-meet">
            <span>Elige la información para tu reserva</span>
          </div>
        </div>
        <div class="right-col">
          <div class="calendar-section">
            <CalendarMonth
              @dateSelected="onDateSelected"
            />
          </div>
        </div>
      </section>

      <div class="calendar-availability" v-if="selectedTab == 'availability'">
        <ScheduleView
          :availabilities="selectedSubject?.tutor?.availabilities"
          :tutor-id="selectedSubject?.tutor?.id"
          view-mode="week"
          :start-date="selectedSubject ? today : null"
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
import { BookingsService } from "@/api/bookings.service";
import { currencyPipe } from "@/pipes/subjects-pipe";
import CalendarMonth from "@/shared/components/CalendarMonth.vue";
import ScheduleView from "@/shared/components/ScheduleView.vue";
import { useSearchStore } from "@/stores/searchStore";
import { useUserStore } from "@/stores/userStore";
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "CrmCombined",

  components: {
    CalendarMonth,
    ScheduleView,
  },

  data() {
    return {
      page: 1,
      selectedSubject: null,
      subjects: [],
      startDate: null,
      endDate: null,
      today: new Date(),
      selectedTab: "information",
      loading: true,
      currencyPipe: new currencyPipe(),
      result: ref(""),
      tutorAvailabilities: [],
      sendDate: null,
    };
  },

  setup() {
    const route = useRoute();
    return { route };
  },

  async mounted() {
    const searchs = useSearchStore();
    const q = this.$route.query.q || "";

    if (searchs.results.length > 0) {
      this.subjects = searchs.results;
      this.selectedSubject = this.subjects[0];
      this.loading = false;
      
    } else {
      await this.handleSearch(q);
    }

    searchs.$subscribe((mutation, state) => {
      this.subjects = state.results;
      
      if (!this.selectedSubject || this.selectedSubject.id !== state.results[0]?.id) {
        this.selectedSubject = state.results[0] || null;        
      }

      this.loading = state.results.length === 0;
    });
  },

  methods: {
    selectTeacher(teacher) {
      this.selectedSubject = teacher;      
    },

    async createBooking() {
      try {
        const booking = {
          studentId: useUserStore().userId,
          tutorId: this.selectedSubject.tutor.id,
          subjectId: this.selectedSubject.id,
          type: "virtual",
          location: "virtual",
          status: "Pendiente",
          date: this.startDate,
          startTime: "14:00",
          endTime: "18:00",
          price: this.selectedSubject.price,
        };

        const response = await BookingsService.createBooking(JSON.stringify(booking));

        console.log(response);
        

        // this.result.value = JSON.stringify(response, null, 2);
      } catch (error) {
        // this.result.value = JSON.stringify(error, null, 2);
      }
    },

    getStars(rating) {
      const fullStars = Math.floor(rating);
      const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStar;

      return (
        "⭐".repeat(fullStars) + (halfStar ? "☆" : "") + "☆".repeat(emptyStars)
      );
    },

    async handleSearch(query) {
      const cleanQuery = query.trim();

      if (!cleanQuery) {
        useSearchStore().clear();
        return;
      }

      await useSearchStore().search(cleanQuery);

      const results = useSearchStore().results;

      if (results.length > 0) {
        this.loading = false;
        this.subjects = results;
        this.selectedSubject = results[0];        
      }
    },

    stringToHexColor(name) {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }

      const hue = Math.abs(hash) % 360;
      const saturation = 60;
      const lightness = 85;

      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },

    redirectPayment() {
      this.$router.push("/payment");
    },

    redirectProfile() {
      this.$router.push(`/profile/${this.selectedSubject?.id}`);
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
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = date;
        this.endDate = null;
      } else if (this.startDate && !this.endDate && date > this.startDate) {
        this.endDate = date;
      } else {
        this.startDate = date;
        this.endDate = null;
      }

      const formattedDate = this.startDate.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });


      this.sendDate = formattedDate;

      const tutorInfo = {
        id: this.selectedSubject.id,
        name: this.selectedSubject.name,
        subject: this.selectedSubject.subject,
        description: this.selectedSubject.description,
        price: this.selectedSubject.price,
        img: this.selectedSubject.img,
        email: this.selectedSubject.email,
        phone: this.selectedSubject.phone,
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

.letter-name-tutor {
  min-width: 40px;
  min-height: 40px;
  clip-path: circle();
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
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

.type-meet {
  padding: 20px 10px;
}

.type-meet span {
  color: #4b63ff;
  font-weight: 700;
  font-size: 16px;
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
  font-size: 20px;
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
  display: flex;
  flex-direction: column;
  align-items: start;
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
}

.left-col .info-item:last-of-type {
  border-bottom: 1px solid rgb(228, 228, 228);
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
  font-size: 12px;
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
