<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-300">
      <div class="bg-indigo-600 dark:bg-indigo-700 p-5 sm:p-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-white text-center">Edit Link</h1>
      </div>

      <div v-if="isLoadingLink" class="p-8 text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-100 dark:border-indigo-400 mx-auto"></div>
        <p class="mt-3 text-gray-600 dark:text-gray-400">Loading link details...</p>
      </div>

      <div v-else-if="!currentLink" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-red-700 dark:text-red-300">Link Not Found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The link you are trying to edit could not be found. It might have been deleted.
        </p>
        <NuxtLink to="/dashboard/links" 
                  class="mt-6 inline-block px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          Back to My Links
        </NuxtLink>
      </div>

      <form v-else @submit.prevent="handleUpdateLink" class="p-5 sm:p-7 space-y-6">
        <div>
          <label for="longLink" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Original Long URL <span class="text-red-500">*</span>
          </label>
          <input type="url" id="longLink" v-model="longLink" required
                 :disabled="linkStore.isLoading"
                 class="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 transition-colors duration-150"
                 placeholder="https://example.com/my-very-long-and-interesting-url">
          <p v-if="formErrors.longLink" class="mt-2 text-xs text-red-500 dark:text-red-400">{{ formErrors.longLink }}</p>
        </div>

        <div>
          <label for="alias" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Alias <span class="text-red-500">*</span>
          </label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 transition-colors duration-150">
              {{ displayHost }}/
            </span>
            <input type="text" id="alias" v-model="alias" required
                   :disabled="linkStore.isLoading"
                   class="appearance-none flex-1 min-w-0 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-none rounded-r-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 transition-colors duration-150"
                   placeholder="my-cool-link">
          </div>
           <p v-if="formErrors.alias" class="mt-2 text-xs text-red-500 dark:text-red-400">{{ formErrors.alias }}</p>
        </div>

        <!-- Error Message Display from Store -->
        <div v-if="linkStore.error && !formErrors.longLink && !formErrors.alias" class="rounded-md bg-red-50 dark:bg-red-900 p-4 transition-all duration-150">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 7a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error: {{ linkStore.error }}</h3>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-end space-x-4 pt-2">
          <NuxtLink to="/dashboard/links"
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-colors duration-150">
            Cancel
          </NuxtLink>
          <button type="submit" :disabled="linkStore.isLoading || !isFormValid"
                  class="group relative inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3" v-if="linkStore.isLoading">
              <svg class="h-5 w-5 text-indigo-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ linkStore.isLoading ? 'Updating...' : 'Update Link' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useLinkStore, type Link } from '~/stores/links'; // Import Link type
import { useRoute, useRouter } from '#vue-router';

definePageMeta({
  layout: 'authenticated',
  meta: {
    requiresAuth: true,
  }
});

const linkStore = useLinkStore();
const route = useRoute();
const router = useRouter();

const linkId = route.params.id as string;
// Use the Link type from the store for currentLink
const currentLink = ref<Link | null | undefined>(undefined); 
const isLoadingLink = ref(true);

const longLink = ref('');
const alias = ref('');
const formErrors = ref<{ longLink?: string; alias?: string }>({});


const displayHost = computed(() => {
  if (process.client) {
    return window.location.host;
  }
  const apiBase = useRuntimeConfig().public.apiBase || 'yourdomain.com';
   try {
    return new URL(apiBase).host;
  } catch {
    return apiBase.replace(/^https?:\/\//, '').split('/')[0];
  }
});

const isFormValid = computed(() => {
  return !formErrors.value.longLink && !formErrors.value.alias && longLink.value.length > 0 && alias.value.length > 0;
});

// Client-side validation watchers
watch(longLink, (value) => {
  if (linkStore.error) linkStore.error = null;
  if (!value) {
    formErrors.value.longLink = 'Long URL is required.';
  } else {
    try {
      new URL(value);
      formErrors.value.longLink = undefined;
    } catch (_) {
      formErrors.value.longLink = 'Please enter a valid URL.';
    }
  }
});

watch(alias, (value) => {
  if (linkStore.error) linkStore.error = null;
  if (!value) {
    formErrors.value.alias = 'Alias is required.';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    formErrors.value.alias = 'Alias can only contain letters, numbers, underscores, and hyphens.';
  } else if (value.length > 50) {
     formErrors.value.alias = 'Alias cannot exceed 50 characters.';
  } else {
    formErrors.value.alias = undefined;
  }
});

onMounted(async () => {
  isLoadingLink.value = true;
  linkStore.error = null; // Clear previous errors
  
  let foundLink = linkStore.links.find(link => link.id === linkId);

  if (!foundLink) {
    // Attempt to fetch all links if not found (could be direct navigation)
    // In a more optimized app, this would be an action to fetch a single link by ID.
    await linkStore.fetchLinks();
    if(linkStore.error) { // If fetching all links failed
        currentLink.value = null; // Indicate link not found due to error
        isLoadingLink.value = false;
        console.error(`Failed to fetch links while trying to find link ID ${linkId}. Error: ${linkStore.error}`);
        return;
    }
    foundLink = linkStore.links.find(link => link.id === linkId);
  }

  if (foundLink) {
    currentLink.value = { ...foundLink }; // Clone to avoid direct mutation if needed, though form fields are separate
    longLink.value = foundLink.longLink;
    alias.value = foundLink.alias;
  } else {
    currentLink.value = null; // Link truly not found
    console.error(`Link with ID ${linkId} not found after attempting to fetch.`);
  }
  isLoadingLink.value = false;
});

// No need for watch(currentLink, ...) if onMounted populates form refs directly.

onUnmounted(() => {
  linkStore.error = null; // Clear store error when leaving the page
});

async function handleUpdateLink() {
   if (!longLink.value) formErrors.value.longLink = "Long URL is required.";
   if (!alias.value) formErrors.value.alias = "Alias is required.";
  
  if (!isFormValid.value) {
    return; 
  }

  try {
    await linkStore.updateLink(linkId, {
      longLink: longLink.value,
      alias: alias.value,
    });
    if (!linkStore.error) {
        router.push('/dashboard/links');
    }
  } catch (e: any) {
    // Error is set in the store by the updateLink action
    console.error('Edit Link Page: Failed to update link -', e.message);
  }
}
</script>

<style scoped>
/* Add any specific scoped styles here */
</style>
