<template>
  <div class="section">
    <transition name="slide" mode="out-in">
        <Phrase v-if="currentItem" :key="currentItem.id" :item="currentItem">
            <div class="navigation-button">
                <span @click="handleCardClick(-1)" class="material-icons-outlined">keyboard_arrow_left</span>
                <span @click="handleCardClick(+1)" class="material-icons-outlined">keyboard_arrow_right</span>
            </div>
        </Phrase>
    </transition>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
    name: 'phrasesSection',
    data() {
        return {
            items: [
                { 
                    id: 1, 
                    name: 'Nelson Mandela', 
                    description: 'Nobel De La Paz',
                    img: 'https://i0.wp.com/karsh.org/wp-content/uploads/2017/06/Yousuf-Karsh-Nelson-Mandela-1990.jpg?fit=960%2C1235&strip=none&ssl=1',
                    phrase_initial: 'El mejor arma para combatir la pobreza es la',
                    word_main: 'educación',
                    phrase_final: ''

                },
                { 
                    id: 2, 
                    name: 'Nelson Mandamela2', 
                    description: 'Nobel De La Paz',
                    img: 'https://i0.wp.com/karsh.org/wp-content/uploads/2017/06/Yousuf-Karsh-Nelson-Mandela-1990.jpg?fit=960%2C1235&strip=none&ssl=1',
                    phrase_initial: 'El mejor arma para combatir la pobreza es la',
                    word_main: 'educación',
                    phrase_final: ''

                },
                { 
                    id: 3, 
                    name: 'Nelson Mandela3', 
                    description: 'Nobel De La Paz',
                    img: 'https://i0.wp.com/karsh.org/wp-content/uploads/2017/06/Yousuf-Karsh-Nelson-Mandela-1990.jpg?fit=960%2C1235&strip=none&ssl=1',
                    phrase_initial: 'El mejor arma para combatir la pobreza es la',
                    word_main: 'educación',
                    phrase_final: ''

                },
            ],
            currentItem: null,
            currentPosition: null
        };
    },
    created() {
        this.currentPosition = 0,
        this.currentItem = this.items[this.currentPosition]
    }, 
    methods: {
        handleCardClick: function(position) {
            this.currentPosition += position;
            if (this.currentPosition < 0) {
                this.currentPosition = this.items.length - 1;
            } else if (this.currentPosition >= this.items.length) {
                this.currentPosition = 0;
            }
            this.currentItem = this.items[this.currentPosition];
        }
    },
    components: {
        Phrase: defineAsyncComponent(() => import('../shared/components/phrases.vue'))
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
  justify-content: center;
  gap: 15px;
  margin-top: 50px;
  padding: 18px;
  min-height: 250px;
}

.navigation-button {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.navigation-button span {
    padding: 2px;
    font-size: 16px;
    border-radius: 99px;
    background-color: #D9D9D9;
    color: var(--color-primary);
}


@media (min-width: 375px) {
    .navigation-button span {
        font-size: 18px;
    }
}
@media (min-width: 425px) {
    .navigation-button span {
        font-size: 20px;
    }
}
@media (min-width: 550px) {
    .navigation-button span {
        font-size: 26px;
    }
}
@media (min-width: 768px) {
    .navigation-button span {
        font-size: 32px;
    }
}
@media (min-width: 1024px) {
    .navigation-button {
        gap: 16px;
    }
    .navigation-button span {
        font-size: 38px;
    }
}

</style>

