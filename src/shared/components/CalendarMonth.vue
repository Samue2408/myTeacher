<template>
  <div class="calendar-container">
    <header class="calendar-header">
      <button class="nav-btn" @click="prevPeriod">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
        >
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <div class="header-title">{{ headerTitle }}</div>

      <button class="nav-btn" @click="nextPeriod">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
        >
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </header>

    <nav class="view-switch">
      <button
        v-for="mode in ['día', 'semana', 'mes', 'año']"
        :key="mode"
        :class="{ active: viewMode === mode }"
        @click="setViewMode(mode)"
      >
        {{ mode }}
      </button>
    </nav>

    <div v-if="viewMode === 'semana'" class="days-row">
      <div v-for="(day, i) in weekDays" :key="i">{{ day }}</div>
    </div>

    <transition name="fade">
      <div
        v-if="['día', 'semana', 'mes'].includes(viewMode)"
        class="dates-grid"
      >
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
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const tooltip = ref({ visible: false, text: "", x: 0, y: 0 });

const monthName = computed(() => {
  const name = new Date(year.value, month.value, 1).toLocaleDateString(
    "es-ES",
    { month: "long" }
  );
  return name.charAt(0).toUpperCase() + name.slice(1);
});

const headerTitle = computed(() => {
  switch (viewMode.value) {
    case "día":
      return today.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    case "semana":
      const [start, end] = getCurrentWeekRange(today);
      return `Semana del ${start.getDate()} al ${end.getDate()} de ${
        monthName.value
      }`;
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
  return Array.from(
    { length: 7 },
    (_, i) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
  );
}
function getCurrentWeekRange(date) {
  const week = getCurrentWeek(date);
  return [week[0], week[6]];
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
  emit("dateSelected", date);
}
function goToMonth(i) {
  month.value = i;
  viewMode.value = "mes";
}

function showTooltip(date, event) {
  const key = date.toISOString().split("T")[0];
  if (!props.tooltips[key]) return;

  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();

  const containerRect = target
    .closest(".calendar-container")
    .getBoundingClientRect();
  const relativeX = rect.left - containerRect.left + rect.width / 2;
  const relativeY = rect.top - containerRect.top;

  tooltip.value = {
    visible: true,
    text: props.tooltips[key],
    x: relativeX,
    y: relativeY,
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
    text-transform: capitalize;
    cursor: pointer;
    transition: all 0.2s;

    &.active {
      background-color: #1677ff;
      color: white;
      border-color: #1677ff;
      box-shadow: 0 0 6px rgba(22, 119, 255, 0.3);
    }

    &:hover:not(.active) {
      background-color: #f5f8ff;
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
  text-align: center;

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

    &:hover:not(.selected) {
      background-color: #edf2ff;
      transform: scale(1.05);
    }
  }
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  text-align: center;

  .month-cell {
    background: #fff;
    border-radius: 10px;
    padding: 0.75rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #1677ff;
      color: white;
      transform: scale(1.05);
    }
  }
}

.tooltip {
  position: absolute;
  background: #222;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -120%);
  white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
