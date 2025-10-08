<template>
  <main>
    <h1>
      myTEACHER
    </h1>
    <h5>CONECTA, APRENDE, CRECE</h5>
    <div class="search" style="view-transition-name: search-box;">
      <input type="text" :value="$route.query.q" placeholder="Buscar materias" name="search" />
      <button>Buscar</button>
    </div>

    <div class="content">
      
      <button class="filters-sm">
        <span class="input-icon material-icons-outlined" >
          filter_list
        </span>
        Filtros
      </button>

      <div class="filters-lg">
        <button class="filters-sm">
          <span class="input-icon material-icons-outlined" >
            filter_list
          </span>
          <p>
            Filtros
          </p>
        </button>
      </div>

      <results_search/>

    </div>

  </main>
</template>

<script setup>
import results_search from '@/components/search/results_search.vue';
</script>



<style scoped>
main {
  padding: 20px;
  background: linear-gradient(
    180deg,
    rgba(83, 127, 213, 0.2) 0%,
    rgba(249, 249, 249, 0.02) 100%
  );
}

h1 {
  font-size: 25px;
  font-weight: 800;
  color: var(--color-primary);
  text-align: center;
}

h5 {
  font-weight: 400;
  color: var(--color-primary);
  text-align: center;
  margin-inline: auto;
  margin-bottom: 15px;
}

.search {
  width: 100%;
  margin-block: 0 35px;
  margin-inline: auto;
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--color-bg);
}

.search input {
  width: 75%;
  padding: 10px 14px;
  font-size: 14px;
}

.search button{
  width: 25%;
  padding-block: 10px;
  color: white;
  background-color: var(--color-primary);
  font-size: 14px;
  border-radius: 6px;
}

.content .filters-sm {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-primary);
  font-weight: 600;
  margin-block: 10px;
  line-height: .6;
  animation: fade-in 0.3s ease-in forwards;
  animation-delay: 0.4s;
  opacity: 0;
}

.input-icon {
  font-size: 20px;
  display: flex;
  align-items: center;
}


.content .filters-lg {
  height: 80vh;
  background-color: white;
  border-radius: 12px;
  padding: 10px 20px;
  display: none;
  animation: fade-in 0.4s ease-in forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

  @keyframes fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }


@media (min-width: 600px) {

  main {
    padding-inline: 40px;
  }
  h1 {
    font-size: 30px;
  }

  .search {
    width: 60%;
    margin-block: 0 40px;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 20px;
  }

  .content > .filters-sm {
    display: none;
  }

  .content .filters-lg {
    display: block;
  }


    

}


</style>

