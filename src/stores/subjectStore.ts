import { defineStore } from 'pinia'
import { SubjectsType } from '@/types/subjects';
import { SubjectsService } from '@/api/subjects.service';


export const useSubjectsStore = defineStore('subjects', {
  state: () => ({
    subjects: [] as SubjectsType[]
  }),

  actions: {
    async fetchAllSubjects(){
        this.subjects = await SubjectsService.getAll();
    }
  }
})

