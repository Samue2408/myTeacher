// src/stores/tutors.ts
import { defineStore } from 'pinia'
import type { Tutor } from '@/types/tutor'

export const useTutorsStore = defineStore('tutors', {
  state: () => ({
    tutors: [] as Tutor[],
    loading: false as boolean,
    error: null as string | null
  }),

  actions: {
    // Método para simular la carga de datos desde un backend
    async fetchTutors() {
      this.loading = true
      this.error = null

      try {
        // Simulando retraso como si fuera un fetch real
        await new Promise(resolve => setTimeout(resolve, 3000))

        // const res = await axios.get('/api/tutors')
        // this.tutors = res.data

        // 🔥 MOCK DATA (luego aquí va tu fetch con axios o fetch API)
        this.tutors = [
          {
            id: 1,
            name: 'Juan Pérez',
            subject: 'Matemáticas',
            price: 25000,
            description: 'Especialista en álgebra y cálculo diferencial.',
            img: '/images/tutors/juan.jpg'
          },
          {
            id: 2,
            name: 'Ana Gómez',
            subject: 'Inglés',
            price: 30000,
            description: 'Profesora con 5 años de experiencia enseñando inglés conversacional.',
            img: '/images/tutors/ana.jpg'
          },
          {
            id: 3,
            name: 'Carlos Ruiz',
            subject: 'Física',
            price: 28000,
            description: 'Apasionado por la física cuántica y la enseñanza.',
            img: '/images/tutors/carlos.jpg'
          }
        ]

      } catch (err) {
        this.error = 'No se pudieron cargar los tutores.'
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    // Ejemplo: obtener tutor por id
    getTutorById: (state) => {
      return (id: number) => state.tutors.find(t => t.id === id)
    }
  }
})
