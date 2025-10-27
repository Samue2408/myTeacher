// src/stores/tutors.ts
import { defineStore } from "pinia";
import type { Tutor } from "@/types/tutor";

export const useTutorsStore = defineStore("tutors", {
  state: () => ({
    tutors: [] as Tutor[],
    loading: false as boolean,
    error: null as string | null,
  }),

  actions: {
    // Método para simular la carga de datos desde un backend
    async fetchTutors() {
      this.loading = true;
      this.error = null;

      try {
        // Simulando retraso como si fuera un fetch real
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // const res = await axios.get('/api/tutors')
        // this.tutors = res.data

        // 🔥 MOCK DATA (luego aquí va tu fetch con axios o fetch API)
        this.tutors = [
          {
            id: 1,
            name: "Laura Gómez",
            description: "Educación Superior",
            subject: "Matemáticas",
            price: 35000,
            img: "https://randomuser.me/api/portraits/women/44.jpg",
            phone: "+57 310 458 9276",
            email: "laura.gomez@teacher.com",
          },
          {
            id: 2,
            name: "Carlos Ramírez",
            description: "Secundaria",
            subject: "Física",
            price: 40000,
            img: "https://randomuser.me/api/portraits/men/32.jpg",
            phone: "+57 301 722 6435",
            email: "carlos.ramirez@teacher.com",
          },
          {
            id: 3,
            name: "Ana Torres",
            description: "Primaria",
            subject: "Lengua y Literatura",
            price: 30000,
            img: "https://randomuser.me/api/portraits/women/68.jpg",
            phone: "+57 315 839 2471",
            email: "ana.torres@teacher.com",
          },
          {
            id: 4,
            name: "Julián Pérez",
            description: "Primaria",
            subject: "Informática",
            price: 45000,
            img: "https://randomuser.me/api/portraits/men/12.jpg",
            phone: "+57 316 204 5539",
            email: "julian.perez@teacher.com",
          },
          {
            id: 5,
            name: "Sofía Hernández",
            description: "Educación Superior",
            subject: "Inglés",
            price: 38000,
            img: "https://randomuser.me/api/portraits/women/26.jpg",
            phone: "+57 320 994 3178",
            email: "sofia.hernandez@teacher.com",
          },
        ];
      } catch (err) {
        this.error = "No se pudieron cargar los tutores.";
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    // Ejemplo: obtener tutor por id
    getTutorById: (state) => {
      return (id: number) => state.tutors.find((t) => t.id === id);
    },
  },
});
