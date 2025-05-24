<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl" @submit.prevent="handleSignin">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
                   :disabled="authStore.isLoading"
                   class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors duration-150 disabled:opacity-70"
                   placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password"
                   :disabled="authStore.isLoading"
                   class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors duration-150 disabled:opacity-70"
                   placeholder="Password">
          </div>
        </div>

        <!-- Error Message Display -->
        <div v-if="authStore.error" class="rounded-md bg-red-50 dark:bg-red-900 p-4 transition-all duration-150">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 7a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">{{ authStore.error }}</h3>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="authStore.isLoading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3" v-if="authStore.isLoading">
              <svg class="h-5 w-5 text-indigo-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ authStore.isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </div>
      </form>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <NuxtLink to="/auth/signup" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline">
          Sign Up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from '#vue-router';

definePageMeta({
  layout: 'default',
});

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

// Clear error on component mount/unmount or when email/password changes
onUnmounted(() => {
  authStore.error = null;
});
watch([email, password], () => {
    if(authStore.error) authStore.error = null;
});

async function handleSignin() {
  // Error is now cleared when inputs change or on unmount
  // authStore.error = null; // Reset error before new attempt
  try {
    await authStore.signin({
      email: email.value,
      password: password.value,
    });
    // Redirect to a protected page, e.g., /dashboard
    if (authStore.isAuthenticated) { // Check if signin was successful
        router.push('/dashboard');
    }
    // If not authenticated, the error message will be shown from the store.
  } catch (e: any) {
    // Error is already set in the store by the signin action
    // No need to set local error ref anymore
    console.error("Signin component caught error:", e.message);
  }
  // isLoading is handled by the store
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
