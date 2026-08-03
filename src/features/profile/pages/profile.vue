<template>
  <div v-if="!currentUser" class="loading"><span class="spinner" /></div>
  <div v-else class="dashboard">
    <aside class="sidebar">
      <button class="back" @click="goBack"><span class="material-icons-outlined">arrow_back</span> Volver</button>
      <img v-if="currentUser.image" :src="currentUser.image" :alt="currentUser.name" class="profile-pic" />
      <div v-else class="avatar"><span>{{ initial }}</span></div>
      <div class="name"><h2>{{ currentUser.name }}</h2><span v-if="!isStudent && currentUser.validatedTeacher" class="material-icons-outlined verified">verified</span></div>
      <p class="role">{{ isStudent ? 'Estudiante' : 'Tutor' }}</p>

      <div class="info">
        <div class="info-item"><span class="material-icons-outlined">mail</span><div><label>Correo</label><p>{{ currentUser.email }}</p></div></div>
        <div v-if="currentUser.phone" class="info-item"><span class="material-icons-outlined">phone</span><div><label>Teléfono</label><p>{{ currentUser.phone }}</p></div></div>
        <div v-if="isStudent && currentUser.location" class="info-item"><span class="material-icons-outlined">location_on</span><div><label>Ubicación</label><p>{{ locationLabel }}</p></div></div>
        <div v-if="!isStudent && currentUser.reputation" class="rating"><label>Popularidad</label><RatingStars :rating="currentUser.reputation.rating || 0" /></div>
      </div>

      <button class="outline" @click="showEditProfile = true"><span class="material-icons-outlined">edit</span> Editar perfil</button>
      <button class="logout outline" @click="handleLogout"><span class="material-icons-outlined">logout</span> Cerrar sesión</button>
    </aside>

    <main class="main">
      <template v-if="isStudent">
        <header class="student-header"><div><p class="eyebrow">Mi espacio</p><h2>Hola, {{ firstName }}</h2><p>Gestiona tus clases y mantén tu información actualizada.</p></div><button class="primary" @click="router.push('/search')"><span class="material-icons-outlined">search</span> Buscar una clase</button></header>
        <div class="student-stats">
          <article><span class="material-icons-outlined blue">event</span><div><small>Total de reservas</small><strong>{{ studentBookings.length }}</strong></div></article>
          <article><span class="material-icons-outlined green">check_circle</span><div><small>Clases aceptadas</small><strong>{{ acceptedBookings }}</strong></div></article>
          <article><span class="material-icons-outlined orange">pending_actions</span><div><small>En espera</small><strong>{{ pendingBookings }}</strong></div></article>
          <article v-if="currentUser.balance !== undefined"><span class="material-icons-outlined purple">account_balance_wallet</span><div><small>Saldo disponible</small><strong>{{ formatCurrency(currentUser.balance) }}</strong></div></article>
        </div>
        <div class="student-content"><div class="section-card"><div class="section-title"><div><h3>Próximas clases</h3><p>Tus reservas más recientes.</p></div><button class="link-button" @click="router.push('/bookings')">Ver todas</button></div><div v-if="studentLoading" class="loading-inline"><span class="spinner" /> Cargando reservas...</div><div v-else-if="upcomingBookings.length" class="booking-list"><article v-for="booking in upcomingBookings" :key="booking._id" class="student-booking"><span class="date-box"><strong>{{ day(booking.date) }}</strong><small>{{ month(booking.date) }}</small></span><div><h4>{{ booking.subject?.name || 'Clase' }}</h4><p>Con {{ tutorName(booking) }} · {{ booking.startTime }} - {{ booking.endTime }}</p></div><span :class="['status', statusClass(booking.status)]">{{ booking.status }}</span></article></div><div v-else class="empty-state"><span class="material-icons-outlined">calendar_month</span><h4>Aún no tienes clases reservadas</h4><p>Encuentra un tutor y agenda tu primera clase.</p><button class="primary" @click="router.push('/search')">Buscar tutor</button></div></div><aside class="section-card help-card"><span class="material-icons-outlined">auto_stories</span><h3>¿Listo para aprender?</h3><p>Explora tutores por materia, selecciona un horario y confirma tu reserva.</p><button class="secondary" @click="router.push('/search')">Explorar materias</button></aside></div>
      </template>

      <template v-else>
        <nav class="tabs"><button v-for="tab in tutorTabs" :key="tab" :class="{ active: activeTab === tab }" @click="activeTab = tab">{{ tab }}</button></nav>
        <section v-if="activeTab === 'Resumen'" class="section"><Dashboard /></section>
        <section v-else-if="activeTab === 'Materias a Impartir'" class="section"><Subjects :tutor-id="currentUser._id" /></section>
        <section v-else-if="activeTab === 'Disponibilidad'" class="section"><Availability /></section>
        <section v-else class="section"><BookingsHistory /></section>
      </template>
    </main>
  </div>
  <EditProfileModal v-if="showEditProfile" @close="showEditProfile = false" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useBookingsStore } from "@/stores/bookingsStore";
