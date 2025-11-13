import { defineStore } from 'pinia'
import { SubjectsType } from '@/types/subjects';
import { SubjectsService } from '@/api/subjects.service';
import { useErrorHandler, useSuccessHandler } from '@/composables/useAlertsHandler';

export const useSubjectsStore = defineStore('subjects', {
  state: () => ({
    subjects: [] as SubjectsType[],          // Todas las materias (solo si se usan globalmente)
    SubjectsTutor: [] as SubjectsType[],     // Materias del tutor autenticado
    loadedTutorId: null as string | null,    // Controla si ya se cargó ese tutor
    loading: false,                          // Estado general de carga
    errorMessage: '' as string,              // Mensaje de error para mostrar en UI
  }),

  getters: {
    hasSubjects: (state) => state.SubjectsTutor.length > 0,
    isLoadedForTutor: (state) => (tutorId: string) =>
      state.loadedTutorId === tutorId && state.SubjectsTutor.length > 0,
  },

  actions: {
    async createSubject(subjectData: SubjectsType){
      const { handleError } = useErrorHandler();
      const { handleSuccess } = useSuccessHandler()
      this.loading = true;

      try {
        const created = await SubjectsService.create(subjectData);
        this.SubjectsTutor.push(created);
        this.errorMessage = ''
        handleSuccess('Materia creada con éxito')
      } catch (err) {
        handleError(this.errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async fetchAllSubjects() {
      this.loading = true;
      try {
        const data = await SubjectsService.getAll();
        this.subjects = data;
        this.loading = false;
        this.errorMessage = ''
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    },

    async fetchSubjectsByTutor(tutorId: string) {
      if (this.isLoadedForTutor(tutorId)) return; // Usa cache

      this.loading = true;
      this.errorMessage = '';

      try {
        const data = await SubjectsService.getByTutor(tutorId);
        this.SubjectsTutor = data;
        this.loading = false;
        this.loadedTutorId = tutorId;

      } catch (error) {
        this.errorMessage = 'No se econtraron materias'
      }
    },

    async updateSubject(subjectData: SubjectsType){
      const { handleError } = useErrorHandler();
      const { handleSuccess } = useSuccessHandler()

      this.loading = true;

      try {
        await SubjectsService.update(subjectData._id, subjectData);
        this.errorMessage = ''
        handleSuccess('Materia actualizada con éxito')
      } catch (err) {
        handleError(this.errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async deleteSubject(idSubject: string) {
      try {
        const data = await SubjectsService.delete(idSubject)
        this.SubjectsTutor = this.SubjectsTutor.filter(s => s._id !== idSubject);
        this.errorMessage = ''
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    },

    /** 🔹 Refrescar materias de un tutor (ignora cache) */
    async refreshSubjectsByTutor(tutorId: string) {
      this.loadedTutorId = null;
      await this.fetchSubjectsByTutor(tutorId);
    },
  }

});
