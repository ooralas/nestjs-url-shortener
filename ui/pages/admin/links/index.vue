<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Admin: All System Links</h1>
      <!-- Placeholder for future actions like filtering or bulk operations -->
    </div>

    <div v-if="adminLinksStore.isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      <p class="ml-4 text-lg text-gray-600 dark:text-gray-400">Loading all system links...</p>
    </div>

    <div v-else-if="adminLinksStore.error" class="text-center py-10 bg-red-50 dark:bg-red-900_ p-6 rounded-lg shadow-md">
      <svg class="mx-auto h-12 w-12 text-red-400 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-red-800 dark:text-red-200">Failed to Load Links</h3>
      <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ adminLinksStore.error }}</p>
      <button @click="adminLinksStore.fetchAllLinks()" 
              class="mt-6 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-900">
        Retry Loading
      </button>
    </div>
    
    <div v-else-if="!isAdmin" class="text-center py-10 bg-yellow-50 dark:bg-yellow-900_ p-6 rounded-lg shadow-md">
      <svg class="mx-auto h-12 w-12 text-yellow-400 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <h3 class="mt-2 text-lg font-medium text-yellow-800 dark:text-yellow-200">Authorization Denied</h3>
      <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">You are not authorized to view this page.</p>
      <NuxtLink to="/dashboard" class="mt-6 inline-block px-5 py-2.5 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-yellow-900">
          Go to Dashboard
      </NuxtLink>
    </div>

    <div v-else-if="adminLinksStore.allLinks.length === 0" class="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
       <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      <h3 class="mt-2 text-xl font-medium text-gray-900 dark:text-white">No Links in System</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        There are currently no links created by any user in the system.
      </p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors duration-300">
       <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="link in adminLinksStore.allLinks" :key="link.id">
          <AdminLinkListItem :link="link" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAdminLinksStore } from '~/stores/adminLinks';
import { useAuthStore } from '~/stores/auth'; 
import AdminLinkListItem from '~/components/admin/AdminLinkListItem.vue'; 

definePageMeta({
  layout: 'authenticated',
  meta: {
    requiresAuth: true,
    requiresAdmin: true,
  },
});

const adminLinksStore = useAdminLinksStore();
const authStore = useAuthStore();

const isAdmin = computed(() => authStore.user?.role === 'ADMIN');

onMounted(async () => {
  // Middleware should handle redirection. This fetch is conditional for safety.
  if (isAdmin.value && (adminLinksStore.allLinks.length === 0 || adminLinksStore.error )) { 
    await adminLinksStore.fetchAllLinks();
  } else if(!isAdmin.value) {
    adminLinksStore.error = "You are not authorized to manage links.";
    console.warn("Admin All Links Page: User is not an admin. Not fetching links.");
  }
});
</script>

<style scoped>
/* Scoped styles if needed */
</style>
