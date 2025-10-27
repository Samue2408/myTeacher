import { defineStore } from 'pinia'

interface User {
    id: number;
    name: string;
    email: string;
    age?: number; 
    image?: string
}


export const useUser = defineStore('user', {
  state: (): User => ({
    id: 1,
    name: "Mauricio",
    email: "mauro@gmail.com",
    image: "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm90byUyMGRlJTIwcGVyZmlsfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000"
  }),
  actions: {
    getUser() {
    
    },
    logout() {
      this.isAuthenticated = false
      this.token = null
    }
  }
})

