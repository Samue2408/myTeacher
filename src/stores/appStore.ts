// src/stores/appStore.ts
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    errorMessage: "" as string | null,
    successMessage: "" as string | null,
  }),

  actions: {
    setError(message: string) {
      this.errorMessage = message;
      setTimeout(() => (this.errorMessage = null), 5000); // se limpia en 5s
    },
    setSuccess(message: string) {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = null), 5000);
    },
    clearMessages() {
      this.errorMessage = null;
      this.successMessage = null;
    },
  },
});