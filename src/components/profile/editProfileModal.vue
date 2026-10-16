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
          <InputDefault id="profile-phone" :modelValue="form.phone" @update:modelValue="handlePhoneInput" type="number" inputmode="numeric" placeholder="Ingresa tu teléfono" icon="phone" :styles="inputStyle" />
        </div>

        <div class="field">
          <label for="profile-country">País</label>
          <select id="profile-country" v-model="form.country" class="location-select" :disabled="countriesLoading || !countries.length" @change="handleCountryChange">
            <option value="" disabled>{{ countriesLoading ? 'Cargando países...' : 'Selecciona un país' }}</option>
            <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
          </select>
        </div>

        <div class="field">
          <label for="profile-city">Ciudad</label>
          <select id="profile-city" v-model="form.city" class="location-select" :disabled="!form.country || citiesLoading || !cities.length" @change="locationError = ''">
            <option value="" disabled>{{ citiesLoading ? 'Cargando ciudades...' : 'Selecciona una ciudad' }}</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>

        <div v-if="locationError" class="location-error" role="alert">
          <span>{{ locationError }}</span>
          <button type="button" @click="retryLocationLoad">Reintentar</button>
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
import { computed, onMounted, reactive, ref } from "vue";
import InputDefault from "@/shared/components/input.vue";
import { useUserStore } from "@/stores/userStore";
import LocationService from "@/api/location.service";

const emit = defineEmits(["close", "saved"]);
const userStore = useUserStore();
const saving = ref(false);
const errorMessage = ref("");
const inputStyle = "white";
const countries = ref<string[]>([]);
const cities = ref<string[]>([]);
const countriesLoading = ref(false);
const citiesLoading = ref(false);
const locationError = ref("");

const form = reactive({
  name: userStore.currentUser?.name || "",
  email: userStore.currentUser?.email || "",
  phone: (userStore.currentUser?.phone || "").replace(/\D/g, ""),
  city: userStore.currentUser?.location?.city || "",
  country: userStore.currentUser?.location?.country || "",
});

const originalLocation = {
  city: form.city,
  country: form.country,
};
const locationChanged = computed(
  () => form.city !== originalLocation.city || form.country !== originalLocation.country,
);

function handlePhoneInput(value: string) {
  form.phone = value.replace(/\D/g, "");
}

async function loadCities(country: string, preferredCity = "") {
  if (!country) {
    cities.value = [];
    form.city = "";
    return;
  }

  citiesLoading.value = true;
  locationError.value = "";
  try {
    cities.value = await LocationService.getCities(country);
    const matchingCity = cities.value.find(
      (city) => city.toLocaleLowerCase() === preferredCity.trim().toLocaleLowerCase(),
    );
    form.city = matchingCity || "";
    if (!cities.value.length) {
      locationError.value = "No encontramos ciudades disponibles para este país.";
    } else if (preferredCity && !matchingCity) {
      locationError.value = "Selecciona una ciudad válida para el país elegido.";
    }
  } catch (error: unknown) {
    cities.value = [];
    locationError.value = error instanceof Error
      ? error.message
      : "No fue posible cargar las ciudades.";
  } finally {
    citiesLoading.value = false;
  }
}

async function loadCountries() {
  countriesLoading.value = true;
  locationError.value = "";
  try {
    countries.value = await LocationService.getCountries();
    const matchingCountry = countries.value.find(
      (country) => country.toLocaleLowerCase() === form.country.trim().toLocaleLowerCase(),
    );
    if (matchingCountry) {
      form.country = matchingCountry;
      await loadCities(matchingCountry, form.city);
    } else if (form.country) {
      form.country = "";
      form.city = "";
      locationError.value = "Selecciona un país válido para actualizar la ubicación.";
    }
  } catch (error: unknown) {
    locationError.value = error instanceof Error
      ? error.message
      : "No fue posible cargar los países.";
  } finally {
    countriesLoading.value = false;
  }
}

async function handleCountryChange() {
  form.city = "";
  cities.value = [];
  locationError.value = "";
  if (form.country) await loadCities(form.country);
}

async function retryLocationLoad() {
  if (countries.value.length && form.country) {
    await loadCities(form.country, form.city);
    return;
  }
  await loadCountries();
}

onMounted(loadCountries);

const handleSubmit = async () => {
  errorMessage.value = "";

  if (!form.name.trim() || !form.email.trim()) {
    errorMessage.value = "El nombre y el correo son obligatorios.";
    return;
  }
  if (form.phone && !/^\d+$/.test(form.phone)) {
    errorMessage.value = "El teléfono solo puede contener números.";
    return;
  }
  if (locationChanged.value) {
    if (!form.country || !form.city) {
      errorMessage.value = "Selecciona un país y una ciudad válidos.";
      return;
    }
    if (!countries.value.includes(form.country) || !cities.value.includes(form.city)) {
      errorMessage.value = "La ubicación seleccionada no es válida. Revisa el país y la ciudad.";
      return;
    }
  }

  saving.value = true;
  try {
    await userStore.updateCurrentUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      ...(locationChanged.value
        ? { location: { city: form.city.trim(), country: form.country.trim() } }
        : {}),
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
.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; overflow-y: auto; padding: 16px; background: rgba(0, 0, 0, .5); animation: fade-overlay .25s ease; }
.modal-content { position: relative; box-sizing: border-box; width: min(100%, 500px); max-height: calc(100vh - 32px); overflow-y: auto; overscroll-behavior: contain; padding: 2rem; border-radius: 12px; background: linear-gradient(145deg, #fff 0%, #f5f7fc 38%); animation: scale-modal .3s ease; }
@supports (height: 100dvh) { .modal-content { max-height: calc(100dvh - 32px); } }
.close-button { position: absolute; top: 14px; right: 14px; display: grid; place-items: center; padding: 4px; border: 0; background: transparent; color: #777; cursor: pointer; }
h2 { margin: 0; text-align: center; font-size: 24px; }
h2 span { color: var(--color-primary); }
.modal-content > p { margin: 8px 0 28px; text-align: center; font-size: 14px; color: #666; }
form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.location-select { width: 100%; min-height: 46px; padding: 12px; border: 0; border-radius: 8px; background: #fff; color: #333; font: inherit; font-size: 14px; }
.location-select:disabled { cursor: wait; opacity: .65; }
.location-error { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #b42318; font-size: 12px; }
.location-error button { flex: 0 0 auto; padding: 4px 8px; border: 1px solid currentColor; border-radius: 5px; background: transparent; color: inherit; cursor: pointer; }
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
