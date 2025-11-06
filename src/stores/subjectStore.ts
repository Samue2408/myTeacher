import { defineStore } from 'pinia'
import { SubjectsType } from '@/types/subjects';
import { SubjectsService } from '@/api/subjects.service';

export const useSubjectsStore = defineStore('subjects', {
  state: () => ({
    subjects: [] as SubjectsType[],
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
    }
  }
});
