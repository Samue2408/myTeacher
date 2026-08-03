// composables/useDashboardSync.ts
import { watch } from "vue";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useSubjectsStore } from "@/stores/subjectStore";
import { useBookingsStore } from "@/stores/bookingsStore";
// Puedes importar más stores aquí (bookings, students, etc.)

export function useDashboardSync(tutorId: string) {
  const dashboardStore = useDashboardStore();
  const subjectsStore = useSubjectsStore();
  const bookingsStore = useBookingsStore();
  // const bookingsStore = useBookingsStore(); (cuando exista)

  // 🔁 Observa los stores que quieras sincronizar
  watch(
    [
      () => subjectsStore.SubjectsTutor.length,
      () => bookingsStore.tutorBookings.map((booking) => `${booking._id}-${booking.status}`),
    ],
    () => {
      dashboardStore.refreshDashboardsByTutor(tutorId);
    },
    { deep: true } // detecta cambios internos también
  );
}
