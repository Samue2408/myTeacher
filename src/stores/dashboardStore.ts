import { defineStore } from "pinia";
import { DashboardService } from "@/api/dashboard.service";
import { DashboardType } from "@/types/dashboard";
import { useErrorHandler, useSuccessHandler } from '@/composables/useAlertsHandler';



export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboard: null as DashboardType | null,
    isLoading: true,
    loadedTutorId: null as string | null
  }),

  getters: {
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
            const { data } = await DashboardService.getById(tutorId) as {message: string, data: DashboardType};        

            this.dashboard = data;
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