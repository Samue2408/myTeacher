<template>
  <main class="schedule" ref="containerRef">
    <header class="schedule__header-controls">
      <button @click="previousWeek" class="nav-btn">←</button>
      <span class="week-label">{{ formattedWeekRange }}</span>
      <button @click="nextWeek" class="nav-btn">→</button>
      <button @click="goToToday" class="today-btn">Hoy</button>
    </header>

    <section class="schedule__header">
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="schedule__day"
        :class="{
          'schedule__day--selected': selectedDay === day.date,
          'schedule__day--highlighted': day.isHighlighted,
          'schedule__day--today': isToday(day.date)
        }"
        @click="onDayClick(day, $event)"
        @mouseenter="onDayEnter(day, $event)"
        @mouseleave="onDayLeave"
        role="button"
        tabindex="0"
      >
        <span class="schedule__weekday">{{ day.weekday }}</span>
        <span class="schedule__number">{{ day.day }}</span>
      </div>
    </section>

    <div
      v-if="tooltip.visible"
      class="tooltip"
      :style="{
        top: tooltip.top + 'px',
        left: tooltip.left + 'px',
        transform: 'translateX(-50%) translateY(-8px)'
      }"
      aria-hidden="false"
    >
      <div class="tooltip-inner">
        <div class="tooltip-title">{{ tooltip.title }}</div>
        <!-- <div class="tooltip-sub">
          {{ tooltip.count }}
        </div> -->
      </div>
      <div class="tooltip-arrow" />
    </div>

    <section class="schedule__list">
      <article
        v-for="block in filteredAvailabilities"
        :key="block._id"
        class="event"
        :class="{ 'event--inactive': !block.active }"
        :style="{
          backgroundColor: block.active ? '#e9f5ee' : '#f2f2f2',
          borderLeft: block.active ? '4px solid #1abc9c' : '4px solid #ccc'
        }"
      >
        <div class="event__info">
          <h3 class="event__title">
            {{ block.isRecurring ? 'Recurrente' : 'Disponible' }}
          </h3>
          <p class="event__time">{{ block.startTime }} – {{ block.endTime }}</p>
        </div>
      </article>

      <p v-if="!filteredAvailabilities.length" class="empty-text">
        No hay disponibilidad para este día.
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  availabilities: { type: Array, default: () => [] },
  highlightedDates: { type: Array, default: () => [] },
  startDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
});

const containerRef = ref(null);

const selectedDay = ref(props.startDate);
const currentDate = ref(new Date(props.startDate));

const tooltip = ref({
  visible: false,
  title: "",
  count: 0,
  left: 0, 
  top: 0, 
  date: null,
});

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); 
  const diff = d.getDate() - (day === 0 ? 6 : day - 1); 
  const start = new Date(d);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

const nextWeek = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    currentDate.value.getDate() + 7
  );
  const monday = getStartOfWeek(currentDate.value);
  selectedDay.value = monday.toISOString().slice(0, 10);
  hideTooltip();
};
const previousWeek = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    currentDate.value.getDate() - 7
  );
  const monday = getStartOfWeek(currentDate.value);
  selectedDay.value = monday.toISOString().slice(0, 10);
  hideTooltip();
};
const goToToday = () => {
  const today = new Date();
  currentDate.value = new Date(today);
  selectedDay.value = today.toISOString().slice(0, 10);
  hideTooltip();
};

const weekDays = computed(() => {
  const start = getStartOfWeek(currentDate.value);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().slice(0, 10);
    days.push({
      date: dateStr,
      day: date.getDate(),
      weekday: date.toLocaleDateString("es-ES", { weekday: "short" }),
      isHighlighted: props.highlightedDates.includes(dateStr),
    });
  }
  return days;
});

const formattedWeekRange = computed(() => {
  const start = weekDays.value[0];
  const end = weekDays.value[6];
  if (!start || !end) return "";
  const s = new Date(start.date);
  const e = new Date(end.date);
  const sMonth = s.toLocaleDateString("es-ES", { month: "short" });
  const eMonth = e.toLocaleDateString("es-ES", { month: "short" });
  const year = e.getFullYear();
  return sMonth === eMonth
    ? `${start.day}–${end.day} ${sMonth} ${year}`
    : `${start.day} ${sMonth} – ${end.day} ${eMonth} ${year}`;
});

