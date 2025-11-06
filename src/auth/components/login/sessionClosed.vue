<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
        <span class="input-icon material-icons-outlined" >
            hourglass_full
        </span>
        <h2>¡Ups! Tu sesión ha expirado</h2>
        <p>Por seguridad te hemos desconectado. Inicia sesión otra vez para obtener acceso.</p>
        

        <div class="modal-actions">
            <button class="cancel-btn" @click="closeModal">Cerrar</button>
            <button class="login-btn" @click="goToLogin">Iniciar sesión</button>
        </div>
        
        <sub>No tienes una cuenta? <a @click="goToSignIn">Registrate aquí</a></sub>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const emit = defineEmits(['close']) // evento que lanza el hijo para que lo escuche el padre
const router = useRouter()

// Cerrar el modal
const closeModal = () => {
  emit('close')
}

// Ir al login
const goToLogin = () => {
  emit('close')
  router.push('/user')
}

const goToSignIn = () => {
    emit('close')
    router.push('/user')
}

</script>

<style scoped>
/* Fondo oscuro */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fade-overlay 0.3s ease;
}

@keyframes fade-overlay {
    0% {
        opacity: .5;
    }
    100% {
        opacity: 100%;
    }
}

/* Caja del modal */
.modal-content {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(245, 247, 252, 1) 38%
    );
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  text-align: center;
  animation: scale-modal .4s ease;
}

@keyframes scale-modal {
    0% {
        scale: .8;
    }
    80% {
        scale: 1.1;
    }
    100% {
        scale: 1;
    }
}

.modal-content .input-icon {
  font-size: 60px;
  margin: auto;
  color: var(--color-primary);;
}

.modal-content h2 {
    margin-bottom: 17px;
    font-size: 24px;
}

.modal-content p {
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 28px;
}

/* Botones */
.modal-actions {
  margin-top: 1.5rem;
  margin-bottom: .3rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.login-btn {
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.cancel-btn {
    background-color: var(--color-border);
    font-size: 14px;
}

sub {
    font-size: 11px;
    color: var(--color-muted);
}

sub a {
    font-weight: 600;
    color: var(--color-primary);
    text-decoration: underline;
}

sub .icon {
    margin: 0;
    font-size: 12px;
}



</style>
