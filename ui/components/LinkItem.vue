<template>
  <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 transition-colors duration-300">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
      <h3 class="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 break-all">{{ link.alias }}</h3>
      <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
        <span class="font-medium">Views:</span> {{ link.views ?? 0 }}
      </div>
    </div>

    <div class="mb-4 space-y-2">
      <p class="text-sm text-gray-600 dark:text-gray-300 break-all">
        <span class="font-medium">Original:</span>
        <a :href="link.longLink" target="_blank" rel="noopener noreferrer"
           class="text-indigo-500 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-500 hover:underline ml-1">
          {{ link.longLink }}
        </a>
      </p>
      <div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Link:</p>
        <div class="flex items-stretch">
          <input type="text" :value="fullShortLink" readonly
                 class="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md 
                        bg-gray-50 dark:bg-gray-700 
                        text-gray-800 dark:text-gray-200 
                        focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400
                        transition-colors duration-300" />
          <button @click="copyToClipboard"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                    copyStatus === 'Copied!' ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400' : 
                    copyStatus === 'Failed' ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400' :
                    'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 dark:focus:ring-indigo-400',
                    'transition-all duration-150 ease-in-out'
                  ]">
            {{ copyStatus }}
          </button>
        </div>
      </div>
    </div>

    <div class="text-xs text-gray-400 dark:text-gray-500 mb-4">
      <p v-if="link.createdAt">Created: {{ new Date(link.createdAt).toLocaleString() }}</p>
      <p v-if="link.updatedAt">Updated: {{ new Date(link.updatedAt).toLocaleString() }}</p>
    </div>

    <div class="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-3">
      <NuxtLink :to="`/dashboard/links/edit/${link.id}`"
                class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-center text-indigo-600 dark:text-indigo-300 border border-indigo-500 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150">
        Edit
      </NuxtLink>
      <button @click="handleDelete" :disabled="isDeleting || linkStore.isLoading"
              class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-center text-red-600 dark:text-red-300 border border-red-500 dark:border-red-400 rounded-md hover:bg-red-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150">
        {{ isDeleting ? 'Deleting...' : 'Delete' }}
      </button>
    </div>
    <p v-if="deleteError" class="mt-3 text-sm text-red-500 dark:text-red-400 text-center sm:text-right">{{ deleteError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLinkStore, type Link } from '~/stores/links'; // Import Link type from store

const props = defineProps<{
  link: Link; // Use Link type from store
}>();

const linkStore = useLinkStore();
const isDeleting = ref(false);
const deleteError = ref<string | null>(null);
const copyStatus = ref('Copy');

// Construct the full short link. Assumes link.shortLink from the store is the full URL.
// If not, it constructs it based on the current window's origin and the alias.
const fullShortLink = computed(() => {
  if (props.link.shortLink) {
    // Ensure it has a protocol for external linking, if not present
    if (props.link.shortLink.startsWith('http://') || props.link.shortLink.startsWith('https://')) {
      return props.link.shortLink;
    }
    // If it's just an alias or relative path, prepend protocol and host
    return process.client 
      ? `${window.location.protocol}//${props.link.shortLink}` 
      : `https://${props.link.shortLink}`; // Fallback for SSR, may need adjustment
  }
  // Fallback if shortLink is not provided at all
  return process.client 
    ? `${window.location.origin}/${props.link.alias}` 
    : `yourdomain.com/${props.link.alias}`; // SSR Fallback, adjust as needed
});


async function handleDelete() {
  if (!confirm(`Are you sure you want to delete the link for alias "${props.link.alias}"?`)) {
    return;
  }
  isDeleting.value = true;
  deleteError.value = null;
  try {
    await linkStore.deleteLink(props.link.id);
    // Link removal from UI is handled by store's reactivity
  } catch (e: any) {
    deleteError.value = e.message || 'Failed to delete link.';
  } finally {
    isDeleting.value = false;
  }
}

async function copyToClipboard() {
  if (!navigator.clipboard) {
    copyStatus.value = 'Failed'; // Clipboard API not available
    console.error('Clipboard API not available.');
    return;
  }
  try {
    await navigator.clipboard.writeText(fullShortLink.value);
    copyStatus.value = 'Copied!';
  } catch (err) {
    console.error('Failed to copy text: ', err);
    copyStatus.value = 'Failed';
  } finally {
    setTimeout(() => { copyStatus.value = 'Copy'; }, 2000);
  }
}
</script>

<style scoped>
/* Scoped styles can be added here if needed, e.g., for specific transition effects */
</style>
