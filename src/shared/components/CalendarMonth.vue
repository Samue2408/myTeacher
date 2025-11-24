<template>
  <div class="calendar-container">

    <!-- HEADER -->
    <header class="calendar-header">
      <button class="nav-btn" @click="prevPeriod">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="header-title">{{ headerTitle }}</div>

      <button class="nav-btn" @click="nextPeriod">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </header>

    <!-- MODE -->
    <nav class="view-switch">
      <button
        v-for="mode in ['día','semana','mes','año']"
        :key="mode"
        :class="{ active: viewMode === mode }"
        @click="setViewMode(mode)"
      >
        {{ mode }}
      </button>
    </nav>

    <!-- WEEK DAYS -->
    <div v-if="viewMode === 'semana'" class="days-row">
      <div v-for="(day, i) in weekDays" :key="i">{{ day }}</div>
    </div>

    <!-- DATES -->
    <transition name="fade">
      <div v-if="['día','semana','mes'].includes(viewMode)" class="dates-grid">
        <div
          v-for="(date, i) in visibleDates"
          :key="i"
          class="date-cell"
          :class="{
            selected: isSelected(date),
            'in-range': isInRange(date),
            today: isToday(date),
          }"
          @click="onDateClick(date)"
          @mouseenter="showTooltip(date, $event)"
          @mouseleave="hideTooltip"
        >
          <span>{{ date.getDate() }}</span>
        </div>
      </div>
    </transition>

    <!-- YEAR -->
    <transition name="fade">
      <div v-if="viewMode === 'año'" class="year-grid">
        <div
          v-for="(monthLabel, i) in months"
          :key="i"
          class="month-cell"
          @click="goToMonth(i)"
        >
          <span>{{ monthLabel }}</span>
        </div>
      </div>
    </transition>

    <!-- TOOLTIP -->
    <transition name="fade">
      <div
        v-if="tooltip.visible"
        class="tooltip"
        :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
      >
        <p>{{ tooltip.text }}</p>
      </div>
    </transition>

  </div>

  <!-- DRAWER BACKDROP -->
  <transition name="fade">
    <div v-if="showTimePicker" class="backdrop" @click="closeDrawer"></div>
  </transition>

  <!-- DRAWER SLIDE UP -->
  <transition name="slide-up">
    <div v-if="showTimePicker" class="drawer">

      <h3>
        Seleccionar horario  
        <span>{{ selectedDate?.toLocaleDateString("es-ES") }}</span>
      </h3>

      <div class="picker-row">
        <label>Hora inicial</label>
        <input type="time" v-model="startHour" />
      </div>

      <div class="picker-row">
        <label>Hora final</label>
        <input type="time" v-model="endHour" />
      </div>

      <div class="drawer-actions">
        <button class="cancel" @click="closeDrawer">Cancelar</button>
        <button class="confirm" @click="confirmTimeRange">Confirmar</button>
      </div>

    </div>
  </transition>

</template>


<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  startDate: Date,
  endDate: Date,
  tooltips: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["dateSelected"]);

const today = new Date();
const month = ref(today.getMonth());
const year = ref(today.getFullYear());
const viewMode = ref("mes");

const dates = ref([]);
const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const months = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const tooltip = ref({ visible: false, text: "", x: 0, y: 0 });

const selectedDate = ref(null);
const showTimePicker = ref(false);
const startHour = ref("09:00");
const endHour = ref("10:00");

const monthName = computed(() => {
  const n = new Date(year.value, month.value, 1).toLocaleDateString("es-ES", {
    month: "long",
  });
  return n.charAt(0).toUpperCase() + n.slice(1);
});