import Availability from "@/components/profile/availability/availability.vue";
import Subjects from "@/components/profile/subjects/subjects.vue";
import Dashboard from "@/components/profile/dashboard/dashboard.vue";
import RatingStars from "@/shared/components/RatingStars.vue";
import BookingsHistory from "@/components/profile/bookings/BookingsHistory.vue";
import EditProfileModal from "@/components/profile/editProfileModal.vue";
const router = useRouter(), auth = useAuthStore(), usersStore = useUserStore(), bookingsStore = useBookingsStore();
const { currentUser } = storeToRefs(usersStore); const { studentBookings, isLoadingStudent: studentLoading } = storeToRefs(bookingsStore);
const activeTab = ref('Resumen'), showEditProfile = ref(false); const tutorTabs = ['Resumen','Materias a Impartir','Disponibilidad','Reservas'];
const isStudent = computed(() => String(currentUser.value?.role || '').toLocaleLowerCase() === 'estudiante'); const initial = computed(() => currentUser.value?.name?.[0]?.toUpperCase() || 'U'); const firstName = computed(() => currentUser.value?.name?.split(' ')[0] || '');
const locationLabel = computed(() => { const location = currentUser.value?.location; return [location?.city, location?.country].filter(Boolean).join(', ') || 'No registrada'; });
const acceptedBookings = computed(() => studentBookings.value.filter(b => b.status === 'Aceptada' || b.status === 'Completada').length); const pendingBookings = computed(() => studentBookings.value.filter(b => b.status === 'Pendiente').length); const upcomingBookings = computed(() => [...studentBookings.value].filter(b => b.status !== 'Cancelada').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0,4));
const tutorName = booking => booking.tutor?.[0]?.name || 'Tutor'; const day = date => new Intl.DateTimeFormat('es-CO',{day:'2-digit'}).format(new Date(`${String(date).slice(0,10)}T12:00:00`)); const month = date => new Intl.DateTimeFormat('es-CO',{month:'short'}).format(new Date(`${String(date).slice(0,10)}T12:00:00`)).replace('.',''); const formatCurrency = amount => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(amount || 0); const statusClass = status => `status-${String(status).toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}`;
const loadStudentBookings = id => { if (isStudent.value && id) bookingsStore.fetchBookingsByStudent(id); };
onMounted(async () => { if (!currentUser.value) await auth.restoreSession(); loadStudentBookings(currentUser.value?._id); }); watch(() => currentUser.value?._id, loadStudentBookings);
const goBack = () => router.back(); const handleLogout = () => { auth.logout(); router.push('/'); };
</script>

