<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="toast"
      :class="`toast--${type}`">
      <span class="toast__icon">{{ icon }}</span>
      <span class="toast__message">{{ message }}</span>
      <button class="toast__close" @click="close">×</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  modelValue: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  duration: 3000,
});

const emit = defineEmits(["update:modelValue"]);

const visible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
    if (val) autoClose();
  },
  { immediate: true }
);

function close() {
  visible.value = false;
  emit("update:modelValue", false);
}

function autoClose() {
  setTimeout(() => close(), props.duration);
}

const icon = computed(() => {
  switch (props.type) {
    case "success": return "✔️";
    case "error": return "❌";
    case "warning": return "⚠️";
    default: return "ℹ️";
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  min-width: 250px;
  background: #fff;
  border-left: 6px solid;
  padding: 14px 18px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-weight: 500;
  animation: slideUp 0.3s ease;
  z-index: 9999;
}

.toast__icon {
  font-size: 20px;
}

.toast__close {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #555;
}

.toast--success {
  border-color: #27ae60;
  color: #27ae60;
}

.toast--error {
  border-color: #e74c3c;
  color: #e74c3c;
}

.toast--warning {
  border-color: #f39c12;
  color: #f39c12;
}

.toast--info {
  border-color: #3498db;
  color: #3498db;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
