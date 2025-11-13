// composables/useDashboardSync.ts
import { watch } from "vue";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useSubjectsStore } from "@/stores/subjectStore";
// Puedes importar más stores aquí (bookings, students, etc.)

export function useDashboardSync(tutorId: string) {
  const dashboardStore = useDashboardStore();
  const subjectsStore = useSubjectsStore();
  // const bookingsStore = useBookingsStore(); (cuando exista)

  // 🔁 Observa los stores que quieras sincronizar
  watch(
    [
      () => subjectsStore.SubjectsTutor.length,
      // () => bookingsStore.bookings.length, (ejemplo)
    ],
    () => {
      dashboardStore.refreshDashboardsByTutor(tutorId);
    },
    { deep: true } // detecta cambios internos también
  );
}
