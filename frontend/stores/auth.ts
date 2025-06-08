import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: '' }),
  actions: {
    async signIn(email: string, password: string) {
      const { apiBase } = useRuntimeConfig().public
      const res = await $fetch<{ token: string }>(`${apiBase}/auth/signin`, {
        method: 'POST',
        body: { email, password }
      })
      this.token = res.token
    },
    async signUp(email: string, password: string) {
      const { apiBase } = useRuntimeConfig().public
      await $fetch(`${apiBase}/auth/signup`, {
        method: 'POST',
        body: { email, password }
      })
    },
    signOut() {
      this.token = ''
    }
  }
})
