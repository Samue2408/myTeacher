<template>
  <div class="review-details">
    <div class="review-rating" :aria-label="`${review.rating} de 5 estrellas`">
      <span v-for="star in 5" :key="star" class="material-icons-outlined" :class="{ active: star <= review.rating }">star</span>
      <strong>{{ review.rating }}/5</strong>
    </div>
    <p class="review-comment">{{ review.comments }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Review } from "@/types/reviews";

defineProps<{ review: Review }>();
</script>

<style scoped>
.review-rating { display: flex; align-items: center; gap: 3px; margin: 16px 0 10px; }
.material-icons-outlined { color: #d4d9df; }
.material-icons-outlined.active { color: #f5b301; }
.review-rating strong { margin-left: 5px; color: #4a5360; font-size: 13px; }
.review-comment { margin: 0; color: #3f4650; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
</style>
