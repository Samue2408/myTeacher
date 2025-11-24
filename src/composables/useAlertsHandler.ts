import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";

export function useErrorHandler() {
  const appStore = useAppStore();
  const authStore = useAuthStore();

  function handleError(error: any, defaultMessage = "Ocurrió un error inesperado") {
    const message =
      error.response?.data?.message ||
      error.message ||
      error ||
      defaultMessage;

    appStore.setError(message);
    if (error.response && error.response?.status === 401) {
      authStore.restoreSession();
    }
  }

  return { handleError };
}

export function useSuccessHandler() {
  const appStore = useAppStore();

  function handleSuccess(response: any) {
    const message =
      response?.data?.message ||
      response.message ||
      response;

    appStore.setSuccess(message);
  }

  return { handleSuccess };
}