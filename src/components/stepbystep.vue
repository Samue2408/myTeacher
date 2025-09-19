<template>
    <div class="section">
        <h2>Aprender nunca fue tan fácil, rápido y a tu medida</h2>
        <sub>En cada paso verás como poder interactuar con nosotros</sub>
        <NavTabs :items="items"/>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
    name: 'StepByStep',
    data() {
        return {
            items: [
                { 
                    id: 1, 
                    title: 'Registrate', 
                    title_content: 'Primero deberás registrar tu cuenta',
                    sub_content: 'En cada paso verás como poder interactuar con nosotros',
                    img: '/img/stepbystep//primera.png',
                    callToAction: 'Registrate'
                },
                { 
                    id: 2, 
                    title: 'Busca un  tutor', 
                    title_content: 'contenido de informacion',
                    sub_content: 'En cada paso verás como poder interactuar con nosotros',
                    img: '/img/stepbystep//primera.png',
                    callToAction: 'Buscar'
                },
                { 
                    id: 3, 
                    title: 'Reserva tu clase', 
                    title_content: 'contenido de Ajustes',
                    sub_content: 'En cada paso verás como poder interactuar con nosotros',
                    img: '/img/stepbystep//primera.png',
                    callToAction: 'Reservar'
                },
                { 
                    id: 4, 
                    title: 'Asiste a tu clase', 
                    title_content: 'contenido de Ayuda',
                    sub_content: 'En cada paso verás como poder interactuar con nosotros',
                    img: '/img/stepbystep//primera.png',
                    callToAction: 'Ver mis clases'
                }
            ]
        };
    },
    methods: {
        // tus métodos aquí
    },
    components: {
        NavTabs: defineAsyncComponent(() => import('../shared/components/navtabs.vue'))
    }
    
};

</script>

<style scoped>
    @import "../_global.css";
    
    .section {
        width: 100%;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        overflow: hidden;
        padding-inline: 15px;

    }

    .section h2 {
        color:  var(--color-primary);
        max-width: 50%;
        font-size: 27px;
        text-align: center;
    }

    .section sub{
        color: #7A7A7A;
        font-size: 18px;
        font-weight: lighter;
        text-align: center;
    }

    .section button{
        background-color: white;
        border-radius: 6px;
        color: var(--color-primary);
        padding: 10px;
        box-sizing: border-box;
    }

    @media (max-width: 600px) {
        .section h2 {
            max-width: 80%;
            font-size: 24px;
        }
        .section sub{
            font-size: 16px;
            width: 70%;
        }
    }
</style>
