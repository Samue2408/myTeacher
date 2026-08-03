import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";

export function useErrorHandler() {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const handleError = (error: any, defaultMessage = "No pudimos completar la acción. Inténtalo de nuevo.") => {
    appStore.setError(error?.response?.data?.message || error?.message || defaultMessage);
    if (error?.response?.status === 401) authStore.restoreSession();
  };
  return { handleError };
}

export function useSuccessHandler() {
  const appStore = useAppStore();
  const handleSuccess = (response: any) => {
    const message = response?.data?.message || response?.message || (typeof response === "string" ? response : "¡Listo! Tus cambios se guardaron correctamente.");
    appStore.setSuccess(message);
  };
  return { handleSuccess };
}
