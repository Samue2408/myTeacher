import { defineStore } from "pinia";
import { SubjectsService } from "@/api/subjects.service";
import { SubjectsPipe } from "@/pipes/subjects-pipe";

const pipe = new SubjectsPipe();

export const useSearchStore = defineStore("search", {
  state: () => ({
    loading: false,
    results: [] as any[],
    error: null as string | null,
    lastQuery: "",
  }),

  actions: {
    async search(query: string) {
      const cleanQuery = query.trim();
      if (!cleanQuery) {
        this.clear();
        return;
      }

      if (cleanQuery === this.lastQuery) return;

      this.loading = true;
      this.error = null;
      this.lastQuery = cleanQuery;

      try {
        const res = await SubjectsService.searchSubjects(cleanQuery);
        this.results = pipe.transform(res);
      } catch (error: any) {
        this.error = error.message || "Error al realizar la búsqueda";
        this.results = [];
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.results = [];
      this.error = null;
      this.lastQuery = "";
    },
  },
});
