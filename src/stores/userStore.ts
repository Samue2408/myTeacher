import { defineStore } from 'pinia'
import { UsersService } from '@/api/user.service';

interface User {
  _id: string
  name: string,
  email: string,
  role: string,
  phone?: string,
  balance?: number,
  location?: Object,
  reputation?: Object,
  validatedTeacher?: boolean
  image?: string
}


export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as Partial<User>,
    allUsers: [] as User[]
  }),

  getters: {
    isTeacher: (state) => state.currentUser?.role === "teacher",
    userId: (state) => state.currentUser?._id,
  },

  actions: {
    async fetchUser(id: string) {
      this.currentUser = await UsersService.getById(id);
    },

    async fetchAllUsers() {
      this.allUsers = await UsersService.getAll();
    },

    async updateCurrentUser(payload: Partial<User>) {
      if (!this.currentUser?._id) return;

      const updatedUser = await UsersService.update(this.currentUser._id, payload);
      this.currentUser = { ...this.currentUser, ...updatedUser };
    },

    clearUser() {
      this.currentUser = null;
      this.allUsers = [];
    },
  }
})

