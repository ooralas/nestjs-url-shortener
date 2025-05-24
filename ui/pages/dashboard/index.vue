<template>
  <div class="space-y-8">
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 sm:p-10 text-center transition-colors duration-300">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome to Your Dashboard, {{ authStore.user?.firstName || 'User' }}!
      </h1>
      <p class="text-md sm:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        This is your central hub to manage shortened links, track their performance, and configure your account settings.
      </p>
      <NuxtLink to="/dashboard/links"
                class="inline-block px-8 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out transform hover:scale-105">
        Manage My Links
      </NuxtLink>
    </div>

    <!-- Quick Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-colors duration-300">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h2>
        <div v-if="linkStore.isLoading" class="text-center text-gray-500 dark:text-gray-400">
          Loading stats...
        </div>
        <div v-else class="space-y-3">
          <p class="text-lg text-gray-700 dark:text-gray-300">
            <span class="font-medium">Total Links Created:</span> 
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">{{ linkStore.links.length }}</span>
          </p>
          <p class="text-lg text-gray-700 dark:text-gray-300">
            <span class="font-medium">Total Views (All Links):</span> 
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">{{ totalViews }}</span>
          </p>
          <!-- More stats can be added here, e.g., most popular link -->
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-colors duration-300">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
        <p class="text-gray-600 dark:text-gray-400 italic">
          No recent activity to display. (Feature coming soon!)
        </p>
        <!-- Activity feed can be added here in the future -->
      </div>
    </div>

    <!-- Call to Action / Tips -->
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-8 transition-colors duration-300">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Pro Tip!</h2>
      <p class="text-gray-700 dark:text-gray-300">
        Use custom aliases for your links to make them more memorable. You can edit your links anytime to change their destination or alias.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLinkStore } from '~/stores/links';
import { useAuthStore } from '~/stores/auth';
import { onMounted, computed } from 'vue';

definePageMeta({
  layout: 'authenticated',
  meta: {
    requiresAuth: true,
  }
});

const linkStore = useLinkStore();
const authStore = useAuthStore();

// Fetch links on mounted to display stats, if not already loaded
onMounted(async () => {
  if (linkStore.links.length === 0 && !linkStore.isLoading) { 
    await linkStore.fetchLinks();
  }
});

const totalViews = computed(() => {
  return linkStore.links.reduce((sum, link) => sum + (link.views || 0), 0);
});
</script>

<style scoped>
/* Scoped styles for the dashboard page, if any specific ones are needed */
</style>
