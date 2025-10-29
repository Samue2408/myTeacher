<template>
  <main class="hero">
    <div class="hero__title">
      <div class="subtitle">
        <span >Plataforma de Tutorias</span>
      </div>
      
      <h1 class="title">
        <span>CONECTA,</span>
        <span>APRENDE,</span>
        <span>CRECE</span>
      </h1>
      <span class="description">
        Diseñada para transformar la manera en que estudiantes y tutores se
        conectan y comparten conocimiento
      </span>
      <div class="call-to-actions">
        <div class="action1" @click="goToSearch"><button >Buscar tutores</button></div>
        <div class="action2" @click="goToRegister"><button>Ser Tutor</button></div>
      </div>
    </div>
    <div class="hero__image">
      <img src="../assets/hero-image.png" alt="" />
    </div>
  </main>
</template>
<script setup>
import { useRouter } from "vue-router"

const router = useRouter()
const goToSearch = () => {
  router.push({ path: "/search"})
}
const goToRegister = () => router.push({ path: "/user/signup" })
</script>
<style scoped>
@import "../_global.css";

main {  
  background: linear-gradient(
      180deg,
      rgb(83, 126, 213) 0%,
      rgba(83, 127, 213, 0.2) 15%,
      var(--color-bg) 30%
    );
}

canvas {
  display: block;
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

.hero .hero__title .subtitle {
  display: inline-block;
  padding: 6px 12px;
  background-color: #fff;
  border-radius: 99px;
}

.hero .hero__title .subtitle span {
  font-size: .875rem;
  font-weight: 600;
  color: var(--color-primary);
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
    animation: fadeIn 0.5s ease forwards;
    transform: translateX(-100px);
    opacity: 0;
}

.hero .hero__title h1 span:first-of-type {
  animation-delay: 0;
}

.hero .hero__title h1 span:nth-of-type(2) {
  animation-delay: .1s;
}

.hero .hero__title h1 span:nth-of-type(3) {
  animation-delay: .15s;
}

.hero .hero__title .description {
  color: var(--color-muted);
  font-style: italic;
  font-size: 14px;
  animation: fadeIn 0.5s ease forwards;
}

.hero .hero__title .search {
  width: 80%;
  margin-top: 10px;
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--color-bg);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: end;
}

.hero .hero__title .search input {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.hero .hero__title .search button{
  width: 20%;
  padding-block: 10px;
  color: white;
  background-color: var(--color-primary);
  font-size: 14px;
  border-radius: 0 6px 6px 0;
  z-index: 10;
  cursor: pointer;
}

.hero .hero__title .call-to-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 12px;
}

.hero .hero__title .call-to-actions .action1 {
  padding: 9px 15px;
  color: white;
  background-color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  border-radius: 6px;
  margin-right: auto;
  cursor: pointer;

}

.hero .hero__title .call-to-actions .action2 {
  padding: 9px 15px;
  color:  #08B294;
  border-radius: 6px;
  border: 1.5px solid #08B294;
  margin-right: auto;
  cursor: pointer;
}

.hero .hero__title .call-to-actions div:hover {
  transform: translate(-2px, -1px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.hero .hero__image {
  display: grid;
  place-items: center;
  margin-top: 50px;
  height: 40%;
  filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.05));
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
  main {  
    background: linear-gradient(
        180deg,
        rgb(83, 126, 213) 0%,
        rgba(83, 127, 213, 0.2) 35%,

        var(--color-bg) 95%
      );
  }
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
    max-width: 550px;
  }
  .hero .hero__title h1 {
    line-height: 1.4;
  }

  .hero .hero__title h1 span {
    font-size: clamp(3.5rem, 1vw, 4rem);
  }

  .hero .hero__title .description {
    font-size: 16px;
  }

  .hero .hero__title .search input {
    font-size: 16px;
  }

  .hero .hero__title .search button{
    font-size: 16px;
  }

  .hero .hero__title .call-to-actions {
    font-size: 14px;
  }

  .hero .hero__image {
    margin-top: 0;
    place-items: end;
  }

  .hero .hero__image img {
    max-width: 90%;
    height: auto;
  }

}
</style>
