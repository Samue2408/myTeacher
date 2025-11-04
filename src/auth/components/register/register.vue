<script setup lang="ts">
import { ref, watch } from "vue";
import inputDefault from "@/shared/components/input.vue";
import ComboBox from "@/shared/components/comboBox.vue";
import type { SignUpPayload, AuthResponse } from "@/types/auth";
import { useRouter } from "vue-router";
import authService from "@/api/auth.service";
import { useToast } from "@/composables/useToast";

const router = useRouter();

const form = ref<SignUpPayload>({
  name: "",
  email: "",
  password: "",
  role: "",
  phone: "",
  location: null,
});

const confirmPassword = ref("");
const loading = ref(false);
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);

const { show, message, type, triggerToast } = useToast();

const passwordStrength = ref<"Débil" | "Media" | "Fuerte" | "Muy débil">(
  "Muy débil"
);
const strengthColor = ref("#d33");

const roles = [
  { label: "Profesor", value: "teacher" },
  { label: "Estudiante", value: "student" },
];

async function validatePassword(password: string): Promise<void> {
  const cases = [
    { regex: /.{8,}/, msg: "Debe tener al menos 8 caracteres" },
    { regex: /[A-Z]/, msg: "Debe incluir al menos una letra mayúscula" },
    { regex: /[a-z]/, msg: "Debe incluir al menos una letra minúscula" },
    { regex: /[0-9]/, msg: "Debe incluir al menos un número" },
    {
      regex: /[!@#$%^&*(),.?\":{}|<>_\-]/,
      msg: "Debe incluir al menos un carácter especial",
    },
  ];

  const failed = cases.filter((c) => !c.regex.test(password));
  if (failed.length > 0) {
    const messages = failed.map((f) => f.msg).join(", ");
    throw new Error(`Contraseña inválida: ${messages}.`);
  }
}

watch(
  () => form.value.password,
  (password) => {
    if (!password) {
      passwordStrength.value = "Muy débil";
      strengthColor.value = "#d33";
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?\":{}|<>_\-]/.test(password)) score++;

    switch (score) {
      case 1:
      case 2:
        passwordStrength.value = "Débil";
        strengthColor.value = "#ff6b6b";
        break;
      case 3:
      case 4:
        passwordStrength.value = "Media";
        strengthColor.value = "#f7b500";
        break;
      case 5:
        passwordStrength.value = "Fuerte";
        strengthColor.value = "#28a745";
        break;
      default:
        passwordStrength.value = "Muy débil";
        strengthColor.value = "#d33";
    }
  }
);

async function handleRegister() {
  errorMsg.value = null;
  successMsg.value = null;

  if (form.value.password !== confirmPassword.value) {
    errorMsg.value = "Las contraseñas no coinciden";
    return;
  }

  if (!form.value.email || !form.value.name || !form.value.password) {
    errorMsg.value = "Por favor, completa todos los campos requeridos";
    return;
  }

  try {
    await validatePassword(form.value.password);
  } catch (err: any) {
    errorMsg.value = err.message;
    return;
  }

  loading.value = true;

  try {
    const res = await fetch("https://ipapi.co/json/");
    const loc = await res.json();
    form.value.location = {
      city: loc.city,
      country: loc.country_name,
    };

    const response: AuthResponse = await authService.signUp(form.value);

    if (response.user) {
      triggerToast("Inicio de sesión exitoso", "success");
      successMsg.value = "Cuenta creada exitosamente";
      setTimeout(() => router.push("/user/login"), 1500);
    }
  } catch (err: any) {
    console.error("Error en registro:", err);
    errorMsg.value = err.response?.data?.message || "Error al registrarse";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="register">
    <aside class="register-forms">
      <form class="form" @submit.prevent="handleRegister">
        <header class="form-header">
          <h1 class="form--title">Registrarse</h1>
          <span class="form--description">
            Ingrese sus datos a continuación para crear su cuenta y comenzar.
          </span>
        </header>

        <div class="form-row">
          <inputDefault
            v-model="form.name"
            placeholder="Ingresa tu nombre completo"
            icon="person"
          />
          <inputDefault
            v-model="form.email"
            placeholder="Ingresa tu correo"
            type="email"
            icon="email"
          />
        </div>

        <div class="form-row">
          <div class="combo-box">
            <label>Selecciona tu rol</label>
            <comboBox
              v-model="form.role"
              :items="roles"
              placeholder="Selecciona tu rol"
            />
          </div>
        </div>

        <div class="form-row">
          <inputDefault
            v-model="form.phone"
            placeholder="Número de teléfono"
            type="tel"
            icon="phone"
          />
        </div>

        <div class="form-row">
          <inputDefault
            v-model="form.password"
            placeholder="Ingresa tu contraseña"
            type="password"
            icon="lock"
          />
          <inputDefault
            v-model="confirmPassword"
            placeholder="Confirma tu contraseña"
            type="password"
            icon="lock"
          />
        </div>

        <div class="password-strength" v-if="form.password.length > 0">
          Fortaleza de contraseña:
          <strong :style="{ color: strengthColor }">{{
            passwordStrength
          }}</strong>
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

        <div class="form-actions">
          <button type="submit" class="confirm-btn" :disabled="loading">
            <span v-if="!loading">Crear cuenta</span>
            <span v-else class="loader"></span>
          </button>
        </div>

        <footer class="redirect-login">
          <span>¿Tienes una cuenta ya?</span>
          <router-link to="/user/login">Inicia sesión</router-link>
        </footer>

        <Toast v-model="show" :message="message" :type="type" />
      </form>
    </aside>
  </main>
</template>

<style scoped>
.error-msg {
  color: #d33;
  font-size: 14px;
  text-align: center;
}

.success-msg {
  color: #28a745;
  font-size: 14px;
  text-align: center;
}

.password-strength {
  font-size: 13px;
  text-align: center;
  margin-top: -10px;
  color: #555;
}

.register {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: center;
}

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
