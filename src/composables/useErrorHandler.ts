import { useAppStore } from "@/stores/appStore";

export function useErrorHandler() {
  const appStore = useAppStore();

  function handleError(error: any, defaultMessage = "Ocurrió un error inesperado") {
    const message =
      error.response?.data?.message ||
      error.message ||
      defaultMessage;

    appStore.setError(message);
  }

  return { handleError };
}