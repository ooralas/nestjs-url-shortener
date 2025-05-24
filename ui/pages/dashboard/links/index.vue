<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">My Links</h1>
      <NuxtLink to="/dashboard/links/create"
                class="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out transform hover:scale-105">
        <svg class="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Create New Link
      </NuxtLink>
    </div>

    <div v-if="linkStore.isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      <p class="ml-4 text-lg text-gray-600 dark:text-gray-400">Loading your links...</p>
    </div>

    <div v-else-if="linkStore.error" class="text-center py-10 bg-red-50 dark:bg-red-900_ p-6 rounded-lg shadow-md">
      <svg class="mx-auto h-12 w-12 text-red-400 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-red-800 dark:text-red-200">Oops! Something went wrong.</h3>
      <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ linkStore.error }}</p>
      <button @click="linkStore.fetchLinks()" 
              class="mt-6 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-900">
        Try Again
      </button>
    </div>

    <div v-else-if="linkStore.links.length === 0" class="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      <h3 class="mt-2 text-xl font-medium text-gray-900 dark:text-white">No links yet!</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        You haven't created any shortened links. Get started by creating your first one.
      </p>
      <div class="mt-6">
         <NuxtLink to="/dashboard/links/create"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
           <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
           </svg>
           Create your first link
        </NuxtLink>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <LinkItem v-for="link in linkStore.links" :key="link.id" :link="link" 
                class="transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useLinkStore } from '~/stores/links';
import LinkItem from '~/components/LinkItem.vue'; 

definePageMeta({
  layout: 'authenticated',
  meta: {
    requiresAuth: true,
  }
});

const linkStore = useLinkStore();

onMounted(async () => {
  // Fetch links only if they haven't been loaded yet or if an error previously occurred.
  if (linkStore.links.length === 0 || linkStore.error) {
    await linkStore.fetchLinks();
  }
});
</script>

<style scoped>
/* Additional styles for subtle animations or specific adjustments */
</style>
