import { defineStore } from 'pinia'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  showLoginModal: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
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

// export const useAuthStore = defineStore('auth', {
//   state: (): AuthState => ({
//     isAuthenticated: !!localStorage.getItem('token'),
//     token: localStorage.getItem('token') || null
//     showLoginModal: false
//   }),

//   actions: {
//     login(token: string) {
//       this.isAuthenticated = true
//       this.token = token
//       localStorage.setItem('token', token)
//     },

//     logout() {
//       this.isAuthenticated = false
//       this.token = null
//       localStorage.removeItem('token')
//     }
//   }
// })
