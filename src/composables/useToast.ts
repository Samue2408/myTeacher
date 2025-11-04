import { ref } from "vue";

export const useToast = () => {
  const show = ref(false);
  const message = ref("");
  const type = ref<"success" | "error" | "warning" | "info">("info");

  function triggerToast(msg: string, t: typeof type.value = "info") {
    message.value = msg;
    type.value = t;
    show.value = true;
  }

  return { show, message, type, triggerToast };
};
