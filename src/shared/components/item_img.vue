<template>
  <div class="tab-panel">
    <div class="tab-panel-content">
      <h3>{{ item.title_content }}</h3>
      <p>{{ item.sub_content }}</p>
      <div class="call-to-action">
        <a href="">{{ item.callToAction }}</a>
      </div>
    </div>
    <figure>
          <img :src="item.img" :alt="item.title">
    </figure>

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

  .tab-panel img {
    height: 300px;
    margin-top: 20px;
    margin-bottom: 40px;
    border-radius: 29px;  
  }

  .tab-panel .tab-panel-content {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    height: 100%;
  }

  .tab-panel .tab-panel-content .call-to-action {
     padding: 9px 15px;
      color: white;
      background-color: var(--color-primary);
      border-radius: 6px;
      margin-right: auto;
  }
  
  .tab-panel .tab-panel-content h3 {
    color: var(--color-primary);
    font-weight: 700;
    font-size: 30px;
    max-width: 280px;
    line-height: 1.2;
  }

  .tab-panel .tab-panel-content p {
    color: #7a7a7a;
    font-weight: 300;
    font-size: 18px;
    max-width: 280px;
  }

  @media (min-width: 600px) {
  
    .tab-panel {
      flex-direction: row;
      position: relative;
      max-width: 1000px;
      margin-block: 50px;
    }
    
    .tab-panel .tab-panel-content {
      padding-left: 65px;
      gap: 30px;
    }

    .tab-panel figure{
      margin: 0;
      padding: 0;
      width: 50%;
      height: 100%;
    }

    .tab-panel figure img {
      height: 100%;
      width: 100%;
      margin: 0;
    }

    .tab-panel .tab-panel-content h3 {
      max-width: 400px;
      font-size: 40px;
      line-height: 1.4;
    }

    .tab-panel .tab-panel-content p {
      max-width: 80%;
      font-size: 20px;
      
    }

  }
</style>
