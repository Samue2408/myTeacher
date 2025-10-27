<template>
    <div class="section">
        <h2>Aprender nunca fue tan fácil, <span>rápido y a tu medida</span></h2>
        <sub>En cada paso verás como poder interactuar con nosotros</sub>
        <NavTabs :items="items" :nav-enabled="1"/>
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
                    img: '/img/stepbystep/primera.png',
                    callToAction: 'Registrate'
                },
                { 
                    id: 2, 
                    title: 'Busca un  tutor', 
                    title_content: 'Explora los perfiles de nuestros tutores',
                    sub_content: 'Podrás filtrar por nivel de educación y más para encontrar al tutor ideal.',
                    img: '/img/stepbystep/segunda.png',
                    callToAction: 'Buscar tutor'
                },
                { 
                    id: 3, 
                    title: 'Reserva tu clase', 
                    title_content: 'Elige él horario que más te sirva',
                    sub_content: 'Confirma la reserva y asegura tu espacio con el tutor.',
                    img: '/img/stepbystep/primera.png',
                    callToAction: 'Reservar ahora'
                },
                { 
                    id: 4, 
                    title: 'Asiste a tu clase', 
                    title_content: 'Reúnete desde cualquier lugar',
                    sub_content: 'Accede tu perfil para ver el link o dirección para disfrutar de tu clase.',
                    img: '/img/stepbystep/primera.png',
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
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        overflow: hidden;
        padding-inline: 15px;
        margin-top: 80px;
    }

    .section h2 {
        max-width: 50%;
        font-size: 27px;
        text-align: center;
    }

    .section h2 span {
        color:  var(--color-primary);
    }

    .section sub{
        color: var(--color-muted);;
        font-size: 18px;
        font-weight: light;
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

        .section {
            padding-top: 20px;
        }
        .section h2 {
            max-width: 90%;
            font-size: 24px;
        }
        .section sub{
            font-size: 14px;
            width: 85%;
        }
    }
</style>
