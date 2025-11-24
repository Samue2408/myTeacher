<template>
    <div class="availability">
      <div :class="[
            'availability-back',
            availability.dayOfWeek ? availability.dayOfWeek.toLowerCase() : 'puntual'
        ]">
        <p><strong>{{ availability.active ? 'Activo': 'Desactivo' }}</strong></p>
      </div>
      <div :class="[
            'content',
            availability.dayOfWeek ? availability.dayOfWeek.toLowerCase() :  'puntual',
            !availability.active ? 'inactive': null
        ]">
        <div class="content-header">
            <p>
                <strong>{{ availability.dayOfWeek || availability.date }}</strong>
            </p>
            <span @click.stop="toggleMenu" class="material-icons"> more_vert </span>
        </div>
        <MenuModal
          :items="menuItems"
          :row="availability"
          :isOpen="isMenuOpen"
          :dividerIndex="null"
          :itemRed="2"
          @closed="isMenuOpen = false"
          />
        <div class="availability-from">
          <p>Desde las: </p>
          <p><strong>{{ availability.startTime }}</strong></p>
        </div>
        <div class="availability-to">
          <p>Hasta las: </p>
          <p><strong>{{ availability.endTime }}</strong></p>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { Availabilitytype } from "@/types/user";
import type { PropType } from "vue";
import { onMounted, ref } from "vue";
import MenuModal from "@/shared/components/MenuModal.vue";
import { useAvailabilitiesStore } from "@/stores/availabilitiesStore";

const availabilitiesStore = useAvailabilitiesStore()

const $props = defineProps({
    availability: {
        type: Object as PropType<Availabilitytype>,
        required: true
    }
})
const emit = defineEmits(["edit"]);
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const menuItems = [
  {
    label: "Editar",
    icon: "create",
    action: (row: Availabilitytype) => {
      emit("edit")
    },
  },
  {
    label: $props.availability.active ? "Desactivar" : "Activar",
    icon: "power_settings_new",
    action: async (row: Availabilitytype) => {
      row = {...row, active: !row.active}
      await availabilitiesStore.activateAvailability(row)
    },
  },
  {
    label: "Eliminar",
    icon: "close",
    class: "red",
    action: async (row: Availabilitytype) => {
      await availabilitiesStore.deleteAvailabity(row._id)
    },
  },
];

onMounted(() => {
  if ($props.availability.date) {
    const raw = $props.availability.date;
    // Si viene en formato ISO (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS...), extraer la parte de fecha
    if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
      const isoDate = raw.slice(0, 10); // 'YYYY-MM-DD'
      const [y, m, d] = isoDate.split('-');
      // Mostrar como 'DD/MM/YYYY' pero sin usar toLocaleDateString para evitar conversiones por zona
      $props.availability.date = `${d}/${m}/${y}`;
    } else {
      // Fallback: crear Date y usar componentes UTC para evitar desplazamientos por zona horaria
      const dateObj = new Date(raw as any);
      if (!isNaN(dateObj.getTime())) {
        const dd = String(dateObj.getUTCDate()).padStart(2, '0');
        const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const yyyy = dateObj.getUTCFullYear();
        $props.availability.date = `${dd}/${mm}/${yyyy}`;
      }
    }
  }
})

</script>

<style scoped>


.availability {
  min-width: 220px;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 1s ease;
  animation-duration: 1s;
}
.availability-back {
  position: absolute;
  color: #fff;
  top: -22px;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 3px 10px;
  z-index: 0;
}

.puntual {
  background-color: #08B294;
  border-color: #08B294;    
}

.lunes {
  background-color: #003366;
  border-color: #003366;    
}

.martes {
  background-color: #CC0000;
  border-color: #CC0000;    
}

.miercoles {
  background-color: #228B22;
  border-color: #228B22;    
}

.jueves {
  background-color: #6A0DAD;
  border-color: #6A0DAD;    
}

.viernes {
  background-color: #FF8C00;
  border-color: #FF8C00;    
}

.sábado {
  background-color: #0047AB;
  border-color: #0047AB;    
}

.domingo {
  background-color: #8B4513;
  border-color: #8B4513;    
}

.availability-back p {
  font-size: 12px;
}

.availability .content {
  border-width: 1px;
  border-style: solid;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 14px 20px;
  border-radius: 8px;
  background-color: #fff;
  z-index: 1;
}

.availability .content .content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 13px;
}

.availability .content .content-header p {
  font-size: 30px;
  line-height: 1;
}

.availability .content .content-header span {
  cursor: pointer;
}

.availability-from, .availability-to {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding-inline: 10px;
  font-size: 14px;
}

.availability .content.inactive {
  background-color: #D9D9D9; 
}
</style>