<template>
    <template v-if="$props.skeleton">
        <div class="card">
            <div class="header"> 
                <h3 class="skltn skltn-text" style="max-width: 120px; height: 30px;"></h3>
                <span class="skltn skltn-text" style="width: 60px; height: 30px;"></span>
            </div>
            <div class="main skltn skltn-text" style="height: 40px;">
            </div>
            <div class="booking-info skltn skltn-text" style="height: 45px;">
            </div>
            <div class="actions">
                <button class="skltn skltn-text" style="width: 60px; height: 25px;"></button>
                <button class="skltn skltn-text" style="width: 60px; height: 25px;"></button>
                <button class="skltn skltn-text" style="width: 60px; height: 25px;"></button>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="card">
            <div class="header"> 
                <h3>Tu Proxima Clase</h3>
                <span>En 2 días</span>
            </div>
            <div class="main">
                <div class="student-info">
                    <p>Shaira Mishell Rico Echeverría</p>
                    <h5>Ciencias Naturales</h5>
                </div>
                <div class="avatar">
                    <span>S</span>
                </div>
            </div>
            <div class="booking-info">
                <div class="date">
                    <p>Fecha:</p>
                    <h5>Martes. 2 de septiembre</h5>
                </div>
                <div class="schedule">
                    <p>Horario:</p>
                    <h5>10:00 AM - 11:00 AM</h5>
                </div>
                <div class="mode">
                    <p>Modalidad:</p>
                    <h5>Virtual</h5>
                </div>
            </div>
            <div class="actions">
                <button class="link">Ir al enlace</button>
                <button class="calendar">Ir a calendario</button>
                <button class="cancel">Cancelar</button>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { BookingsType } from '@/types/bookings'
import type { PropType } from 'vue'

const $props = defineProps({
    booking: {
        type: Object as PropType<BookingsType>,
    },
    skeleton: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 12px;
    padding: 20px;
    flex: 1;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.card p {
  font-size: 13px;
  font-weight: 200;
  color: #222;
}

.card .header {
    display: flex;
    justify-content: space-between;
}

.card .header h3 {
    font-size: 15px;
    color: #222;
}

.card .header span {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-primary);
}

.card .main {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.card .main .student-info {
    max-width: 70%;
}

.card .main .student-info p {
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card .main .student-info h5 {
    font-size: 15px;
    color: var(--color-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card .main .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #08B294;
}
.card .main .avatar span {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.card .booking-info div {
    display: flex;
    justify-content: space-between;
}

.card .booking-info div h5 {
    font-weight: 500;
}

.card .actions {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.card .actions button {
    padding: 6px 12px;
    border-radius: 6px;
}
.card .actions .link {
    background-color: var(--color-primary);
    color: #fff;
    border: 1px solid var(--color-primary);
}

.card .actions .calendar {
    color: #08B294;
    border: 1px solid #08B294;
}

.card .actions .cancel {
    color: #EE332D;
    border: 1px solid #EE332D;
}

</style>