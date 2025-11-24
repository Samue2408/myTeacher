import { defineStore } from 'pinia'
import AuthService from '@/api/auth.service'
import { LoginCredentials, TokenUser } from '@/types/auth'
import { jwtDecode } from "jwt-decode";
import { useUserStore } from './userStore';
import { useSubjectsStore } from './subjectStore';
import router from "@/router";
import { useDashboardStore } from './dashboardStore';
import { useAvailabilitiesStore } from './availabilitiesStore';

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  showLoginModal: boolean,
  showSessionClosedModal: boolean,
  loading: boolean,
  
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: Boolean(localStorage.getItem('token')),
    token: localStorage.getItem('token'),
    showLoginModal: false,
    showSessionClosedModal: false,
    loading: false    
  }),
  actions: {

    async login(credentials: LoginCredentials) {
      try {
        this.loading = true

        const response = await AuthService.login(credentials)

        this.token = response.token
        localStorage.setItem('token', response.token)

        const userStore = useUserStore()
        const decode: TokenUser = jwtDecode<TokenUser>(response.token)
        await userStore.fetchUser(decode.idUser)

        this.isAuthenticated = true

      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al iniciar sesión'
      } finally {
        this.loading = false
      }
    },

    async restoreSession() {
      if (this.token) {
        try {
          const decoded: TokenUser = jwtDecode(this.token);
          const userStore = useUserStore();
          await userStore.fetchUser(decoded.idUser);
        } catch {
          this.showSessionClosedModal = true
          this.logout();
          router.push('/user')
        }
      }
    },

    logout() {
      localStorage.removeItem('token')
      this.token = null
      this.isAuthenticated = false      

      const userStore = useUserStore();
      const subjectStore = useSubjectsStore();
      const dashboardStore = useDashboardStore();
      const availabilitiesStore = useAvailabilitiesStore();

      subjectStore.$reset();
      dashboardStore.$reset();
      userStore.clearUser();
      availabilitiesStore.$reset();

    },

  }
})

