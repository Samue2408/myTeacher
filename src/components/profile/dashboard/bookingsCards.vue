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
            :itemRed="2"
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
import { ref } from "vue";
import { Booking } from '@/types/dashboard'
import type { PropType } from "vue";
import MenuModal from "@/shared/components/MenuModal.vue";

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

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};



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

const menuItems = [
  {
    label: "Ir al enlace",
    icon: "link",
    action: (row: Booking) => {
      console.log("Ir al enlace:", row);
    },
  },
  {
    label: "Ir a calendario",
    icon: "schedule",
    action: (row: Booking) => {
      console.log("Ir al calendario:", row);
    },
  },
  {
    label: "Cancelar clase",
    icon: "close",
    class: "red",
    action: (row: Booking) => {
      console.log("Cancelar clase:", row);
    },
  },
];
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
