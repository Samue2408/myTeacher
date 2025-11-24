<template>
  <div class="header">
    <h3>Mis disponibilidades</h3>
    <button @click="modalAddUpdate = true">Agregar</button>
  </div>
  <h5>Recurrentes</h5>
  <div v-if="availabilitiesStore.hasAvailabilitiesRecurrent" class="availabilities">
    <CardsAvailability 
     @edit="modalAddUpdate = true; availabilityUpdate = av" 
     v-for="av in availabilitiesStore.tutorAvailabilities.filter(av => av.isRecurring)" 
     :key="av._id" 
     :availability="av" 
    />
  </div>
  <p v-else class="empty">No hay disponibilidades aún.</p>

  <h5>Puntuales</h5>
  <div v-if="availabilitiesStore.hasAvailabilitiesNoRecurrent" class="availabilities">
    <CardsAvailability 
     @edit="modalAddUpdate = true; availabilityUpdate = av" 
     v-for="av in availabilitiesStore.tutorAvailabilities.filter(av => !av.isRecurring)" 
     :key="av._id" 
     :availability="av" 
    />
  </div>
  <p v-else class="empty">No hay disponibilidades aún.</p>
  <modalAvailabilities v-if="modalAddUpdate" @close="() => { modalAddUpdate = false; availabilityUpdate = null }"
        :availability-to-edit="availabilityUpdate" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from "pinia";
import { useUserStore } from '@/stores/userStore';
import { useAvailabilitiesStore } from '@/stores/availabilitiesStore';
import CardsAvailability from './cardsAvailability.vue';
import modalAvailabilities from './modalAvailabilities.vue';

const usersStore = useUserStore()
const availabilitiesStore = useAvailabilitiesStore()
const { tutorAvailabilities, isLoading } = storeToRefs(availabilitiesStore)
const modalAddUpdate = ref(false)
const availabilityUpdate = ref(null)

onMounted(async () => {
  await availabilitiesStore.fetchAvalabilitiesByTutor(usersStore.currentUser._id)
})

</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header button {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  background-color: #08B294;
  border-radius: 6px;
}

.header button .add {
  font-size: 18px;
}

h5 {
  color: var(--color-primary);
  margin-block: 30px 35px;
}

.availabilities {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.empty {
  color: #777;
  font-style: italic;
  margin-top: 10px;
}
</style>