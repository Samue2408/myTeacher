import { defineStore } from 'pinia'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  showLoginModal: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: true,
    token: null,
    showLoginModal: false
  }),
  actions: {
    login(token: string) {
      this.isAuthenticated = true
      this.token = token
    },
    logout() {
      this.isAuthenticated = false
      this.token = null
    }
  }
})

