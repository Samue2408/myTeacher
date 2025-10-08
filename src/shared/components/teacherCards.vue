<template>
  <div class="card">    
    <div class="card-teacher">
        <figure class="card-avatar">
            <img :src="teacher.img" :alt="teacher.title">
        </figure>
        <div class="card-info">
            <h3>{{ teacher.name }}</h3>
            <p class="desc">{{ teacher.description }}</p>
            <p class="subj">{{ teacher.subject }}</p>
        </div>
    </div>

    <div class="card-subject">
        <a href="">{{ teacher.subject }}</a>
    </div>  
    
    <div class="card-price">
        <h5>Precio</h5>
        <p>$ {{ teacher.price.toLocaleString('es-CO') }}</p>
    </div>

    <button @click="goToTutoringProfile(teacher.id)" class="card-action">
        Ver
    </button>

  </div>
</template>

<script setup>

import { useRouter } from 'vue-router'

// Accedemos al router dentro del componente
const router = useRouter()

// Recibimos la prop
defineProps({
  teacher: Object
})

const goToTutoringProfile = (id) => {
  router.push({
    name: 'TutorProfile',
    params: {id}   // Ruta a la que quieres ir
  })
}

</script>

<style scoped>
  .card {
    display: grid;
    align-items: center;
    justify-content: space-between;
    grid-template-columns: 2fr 1.25fr .5fr;
    width: 100%;
    border: 1px solid #EEE;
    border-radius: 10px;
    padding: 10px;
    gap: 6px;
    transition: all 0.3s ease;
  }

  .card:hover {
    scale: 1.01;
  }

  .card .card-teacher {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card .card-teacher .card-avatar {
    height: 40px;
    width: 40px;
  }

  .card .card-teacher .card-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 99px;
  }

  .card .card-teacher .card-info h3 {
    font-size: 11px;
  }

  .card .card-teacher .card-info p {
    font-size: 9px;
    color: var(--color-muted);
  }

  .card .card-teacher .card-info .desc{
    display: none;
  }

  .card .card-subject {
    text-align: center;
    font-size: 10px;
    display: none;
    
  }

  .card .card-price {
    text-align: center;
    font-size: 10px;
  }
  
  .card .card-price p {
    color: #0A8E0A;
    font-weight: 500;
  }


  .card .card-action {
    text-align: center;
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 6px;
    background-color: #0A8E0A;
    margin: auto;
  }

   @media (min-width: 800px) {

    .card {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr .5fr;
    }

    .card .card-teacher .card-info .desc{
      display: block;
    }

    .card .card-teacher .card-info .subj{
      display: none;
    }

    .card .card-subject {
      display: block;
    }

   }


  @media (min-width: 1024px) {
    .card {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr .5fr;
      padding: 15px;
    }

    .card .card-teacher {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card .card-teacher .card-avatar {
      width: 50px;
      height: 50px;
    }

    .card .card-teacher .card-info h3 {
      font-size: 14px;
    }

    .card .card-teacher .card-info .desc{
      font-size: 10px;
    }

    .card .card-subject {
      font-size: 12px;
    }

    .card .card-price {
      text-align: center;
      font-size: 12px;
    }

    .card .card-action {
      font-size: 12px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 6px;
    }

  }


</style>
