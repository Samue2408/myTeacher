import { defineStore } from "pinia";

let messageTimer: ReturnType<typeof setTimeout> | undefined;

const friendlyMessage = (message: unknown, fallback: string) => {
  const text = String(message || "").trim();
  if (!text || text === "[object Object]") return fallback;
  if (/network error|failed to fetch|load failed/i.test(text)) return "No pudimos conectarnos al servicio. Revisa tu conexión e inténtalo de nuevo.";
  if (/unauthorized|token|jwt|401/i.test(text)) return "Tu sesión ya no está disponible. Inicia sesión nuevamente para continuar.";
  if (/timeout/i.test(text)) return "La solicitud tardó demasiado. Por favor, inténtalo de nuevo.";
  return text;
};

export const useAppStore = defineStore("app", {
  state: () => ({ errorMessage: "" as string | null, successMessage: "" as string | null }),
  actions: {
    setError(message: string) {
      if (messageTimer) clearTimeout(messageTimer);
      this.successMessage = null;
      this.errorMessage = friendlyMessage(message, "No pudimos completar la acción. Inténtalo de nuevo.");
      messageTimer = setTimeout(() => (this.errorMessage = null), 6000);
    },
    setSuccess(message: string) {
      if (messageTimer) clearTimeout(messageTimer);
      this.errorMessage = null;
      this.successMessage = friendlyMessage(message, "¡Listo! La acción se realizó correctamente.");
      messageTimer = setTimeout(() => (this.successMessage = null), 5000);
    },
    clearMessages() {
      if (messageTimer) clearTimeout(messageTimer);
      this.errorMessage = null;
      this.successMessage = null;
    },
  },
});
