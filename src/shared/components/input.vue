<script setup lang="ts">
import { defineProps } from "vue";


const $props = defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
  icon?: string; 
  disabled?: boolean;
  readonly?: boolean;
  styles?: string;
}>();

const emit = defineEmits(["update:modelValue"]);
const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};


</script>

<template>
  <div class="input-wrapper" :class="$props.styles">
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="onInput"
      class="input-field"
    />

    <span v-if="icon" class="input-icon material-icons-outlined" >
      {{ icon  }}
    </span>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  background-color: #f2f2f2;
  align-items: center;  
  border-radius: 6px;
  padding: 15px 12px;
  width: 100%;
  gap: 8px;
}

.input-wrapper.white {
  background-color: #fff;
  border-radius: 8px;
  flex-direction: row-reverse;
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
  color: var(--color-gray);
  font-size: 16px;
  display: flex;
  align-items: center;
}
</style>
