<template>
  <div class="drop-down-container right stylized" @click.stop ref="modalRef">
    <ul v-if="isOpen" class="options-container">
      <template v-for="(item, i) in items" :key="i">
        <div v-if="dividerIndex === i" class="divider"></div>

        <li
          class="option"
          :class="[
            item.class,
            getCssClass(item, row, i),
            { red: i === itemRed },
          ]"
          @click.stop="handleClick(item)"
        >
          <i :class="getDynamicValue(item.icon, row, i)"></i>
          {{ getDynamicValue(item.label, row, i) }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, onBeforeUnmount, ref } from "vue";

interface DropdownItem {
  class?: string;
  classCss?: string | ((row: any, index: number) => string);
  icon?: string | ((row: any, index: number) => string);
  label?: string | ((row: any, index: number) => string);
  action?: (row: any) => void;
}

const modalRef = ref<HTMLElement | null>(null);

const props = defineProps<{
  items: DropdownItem[];
  row: any;
  isOpen: boolean;
  dividerIndex: number | null;
  itemRed: number | null;
}>();


const emit = defineEmits(["closed"]);

const handleClickOutside = (e: MouseEvent) => {
  if (!props.isOpen) return;

  if (modalRef.value && !modalRef.value.contains(e.target as Node)) {
    emit("closed");
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleClick = (item) => {
  if (item?.action) {
    item.action(props.row);
  }
  emit("closed");
};

const getCssClass = (item, row, index) => {
  const css = item.classCss;
  return typeof css === "function" ? css(row, index) : css || "";
};

const getDynamicValue = (value, row, index) => {
  return typeof value === "function" ? value(row, index) : value;
};
</script>

<style scoped lang="scss">
@import "../styles/colors.scss";
@import "../styles/utilities.scss";

.drop-down-container {
  text-align: initial;
  color: $dark-blue-font;
  font-weight: 600;
  position: relative;

  .options-container {
    display: flex;
    flex-direction: column;
    z-index: 7;
    padding: 0;
    margin: 0;
    position: absolute;
    min-width: 100%;
    background-color: white;
    border: 1px solid $border-color;
    border-radius: 0.5rem;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    max-width: 500px;
    width: max-content;
    animation: fadeIn 0.3s ease;
  }

  .option {
    display: inline-flex;
    padding: 0.8rem 0.8rem;
    cursor: pointer;
    gap: 0.5rem;
    align-items: center;
    color: #4e6598;
    font-weight: 600;
    font-size: $fs-14;

    i {
      font-size: $fs-14;
    }

    &.red {
      color: $red;
    }

    &:hover {
      background-color: $gray-bg;
    }
  }

  &.stylized {
    .options-container {
      padding: 0.5rem;
      gap: 0.3rem;

      .option {
        border-radius: 6px;
        padding: 0.5rem 0.6rem;

        &.selected {
          background-color: $dark-blue-bg;
          color: $blue;
        }
      }
    }

    &.right {
      .options-container {
        right: 15px;
      }
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-8px);
    height: 2px;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    height: fit-content;
  }
}
</style>
