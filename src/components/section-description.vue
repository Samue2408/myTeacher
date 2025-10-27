<template>
  <div class="section">
    <h2>Explora más de 40 materias y domina lo  que siempre quisiste</h2>
    <p>Encuentra al tutor ideal y alcanza tus metas desde cualquier lugar</p>
    <button>Empieza ya</button>
  </div>
</template>
<style scoped>
@import "../_global.css";

.section {
  width: 100%;
  background-color: var(--color-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 50px;
  padding: 35px 18px ;
}

.section h2{
    color: white;
    max-width: 50%;
    font-size: 2rem;
    text-align: center;
}

.section p{
    color: var( --color-border);
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
  .section h2{
    max-width: 90%;
    font-size: 1.5rem;
}

.section p{
    color: var( --color-border);
    font-size: 15px;
}
}

</style>
<script></script>
