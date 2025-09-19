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
      <Item v-if="currentItem" :item="currentItem" />
    </div>
  
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
    name: 'navTabs',
    props: {
      items: Array
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
          this.activeTab = item.id
          this.currentItem = item 
        }
    },
    components: {
      Item: defineAsyncComponent(() => import('./item_img.vue'))
    }
};

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
    -webkit-mask-image: linear-gradient(90deg, #0000, #000 2% 95%, #0000);
    mask-image: linear-gradient(90deg, #0000, #000 2% 95%, #0000);
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
    font-weight: 600;
  }

   .navtabs::-webkit-scrollbar {
    display: none; /* scroll horizontal fino */
  }

  @media (max-width: 600px) {
    .navtabs {     
      justify-content: start;
      gap: 10px;   
    }    
  } 
    
</style>
