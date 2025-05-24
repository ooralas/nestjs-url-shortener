<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl" @submit.prevent="handleSignup">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="firstName" class="sr-only">First Name</label>
            <input id="firstName" name="firstName" type="text" autocomplete="given-name" required v-model="firstName"
                   :disabled="authStore.isLoading"
                   class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors duration-150 disabled:opacity-70"
                   placeholder="First Name">
          </div>
          <div>
            <label for="lastName" class="sr-only">Last Name</label>
            <input id="lastName" name="lastName" type="text" autocomplete="family-name" required v-model="lastName"
                   :disabled="authStore.isLoading"
                   class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors duration-150 disabled:opacity-70"
                   placeholder="Last Name">
          </div>
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
                   :disabled="authStore.isLoading"
                   class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors duration-150 disabled:opacity-70"
                   placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="new-password" required v-model="password"
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
        
        <!-- Success Message Display -->
        <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900 p-4 transition-all duration-150">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11.414L9.293 7.293a1 1 0 00-1.414 1.414L9.586 10l-1.707 1.707a1 1 0 101.414 1.414L11 11.414l1.707 1.707a1 1 0 101.414-1.414L12.414 10l1.707-1.707a1 1 0 10-1.414-1.414L11 8.586z" clip-rule="evenodd" />
                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">{{ successMessage }}</h3>
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
            {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>
      </form>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <NuxtLink to="/auth/signin" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline">
          Sign In
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from '#vue-router'; // Import useRouter

definePageMeta({
  layout: 'default',
});

const authStore = useAuthStore();
const router = useRouter(); // Initialize router

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
// const isLoading = ref(false); // Replaced by authStore.isLoading
// const error = ref<string | null>(null); // Replaced by authStore.error
const successMessage = ref<string | null>(null);

// Clear messages when inputs change or on unmount
watch([firstName, lastName, email, password], () => {
  if(authStore.error) authStore.error = null;
  if(successMessage.value) successMessage.value = null;
});
onUnmounted(() => {
  authStore.error = null;
  successMessage.value = null;
});

async function handleSignup() {
  // Error and success states are managed by the store or local successMessage ref
  // isLoading state is managed by the store
  successMessage.value = null; // Clear previous success message
  // authStore.error = null; // Clear previous error from store if not handled by input change

  try {
    await authStore.signup({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });
    successMessage.value = 'Signup successful! You can now sign in.';
    // Clear form fields
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    password.value = '';
    // Optionally redirect or inform user to check email etc.
    // For now, just show success and let them click "Sign In"
    // setTimeout(() => router.push('/auth/signin'), 3000); // Optional redirect
  } catch (e: any) {
    // Error is already set in the authStore by the signup action
    // No need to set local error.value
    console.error("Signup component caught error:", e.message);
  }
  // isLoading is handled by the store
}
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