<style scoped>
/* .dashboard{display:flex;min-height:calc(100vh - 8vh);background:#f8fafc;color:#252b36;font-family:Inter,sans-serif}
.sidebar{width:280px;box-sizing:border-box;display:flex;flex-direction:column;gap:18px;padding:28px 24px;background:#fff;border-right:1px solid #e8ebf0}.back,.outline{display:flex;align-items:center;gap:6px;border:0;background:none;cursor:pointer}.back{color:var(--color-primary);font-weight:700;text-align:left}.back .material-icons-outlined,.outline .material-icons-outlined{font-size:17px}.profile-pic,.avatar{width:92px;height:92px;align-self:center;border-radius:50%;object-fit:cover}.avatar{display:grid;place-items:center;background:#08b294;color:#fff;font-size:46px;font-weight:700}.name{display:flex;justify-content:center;align-items:center;gap:5px;text-align:center}.name h1{margin:0;font-size:20px}.verified{color:#08b294;font-size:19px}.role{margin:-14px 0 0;text-align:center;color:#78818e;font-size:13px}.info{display:flex;flex-direction:column;gap:14px}.info-item{display:flex;gap:9px;align-items:flex-start}.info-item>.material-icons-outlined{color:#7b8592;font-size:17px}.info-item label,.rating label{display:block;color:#818a96;font-size:11px}.info-item p{margin:3px 0 0;overflow-wrap:anywhere;font-size:13px;font-weight:600}.rating{display:flex;flex-direction:column;gap:3px}.outline{justify-content:center;padding:10px;border:1px solid #dce1e8;border-radius:8px;color:#303744;font-size:13px;font-weight:700}.outline:hover{background:#f5f7fa}.logout{margin-top:auto;border-color:#f0b9b7;color:#d52d2a}.main{flex:1;min-width:0;padding:32px;overflow:auto}.tabs{display:flex;gap:12px;margin-bottom:22px;border-bottom:1px solid #e3e6eb}.tabs button{padding:11px 14px;border:0;border-bottom:2px solid transparent;background:none;color:#697383;cursor:pointer}.tabs button.active{border-color:var(--color-primary);color:var(--color-primary);font-weight:700}.section{min-height:90%}.student-header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:28px}.eyebrow{margin:0 0 5px;color:var(--color-primary);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.student-header h2{margin:0 0 7px;font-size:28px}.student-header p:not(.eyebrow){margin:0;color:#707a88}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 14px;border:0;border-radius:8px;background:var(--color-primary);color:#fff;font-size:13px;font-weight:700;cursor:pointer}.primary .material-icons-outlined{font-size:17px}.student-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}.student-stats article{display:flex;gap:11px;align-items:center;padding:17px;background:#fff;border:1px solid #e7ebf1;border-radius:12px}.student-stats .material-icons-outlined{padding:8px;border-radius:8px;font-size:22px}.blue{background:#eaf1ff;color:#2765c6}.green{background:#e5f7ed;color:#13844e}.orange{background:#fff2df;color:#b36300}.purple{background:#f0ebff;color:#6c4cc3}.student-stats small,.student-stats strong{display:block}.student-stats small{color:#78818e;font-size:11px}.student-stats strong{margin-top:3px;font-size:19px}.student-content{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px}.section-card{padding:22px;background:#fff;border:1px solid #e7ebf1;border-radius:14px}.section-title{display:flex;justify-content:space-between;align-items:start}.section-title h3,.help-card h3{margin:0 0 5px;font-size:17px}.section-title p,.help-card p{margin:0;color:#717a88;font-size:13px}.link-button{border:0;background:none;color:var(--color-primary);font-weight:700;cursor:pointer}.booking-list{display:flex;flex-direction:column;margin-top:16px}.student-booking{display:flex;align-items:center;gap:12px;padding:13px 0;border-top:1px solid #edf0f3}.date-box{width:40px;padding:6px 0;border-radius:8px;background:#eef3ff;color:var(--color-primary);text-align:center}.date-box strong,.date-box small{display:block}.date-box strong{font-size:16px}.date-box small{font-size:10px;text-transform:capitalize}.student-booking>div{flex:1}.student-booking h4{margin:0 0 4px;font-size:14px}.student-booking p{margin:0;color:#737d8a;font-size:12px}.status{padding:5px 8px;border-radius:99px;font-size:10px;font-weight:800}.status-pendiente{background:#fff2df;color:#a15a00}.status-aceptada{background:#e5f7ed;color:#127541}.status-completada{background:#e7f0ff;color:#235ec1}.help-card{align-self:start;background:linear-gradient(135deg,#eff5ff,#fff)}.help-card>.material-icons-outlined{margin-bottom:12px;color:var(--color-primary);font-size:32px}.secondary{margin-top:17px;background:#fff;color:var(--color-primary);border:1px solid #c9d8f3}.empty-state,.loading-inline,.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.empty-state{padding:35px 15px}.empty-state .material-icons-outlined{color:#8792a0;font-size:40px}.empty-state h4{margin:9px 0 5px}.empty-state p{margin:0 0 14px;color:#737d8a;font-size:13px}.loading{height:calc(100vh - 8vh)}.loading-inline{min-height:150px;color:#7b8592;font-size:13px}.spinner{width:32px;height:32px;margin-bottom:10px;border:3px solid #dfe8fa;border-top-color:var(--color-primary);border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:1000px){.student-stats{grid-template-columns:repeat(2,1fr)}.student-content{grid-template-columns:1fr}}@media(max-width:720px){.dashboard{display:block}.sidebar{width:100%;border-right:0;border-bottom:1px solid #e8ebf0}.main{padding:22px 16px}.student-header{align-items:start;flex-direction:column}.student-stats{grid-template-columns:1fr}.profile-pic,.avatar{width:70px;height:70px}.avatar{font-size:34px}} */

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");

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
  border-right: 1px solid #e8ebf0;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.back,.outline{display:flex;align-items:center;gap:6px;border:0;background:none;cursor:pointer}

