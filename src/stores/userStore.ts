import { defineStore } from 'pinia'
import { UsersService } from '@/api/user.service';

interface User {
  _id: string
  name: string,
  email: string,
  role: string,
  phone?: string,
  balance?: number,
  location?: {
    city: string,
    country: string,
  },
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

    async adjustBalance(userId: string, amount: number) {
      if (!Number.isFinite(amount)) throw new Error('El ajuste del saldo no es válido.');

      const user = userId === this.currentUser?._id
        ? this.currentUser
        : await UsersService.getById(userId);
      const balance = Number(user.balance || 0);
      const nextBalance = balance + amount;

      if (nextBalance < 0) throw new Error('El saldo disponible es insuficiente.');

      const updatedUser = await UsersService.update(userId, { balance: nextBalance });
      const savedBalance = Number(updatedUser?.balance ?? nextBalance);

      if (userId === this.currentUser?._id) {
        this.currentUser = { ...this.currentUser, ...updatedUser, balance: savedBalance };
      }

      return savedBalance;
    },

    clearUser() {
      this.currentUser = null;
      this.allUsers = [];
    },
  }
})

