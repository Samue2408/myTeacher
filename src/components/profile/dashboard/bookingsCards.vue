<template>
  <template v-if="$props.skeleton">
    <div class="card">
      <div class="header">
        <h3
          class="skltn skltn-text"
          style="max-width: 120px; height: 30px"
        ></h3>
        <span class="skltn skltn-text" style="width: 60px; height: 30px"></span>
      </div>
      <div class="main skltn skltn-text" style="height: 40px"></div>
      <div class="booking-info skltn skltn-text" style="height: 45px"></div>
      <div class="actions">
        <button
          class="skltn skltn-text"
          style="width: 60px; height: 25px"
        ></button>
        <button
          class="skltn skltn-text"
          style="width: 60px; height: 25px"
        ></button>
        <button
          class="skltn skltn-text"
          style="width: 60px; height: 25px"
        ></button>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="card">
      <div class="header">
        <h3>Tu Próxima Clase</h3>
        <div class="menu-trigger" @click.stop="toggleMenu">
          <span>{{ getTimeUntilBooking(booking.date) }}</span>
          <span class="material-icons"> more_vert </span>
          <MenuModal
            :items="menuItems"
            :row="booking"
            :isOpen="isMenuOpen"
            :dividerIndex="null"
            :itemRed="null"
            @closed="isMenuOpen = false"
          />
        </div>
        

      </div>

      <div class="main">
        <div class="student-info">
          <p>{{ booking.student.name }}</p>
          <h5 :title="booking.subject.name">{{ booking.subject.name }}</h5>
        </div>
        <div class="avatar">
          <span>{{ booking.student.name[0].toUpperCase() }}</span>
        </div>
      </div>

      <div class="booking-info">
        <div class="date">
          <p>Fecha:</p>
          <h5>{{ formatDate(booking.date) }}</h5>
        </div>
        <div class="schedule">
          <p>Horario:</p>
          <h5>{{ booking.startTime }} - {{ booking.endTime}}</h5>
        </div>
        <div class="mode">
          <p>Modalidad:</p>
          <h5>{{ booking.type }}</h5>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Booking } from '@/types/dashboard'
import type { PropType } from "vue";
import MenuModal from "@/shared/components/MenuModal.vue";
import { useUserStore } from "@/stores/userStore";
import { useBookingsStore } from "@/stores/bookingsStore";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useAppStore } from "@/stores/appStore";
import { BookingsService } from "@/api/bookings.service";
import type { BookingsType } from "@/types/bookings";
import { sendMeetingJoinNotification } from "@/utils/meetingJoinNotification";
import { isMeetingJoinAvailable, useMeetingClock } from "@/utils/meetingAvailability";

const $props = defineProps({
  booking: {
    type: Object as PropType<Booking>,
  },
  skeleton: {
    type: Boolean,
    default: false,
  },
});


const isMenuOpen = ref(false);
const userStore = useUserStore();
const bookingsStore = useBookingsStore();
const dashboardStore = useDashboardStore();
const appStore = useAppStore();
const meetingNow = useMeetingClock();
const isMeetingJoinOpen = computed(() =>
  Boolean(
    $props.booking?.type === "Virtual" &&
    isMeetingJoinAvailable($props.booking, new Date(meetingNow.value)),
  ),
);
const menuItems = computed(() => [
  ...(isMeetingJoinOpen.value
    ? [{ label: "Ir al enlace", icon: "link", action: openMeeting }]
    : []),
  {
    label: "Cancelar clase",
    icon: "close",
    class: "red",
    action: cancelClass,
  },
]);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

