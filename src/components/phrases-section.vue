<template>
  <div class="section">
    <div class="background1">
        <svg width="592" height="555" viewBox="0 0 592 555" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M273.412 38.4705C349.515 -28.5434 516.667 -11.9721 576.472 119.617C620.901 217.374 555.767 287.023 535.021 332.057C514.276 377.091 396.611 531.041 333.564 551.925C235.206 584.506 17.1029 315.199 3.57417 253.77C-9.95452 192.342 12.6549 201.387 110.56 207.625C208.464 213.864 197.309 105.484 273.412 38.4705Z" fill="url(#paint0_linear_313_1464)"/>
            <defs>
                <linearGradient id="paint0_linear_313_1464" x1="170.708" y1="84.2656" x2="517.811" y2="371.88" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#D5E0FF"/>
                    <stop offset="1" stop-color="#E7F4E7"/>
                </linearGradient>
            </defs>
        </svg>

    </div>
    <div class="background2">
        <svg width="487" height="462" viewBox="0 0 487 462" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M274.273 449.67C167.733 394.795 93.749 511.808 31.0446 432.544C-41.9736 340.243 38.1074 395.432 27.7814 238.116C18.2609 93.0722 136.249 31.6811 195.02 4.48588C253.791 -22.7093 297.862 80.8689 459.862 123.869C543.36 146.032 405.631 229.631 371.237 286.987C328.606 358.08 342.853 484.993 274.273 449.67Z" fill="url(#paint0_linear_313_1467)"/>
            <defs>
                <linearGradient id="paint0_linear_313_1467" x1="337.735" y1="42.3951" x2="69.7466" y2="463.261" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E7F4E7"/>
                    <stop offset="1" stop-color="#D5E0FF"/>
                </linearGradient>
            </defs>
        </svg>


    </div>
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
  position: relative;
  max-width: 1300px;
  margin-inline: auto;
}

.section .background1 {
    content: '';
    position: absolute;
    top: 0;
    left: 10px;
    height: 10%;
    width: 40%;
    transform: rotate(10deg);
    z-index: -1;
}

.section .background2 {
    content: '';
    position: absolute;
    top: 45%;
    right: 10px;
    height: 10%;
    width: 40%;
    z-index: -1;
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
    .section .background1 {
        top: 0;
        height: 10%;
        width: 35%;
    }

    .section .background2 {
        top: 45%;
        height: 10%;
        width: 40%;
    }
}
@media (min-width: 425px) {
    .navigation-button span {
        font-size: 20px;
    }
    .section .background1 {
        top: 0;
        height: 10%;
        width: 35%;
        transform: rotate(0deg);
    }

    .section .background2 {
        top: 45%;
        height: 10%;
        width: 35%;

    }
}
@media (min-width: 550px) {
    .section {
        margin-top: 100px;
    }
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
    .section .background1 {
        top: -50px;
        height: 10%;
        width: 50%;
    }

    .section .background2 {
        top: 30%;
        height: 10%;
        width: 40%;
    }
}
@media (min-width: 1280px) {
    .navigation-button {
        gap: 16px;
    }
    .navigation-button span {
        font-size: 38px;
    }
    .section .background1 {
        top: 0;
        height: 10%;
        width: 30%;
    }

    .section .background2 {
        top: 35%;
        height: 10%;
        width: 30%;
    }
}

</style>

