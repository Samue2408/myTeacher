<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import inputDefault from "@/shared/components/input.vue";
import type { SignUpPayload, AuthResponse, CustomEmailPayload } from "@/types/auth";
import { useRouter } from "vue-router";
import authService from "@/api/auth.service";
import emailService from "@/api/email.service";
import { generateTemporaryPassword } from "@/utils/password";
import { useToast } from "@/composables/useToast";
import ComboBox from "@/shared/components/comboBox.vue";

const router = useRouter();

const form = ref<Omit<SignUpPayload, "password">>({
  name: "",
  email: "",
  role: "",
  phone: "",
});

const loading = ref(false);
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);
const accountCreated = ref(false);
const pendingWelcomeEmail = ref<CustomEmailPayload | null>(null);

const { show, message, type, triggerToast } = useToast();

const roles = [
  { label: "Tutor", value: "Tutor" },
  { label: "Estudiante", value: "Estudiante" },
];

function createWelcomeEmail(email: string, temporaryPassword: string): CustomEmailPayload {
  return {
    to: email,
    subject: "Tu contraseña temporal de MyTeacher",
    previewText: "Tu cuenta ya está lista. Usa la contraseña temporal para iniciar sesión.",
    title: "¡Bienvenido a MyTeacher!",
    message: `Tu cuenta fue creada con éxito. Tu contraseña temporal es: ${temporaryPassword}. Inicia sesión con ella y actualízala desde tu perfil. Por seguridad, no compartas este correo.`,
    buttonText: "Iniciar sesión",
    buttonLink: `${window.location.origin}/user/login`,
  };
}

async function sendWelcomeEmail(): Promise<boolean> {
  if (!pendingWelcomeEmail.value) return false;

  try {
    await emailService.sendCustom(pendingWelcomeEmail.value);
    pendingWelcomeEmail.value = null;
    errorMsg.value = null;
    successMsg.value = "Cuenta creada. Revisa tu correo para obtener tu contraseña temporal.";
    triggerToast("Cuenta creada; revisa tu correo", "success");
    setTimeout(() => router.push("/user/login"), 2500);
    return true;
  } catch {
    errorMsg.value = "Tu cuenta sí fue creada, pero no pudimos enviar el correo. Reintenta el envío.";
    return false;
  }
}

async function handleRegister() {
  errorMsg.value = null;
  successMsg.value = null;

  if (!form.value.email || !form.value.name) {
    errorMsg.value = "Por favor, completa todos los campos requeridos";
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

    const temporaryPassword = generateTemporaryPassword();
    console.log("Contraseña temporal generada:", temporaryPassword);
    const response: AuthResponse = await authService.signUp({
      ...form.value,
      password: temporaryPassword,
    });

    if (response.user) {
      accountCreated.value = true;
      pendingWelcomeEmail.value = createWelcomeEmail(form.value.email, temporaryPassword);
      await sendWelcomeEmail();
    } else {
      errorMsg.value = "No se pudo confirmar la creación de la cuenta.";
    }
  } catch (err: unknown) {
    console.error("Error en registro:", err);
    errorMsg.value = axios.isAxiosError<{ message?: string }>(err)
      ? err.response?.data?.message || "Error al registrarse"
      : err instanceof Error
        ? err.message
        : "Error al registrarse";
  } finally {
    loading.value = false;
  }
}

async function retryWelcomeEmail() {
  errorMsg.value = null;
  loading.value = true;
  try {
    await sendWelcomeEmail();
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
            Ingresa tus datos para crear tu cuenta. Te enviaremos una contraseña temporal a tu correo.
          </span>
        </header>

        <div class="form-row">
          <inputDefault
            v-model="form.name"
            placeholder="Ingresa tu nombre completo"
            icon="person"
          />
          <div class="combo-box">
            <comboBox
              v-model="form.role"
              :items="roles"
              placeholder="Selecciona tu rol"
            />
          </div>
          
        </div>

        <div class="form-row">
          <inputDefault
            v-model="form.email"
            placeholder="Ingresa tu correo"
            type="email"
            icon="email"
          />
        </div>

        <div class="form-row">
          <inputDefault
            v-model="form.phone"
            placeholder="Número de teléfono"
            type="tel"
            icon="phone"
          />
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

        <button
          v-if="pendingWelcomeEmail && errorMsg"
          type="button"
          class="retry-email-btn"
          :disabled="loading"
          @click="retryWelcomeEmail"
        >
          {{ loading ? "Enviando..." : "Reintentar envío del correo" }}
        </button>

        <div class="form-actions">
          <button type="submit" class="confirm-btn" :disabled="loading || accountCreated || !!pendingWelcomeEmail">
            <span v-if="!loading">{{ accountCreated ? "Cuenta creada" : "Crear cuenta" }}</span>
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

.retry-email-btn {
  padding: 10px;
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  background: white;
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 600;
}

.retry-email-btn:disabled {
  cursor: wait;
  opacity: 0.7;
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