const headerTitle = computed(() => {
  switch (viewMode.value) {
    case "día":
      return today.toLocaleDateString("es-ES", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
    case "semana":
      const [start, end] = getCurrentWeekRange(today);
      return `Semana del ${start.getDate()} al ${end.getDate()} de ${monthName.value}`;
    case "mes":
      return `${monthName.value} ${year.value}`;
    case "año":
      return `${year.value}`;
  }
});

function generateMonth() {
  const first = new Date(year.value, month.value, 1);
  const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const arr = [];
  for (let i = startDay * -1; i < 42 - startDay; i++) {
    arr.push(new Date(year.value, month.value, i + 1));
  }
  dates.value = arr;
}
watch([month, year], generateMonth, { immediate: true });

const visibleDates = computed(() => {
  if (viewMode.value === "día") return [today];
  if (viewMode.value === "semana") return getCurrentWeek(today);
  return dates.value;
});

function getCurrentWeek(date) {
  const start = new Date(date);
  const day = start.getDay() === 0 ? 6 : start.getDay() - 1;
  start.setDate(start.getDate() - day);
  return Array.from({ length: 7 }, (_, i) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
  );
}
function getCurrentWeekRange(date) {
  const w = getCurrentWeek(date);
  return [w[0], w[6]];
}

function prevPeriod() {
  if (viewMode.value === "mes") {
    month.value = month.value === 0 ? 11 : month.value - 1;
    if (month.value === 11) year.value -= 1;
  } else if (viewMode.value === "año") year.value -= 1;
}
function nextPeriod() {
  if (viewMode.value === "mes") {
    month.value = month.value === 11 ? 0 : month.value + 1;
    if (month.value === 0) year.value += 1;
  } else if (viewMode.value === "año") year.value += 1;
}

function isSameDate(a, b) {
  if (!a || !b) return false;
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}
function isBetween(date, start, end) {
  if (!start || !end) return false;
  const t = date.getTime();
  return t > start.getTime() && t < end.getTime();
}
function isToday(date) {
  const now = new Date();
  return isSameDate(date, now);
}
function isSelected(date) {
  return isSameDate(date, props.startDate) || isSameDate(date, props.endDate);
}
function isInRange(date) {
  return isBetween(date, props.startDate, props.endDate);
}

function onDateClick(date) {
  selectedDate.value = date;
  showTimePicker.value = true;
}

function closeDrawer() {
  showTimePicker.value = false;
}

function confirmTimeRange() {
  emit("dateSelected", {
    date: selectedDate.value,
    startTime: startHour.value,
    endTime: endHour.value,
  });
  showTimePicker.value = false;
}

function goToMonth(i) {
  month.value = i;
  viewMode.value = "mes";
}

function showTooltip(date, event) {
  const key = date.toISOString().split("T")[0];
  if (!props.tooltips[key]) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const containerRect = event.currentTarget
    .closest(".calendar-container")
    .getBoundingClientRect();

  tooltip.value = {
    visible: true,
    text: props.tooltips[key],
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top,
  };
}

function hideTooltip() {
  tooltip.value.visible = false;
}

function setViewMode(mode) {
  viewMode.value = mode;
}
</script>


<style scoped lang="scss">
/* CALENDARIO (idéntico al tuyo) ---------------------------------- */

.calendar-container {
  width: 100%;
  max-width: 380px;
  margin: auto;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  font-family: "Inter", system-ui, sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  .header-title {
    font-weight: 600;
    text-transform: capitalize;
    font-size: 1rem;
  }

  .nav-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 50%;
    transition: all 0.2s;
    color: #444;

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
  }
}

.view-switch {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  button {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    border: 1px solid #d0d0d0;
    background: #fff;
    font-size: 0.8rem;
    cursor: pointer;

    &.active {
      background-color: #1677ff;
      color: white;
      border-color: #1677ff;
      box-shadow: 0 0 6px rgba(22, 119, 255, 0.3);
    }
  }
}

.days-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 0.75rem;
  color: #777;
  margin-bottom: 0.3rem;
  text-align: center;
}

.dates-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;

  .date-cell {
    padding: 0.6rem 0;
    border-radius: 8px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.25s ease;

    &.today {
      font-weight: 600;
      border: 1px solid #1677ff50;
    }

    &.in-range {
      background-color: #ebf3ff;
    }

    &.selected {
      background-color: #1677ff;
      color: #fff;
      box-shadow: 0 0 6px rgba(22, 119, 255, 0.4);
    }
  }
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;

  .month-cell {
    background: #fff;
    border-radius: 10px;
    padding: 0.75rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
}

/* TOOLTIP */
.tooltip {
  position: absolute;
  background: #222;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  transform: translate(-50%, -120%);
}

/* ---------------- DRAWER STYLES ---------------- */

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(2px);
  z-index: 90;
}

.drawer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  background: #fff;
  padding: 1.2rem 1rem;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 18px rgba(0,0,0,0.12);

  z-index: 100;
  animation: none;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;

    span {
      display: block;
      font-size: .85rem;
      font-weight: 400;
      color: #666;
    }
  }

  .picker-row {
    margin-bottom: 1rem;

    label {
      font-size: 0.8rem;
      color: #444;
      margin-bottom: 0.25rem;
      display: block;
    }
    input[type="time"] {
      padding: 0.55rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: .9rem;
      width: 100%;
    }
  }

  .drawer-actions {
    display: flex;
    justify-content: flex-end;
    gap: .75rem;

    .cancel {
      padding: .55rem 1rem;
      border-radius: 8px;
      background: #eee;
      border: none;
      cursor: pointer;
    }
    .confirm {
      padding: .55rem 1rem;
      border-radius: 8px;
      background: #1677ff;
      color: white;
      cursor: pointer;
      border: none;
      font-weight: 500;
      box-shadow: 0 0 6px rgba(22,119,255,.3);
    }
  }
}

/* ANIMACIONES */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform .28s ease, opacity .28s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

