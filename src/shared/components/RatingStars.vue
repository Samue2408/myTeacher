<template>
  <div class="rating-container">
    <span class="rating-number">{{ rating }}</span>
    <div class="stars">
      <span 
        v-for="star in 5" 
        :key="star" 
        class="material-icons"
        :class="getStarClass(star)"
      >
        {{ getStarIcon(star) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  rating: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 5,
  },
});

// Determinar qué estrella mostrar (completa, media o vacía)
const getStarIcon = (starPosition) => {
  const rating = props.rating;
  const decimalPart = rating % 1;
  
  
  
  // Si el rating es mayor o igual a la posición (estrella completa)
  if (rating >= starPosition) {
    return "star";
  }
  
  // Si está entre starPosition-1 y starPosition, verificar decimal
  // Si decimal >= 0.5, mostrar media estrella en la siguiente posición
  if (rating > starPosition - 1 && rating < starPosition) {
    if (decimalPart >= 0.5) {
      return "star_half";
    }
    return "star_border";
  }
  
  return "star_border";
};

const getStarClass = (starPosition) => {
  const rating = props.rating;
  const decimalPart = rating % 1;
  
  if (rating >= starPosition) {
    return "full";
  }
  
  // Media estrella solo si decimal >= 0.5 y estamos en la siguiente posición
  if (rating > starPosition - 1 && rating < starPosition && decimalPart >= 0.5) {
    return "half";
  }
  
  return "empty";
};
</script>

<style scoped>
.rating-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-number {
  font-size: 14.5px;
  font-weight: 500;
  color: #222;
  min-width: 30px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars .material-icons {
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stars .material-icons.full {
  color: #ffc107;
}

.stars .material-icons.half {
  color: #ffc107;
}

.stars .material-icons.empty {
  color: #ddd;
}

.stars .material-icons:hover {
  transform: scale(1.1);
}
</style>
