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
        <span>En 2 días</span>

        <div class="menu-trigger" @click.stop="toggleMenu">
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
          <p>Mauricio Molina</p>
          <h5>Programación</h5>
        </div>
        <div class="avatar">
          <span>M</span>
        </div>
      </div>

      <div class="booking-info">
        <div class="date">
          <p>Fecha:</p>
          <h5>23/11/2025</h5>
        </div>
        <div class="schedule">
          <p>Horario:</p>
          <h5>10:00 AM - 11:00 AM</h5>
        </div>
        <div class="mode">
          <p>Modalidad:</p>
          <h5>Presencial</h5>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BookingsType } from "@/types/bookings";
import type { PropType } from "vue";
import MenuModal from "@/shared/components/MenuModal.vue";

const $props = defineProps({
  booking: {
    type: Object as PropType<BookingsType>,
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

const menuItems = [
  {
    label: "Ir al enlace",
    icon: "link",
    action: (row: BookingsType) => {
      console.log("Ir al enlace:", row);
    },
  },
  {
    label: "Ir a calendario",
    icon: "schedule",
    action: (row: BookingsType) => {
      console.log("Ir al calendario:", row);
    },
  },
  {
    label: "Cancelar clase",
    icon: "close",
    class: "red",
    action: (row: BookingsType) => {
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
  cursor: pointer;
  font-size: 22px;
  padding: 4px;
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
