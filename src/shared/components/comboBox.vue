<template>
  <div class="combo-box" @click.stop="toggleList">
    <div class="combo-selected" :class="$props.styles" >
      <div v-if="startItem && selectedItem?.img" class="start-item">
        <img :src="selectedItem.img" :alt="selectedItem.label" />
      </div>
      <span>{{ selectedItem ? selectedItem.label : placeholder }}</span>
      <span class="material-icons-outlined arrow" :class="{ open: isOpen }">expand_more</span>
    </div>

    <ul v-if="isOpen" class="combo-list">
      <li
        v-for="(item, i) in items"
        :key="i"
        @click.stop="selectItem(item)"
        class="combo-item"
      >
        <div v-if="startItem && item.img" class="start-item">
          <img :src="item.img" :alt="item.label" />
        </div>
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, defineProps } from "vue";

interface Item {
  label: string;
  value: string;
  img?: string;
}

const $props = defineProps<{
  modelValue: string | null;
  items: Item[];
  placeholder?: string;
  startItem?: boolean;
  styles?: string;
}>();


const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);

const selectedItem = computed(() =>
  $props.items.find((item) => item.value === $props.modelValue) || null
);

function toggleList() {
  isOpen.value = !isOpen.value;
}

function selectItem(item: Item) {
  emit("update:modelValue", item.value);
  isOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest(".combo-box")) isOpen.value = false;
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>

<style>
.combo-box {
  position: relative;
  width: 100%;
  font-size: 14px;
}


.combo-selected {
  background-color: #f2f2f2;
  padding: 15px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.combo-selected.white {
  background-color: #fff;
}

.combo-selected:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.combo-selected .start-item {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.combo-selected .start-item img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.combo-list {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  z-index: 10;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  max-height: 180px;
  overflow-y: auto;
  animation: fadeIn 0.2s ease;
}

.combo-item {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.combo-item:hover {
  background-color: #f4f6ff;
}

.arrow {
  font-size: 20px;
  color: #555;
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(180deg);
  color: var(--color-primary);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
