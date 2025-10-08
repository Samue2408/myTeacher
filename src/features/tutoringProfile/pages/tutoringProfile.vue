<template>
  <div>
    <h2>Lista de Tutores</h2>

    <div v-if="loading">Cargando tutores...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else class="grid">
      <div v-for="t in tutors" :key="t.id" class="card">
        <img :src="t.img" :alt="t.name" class="card-img" />
        <h3>{{ t.name }}</h3>
        <p>{{ t.subject }}</p>
        <p>Precio: {{ formatPrice(t.price) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTutorsStore } from '@/stores/tutorsStore'

const tutorStore = useTutorsStore()

// ✅ Esto mantiene la reactividad
const { tutors, loading, error } = storeToRefs(tutorStore)

onMounted(() => {
  if (!tutors.value.length) {
    tutorStore.fetchTutors()
  }
})

function formatPrice(price: number) {
  return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
}
</script>

