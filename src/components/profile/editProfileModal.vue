<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <button class="close-button" type="button" aria-label="Cerrar" @click="emit('close')">
        <span class="material-icons-outlined">close</span>
      </button>

      <h2 id="edit-profile-title">Editar <span>perfil</span></h2>
      <p>Actualiza la información que verán los demás usuarios.</p>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="profile-name">Nombre completo</label>
          <InputDefault id="profile-name" v-model="form.name" placeholder="Ingresa tu nombre" icon="person" :styles="inputStyle" />
        </div>

        <div class="field">
          <label for="profile-email">Correo electrónico</label>
          <InputDefault id="profile-email" v-model="form.email" type="email" placeholder="Ingresa tu correo" icon="email" :styles="inputStyle" />
        </div>

        <div class="field">
          <label for="profile-phone">Teléfono</label>
          <InputDefault id="profile-phone" v-model="form.phone" type="tel" placeholder="Ingresa tu teléfono" icon="phone" :styles="inputStyle" />
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="modal-actions">
          <button class="cancel-btn" type="button" @click="emit('close')">Cancelar</button>
          <button class="save-btn" type="submit" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import InputDefault from "@/shared/components/input.vue";
import { useUserStore } from "@/stores/userStore";

const emit = defineEmits(["close", "saved"]);
const userStore = useUserStore();
const saving = ref(false);
const errorMessage = ref("");
const inputStyle = "white";

const form = reactive({
  name: userStore.currentUser?.name || "",
  email: userStore.currentUser?.email || "",
  phone: userStore.currentUser?.phone || "",
});

const handleSubmit = async () => {
  errorMessage.value = "";

  if (!form.name.trim() || !form.email.trim()) {
    errorMessage.value = "El nombre y el correo son obligatorios.";
    return;
  }

  saving.value = true;
  try {
    await userStore.updateCurrentUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    emit("saved");
    emit("close");
  } catch {
    errorMessage.value = "No fue posible guardar los cambios. Inténtalo de nuevo.";
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0, 0, 0, .5); animation: fade-overlay .25s ease; }
.modal-content { position: relative; width: min(100%, 500px); padding: 2rem; border-radius: 12px; background: linear-gradient(145deg, #fff 0%, #f5f7fc 38%); animation: scale-modal .3s ease; }
.close-button { position: absolute; top: 14px; right: 14px; display: grid; place-items: center; padding: 4px; border: 0; background: transparent; color: #777; cursor: pointer; }
h2 { margin: 0; text-align: center; font-size: 24px; }
h2 span { color: var(--color-primary); }
.modal-content > p { margin: 8px 0 28px; text-align: center; font-size: 14px; color: #666; }
form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 13px; font-weight: 600; color: var(--color-muted); }
.error-message { margin: 0; color: #d33; font-size: 13px; text-align: center; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
.modal-actions button { padding: 10px 16px; border: 0; border-radius: 6px; font-size: 14px; cursor: pointer; }
.cancel-btn { background: var(--color-border); color: #333; }
.save-btn { background: var(--color-primary); color: #fff; font-weight: 600; }
.save-btn:disabled { cursor: wait; opacity: .7; }
@keyframes fade-overlay { from { opacity: 0; } to { opacity: 1; } }
@keyframes scale-modal { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
@media (max-width: 480px) { .modal-content { padding: 1.5rem; } .modal-actions { flex-direction: column-reverse; } .modal-actions button { width: 100%; } }
</style>
