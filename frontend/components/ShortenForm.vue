<template>
  <form @submit.prevent="create" class="space-y-4">
    <input v-model="url" type="url" placeholder="Long URL" class="w-full p-2 border rounded" />
    <button type="submit" class="w-full p-2 bg-green-600 text-white rounded">Shorten</button>
    <p v-if="shortUrl" class="text-center mt-4">Short URL: <a :href="shortUrl" class="text-blue-600" target="_blank">{{ shortUrl }}</a></p>
  </form>
</template>

<script setup lang="ts">
const url = ref('')
const shortUrl = ref('')
const store = useLinkStore()

async function create() {
  try {
    shortUrl.value = await store.createLink(url.value)
  } catch (err) {
    console.error(err)
    alert('Failed to shorten URL')
  }
}
</script>
