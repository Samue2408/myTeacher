<template>
  <div class="section">
      <div class="learnWithUs-content">
        <h2>Aprende con <span>nosotros</span></h2>
        <article>
            <ul>
                <li>
                    <div>
                        <span class="material-icons-outlined">check</span>
                    </div>
                    <div>
                        <strong>Tutores verificados: </strong>cada perfil es revisado y validado para garantizar experiencia y conocimientos reales.
                    </div>
                </li>
                <li>
                    <div>
                        <span class="material-icons-outlined">check</span>
                    </div>
                    <div>
                        <strong>Reputación transparente: </strong>consulta reseñas y calificaciones de otros estudiantes antes de elegir tu tutor.
                    </div>
                </li>
                <li>
                    <div>
                        <span class="material-icons-outlined">check</span>
                    </div>
                    <div>
                        <strong>Alto nivel de satisfacción: </strong>más del 97% de los estudiantes recomienda la plataforma tras completar sus clases.
                    </div>
                </li>
            </ul>
        </article>
      </div>
      <figure class="learnWithUs-figure">
        <img :src="learnWithUs" alt="learnWithUs">
      </figure>
</div>
</template>

<script>

export default {
    name: 'learnWithUs',
    data() {
        return {
            learnWithUs: new URL('@/assets/WithUs/learnWithUs.png', import.meta.url).href,
        };
    },
    created() {
    },
    methods: {
        
    },
    components: {
        
    }
    
};
</script>
<style scoped>
@import "../_global.css";

.section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-block: 20px;
  padding: 18px;
}

.section h2 {
    font-size: 27px;
    text-align: center;
    margin-bottom: 25px;
}

.section h2 span {
    color:  var(--color-primary);
}

.section .learnWithUs-contentn article ul {
    width: 80%;
    margin-inline: auto;
}

.section .learnWithUs-content article ul li {
    margin-block: 15px;
    display: flex;
    align-items: start;
    gap: 12px;
    font-size: 16px;

}

.section .learnWithUs-content article ul li span {
    color: #0a8e0a;
}

.section .learnWithUs-figure {
    width: 80%;
    max-width: 400px;
    margin-top: 20px;
}


@media (min-width: 375px) {
    .section {
        margin-top: 70px;
    }
}

@media (min-width: 425px) {
    .section h2 {
        font-size: 32px;
    }
}
@media (min-width: 550px) {
    .section h2 {
        font-size: 35px;
    }
    .section .learnWithUs-content article{
        max-width: 600px;
    }
}

@media (min-width: 768px) {
    .section {
        flex-direction: row;
        padding-inline: 30px;
    }
    .section h2 {
        font-size: 30px;
        text-align: start;
        margin-bottom: 25px;
    }

    .section .learnWithUs-content article ul {
        width: 80%;
        margin-inline: 12px 0;
    }
    .section .learnWithUs-content article ul li {
        gap: 18px;
    }

    .section .learnWithUs-figure {
        max-width: 450px;
        margin-top: 0;
    }
}

@media (min-width: 1024px){
    .section {
        margin-block: 90px;
        max-width: 1200px;
        margin-inline: auto;
    }
    .section h2 {
        font-size: 37px;
        margin-bottom: 35px;
    }

    .section .learnWithUs-content article ul li {
        gap: 22px;
        font-size: 20px;
    }
}

</style>

