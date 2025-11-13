import { useAppStore } from "@/stores/appStore";

export function useErrorHandler() {
  const appStore = useAppStore();

  function handleError(error: any, defaultMessage = "Ocurrió un error inesperado") {
    const message =
      error.response?.data?.message ||
      error.message ||
      error ||
      defaultMessage;

    appStore.setError(message);
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