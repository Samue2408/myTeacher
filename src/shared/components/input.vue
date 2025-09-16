<script setup lang="ts">
import { computed } from "vue";

defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
  icon?: string; 
  disabled?: boolean;
  readonly?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="input-wrapper">
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="onInput"
      class="input-field"
    />

    <span v-if="icon" class="input-icon">
      <i :class="`icon-${icon}`"></i>
    </span>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  background: #f2f2f2;
  border-radius: 8px;
  padding: 6px 10px;
  width: 100%;
  max-width: 400px;
}

.input-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
}

.input-field:disabled {
  opacity: 0.6;
}

.input-icon {
  color: #666;
  margin-left: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
}
</style>
