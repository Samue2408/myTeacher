<template>
  <main class="hero">
    <div class="hero__title">
      <h1 class="title">
        <span>CONECTA</span>
        <span>APRENDE</span>
        <span>CRECE</span>
      </h1>
      <span class="description"
        >Diseñada para transformar la manera en que estudiantes y tutores se
        conectan y comparten conocimiento</span
      >
      <div class="search" style="view-transition-name: search-box;">
        <input @keyup.enter="goToSearch" type="text" placeholder="Buscar materias" v-model="query" name="search" />
        <button @click="goToSearch">Buscar</button>
      </div>
    </div>
    <div class="hero__image">
      <img src="../assets/hero-image.png" alt="" />
    </div>
  </main>
</template>
<script setup>
  import { useRouter } from "vue-router";
  import { ref } from "vue";

  const router = useRouter();
  const query = ref("");

  
  const goToSearch = () => {
    router.push({ path: "/search", query: { q: query.value } });
  };

</script>
<style scoped>
@import "../_global.css";

main {
  background: linear-gradient(
    180deg,
    rgba(83, 127, 213, 0.2) 0%,
    rgba(249, 249, 249, 0.02) 100%
  );
}

.hero {
  width: 100%;
  min-height: calc(100vh - 8vh);
  padding-top: 40px;
  padding-inline: 35px;
}

.hero .hero__title,
.hero__image {
  width: 100%;
}

.hero .hero__title {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 20px;
}

.hero .hero__title h1 {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.hero .hero__title h1 span {
    font-size: clamp(3rem, 1vw, 4.5rem);
    font-weight: 800;
    color: var(--color-primary);
    animation: fadeIn 0.5s ease;
}

.hero .hero__title h1 span:first-of-type {
  animation-delay: 0;
}

.hero .hero__title h1 span:nth-of-type(2) {
  animation-delay: 0s;
}

.hero .hero__title h1 span:nth-of-type(3) {
  animation-delay: 0s;
}

.hero .hero__title .description {
  color: var(--color-muted);
  font-style: italic;
  font-size: 14px;
  animation: fadeIn 0.5s ease;
}

.hero .hero__title .search {
  width: 100%;
  margin-top: 10px;
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--color-bg);
}

.hero .hero__title .search input {
  width: 75%;
  padding: 10px 14px;
  font-size: 14px;
}

.hero .hero__title .search button{
  width: 25%;
  padding-block: 10px;
  color: white;
  background-color: var(--color-primary);
  font-size: 14px;
  border-radius: 6px;
}

.hero .hero__image {
  display: grid;
  place-items: center;
  margin-top: 50px;
  height: 40%;
}

.hero .hero__image img {
  object-fit: cover;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (min-width: 600px) {
  .hero {
    padding-inline: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
    padding-top: 0;
  }

  .hero .hero__title,
  .hero__image {
    width: 50%;
    height: 100%;
  }

  .hero .hero__title {
    max-width: 600px;
  }
  .hero .hero__title h1 {
    line-height: 1.4;
  }

  .hero .hero__title h1 span {
    font-size: clamp(3.5rem, 1vw, 4rem);
  }

  .hero .hero__title .description {
    color: var(--color-muted);
    font-style: italic;
    font-size: 16px;
  }

  .hero .hero__title .search input {
    font-size: 16px;
  }

  .hero .hero__title .search button{
    font-size: 16px;
  }

  .hero .hero__image {
    margin-top: 0;
    place-items: end;
  }

  .hero .hero__image img {
    max-width: 80%;
    height: auto;
  }

}
</style>
