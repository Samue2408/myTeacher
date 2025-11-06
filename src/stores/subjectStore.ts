import { defineStore } from 'pinia'
import { SubjectsType } from '@/types/subjects';
import { SubjectsService } from '@/api/subjects.service';
import { useErrorHandler } from '@/composables/useErrorHandler';

export const useSubjectsStore = defineStore('subjects', {
  state: () => ({
    subjects: [] as SubjectsType[],
    SubjectsTutor: [] as SubjectsType[],
    errorMessage: "",
    loaded: false 
  }),

  actions: {
    async fetchAllSubjects(force = false) {
      if (this.loaded && !force) return

      try {
        const data = await SubjectsService.getAll();
        this.subjects = data;
        this.loaded = true;
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    },

    async fetchSubjectsByTutor(tutorId: string, force = false) {
      const { handleError } = useErrorHandler();

      if (this.loaded && !force) return

      try {
        const data = await SubjectsService.getByTutor(tutorId);
        this.SubjectsTutor = data;
        this.loaded = true;
        this.errorMessage = ''

      } catch (error) {
        handleError(error, "No se pudieron cargar las materias.");
        this.errorMessage = 'No se econtraron materias'
      }
    },
  }

});
