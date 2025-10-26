<template>
  <div class="calendar-month">
    <div class="calendar-header">
      <div class="calendar-header-content">
        <div class="left" @click="prevMonth">←</div>

        <div class="center-text">
          {{ monthName }} {{ year }}
        </div>

        <div class="right" @click="nextMonth">→</div>
      </div>
    </div>
    <div class="days-row">
      <div v-for="(day, i) in weekDays" :key="i">{{ day }}</div>
    </div>

    <div class="dates-grid">
      <div
        v-for="(date, i) in dates"
        :key="i"
        class="date-cell"
        :class="{
          hoverable: true,
          selected: isSelected(date),
          'in-range': isInRange(date),
          disabled: false,
        }"
        @click="onDateClick(date)"
      >
        {{ date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  startDate: Date,
  endDate: Date,
});

const emit = defineEmits(["dateSelected"]);

const today = new Date();
const month = ref(today.getMonth());
const year = ref(today.getFullYear());

const dates = ref([]);
const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const monthName = ref("");

function generateMonth() {
  const first = new Date(year.value, month.value, 1);
  const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1;

  monthName.value = first
    .toLocaleDateString("es-ES", { month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());

  const arr = [];
  for (let i = startDay * -1; i < 42 - startDay; i++) {
    arr.push(new Date(year.value, month.value, i + 1));
  }
  dates.value = arr;
}

watch([month, year], generateMonth, { immediate: true });

function prevMonth() {
  if (month.value === 0) {
    month.value = 11;
    year.value -= 1;
  } else {
    month.value -= 1;
  }
}

function nextMonth() {
  if (month.value === 11) {
    month.value = 0;
    year.value += 1;
  } else {
    month.value += 1;
  }
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
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
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
</script>

<style scoped lang="scss">
.calendar-month {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  margin: auto;
}

.calendar-header {
  position: relative;
  height: 32px;

  .calendar-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 100%;
  }

  .left,
  .right {
    cursor: pointer;
    font-size: 18px;
    user-select: none;
  }

  .center-text {
    font-weight: 600;
    font-size: 15px;
    text-transform: capitalize;
    color: #333;
  }
}

.days-row,
.dates-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.days-row {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.25rem;
}

.date-cell {
  padding: 0.5rem;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;

  &.hoverable:hover {
    background-color: #e6f0ff;
  }

  &.selected {
    background-color: #1677ff;
    color: #fff;
  }

  &.in-range {
    background-color: #dbe9ff;
  }

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }
}
</style>
