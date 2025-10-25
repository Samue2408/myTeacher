<template>
  <main class="register">
    <aside class="register-forms">
      <form class="form">
        <header class="form-header">
          <h1 class="form--title">Registrarse</h1>
          <span class="form--description">
            Ingrese sus datos a continuación para crear su cuenta y comenzar.
          </span>
        </header>

        <div class="form-row">
          <inputDefault v-model="form.fullName" placeholder="Ingresa tu nombre completo" icon="person"/>
          <inputDefault
            v-model="form.email"
            placeholder="Ingresa tu correo"
            type="email"
            icon="email"
          />
        </div>

        <div class="form-row">
          <div class="combo-box">
            <label for="">Selecciona tu rol</label>
            <comboBox
              v-model="form.role"
              :items="roles"
              placeholder="Selecciona tu rol"
            />
          </div>
        </div>

        <div class="form-row">
          <inputDefault
            v-model="form.password"
            placeholder="Ingresa tu contraseña"
            type="password"
            icon="lock"
          />
          <inputDefault
            v-model="form.confirmPassword"
            placeholder="Confirma tu contraseña"
            type="password"
            icon="lock"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="confirm-btn">Confirmar</button>
        </div>

        <footer class="redirect-login">
          <span>Tienes una cuenta ya?</span>
          <router-link to="/user/login">Inicia sesión</router-link>
        </footer>
      </form>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import inputDefault from "../../../shared/components/input.vue";
import ComboBox from "@/shared/components/comboBox.vue";

const form = ref({
  fullName: "",
  email: "",
  birth: "",
  phone: "",
  nationality: "",
  role: "",
  password: "",
  confirmPassword: "",
});

const countries = ref([
  { label: "Brazil", value: "br", img: "/public/img/flags/br.svg" },
  { label: "Colombia", value: "co", img: "/public/img/flags/co.svg" },
  { label: "Mexico", value: "mx", img: "/public/img/flags/mx.svg" },
]);

const roles = ref([
  { label: "Profesor", value: "teacher" },
  { label: "Estudiante", value: "student" },
]);

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

onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.register {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: center;
}
/* 
.register-image {
  width: 60%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.register-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.register-image::after {
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

.register-image--indicator {
  position: absolute;
  bottom: 30px;
  left: 40%;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
} */

.register-forms {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 80%;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 40px;
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form--title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-primary);
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.form-row label {
  font-size: 13px;
  color: var(--color-gray);
  margin-bottom: 6px;
  display: block;
}

.form-row > * {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  background-color: #eee;
}

.confirm-btn {
  background-color: var(--color-primary);
  color: white;
}

.confirm-btn:hover {
  background-color: var(--color-primary-dark);
}

.redirect-login {
  text-align: center;
  font-size: 13px;
  color: var(--color-gray);
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 5px;
}

.redirect-login a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 768px) {
  .register {
    flex-direction: column-reverse;
  }

  .register-image {
    display: none;
  }

  .register-forms {
    width: 100%;
  }

  .form {
    width: 90%;
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
