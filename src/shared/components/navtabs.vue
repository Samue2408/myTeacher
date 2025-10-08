<template>
    <div class="container-tabs">
      <div class="navtabs">
        <nav 
          v-for="item in items" 
          :key="item.id" 
          @click="handleTabClick(item)" 
          :class="{ 'activeTab': activeTab === item.id }"
        >
          
          {{ item.title }}
        </nav>
      </div>
      <transition name="slide" mode="out-in">
        <Item v-if="currentItem" :key="currentItem.id" :item="currentItem" />
      </transition>
    </div>  
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
    name: 'navTabs',
    props: {
      items: Array,
      navEnabled: Number,
      disabledTabs: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return{
        currentItem: this.items[0],
        activeTab: 1,
        tabs: {
            
        }
      }
    },
    methods: {
        handleTabClick: function(item) {
          if(this.disabledTabs)return;
          this.activeTab = item.id
          this.currentItem = item 
        }
    },
    components: {
      Item: defineAsyncComponent(() => import('./item_img.vue'))
    }
}

</script>

<style scoped>
  @import "../../_global.css";

  .container-tabs {
    width: 100%;
  }   
  
  .navtabs { 
    overflow-x: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    gap: 19px;
    margin-top: 48px;
    -webkit-mask-image: linear-gradient(90deg, #0000, #000 5% 95%, #0000);
    mask-image: linear-gradient(90deg, #0000, #000 5% 95%, #0000);
  }

  nav {
    padding: 8px 17px;
    background-color: rgba(83, 127, 213, 0.16);
    border: none;
    border-radius: 16px;
    font-weight: 400;
    font-size: 13px;
    text-wrap: nowrap;
    color: #222;
    cursor: pointer;
    transition: all .5s ease;
  }

  nav.activeTab {
    background-color: var(--color-primary);
    color: white;
  }

  nav.disabledTabs {
    opacity: .2;
    pointer-events: none;
    user-select: none;
  }

  .navtabs::-webkit-scrollbar {
    display: none; /* scroll horizontal fino */
  }

  /* Slide hacia la derecha */
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;  
    width: 100%;
  }

  .slide-enter-from {
    opacity: 0;
    transform: translateX(50px); /* entra desde la derecha */
  }

  .slide-enter-to {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-leave-from {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-leave-to {
    opacity: 0;
    transform: translateX(-50px); /* sale hacia la izquierda */
  }
  


  @media (max-width: 600px) {
    .navtabs {     
      justify-content: start;
      gap: 10px;   
      margin-top: 30px;
      padding-inline: 10px;
    }    
  } 
    
</style>
