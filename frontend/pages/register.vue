<template>
  <div class="max-w-md mx-auto mt-20">
    <h1 class="text-2xl font-semibold mb-4 text-center">Sign Up</h1>
    <form @submit.prevent="signup" class="space-y-4">
      <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded" />
      <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded" />
      <button type="submit" class="w-full p-2 bg-blue-600 text-white rounded">Sign Up</button>
    </form>
    <p class="mt-4 text-center">
      <NuxtLink to="/login" class="text-blue-600">Back to login</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const auth = useAuthStore()

async function signup() {
  try {
    await auth.signUp(email.value, password.value)
    alert('Account created. Please sign in.')
    await navigateTo('/login')
  } catch (err) {
    console.error(err)
    alert('Signup failed')
  }
}
</script>
