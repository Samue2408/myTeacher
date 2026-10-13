<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
      <button class="close-button" type="button" aria-label="Cerrar" @click="emit('close')">
        <span class="material-icons-outlined">close</span>
      </button>

      <h2 id="change-password-title">Cambiar <span>contraseña</span></h2>
      <p>Ingresa tu contraseña actual y elige una nueva.</p>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="current-password">Contraseña actual</label>
          <InputDefault id="current-password" v-model="form.password" type="password" placeholder="Ingresa tu contraseña actual" icon="lock" :styles="inputStyle" />
        </div>

        <div class="field">
          <label for="new-password">Nueva contraseña</label>
          <InputDefault id="new-password" v-model="form.newPassword" type="password" placeholder="Ingresa una nueva contraseña" icon="lock" :styles="inputStyle" />
        </div>

        <div class="field">
          <label for="confirm-password">Confirma la nueva contraseña</label>
          <InputDefault id="confirm-password" v-model="form.confirmPassword" type="password" placeholder="Confirma la nueva contraseña" icon="lock" :styles="inputStyle" />
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <div class="modal-actions">
          <button class="cancel-btn" type="button" @click="emit('close')">Cerrar</button>
          <button class="save-btn" type="submit" :disabled="saving">
            {{ saving ? "Actualizando..." : "Actualizar contraseña" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import InputDefault from "@/shared/components/input.vue";
import authService from "@/api/auth.service";
import { useUserStore } from "@/stores/userStore";
import { validatePassword } from "@/utils/password";

const emit = defineEmits(["close"]);
const userStore = useUserStore();
const saving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const inputStyle = "white";

const form = reactive({
  password: "",
  newPassword: "",
  confirmPassword: "",
});

async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!form.password || !form.newPassword || !form.confirmPassword) {
    errorMessage.value = "Completa todos los campos.";
    return;
  }
  if (form.newPassword !== form.confirmPassword) {
    errorMessage.value = "Las contraseñas nuevas no coinciden.";
    return;
  }
  if (form.password === form.newPassword) {
    errorMessage.value = "La nueva contraseña debe ser diferente a la actual.";
    return;
  }

  try {
    validatePassword(form.newPassword);
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : "La nueva contraseña no es válida.";
    return;
  }

  const email = userStore.currentUser?.email;
  if (!email) {
    errorMessage.value = "No se encontró el correo de la cuenta. Cierra sesión e inténtalo de nuevo.";
    return;
  }

  saving.value = true;
  try {
    await authService.changePassword({
      email,
      password: form.password,
      newPassword: form.newPassword,
    });
    form.password = "";
    form.newPassword = "";
    form.confirmPassword = "";
    successMessage.value = "Tu contraseña se actualizó correctamente.";
  } catch (error: unknown) {
    errorMessage.value = axios.isAxiosError<{ message?: string; error?: string }>(error)
      ? error.response?.data?.message || error.response?.data?.error || "No fue posible actualizar la contraseña."
      : "No fue posible actualizar la contraseña.";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0, 0, 0, .5); }
.modal-content { position: relative; width: min(100%, 500px); padding: 2rem; border-radius: 12px; background: linear-gradient(145deg, #fff 0%, #f5f7fc 38%); }
.close-button { position: absolute; top: 14px; right: 14px; display: grid; place-items: center; padding: 4px; border: 0; background: transparent; color: #777; cursor: pointer; }
h2 { margin: 0; text-align: center; font-size: 24px; }
h2 span { color: var(--color-primary); }
.modal-content > p { margin: 8px 0 28px; text-align: center; font-size: 14px; color: #666; }
form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 13px; font-weight: 600; color: var(--color-muted); }
.error-message,.success-message { margin: 0; font-size: 13px; text-align: center; }
.error-message { color: #d33; }
.success-message { color: #218838; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
.modal-actions button { padding: 10px 16px; border: 0; border-radius: 6px; font-size: 14px; cursor: pointer; }
.cancel-btn { background: var(--color-border); color: #333; }
.save-btn { background: var(--color-primary); color: #fff; font-weight: 600; }
.save-btn:disabled { cursor: wait; opacity: .7; }
@media (max-width: 480px) { .modal-content { padding: 1.5rem; } .modal-actions { flex-direction: column-reverse; } .modal-actions button { width: 100%; } }
</style>
