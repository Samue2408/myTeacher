<template>
  <li class="booking-item">
    <div class="booking-content">
      <div class="booking-header">
        <h5>{{ booking.student }} Samuel Maldonado <span>({{ booking.type.toLowerCase() }})</span></h5>
        <span class="booking-date">{{ formatDate(booking.date) }}</span>
      </div>
      <p class="booking-subject">{{ booking.subject }}Matemáticas</p>

      <Transition name="expand">
        <div v-if="showDetails" class="booking-other-info">
          <div class="booking-time">
            <div class="label">
              <span class="material-icons-outlined">schedule</span>
              <p>Horario:</p>
            </div>
            {{ booking.startTime }} - {{ booking.endTime }}
          </div>
          <div class="booking-type">  
            <div class="label">
              <span class="material-icons-outlined">location_on</span>
              <p>Ubicación:</p>
            </div>           
            {{ booking.location }}
          </div>
          <div class="booking-price">    
            <div class="label">
              <span class="material-icons-outlined">trending_up</span>
              <p>Ganancia:</p>
            </div>          
            {{ formatCurrency(booking.price) }}
          </div>
        </div>
      </Transition>
      <hr>
      <div class="footer">
        <div class="actions">
          <button class="action" title="Comentarios">                        
            <span class="material-icons-outlined">mode_comment</span>
            <p>{{ booking.comments || 0 }}</p>
          </button>
          <button v-if="booking.type.toLowerCase() == 'virtual'" class="action" title="Link de la clase">                        
            <span class="material-icons-outlined link">link</span>
          </button>
          <button class="action" @click="showDetails = !showDetails" title="Más información">                        
            <span class="material-icons-outlined">info</span>
          </button>
        </div>
        
        <div class="booking-status">
          <span :class="`status ${booking.status.toLowerCase()}`">{{ booking.status }}</span>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { ref, defineProps } from "vue";

defineProps({
  booking: {
    type: Object,
    required: true,
  },
});

const showDetails = ref(false);

// Formatear fecha
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return d.toLocaleDateString("es-ES", options);
};

function formatCurrency(value) {
  const format = (num) =>
    Number.isInteger(num) ? num.toString() : num.toFixed(1);

  if (value >= 1_000_000) {
    return `$${format(value / 1_000_000)}M`;
  }
  if (value >= 1_000) {
    return `$${format(value / 1_000)}K`;
  }
  return `$${value}`;
}
</script>

<style scoped>
.booking-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  list-style: none;
}

.booking-content {
  background: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  width: 100%;
  transition: 0.25s;
}

.booking-content:hover {
  transform: translateX(3px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-header h5 {
  font-size: 14px;
  font-weight: 500;
  color: #222;
  margin: 0;
}

.booking-header h5 span {
    color: #222;
    font-weight: 400;
}

.booking-date {
  font-size: 12px;
  color: #7c7c7c;
}

.booking-subject {
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 700;
}

.booking-other-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-block: 8px;
}

.booking-other-info .label {
  display: flex;
  align-items: center;
  gap: 3px;
}

.booking-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  font-size: 12px;
  color: #7c7c7c;
}

.booking-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 26px;
  font-size: 12px;
  color: #7c7c7c;
}

.booking-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  font-size: 12px;
  color: #08B294;
}

.material-icons-outlined {
  font-size: 16px;
}

.booking-status {
  display: flex;
  gap: 8px;
}

hr {
  border: 0.5px solid #e8e8e8;
  border-radius: 20px;
  margin: 10px 0;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.actions .action {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #f5f5f5;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  color: #656467;
  cursor: pointer;
  transition: all 0.2s ease;
}

.actions .action:hover {
  background-color: #efefef;
}

.actions .action .link {
  transform: rotate(-45deg);
}

.actions .action p {
  font-size: 12px;
  margin: 0;
}

.status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.status.aceptada {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status.completada {
  background-color: #e3f2fd;
  color: #1565c0;
}

.status.cancelada {
  background-color: #ffe0e0;
  color: #e60000;
}

.status.pendiente {
  background-color: #fff3e0;
  color: #e65100;
}

/* Transición suave para información adicional */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to {
  opacity: 1;
  max-height: 500px;
}

.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
