<template>
  <main class="login">
    <aside class="login-forms">
      <form @submit.prevent="handleLogin" class="form">
        <header class="form-header">
          <h1 class="form--title">Iniciar sesión</h1>
          <span class="form--description">
            Ingresa tus credenciales para poder acceder
          </span>
        </header>

        <div class="user-name">
          <inputDefault
            v-model="email"
            type="email"
            placeholder="Ingresa tu correo"
            icon="email"
          />
        </div>

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
              <router-link to="/user/signup">Registrate</router-link>
            </div>
          </footer>
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button :disabled="loading" class="form-submit" type="submit">
          <span v-if="!loading">Iniciar sesión</span>
          <span v-else class="loader"></span>
        </button>
      </form>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import inputDefault from "../../../shared/components/input.vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const auth = useAuthStore();
const userStore = useUserStore()
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref<string | null>(null);

const passwordType = ref<"text" | "password">("password");
const showPassword = ref(false);

// 👁️ Cambia tipo de input según checkbox
watch(showPassword, (value) => {
  passwordType.value = value ? "text" : "password";
});

// 📸 Slides (sin cambios, solo limpieza)
const slides = ref([
  { img: "/public/img/auth/meet-virtual.jpg", text: "¡Cumple tus sueños de estudiar!" },
  { img: "/public/img/auth/videolecture.png", text: "Clases virtuales de alta calidad" },
  { img: "/public/img/auth/virtual-class.jpg", text: "Aprende a tu propio ritmo" },
]);

const currentIndex = ref(0);
let interval: number | undefined;

async function handleLogin() {
  errorMsg.value = null;

  if (!email.value || !password.value) {
    errorMsg.value = "Por favor ingresa tu correo y contraseña";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMsg.value = "El correo ingresado no es válido";
    return;
  }

  try {
    loading.value = true;

    const user = {
      email: email.value,
      password: password.value
    }

    await auth.login(user);

    if (auth.token) {
      if(userStore.currentUser.role == 'Estudiante'){
        router.push({ path: "/search" });
      } else {
        router.push({ path: "/profile/1" });
      }
    } else {
      errorMsg.value = "Credenciales incorrectas";
    }
  } catch (err: any) {
    console.error("Error en login:", err);
    errorMsg.value = err.response?.data?.message || "No se pudo iniciar sesión. Intenta de nuevo más tarde.";
  } finally {
    loading.value = false;
  }
}

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

/* .login .login-image {
  width: 60%;
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
} */

.login .login-forms {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  width: 50%;
  height: 100%;
}

.login .login-forms form {
  width: 80%;
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
  margin-top: 10px;
}

.login .login-forms form .password .options .view-password {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-gray);
}

.login .login-forms form .password .options .redirect-signup {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-gray);
}
.login .login-forms form .password .options .redirect-signup a {
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
