<template>
  <nav class="nav">
    <h1 @click="goToHome" class="nav__title">
      <span>MT</span>
      myTeacher
    </h1>

    <div class="nav__actions">
      <button class="nav__search-button" @click="toggleSearch">
        <span class="material-icons-outlined">search</span>
      </button>

      <div class="nav__button-burguer">
        <button :class="{ active: isOpen }" @click="isOpen = !isOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <transition name="slide-down">
      <div v-if="showSearch" class="nav__search-top">
        <SearchBar
          placeholder="¿Qué materia quieres dar hoy?"
          :items="results"
          :loading="loading"
          @search="handleSearch"
          @select="goToItem"
          @clear="clearSearch"
          @enter="goToSearch"
        />
      </div>
    </transition>

    <div class="nav__search-desktop">
      <SearchBar
        placeholder="¿Qué materia quieres dar hoy?"
        :items="results"
        :loading="loading"
        @search="handleSearch"
        @select="goToItem"
        @clear="clearSearch"
        @enter="goToSearch"
      />
    </div>

    <div class="nav__buttons">
      <div v-if="auth.isAuthenticated">
        <button @click="goToBookins">Mis reservas</button>
        <div class="nav__profile">
          <img :src="user.image" alt="Perfil" @click="goToProfile" />
        </div>
      </div>

      <div v-else>
        <button class="btn-sign__up">Registrarme</button>
        <button class="btn-sign__in" @click="goToLogIn">Iniciar sesión</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import SearchBar from "@/shared/components/searchBar.vue";
import { useAuthStore } from "@/stores/authStore";
import { useUser } from "@/stores/userStore";
const user = useUser()

const goToProfile = () => router.push({ path: `/profile/${user.$id}` })

const auth = useAuthStore();

const router = useRouter();
const loading = ref(false);
const results = ref([]);
const isOpen = ref(false);
const showSearch = ref(false);

const handleSearch = (query) => {
  if (!query) {
    results.value = [];
    return;
  }
  loading.value = true;
  setTimeout(() => (loading.value = false), 600);
};

const goToHome = () => router.push({ path: "/" });
const goToBookins = () => router.push({ path: "/bookings" });

const goToSearch = (q) => {
  if (!q || !q.trim()) return;
  router.push({ path: "/search", query: { q } });
};
const goToLogIn = () => router.push({ path: "/user/login" });
const toggleSearch = () => (showSearch.value = !showSearch.value);
</script>

<style>
.nav {
  width: 100%;
  height: 8vh;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav__title {
  color: var(--color-bg);
  font-size: clamp(18px, 2vw, 20px);
  cursor: pointer;
}

.nav__title span {
  background-color: white;
  color: var(--color-primary);
  padding: 4px;
  border-radius: 10px;
  font-weight: 700;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav__search-button {
  background: none;
  border: none;
  color: white;
  font-size: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav__search-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 200;
}

.nav__search-desktop {
  display: none;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.nav__button-burguer {
  height: 100%;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav__button-burguer button {
  background-color: transparent;
  border: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transform: scale(0.5);
  cursor: pointer;
}

.nav__button-burguer button span {
  display: block;
  width: 100%;
  height: 8px;
  background-color: var(--color-bg);
  border-radius: 10px;
  transition: all 0.4s ease;
}

.nav__button-burguer button.active span:nth-of-type(1) {
  transform: translateY(20px) rotate(40deg);
}

.nav__button-burguer button.active span:nth-of-type(2) {
  opacity: 0;
  transform: translateX(-100%);
}

.nav__button-burguer button.active span:nth-of-type(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.nav__buttons {
  display: none;
}

.nav__profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid white;
}

.nav__profile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


@media (min-width: 1024px) {
  .nav {
    gap: 20px;
  }

  .nav__actions {
    display: none;
  }

  .nav__search-desktop {
    display: block;
    flex: 1;
    max-width: 500px;
  }

  .nav__buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav__buttons div{
    display: flex;
    gap: 10px;
  }

  .nav__buttons div button {
    padding: 8px 15px;
    border-radius: 4px;
    color: white;
    font-size: 90%;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .nav__buttons .btn-sign__up {
    background-color: white;
    color: var(--color-primary);
  }

  .nav__buttons div button:hover {
    background-color: #0f63b6;
    color: white;
  }
}
</style>
