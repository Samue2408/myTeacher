<template>
    <div id="walletBrick_container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { MercadoPagoService }from '@/api/mercadopago.service'

const props = defineProps({
  bookingId: {
    type: String,
    required: true
  }
});

let walletBrickController = null;

onMounted(async () => {

  const data = await MercadoPagoService.getPreference(props.bookingId);
  // 1. Carga el SDK de Mercado Pago de forma segura
  await loadMercadoPago();

  // 2. Inicializa con tu clave pública (Public Key)
  const mp = new window.MercadoPago("APP_USR-3fc6bac4-ec65-45aa-933d-84472b794dc8", {
    locale: "es-CO"
  });

  const bricksBuilder = mp.bricks();

  // 3. Renderiza el Wallet Brick
  const renderWalletBrick = async (bricksBuilder) => {
    const settings = {
      initialization: {
        preferenceId: data.id, // El ID de preferencia generado en tu backend
        redirectMode: "self" // "self" para abrir en la misma pestaña o "modal"
      },
      callbacks: {
        onReady: () => {
          console.log("El botón de Mercado Pago está listo");
        },
        onSubmit: () => {
          // Callback opcional al hacer clic
        },
        onError: (error) => {
          console.error("Error en el Wallet Brick:", error);
        },
      },
    };

    // Crea el ladrillo (brick) dentro del div contenedor
    walletBrickController = await bricksBuilder.create(
      "wallet",
      "walletBrick_container",
      settings
    );
  };

  renderWalletBrick(bricksBuilder);
});

// Es MUY importante destruir el componente si el usuario navega fuera de la vista
onBeforeUnmount(() => {
  if (walletBrickController) {
    walletBrickController.unmount();
  }
});
</script>

<style>
</style>