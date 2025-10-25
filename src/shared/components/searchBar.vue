<template>
  <div class="search-bar" ref="searchContainer">
    <div class="search-bar__input-wrapper">
      <input
        ref="inputRef"
        v-model="query"
        :placeholder="placeholder"
        type="text"
        class="search-bar__input"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.enter="emitEnter"
        @input="onInput"
      />
      <button class="search-bar__icon" @click="emitSearch" :disabled="loading">
        <span v-if="!loading" class="material-icons-outlined">search</span>
        <span v-else class="loader"></span>
      </button>
    </div>

    <ul v-if="showDropdown && items.length > 0" class="search-bar__dropdown">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="search-bar__option"
        @click="selectItem(item)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  placeholder: { type: String, default: "Buscar..." },
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["search", "select", "clear", "enter"]);

const query = ref("");
const showDropdown = ref(false);

const onInput = () => {
  showDropdown.value = true;
  emit("search", query.value);
};

const emitSearch = () => {
  emit("search", query.value);
  showDropdown.value = true;
};

// 🔹 Nuevo: emitir cuando se presiona ENTER
const emitEnter = () => {
  emit("enter", query.value);
};

const selectItem = (item) => {
  query.value = item.name;
  showDropdown.value = false;
  emit("select", item);
};

const onFocus = () => {
  if (props.items.length > 0) showDropdown.value = true;
};

const onBlur = () => {
  setTimeout(() => (showDropdown.value = false), 150);
};

watch(query, (val) => {
  if (val === "") emit("clear");
});
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  font-family: "Inter", system-ui, sans-serif;
}

.search-bar__input-wrapper {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.6px solid #e3e6ec;
  border-radius: 6px;
  padding: 3px;
  box-sizing: border-box;
  transition: all 0.25s ease;
  height: 100%;
}

.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #222;
  padding: 8px 6px;
}

.search-bar__input::placeholder {
  color: #aaa;
  font-weight: 400;
}

.search-bar__icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #1e5ab6;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.2s ease, transform 0.2s ease;
}

.search-bar__icon:hover {
  background: rgba(30, 90, 182, 0.08);
  transform: scale(1.08);
}

.loader {
  width: 16px;
  height: 16px;
  border: 2px solid #1e5ab6;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.search-bar__dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 20;
  animation: fadeIn 0.2s ease;
}

.search-bar__option {
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s ease, padding-left 0.15s ease;
}

.search-bar__option:hover {
  background: #f4f7fb;
  padding-left: 18px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
