<template>
  <main class="login">
    <figure class="login-image">
      <!-- Imagen dinámica -->
      <img :src="slides[currentIndex].img" :alt="slides[currentIndex].text" />

      <!-- Indicadores -->
      <div class="login-image--indicator">
        <span>{{ slides[currentIndex].text }}</span>
        <div class="steps">
          <div
            v-for="(slide, i) in slides"
            :key="i"
            class="step"
            :class="{ active: i === currentIndex }"
          ></div>
        </div>
      </div>
    </figure>

    <aside class="login-forms">
      <form action="" class="form">
        <header class="form-header">
          <h1 class="form--title">Iniciar sesión</h1>
          <span class="form--description"
            >Ingresa tus credenciales para poder acceder</span
          >
        </header>

        <!-- Input email -->
        <div class="user-name">
          <inputDefault
            v-model="email"
            type="email"
            placeholder="Ingresa tu correo"
            icon="email"
          />
        </div>

        <!-- Input password -->
        <div class="password">
          <inputDefault
            v-model="password"
            :type="passwordType"
            placeholder="Ingresa tu contraseña"
            icon="lock"
          />

          <footer class="options">
            <div class="view-password">
              <input type="checkbox" v-model="showPassword" />
              <span>Ver contraseña</span>
            </div>
            <div class="redirect-signup">
              <span>¿No tienes una cuenta?</span>
              <a href="/auth/signup">Regístrate</a>
            </div>
          </footer>
        </div>

        <!-- Submit -->
        <a class="form-submit" type="submit" href="/">
          <span>Iniciar sesión</span>
        </a>
      </form>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import inputDefault from "../../../shared/components/input.vue";

// Controllers
const email = ref("");
const password = ref("");

const passwordType = ref<"text" | "password">("password");
const showPassword = ref(false);

watch(showPassword, (value) => {
  passwordType.value = value ? "text" : "password";
});

// Slides
const slides = ref([
  {
    img: "/public/img/auth/meet-virtual.jpg",
    text: "¡Cumple tus sueños de estudiar!",
  },
  {
    img: "/public/img/auth/videolecture.png",
    text: "Clases virtuales de alta calidad",
  },
  {
    img: "/public/img/auth/virtual-class.jpg",
    text: "Aprende a tu propio ritmo",
  },
]);

const currentIndex = ref(0);
let interval: number | undefined;

onMounted(() => {
  interval = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.value.length;
  }, 4000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: center;
}

.login .login-image {
  width: 70%;
  height: 100%;
  object-fit: cover;
  position: relative;
  overflow: hidden;
}

.login .login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.8s ease-in-out;
}

.login .login-image::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  background-blend-mode: multiply;
  z-index: 0;
}

.login .login-image .login-image--indicator {
  position: absolute;
  bottom: 30px;
  left: 40%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login .login-image .login-image--indicator span {
  color: var(--color-white);
}

.login .login-image .login-image--indicator .steps {
  width: 50%;
  margin: 0 auto;
  height: 10px;
  padding-block: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.login .login-image .login-image--indicator .steps .step {
  width: calc(100% / 3);
  height: 4px;
  border-radius: 10px;
  background-color: var(--color-white);
  transition: width 0.5s ease;
}

.login .login-image .login-image--indicator .steps .step.active {
  width: 60px;
}

.login .login-forms {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  width: 40%;
  height: 100%;
}

.login .login-forms form {
  width: 100%;
  height: 80%;
  border-radius: 6px;
  background-color: var(--color-white);
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 40px;
  padding-left: 40px;
}

.login .login-forms form .form--title {
  color: var(--color-primary);
  font-weight: 700;
  font-size: var(--font-30);
}

.login .login-forms form .form--description {
  font-size: var(--font-16);
  color: var(--color-gray);
}

.login .login-forms form .user-name,
.password {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login .login-forms form .password .options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login .login-forms form .password .options .view-password {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-12);
  color: var(--color-gray);
}

.login .login-forms form .password .options .redirect-signup {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-12);
  color: var(--color-gray);
}
.login .login-forms form .password .options .redirect-signup a{
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.login .login-forms form .form-submit {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 10px;
  padding-block: 12px;
  box-sizing: border-box;
  width: 80%;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.5s ease;
}

.login .login-forms form .form-submit:hover {
  background-color: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .login {
    flex-direction: column-reverse;
  }

  .login .login-image {
    display: none;
  }

  .login .login-forms {
    width: 100%;
    height: 100%;
  }
  
  .login .login-forms form {
    width: 90%;
    height: auto;
    padding: 20px;
    padding-left: 20px;
    gap: 30px;
  }

  .login .login-forms form .user-name,
  .password,
  .form-submit {
    width: 100%;
  }
}
</style>
