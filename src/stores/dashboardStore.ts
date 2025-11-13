import { defineStore } from "pinia";
import { DashboardService } from "@/api/dashboard.service";
import { DashboardType } from "@/types/dashboard";
import { useErrorHandler, useSuccessHandler } from '@/composables/useAlertsHandler';


type DashboardWithDiff = DashboardType & {
  studentsDiff: number;
  incomeDiff: number;
  canceledClassesDiff: number;
  pendingRequestsDiff: number;
};

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboard: null as DashboardWithDiff | null,
    isLoading: false,
    loadedTutorId: null as string | null
  }),

  getters: {
    // Ejemplo de getter si luego quieres mostrar los porcentajes de cambio
    studentsChangePercent: (state) => {
      if (!state.dashboard) return 0;
      const { students, studentsLastPerium } = state.dashboard;
      if (studentsLastPerium === 0) return 100;
      return ((students - studentsLastPerium) / studentsLastPerium) * 100;
    },
    isLoadedForTutor: (state) => (tutorId: string) =>
      state.loadedTutorId === tutorId && state.dashboard != null,
  },

  actions: {
    async fetchById(tutorId: string) {
        if (this.isLoadedForTutor(tutorId)) return; // Usa cache
        const { handleError } = useErrorHandler();
        const { handleSuccess } = useSuccessHandler();
        this.isLoading = true;

        try {
            const data = await DashboardService.getById(tutorId) as DashboardType;            

            // Calculamos las diferencias
            const dashboardWithDiff: DashboardWithDiff = {
            ...data,
            studentsDiff: data.students - data.studentsLastPerium,
            incomeDiff: data.income - data.incomeLastPerium,
            canceledClassesDiff: data.canceledClasses - data.canceledClassesLastPerium,
            pendingRequestsDiff: data.pendingRequests - data.pendingRequestsLastPerium,
            };

            this.dashboard = dashboardWithDiff;
            this.loadedTutorId = tutorId;

            handleSuccess('Dashboard actualizado');
        } catch (error) {
            handleError(error);
        } finally {
            this.isLoading = false;
        }
    },
    // Refrescar materias de un tutor (ignora cache) 
    async refreshDashboardsByTutor(tutorId: string) {
      this.loadedTutorId = null;
      await this.fetchById(tutorId);
    },
  },
});