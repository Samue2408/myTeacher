import { onMounted, onUnmounted, ref } from "vue";

export interface MeetingSchedule {
  date?: string | number | Date | null;
  startTime?: string | null;
  endTime?: string | null;
}

export interface MeetingWindow {
  start: Date;
  end: Date;
}

const JOIN_WINDOW_MINUTES = 15;
const meetingNow = ref(Date.now());
let clockTimer: ReturnType<typeof setInterval> | undefined;
let clockSubscribers = 0;

function parseLocalDateTime(date: MeetingSchedule["date"], time: string | null | undefined): Date | null {
  if (!date || !time) return null;
  const timeMatch = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!timeMatch) return null;

  const [, hour, minute] = timeMatch;
  let year: number;
  let month: number;
  let day: number;

  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) return null;
    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDate();
  } else {
    const dateMatch = String(date).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!dateMatch) return null;
    year = Number(dateMatch[1]);
    month = Number(dateMatch[2]) - 1;
    day = Number(dateMatch[3]);
  }

  const parsed = new Date(year, month, day, Number(hour), Number(minute));
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day ||
    parsed.getHours() !== Number(hour) ||
    parsed.getMinutes() !== Number(minute)
  ) {
    return null;
  }

  return parsed;
}

export function getMeetingWindow(schedule: MeetingSchedule): MeetingWindow | null {
  const start = parseLocalDateTime(schedule.date, schedule.startTime);
  const end = parseLocalDateTime(schedule.date, schedule.endTime);

  if (!start || !end) return null;
  if (end <= start) end.setDate(end.getDate() + 1);
  if (end <= start) return null;

  return { start, end };
}

export function isMeetingJoinAvailable(schedule: MeetingSchedule, now = new Date()): boolean {
  const window = getMeetingWindow(schedule);
  if (!window || Number.isNaN(now.getTime())) return false;

  const opensAt = window.start.getTime() - JOIN_WINDOW_MINUTES * 60 * 1000;
  return now.getTime() >= opensAt && now.getTime() <= window.end.getTime();
}

export function useMeetingClock() {
  onMounted(() => {
    clockSubscribers += 1;
    if (!clockTimer) {
      clockTimer = setInterval(() => {
        meetingNow.value = Date.now();
      }, 1000);
    }
  });

  onUnmounted(() => {
    clockSubscribers -= 1;
    if (clockSubscribers === 0 && clockTimer) {
      clearInterval(clockTimer);
      clockTimer = undefined;
    }
  });

  return meetingNow;
}
