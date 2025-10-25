<template>
    <div class="container-results">
        <div class="info">
            <p>Resultados (20)</p>
            <span>Precios indicados por hora de servicio</span>
        </div>
        <div class="results">
            <TeacherCard v-for="teacher in teachers" :teacher="teacher" :key="teacher" />
        </div>
    </div>
    
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
    name: 'resultSearch',
    props: {
    },
    data() {
      return{
        teachers: [
            {
                id: 1,
                name: "Laura Gómez",
                description: "Educación Superior",
                subject: "Matemáticas",
                price: 35000,
                img: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
                id: 2,
                name: "Carlos Ramírez",
                description: "Secundaria",
                subject: "Física",
                price: 40000,
                img: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
                id: 3,
                name: "Ana Torres",
                description: "Primaria",
                subject: "Lengua y Literatura",
                price: 30000,
                img: "https://randomuser.me/api/portraits/women/68.jpg"
            },
            {
                id: 4,
                name: "Julián Pérez",
                description: "Primaria",
                subject: "Informática",
                price: 45000,
                img: "https://randomuser.me/api/portraits/men/12.jpg"
            },
            {
                id: 5,
                name: "Sofía Hernández",
                description: "Educación superior",
                subject: "Inglés",
                price: 38000,
                img: "https://randomuser.me/api/portraits/women/26.jpg"
            },
             {
                id: 6,
                name: "Sofía Hernández",
                description: "Educación superior",
                subject: "Inglés",
                price: 38000,
                img: "https://randomuser.me/api/portraits/women/26.jpg"
            },
            {
                id: 5,
                name: "Sofía Hernández",
                description: "Educación superior",
                subject: "Inglés",
                price: 38000,
                img: "https://randomuser.me/api/portraits/women/26.jpg"
            },
        ]
      }
    },
    methods: {
        
    },
    components: {
      TeacherCard: defineAsyncComponent(() => import('../../shared/components/teacherCards.vue'))
    }
}

</script>

<style scoped>
    @import "../../_global.css";
    .container-results {
        background-color: white;
        border-radius: 12px;
        padding: 20px;
        animation: fade-in 0.4s ease-in forwards;
        animation-delay: 0.2s;
        opacity: 0;
    }

    .container-results .info {
        height: min-content;
    }

    .container-results .info p {
        font-weight: 600;
        line-height: .8;
    }
    .container-results .info span {
        font-weight: 400;
        font-size: 10px;
        font-style: italic;
        line-height: .8;
        color: var(--color-muted);
    }

    .results {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 10px;
        animation: fade-in 0.3s ease-in forwards;
        animation-delay: 0.4s;
        opacity: 0;
        max-height: 75vh;
        overflow-y: auto;
    }

    

    @keyframes fade-in {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
 
</style>