const filteredAvailabilities = computed(() => {
  const dayOfWeek = new Date(selectedDay.value).toLocaleDateString("en-US", {
    weekday: "long",
  });

  return props.availabilities.filter((a) => {
    if (!a.active) return false;
    if (a.isRecurring && a.dayOfWeek === dayOfWeek) return true;
    if (!a.isRecurring && a.date?.slice(0, 10) === selectedDay.value) return true;
    return false;
  });
});

function formatFullDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getAvailabilitiesForDate(dateStr) {
  const dayOfWeek = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
  });
  return props.availabilities.filter((a) => {
    if (!a.active) return false;
    if (a.isRecurring && a.dayOfWeek === dayOfWeek) return true;
    if (!a.isRecurring && a.date?.slice(0, 10) === dateStr) return true;
    return false;
  });
}

function showTooltipForDay(day, eventTarget) {
  const container = containerRef.value;
  if (!container || !eventTarget) {
    tooltip.value.left = container ? container.clientWidth / 2 : 0;
    tooltip.value.top = 16;
  } else {
    const targetRect = eventTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    
    tooltip.value.left = (targetRect.left - containerRect.left + targetRect.width / 2) + 20;

    tooltip.value.top = targetRect.top - containerRect.top;
  }

  tooltip.value.title = formatFullDate(day.date);
  tooltip.value.count = getAvailabilitiesForDate(day.date).length;
  tooltip.value.date = day.date;
  tooltip.value.visible = true;
}

function hideTooltip() {
  tooltip.value.visible = false;
}

const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

function onDayEnter(day, evt) {
  if (isTouchDevice) return; 
  showTooltipForDay(day, evt.currentTarget);
}

function onDayLeave() {
  if (isTouchDevice) return;
  hideTooltip();
}

function onDayClick(day, evt) {
  selectedDay.value = day.date;
  if (isTouchDevice) {
    if (tooltip.value.visible && tooltip.value.date === day.date) {
      hideTooltip();
    } else {
      showTooltipForDay(day, evt.currentTarget);
    }
  } else {
    hideTooltip();
  }
}

function isToday(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  return (
    now.getDate() === d.getDate() &&
    now.getMonth() === d.getMonth() &&
    now.getFullYear() === d.getFullYear()
  );
}
</script>

<style scoped>
.schedule {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
  font-family: "Inter", sans-serif;
  position: relative;
}

.schedule__header-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.nav-btn,
.today-btn {
  background: none;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.18s;
}

.nav-btn:hover,
.today-btn:hover {
  background: #f2f2f2;
}

.today-btn {
  margin-left: auto;
  font-weight: 600;
}

.week-label {
  font-weight: 600;
  color: #333;
}

.schedule__header {
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.schedule__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: transform 0.15s ease, background 0.15s;
  position: relative;
}

.schedule__day:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.12);
  border-radius: 8px;
}

.schedule__day--today .schedule__number {
  box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.08);
}

.schedule__day--selected .schedule__number {
  background: #1abc9c;
  color: #fff;
  transform: scale(1.05);
}

.schedule__day--highlighted .schedule__number {
  background: #fef7d1;
}

.schedule__weekday {
  font-size: 0.78rem;
  color: #666;
  text-transform: capitalize;
}

.schedule__number {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.3rem;
  font-weight: 700;
  color: #222;
  transition: background 0.15s, transform 0.15s;
}

.schedule__number:hover {
  background: #f1f5f9;
}

.tooltip {
  position: absolute;
  z-index: 1200;
  background: #111827;
  color: #fff;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  pointer-events: none; 
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.2);
  transform-origin: center bottom;
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.tooltip-inner {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tooltip-title {
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: capitalize;
}

.tooltip-sub {
  font-size: 0.82rem;
  color: #e6eef7;
}

.tooltip-arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  bottom: -6px;
  background: #111827;
  border-radius: 2px;
  filter: drop-shadow(0 4px 8px rgba(2, 6, 23, 0.12));
}

.schedule__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  transition: transform 0.12s ease;
  background: #fff;
  border: 1px solid #eef2f6;
}

.event--inactive {
  opacity: 0.5;
}

.event__title {
  margin: 0 0 4px 0;
  font-weight: 700;
}

.event__time {
  margin: 0;
  color: #6b7280;
  font-size: 0.92rem;
}

.empty-text {
  text-align: center;
  color: #9aa0a6;
  margin-top: 1.5rem;
}

@media (max-width: 600px) {
  .tooltip {
    pointer-events: auto;
  }
}
</style>
