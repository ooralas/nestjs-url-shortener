<template>
  <div class="max-w-xl mx-auto mt-20">
    <h1 class="text-3xl font-semibold mb-6 text-center">URL Shortener</h1>
    <div v-if="!auth.token" class="text-center">
      <NuxtLink to="/login" class="text-blue-600">Sign in to start</NuxtLink>
    </div>
    <div v-else>
      <ShortenForm />
      <button @click="auth.signOut" class="mt-6 underline text-sm">Sign Out</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
</script>
