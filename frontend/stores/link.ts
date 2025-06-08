import { defineStore } from 'pinia'

export const useLinkStore = defineStore('links', {
  state: () => ({}),
  actions: {
    async createLink(longLink: string) {
      const { apiBase } = useRuntimeConfig().public
      const auth = useAuthStore()
      const res = await $fetch<{ alias: string }>(`${apiBase}/links`, {
        method: 'POST',
        body: { longLink },
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
      })
      return `${apiBase}/${res.alias}`
    }
  }
})
