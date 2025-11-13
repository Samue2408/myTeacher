<!-- src/components/global/AppAlert.vue -->
<template>
  <transition name="fade">
    <div v-if="errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>
  </transition>
  <transition name="fade">
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/appStore";

const { errorMessage, successMessage } = storeToRefs(useAppStore());
</script>

<style scoped>
.alert {
  border-radius: 8px;
  padding: 10px 16px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-size: 15px;
  font-weight: 600;
}

.alert-error {
  background: #ffecec;
  color: #d32f2f;
}
.alert-success {
  background: #edffec;
  color: #1d9923;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
