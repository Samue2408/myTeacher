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
    </div>
    <div class="hero__image">
      <img src="../assets/hero-image.png" alt="" />
    </div>
  </main>
</template>
<script></script>
<style>
@import "../_global.css";


.hero {
  width: 100%;
  height: calc(100vh - 8vh);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 80px;
}

.hero .hero__title,
.hero__image {
  width: 50%;
  height: 100%;
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
}
.hero .hero__title h1 span {
    font-size: clamp(3.5rem, 1vw, 4rem);
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
  animation: fadeIn 0.5s ease;
}

.hero .hero__image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero .hero__image img {
  max-width: 80%;
  height: auto;
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
</style>
