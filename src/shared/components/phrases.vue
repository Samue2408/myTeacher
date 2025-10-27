<template>
  <div class="card">
    <figure>
        <img :src="item.img" :alt="item.name">
    </figure>
    <div class="card-body">
        <span class="quote material-icons">format_quote</span>
        <p class="phrase">{{ item.phrase_initial }} <span class="word_main" >{{ item.word_main }}</span> {{ item.phrase_final }}</p>
        <hr>
        <div class="info">
            <div>
                <h5 class="name">
                    {{ item.name }}
                </h5>
                <p class="description">
                    {{ item.description }}
                </p>
            </div>
            <slot></slot>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Phrase',
    props: {
        item: Object
    },
    data() {
        return {
            
        };
    }    
};
</script>

<style scoped>
@import "../../_global.css";

*{
    box-sizing: border-box;
}

.card {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 15px;
    padding: 10px;
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(245, 247, 252, 1) 38%
      );
    border-radius: 29px;
    width: 95%;
    margin-block: 30px;
    margin-inline: auto;
}

.card figure {
    width: 40%;
}
.card figure img {
    border-radius: 20px;
}

.card .card-body {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 8px;
}

.card .card-body .quote {
    color: var(--color-primary);
    transform: rotate(180deg);
    padding: 2px;
    background-color: #D9D9D9;
    border-radius: 6px;
    margin-right: auto;
    font-size: 20px;
}

.card .card-body .phrase {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    
}
.card .card-body .word_main {
    font-weight: 700;
    color: var(--color-primary);
}
.card .card-body hr {
    border: 1px solid #E1E1E1;
}
.card .card-body .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card .card-body .info .name {
    font-size: 10px;
    line-height: 1;
}

.card .card-body .info .description {
    font-size: 10px;
}

@media (min-width: 375px) {
    .card .card-body .phrase {
        font-size: 14px;
    }
    .card .card-body .info .name {
        font-size: 13px;
    }
    .card .card-body .info .description {
        font-size: 10px;
    }
}

@media (min-width: 425px) {
    .card .card-body {
        gap: 12px;
    }
    .card .card-body .phrase {
        font-size: 17px;
    }
    .card .card-body .info .name {
        font-size: 15px;
    }
    .card .card-body .info .description {
        font-size: 12px;
    }
}

@media (min-width: 550px) {
    .card {
        max-width: 550px;
    }
    .card .card-body {
        gap: 18px;
        padding: 10px;
    }
    .card .card-body .quote {
        font-size: 24px;
    }
    .card .card-body .phrase {
        font-size: 20px;
    }
    .card .card-body .info .name {
        font-size: 18px;
    }
    .card .card-body .info .description {
        font-size: 15px;
    }
}
@media (min-width: 768px) {
    .card {
        max-width: 700px;
        padding: 22px;
    }    
    .card .card-body {
        gap: 28px;
        padding: 15px;
    }
    .card .card-body .quote {
        font-size: 35px;
    }
    .card .card-body .phrase {
        font-size: 27px;
    }
    .card .card-body .info .name {
        font-size: 20px;
    }
    .card .card-body .info .description {
        font-size: 18px;
    }
}

</style>

