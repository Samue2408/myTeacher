import { defineStore } from 'pinia'
import AuthService from '@/api/auth.service'
import { LoginCredentials } from '@/types/auth'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  showLoginModal: boolean,
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: Boolean(localStorage.getItem('token')),
    token: localStorage.getItem('token'),
    showLoginModal: false,
    loading: false
  }),
  actions: {
    async login(credentials: LoginCredentials) {
      try {
        this.loading = true
        const response = await AuthService.login(credentials)
        this.token = response.token
        localStorage.setItem('token', response.token)
        this.isAuthenticated = true
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al iniciar sesión'
      } finally {
        this.loading = false
      }
    },
    logout() {
      localStorage.removeItem('token')
      this.token = null
      this.isAuthenticated = false

    }
  }
})

