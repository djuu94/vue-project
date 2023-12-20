import { defineStore, createPinia } from 'pinia';

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    isLoggedIn: false,
    userId: null as number | null | string, 
    
  }),
  actions: {
    login() {
      this.isLoggedIn = true; 
    },
    logout() {
      this.isLoggedIn = false; 
      this.userId = null; 
    },
    setUserId(userId: string) { 
      this.userId = Number(userId); // Convert the userId to a number
    },
  },
});

export const pinia = createPinia(); 