.back {
  background: none;
  border: none;
  color: #2354b6;
  font-weight: 500;
  text-align: left;
}


.profile-pic {
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
  display:flex;
  gap:9px;
  align-items:flex-start
}

.info-item>.material-icons-outlined{ 
  color:#7b8592;font-size:17px
}
.info-item label,.rating label {
  display:block;
  color:#818a96;
  font-size:11px
}
.info-item p {
  margin:3px 0 0;
  overflow-wrap:anywhere;
  font-size:13px;
  font-weight:600
} 
.rating { 
  display:flex;
  flex-direction:column;
  gap:3px
}

.role { 
  margin:-14px 0 0;
  text-align:center;
  color:#78818e;font-size:13px
}

.logout{margin-top:auto;border-color:#f0b9b7;color:#d52d2a}

.back .material-icons-outlined,.outline .material-icons-outlined{font-size:17px}.profile-pic,.avatar{width:92px;height:92px;align-self:center;border-radius:50%;object-fit:cover}
.outline{justify-content:center;padding:10px;border:1px solid #dce1e8;border-radius:8px;color:#303744;font-size:13px;font-weight:700}

.outline:hover {
  background: #f5f6fa;
}

.logout {
  margin-top: auto;
  color: #EE332D;
  border-color: #EE332D;
  font-weight: 800;
}

.logout:hover {
 background-color: #ffefef;
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
  color: #2354b6;
  border-color: #2354b6;
  font-weight: 600;
}

section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 90%;
}

.progress-bar {
  background: #f0f0f0;
  border-radius: 8px;
  height: 6px;
  margin-top: 8px;
}
.progress {
  height: 100%;
  background: #2354b6;
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
  background: #2354b6;
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
  background: #2354b6;
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
  border-top-color: #2354b6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.student-header {
  display:flex;
  justify-content:space-between;
  align-items:center;gap:20px;
  margin-bottom:28px
}
.eyebrow {
  margin:0 0 5px;
  color:var(--color-primary);
  font-size:11px;
  font-weight:800;
  letter-spacing:.08em;
  text-transform:uppercase
}
  .student-header h2 {
    margin:0 0 7px;
    font-size:28px
  }
  .student-header p:not(.eyebrow) {
    margin:0;color:#707a88
  }

  .primary,.secondary {
    display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 14px;border:0;border-radius:8px;background:var(--color-primary);color:#fff;font-size:13px;font-weight:700;cursor:pointer}.primary .material-icons-outlined{font-size:17px}.student-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}.student-stats article{display:flex;gap:11px;align-items:center;padding:17px;background:#fff;border:1px solid #e7ebf1;border-radius:12px}.student-stats .material-icons-outlined{padding:8px;border-radius:8px;font-size:22px}.blue{background:#eaf1ff;color:#2765c6}.green{background:#e5f7ed;color:#13844e}.orange{background:#fff2df;color:#b36300}.purple{background:#f0ebff;color:#6c4cc3}.student-stats small,.student-stats strong{display:block}.student-stats small{color:#78818e;font-size:11px}.student-stats strong{margin-top:3px;font-size:19px}.student-content{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px}.section-card{padding:22px;background:#fff;border:1px solid #e7ebf1;border-radius:14px}.section-title{display:flex;justify-content:space-between;align-items:start}.section-title h3,.help-card h3{margin:0 0 5px;font-size:17px}.section-title p,.help-card p{margin:0;color:#717a88;font-size:13px}.link-button{border:0;background:none;color:var(--color-primary);font-weight:700;cursor:pointer}.booking-list{display:flex;flex-direction:column;margin-top:16px}.student-booking{display:flex;align-items:center;gap:12px;padding:13px 0;border-top:1px solid #edf0f3}.date-box{width:40px;padding:6px 0;border-radius:8px;background:#eef3ff;color:var(--color-primary);text-align:center}.date-box strong,.date-box small{display:block}.date-box strong{font-size:16px}.date-box small{font-size:10px;text-transform:capitalize}.student-booking>div{flex:1}.student-booking h4{margin:0 0 4px;font-size:14px}.student-booking p{margin:0;color:#737d8a;font-size:12px}.status{padding:5px 8px;border-radius:99px;font-size:10px;font-weight:800}.status-pendiente{background:#fff2df;color:#a15a00}.status-aceptada{background:#e5f7ed;color:#127541}.status-completada{background:#e7f0ff;color:#235ec1}.help-card{align-self:start;background:linear-gradient(135deg,#eff5ff,#fff)}.help-card>.material-icons-outlined{margin-bottom:12px;color:var(--color-primary);font-size:32px}.secondary{margin-top:17px;background:#fff;color:var(--color-primary);border:1px solid #c9d8f3}.empty-state,.loading-inline,.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.empty-state{padding:35px 15px}.empty-state .material-icons-outlined{color:#8792a0;font-size:40px}.empty-state h4{margin:9px 0 5px}.empty-state p{margin:0 0 14px;color:#737d8a;font-size:13px}.loading{height:calc(100vh - 8vh)}.loading-inline{min-height:150px;color:#7b8592;font-size:13px}.spinner{width:32px;height:32px;margin-bottom:10px;border:3px solid #dfe8fa;border-top-color:var(--color-primary);border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:1000px){.student-stats{grid-template-columns:repeat(2,1fr)}.student-content{grid-template-columns:1fr}}@media(max-width:720px){.dashboard{display:block}.sidebar{width:100%;border-right:0;border-bottom:1px solid #e8ebf0}.main{padding:22px 16px}.student-header{align-items:start;flex-direction:column}.student-stats{grid-template-columns:1fr}.profile-pic,.avatar{width:70px;height:70px}.avatar{font-size:34px}} 


</style>
