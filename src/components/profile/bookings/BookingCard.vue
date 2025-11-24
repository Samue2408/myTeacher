<template>
  <li class="booking-item" >
    <div class="booking-content">
      <div class="booking-header">
        <div class="booking-student">
            <div class="avatar">
                <span>{{ $props.booking.student.name[0].toUpperCase() }}</span>
            </div>
            <div>
                <h5>{{ $props.booking.student.name }} <span>({{ $props.booking.type.toLowerCase() }})</span></h5>
                <p class="booking-subject">{{ $props.booking.subject.name}}</p>
            </div>
        </div>
        <span class="booking-date">{{ formatDate($props.booking.date) }}</span>
      </div>
      

      <Transition name="expand">
        <div v-if="showDetails" class="booking-other-info">
          <div class="booking-time">
            <div class="label">
              <span class="material-icons-outlined">schedule</span>
              <p>Horario:</p>
            </div>
            {{ $props.booking.startTime }} - {{ $props.booking.endTime }}
          </div>
          <div class="booking-type">  
            <div class="label">
              <span class="material-icons-outlined">location_on</span>
              <p>Ubicación:</p>
            </div>           
            {{ $props.booking.location }}
          </div>
          <div class="booking-price">    
            <div class="label">
              <span class="material-icons-outlined">trending_up</span>
              <p>Ganancia:</p>
            </div>          
            {{ formatCurrency($props.booking.price) }}
          </div>
        </div>
      </Transition>
      <hr>
      <div class="footer">
          <div class="actions">
                <button class="action" @click="showDetails = !showDetails" title="Más información">                        
                    <span class="material-icons-outlined">info</span>
                </button>
                <button v-if="!$props.pending" class="action" title="Comentarios">                        
                    <span class="material-icons-outlined">mode_comment</span>
                    <p>{{ $props.booking.reviewsCount }}</p>
                </button>
                <button v-if="$props.booking.type.toLowerCase() == 'virtual' && !$props.pending" class="action" :title="$props.booking.videoCallLink">                        
                    <span class="material-icons-outlined link">link</span>
            </button>
        </div>
        
        <div v-if="$props.pending" class="booking-actions">
          <button class="btn-accept" @click="handleAccept" :disabled="isLoading">Aceptar</button>
          <button class="btn-reject" @click="handleReject" :disabled="isLoading">Rechazar</button>
        </div>
        <div v-else class="booking-status">
          <span :class="`status ${$props.booking.status.toLowerCase()}`">{{ $props.booking.status }}</span>
        </div>

      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { BookingsType } from "@/types/bookings";
import type {PropType} from "vue"

const $props = defineProps({
  booking: {
    type: Object as PropType<BookingsType>,
    required: true,
  },
  pending: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["accept", "reject"]);

const showDetails = ref(false);

// Formatear fecha
const formatDate = (date: string | number | Date | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
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

const handleAccept = () => {
  emit("accept", $props.booking);
};

const handleReject = () => {
  emit("reject", $props.booking);
};
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
  align-items: start;
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
    font-size: 11px;
}

.booking-student {
    display: flex;
    align-items: center;
    gap: 12px;
}

.booking-student .avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #797979;
  color: white;
  font-weight: 600;
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

.booking-actions {
  display: flex;
  gap: 10px;
}

.btn-accept,
.btn-reject {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-accept {
  background-color: var(--color-primary);
  color: white;
}

.btn-accept:hover:not(:disabled) {
  background-color: #3e5de6;
  box-shadow: 0 2px 8px rgba(35, 84, 182, 0.3);
}

.btn-accept:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-reject {
  background-color: #EE332D;
  color: white;
}

.btn-reject:hover:not(:disabled) {
  background-color: #efefef;
  color: #333;
}

.btn-reject:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
