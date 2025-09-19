<template>
  <heroImage />
  <StepByStep></StepByStep>
  <div class="wrapper-description">
    <sectionDescription />
  </div>
</template>
<style>
.wrapper-description {
  width: 100%;
  height: 300px;
}



</style>
<script setup>
import heroImage from "@/components/hero-image.vue";
import sectionDescription from "@/components/section-description.vue";
import StepByStep from "@/components/stepbystep.vue";
</script>
