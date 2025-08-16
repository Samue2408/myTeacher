<template>
  <nav class="nav">
    <h1 class="nav__title">
      <span>MT</span>
      myTeacher
    </h1>

    <aside class="nav__sidebar">
      <ul>
        <li>
          <span>Servicios</span>
          <i class="material-icons">expand_more</i>
        </li>
        <li>
          <span>Explorar</span>
          <i class="material-icons">expand_more</i>
        </li>
      </ul>
    </aside>

    <div class="nav__buttons"></div>

    <div class="nav__button-burguer">
      <button :class="{ active: isOpen }" @click="isOpen = !isOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(false);
</script>

<style>
.nav {
  width: 100%;
  height: 8vh;
  margin: 0;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.nav .nav__title {
  color: var(--color-bg);
  font-size: clamp(18px, 2vw, 20px);
}

.nav .nav__title span {
  background-color: white;
  color: var(--color-primary);
  padding: 4px;
  box-sizing: border-box;
  border-radius: 10px;
  font-weight: 700;
}

.nav .nav__buttons {
  display: none;
}

.nav .nav__sidebar{
    position: absolute;
    left: 0;
    top: 12vh;
    border: 1px solid red;
}

.nav .nav__button-burguer {
  height: 100%;
  width: 60px;
}

.nav .nav__button-burguer button {
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transform: scale(0.4);
  cursor: pointer;
}

.nav .nav__button-burguer button span {
  display: block;
  width: 100%;
  height: calc(100% / 3);
  background-color: var(--color-bg);
  border-radius: 10px;
  transition: all 0.4s ease;
}

.nav .nav__button-burguer button span:nth-of-type(2) {
  width: 80%;
  align-self: flex-end;
}

.nav .nav__button-burguer button.active span:nth-of-type(1) {
  transform: translateY(13px) rotate(45deg);
}

.nav .nav__button-burguer button.active span:nth-of-type(2) {
  opacity: 0;
  transform: translateX(-100%);
}

.nav .nav__button-burguer button.active span:nth-of-type(3) {
  transform: translateY(-28px) rotate(-45deg);
}

@media (min-width: 1280px) {
  .nav .nav__button-burguer {
    display: none;
  }

  .nav .nav__sidebar {
    display: flex;
    height: 100%;
    width: 60%;
  }

  .nav .nav__sidebar ul {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav .nav__sidebar ul li {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: clamp(12px, 1.5vw, 18px);
    gap: 4px;
    color: var(--color-bg);
  }

  .nav .nav__sidebar ul li span {
    color: var(--color-bg);
    font-weight: 500;
    font-size: 16px;
  }

  .nav .nav__sidebar ul li i {
    font-size: clamp(12px, 1.5vw, 18px);
  }

  .nav .nav__buttons {
    display: flex;
    height: 100%;
    width: 20%;
  }
}
</style>
