<template>
  <RouterView></RouterView>
  <LoginRequiredModal v-if="auth.showLoginModal" @close="auth.showLoginModal = false" />
  <SessionClosed v-if="auth.showSessionClosedModal" @close="auth.showSessionClosedModal = false" />
</template>

<script setup>
import { useAuthStore } from './stores/authStore'
import LoginRequiredModal from './auth/components/login/loguinRequireModal.vue'
import SessionClosed from './auth/components/login/sessionClosed.vue'

const auth = useAuthStore()


</script>

<style>
body {
  margin: 0;
  padding: 0;
}



</style>
