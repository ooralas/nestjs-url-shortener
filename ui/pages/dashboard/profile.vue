<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-300">
      <div class="bg-indigo-600 dark:bg-indigo-700 p-5 sm:p-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-white text-center">
          User Profile
        </h1>
      </div>
      
      <div v-if="user" class="p-5 sm:p-7 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 items-center">
          <label class="sm:col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300">First Name:</label>
          <p class="sm:col-span-2 mt-0.5 sm:mt-0 text-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md shadow-sm">
            {{ user.firstName || 'Not Provided' }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 items-center">
          <label class="sm:col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300">Last Name:</label>
          <p class="sm:col-span-2 mt-0.5 sm:mt-0 text-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md shadow-sm">
            {{ user.lastName || 'Not Provided' }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 items-center">
          <label class="sm:col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300">Email Address:</label>
          <p class="sm:col-span-2 mt-0.5 sm:mt-0 text-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md shadow-sm break-all">
            {{ user.email }}
          </p>
        </div>
         <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 items-center">
          <label class="sm:col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300">User Role:</label>
          <p class="sm:col-span-2 mt-0.5 sm:mt-0 text-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md shadow-sm">
            <span :class="['font-semibold px-2.5 py-1 rounded-full text-xs uppercase tracking-wider', user.role === 'ADMIN' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100']">
              {{ user.role || 'USER' }}
            </span>
          </p>
        </div>
        <div class="border-t dark:border-gray-700 pt-6 mt-6">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">User ID:</label>
          <p class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md shadow-sm break-all">
            {{ user.id }}
          </p>
        </div>
        <!-- Placeholder for future actions like "Edit Profile" or "Change Password" -->
        <!-- <div class="mt-8 text-center">
          <button class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            Edit Profile (Coming Soon)
          </button>
        </div> -->
      </div>
      <div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">
        <p>Loading user information or user not found...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'authenticated',
  meta: {
    requiresAuth: true,
  },
});

const authStore = useAuthStore();

// Access user data from the store
const user = computed(() => authStore.user);

// User data is expected to be loaded by the auth plugin (auth.client.ts)
// and available when this page is rendered. If it could be null due to an error
// during plugin init, the v-else block will show.
</script>

<style scoped>
/* Scoped styles for the profile page */
</style>