async function openMeeting(row: Booking) {
  if (row.type !== "Virtual" || !isMeetingJoinAvailable(row)) {
    appStore.setError("El enlace estará disponible desde 15 minutos antes del inicio y hasta que termine la clase.");
    return;
  }

  const meetingWindow = window.open("about:blank", "_blank");
  if (!meetingWindow) {
    appStore.setError("Permite las ventanas emergentes para abrir la videollamada.");
    return;
  }

  meetingWindow.opener = null;
  try {
    const booking = await BookingsService.getById(row._id) as BookingsType;
    if (!booking.videoCallLink) {
      throw new Error("No se encontró el enlace de videollamada para esta reserva.");
    }
    if (!isMeetingJoinAvailable(booking)) {
      throw new Error("El enlace ya no está disponible porque la ventana de la clase terminó.");
    }

    meetingWindow.location.href = booking.videoCallLink;
    void sendMeetingJoinNotification(booking, {
      _id: userStore.currentUser?._id,
      name: userStore.currentUser?.name,
    }).catch((error: unknown) => {
      console.error("No fue posible enviar el aviso de ingreso a la clase.", error);
      appStore.setError("No pudimos avisar al estudiante por correo. El enlace de la reunión sigue disponible.");
    });
  } catch (error: unknown) {
    meetingWindow.close();
    console.error("No fue posible abrir la videollamada desde el dashboard.", error);
    appStore.setError(error instanceof Error ? error.message : "No fue posible abrir el enlace de la clase.");
  }
}

async function cancelClass(row: Booking) {
  if (!window.confirm("¿Cancelar esta clase? El valor se acreditará al saldo del estudiante.")) return;

  try {
    const booking = await BookingsService.getById(row._id) as BookingsType;
    const cancelled = await bookingsStore.cancelAcceptedBookingByTutor(booking);
    if (cancelled) {
      await dashboardStore.refreshDashboardsByTutor(userStore.currentUser?._id || booking.tutorId);
    }
  } catch (error: unknown) {
    console.error("No fue posible cancelar la clase desde el dashboard.", error);
    appStore.setError(error instanceof Error ? error.message : "No fue posible cancelar la clase.");
  }
}



const formatDate = (
  date: string | number | Date | null | undefined
): string => {
  const d = parseAsLocalDate(date);

  if (!d) return "";

  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const parseAsLocalDate = (
  date: string | number | Date | null | undefined
): Date | null => {
  if (!date) return null;

  const value = String(date);

  // Si viene como ISO UTC: 2026-09-27T00:00:00.000Z
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/
  );

  if (match) {
    const [, year, month, day, hours, minutes, seconds = "0"] = match;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    );
  }

  return new Date(date);
};


const getTimeUntilBooking = (
  date: string | number | Date | null | undefined
): string => {
  const bookingDate = parseAsLocalDate(date);

  if (!bookingDate) return "";

  const today = new Date();

  // Comparar únicamente las fechas locales
  const bookingDay = new Date(
    bookingDate.getFullYear(),
    bookingDate.getMonth(),
    bookingDate.getDate()
  );

  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diffDays = Math.round(
    (bookingDay.getTime() - todayDay.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "Pasado";
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";

  if (diffDays < 7) {
    return `En ${diffDays} días`;
  }

  const weeks = Math.floor(diffDays / 7);
  const remainingDays = diffDays % 7;

  if (weeks === 1 && remainingDays === 0) {
    return "En 1 semana";
  }

  if (weeks < 4) {
    if (remainingDays === 0) {
      return `En ${weeks} semanas`;
    }

    return `En ${weeks} semanas y ${remainingDays} día${
      remainingDays > 1 ? "s" : ""
    }`;
  }

  const months = Math.floor(diffDays / 30);
  const remainingAfterMonths = diffDays % 30;

  if (remainingAfterMonths === 0) {
    return `En ${months} mes${months > 1 ? "es" : ""}`;
  }

  return `En ${months} mes${months > 1 ? "es" : ""} y ${
    remainingAfterMonths > 1 ? "días" : "día"
  }`;
};

</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.card p {
  font-size: 13px;
  font-weight: 200;
  color: #222;
}

.card .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.menu-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
}


.card .header h3 {
  font-size: 15px;
  color: #222;
}

.card .header span {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
}

.card .main {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.card .main .student-info {
  max-width: 70%;
}

.card .main .student-info p {
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card .main .student-info h5 {
  font-size: 15px;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card .main .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #08b294;
}
.card .main .avatar span {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.card .booking-info div {
  display: flex;
  justify-content: space-between;
}

.card .booking-info div h5 {
  font-weight: 500;
}
</style>
