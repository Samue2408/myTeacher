<template>
  <main class="payment-page">
    <section class="payment-card">
      <p class="eyebrow">Paso 3 de 3</p>
      <h1>Completa tu pago</h1>
      <p class="subtitle">Serás redirigido a Mercado Pago para completar tu pago de forma segura.</p>

      <div v-if="loading" class="state loading">
        <span class="spinner" />
        <p>Cargando el botón de pago...</p>
      </div>

      <div v-else-if="hasError" class="state error">
        <span class="material-icons-outlined status-icon">error_outline</span>
        <h2>No se pudo cargar el pago</h2>
        <p>Ocurrió un problema al conectar con Mercado Pago.</p>
        <button class="primary" type="button" @click="retry">Reintentar</button>
      </div>

      <div id="walletBrick_container" v-show="!loading && !hasError" class="wallet-brick" />

      <p class="secure-note">
        <span class="material-icons-outlined">lock</span>
        Pago procesado de forma segura por Mercado Pago
      </p>
    </section>
  </main>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { MercadoPagoService } from '@/api/mercadopago.service';

const props = defineProps({
  bookingId: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const hasError = ref(false);
let walletBrickController = null;
let bricksBuilder = null;

const initBrick = async () => {
  loading.value = true;
  hasError.value = false;

  try {
    // 1. Trae la preferencia generada en tu backend
    const data = await MercadoPagoService.getPreference(props.bookingId);

    // 2. Carga el SDK de Mercado Pago de forma segura
    await loadMercadoPago();

    // 3. Inicializa con tu clave pública (Public Key)
    const mp = new window.MercadoPago('APP_USR-3fc6bac4-ec65-45aa-933d-84472b794dc8', {
      locale: 'es-CO',
    });

    bricksBuilder = mp.bricks();

    const settings = {
      initialization: {
        preferenceId: data.id, // El ID de preferencia generado en tu backend
        redirectMode: 'self', // "self" para abrir en la misma pestaña o "modal"
      },
      callbacks: {
        onReady: () => {
          // El brick ya terminó de renderizarse: ocultamos el spinner
          loading.value = false;
        },
        onSubmit: () => {
          // Callback opcional al hacer clic
        },
        onError: (error) => {
          console.error('Error en el Wallet Brick:', error);
          hasError.value = true;
          loading.value = false;
        },
      },
    };

    // 4. Crea el ladrillo (brick) dentro del div contenedor
    walletBrickController = await bricksBuilder.create('wallet', 'walletBrick_container', settings);
  } catch (error) {
    console.error('Error inicializando el pago:', error);
    hasError.value = true;
    loading.value = false;
  }
};

const retry = () => {
  if (walletBrickController) {
    walletBrickController.unmount();
    walletBrickController = null;
  }
  initBrick();
};

onMounted(initBrick);

// Es MUY importante destruir el componente si el usuario navega fuera de la vista
onBeforeUnmount(() => {
  if (walletBrickController) {
    walletBrickController.unmount();
  }
});
</script>

<style scoped>
.payment-page {
  min-height: calc(100vh - 8vh);
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: #f6f8fc;
  font-family: Inter, sans-serif;
  color: #252b36;
}

.payment-card {
  width: min(100%, 480px);
  box-sizing: border-box;
  padding: 32px;
  background: #fff;
  border: 1px solid #e5e9f0;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 42, 55, 0.05);
  text-align: center;
}

.eyebrow {
  margin: 0 0 7px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.subtitle {
  margin: 0 0 28px;
  color: #707987;
  font-size: 14px;
  line-height: 1.5;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
}

.state p {
  margin: 12px 0 0;
  color: #707987;
  font-size: 13px;
}

.state.error h2 {
  margin: 14px 0 6px;
  font-size: 17px;
}

.status-icon {
  font-size: 44px;
  color: #c42b2b;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #dce4f2;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.wallet-brick {
  min-height: 64px;
}

.primary {
  margin-top: 18px;
  padding: 12px 20px;
  border: 0;
  border-radius: 9px;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.secure-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 20px 0 0;
  color: #9da6b3;
  font-size: 12px;
}

.secure-note .material-icons-outlined {
  font-size: 14px;
}

@media (max-width: 600px) {
  .payment-card {
    padding: 24px 20px;
  }
}
</style>