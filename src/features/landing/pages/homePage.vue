<template>
  <heroImage />
  <StepByStep></StepByStep>
  <div class="wrapper-description">
    <sectionDescription />
  </div>
  <phrasesSection/>
</template>

<script setup>
import heroImage from "@/components/hero-image.vue";
import sectionDescription from "@/components/section-description.vue";
import StepByStep from "@/components/stepbystep.vue";
import phrasesSection from "@/components/phrases-section.vue";
</script>


<style>
.wrapper-description {
  width: 100%;
  height: 300px;
}
</style>

