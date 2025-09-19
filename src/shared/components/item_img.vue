<template>
  <div class="tab-panel">
    <div class="tab-panel-content">
      <h3>{{ item.title_content }}</h3>
      <p>{{ item.sub_content }}</p>
      <div>
        <a href="">{{ item.callToAction }}</a>
      </div>
    </div>
    <img :src="item.img" :alt="item.title">

  </div>
</template>

<script>

export default {
  name: 'VueTabs',
  props: {
    item: Object,
  },
  
}
</script>

<style scoped>
  .tab-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-block: 50px;
    background: linear-gradient(
      145deg,
    rgba(255, 255, 255, 1) 0%,
      rgba(245, 247, 252, 1) 38%
    );
    border-radius: 29px;
    width: 95%;
    margin-inline: auto;
  }

  .tab-panel img {
    height: 280px;
  }

  .tab-panel .tab-panel-content {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    height: 100%;
  }

  .tab-panel .tab-panel-content h3 {
    color: var(--color-primary);
    font-weight: 700;
    font-size: 36px;
    max-width: 280px;
  }

  .tab-panel .tab-panel-content p {
    color: #7a7a7a;
    font-weight: 300;
    font-size: 20px;
    max-width: 280px;
  }

  .tab-panel .tab-panel-content a {
    padding: 9px 15px;
    color: white;
    background-color: var(--color-primary);
    border-radius: 6px;
  }

  @media (min-width: 600px) {
  
    .tab-panel {
      flex-direction: row;
      position: relative;
      max-width: 1000px;
      padding-left: 40px;
    }

    .tab-panel img {
      height: 500px;
    }

    .tab-panel h3 {
      max-width: 500px;
    }

  }
</style>
