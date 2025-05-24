<template>
  <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 mb-4 transition-colors duration-300">
    <div class="flex flex-col md:flex-row justify-between items-start">
      <!-- Link & User Info -->
      <div class="flex-grow mb-4 md:mb-0 md:mr-4 overflow-hidden">
        <h3 class="text-xl font-semibold text-indigo-600 dark:text-indigo-400 break-words">{{ link.alias }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 break-words mt-1">
          <span class="font-medium">Original URL:</span>
          <a :href="link.longLink" target="_blank" rel="noopener noreferrer"
             class="text-indigo-500 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-500 hover:underline ml-1">
            {{ link.longLink }}
          </a>
        </p>
        <div class="mt-1">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Short Link:</p>
          <div class="flex items-stretch mt-0.5">
            <input type="text" :value="fullShortLink" readonly
                   class="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md 
                          bg-gray-50 dark:bg-gray-700 
                          text-gray-800 dark:text-gray-200 
                          focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400
                          text-sm transition-colors duration-300" />
            <button @click="copyToClipboard"
                    :class="[
                      'px-3 py-2 text-xs font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800',
                      copyStatus === 'Copied!' ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400' : 
                      copyStatus === 'Failed' ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400' :
                      'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 dark:focus:ring-indigo-400',
                      'transition-all duration-150 ease-in-out'
                    ]">
              {{ copyStatus }}
            </button>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
          <p v-if="link.user">
            <span class="font-medium">User:</span> {{ link.user.firstName || 'N/A' }} {{ link.user.lastName || 'N/A' }} ({{ link.user.email }})
          </p>
           <p v-else-if="link.userId">
            <span class="font-medium">User ID:</span> {{ link.userId }} 
            <span v-if="link.userEmail"> ({{ link.userEmail }})</span>
          </p>
          <p><span class="font-medium">Link ID:</span> {{ link.id }}</p>
        </div>
      </div>

      <!-- Stats and Actions -->
      <div class="flex-shrink-0 flex flex-col items-start md:items-end space-y-2 w-full md:w-auto">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          <span class="font-medium">Views:</span> {{ link.views ?? 0 }}
        </p>
        <p v-if="link.createdAt" class="text-xs text-gray-400 dark:text-gray-500">
          Created: {{ new Date(link.createdAt).toLocaleString() }}
        </p>
        <button @click="handleDelete" :disabled="isDeleting || adminLinksStore.isLoading"
                class="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 
                       rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                       dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150">
          {{ isDeleting ? 'Deleting...' : 'Delete Link' }}
        </button>
      </div>
    </div>
     <p v-if="deleteError" class="mt-3 text-sm text-red-500 dark:text-red-400 text-right">{{ deleteError }}</p>
     <p v-if="deleteSuccessMessage" class="mt-3 text-sm text-green-500 dark:text-green-400 text-right">{{ deleteSuccessMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAdminLinksStore, type AdminManagedLink } from '~/stores/adminLinks';

const props = defineProps<{
  link: AdminManagedLink;
}>();

const adminLinksStore = useAdminLinksStore();
const isDeleting = ref(false);
const deleteError = ref<string | null>(null);
const deleteSuccessMessage = ref<string | null>(null);
const copyStatus = ref('Copy');

const fullShortLink = computed(() => {
  if (props.link.shortLink) {
    if (props.link.shortLink.startsWith('http://') || props.link.shortLink.startsWith('https://')) {
      return props.link.shortLink;
    }
    return process.client 
      ? `${window.location.protocol}//${props.link.shortLink}` 
      : `https://${props.link.shortLink}`;
  }
  return process.client 
    ? `${window.location.origin}/${props.link.alias}` 
    : `yourdomain.com/${props.link.alias}`;
});

async function handleDelete() {
  if (!confirm(`Are you sure you want to PERMANENTLY delete the link with alias "${props.link.alias}"? This action cannot be undone.`)) {
    return;
  }
  isDeleting.value = true;
  deleteError.value = null;
  deleteSuccessMessage.value = null;
  try {
    await adminLinksStore.deleteLink(props.link.id);
    deleteSuccessMessage.value = "Link deleted successfully.";
    setTimeout(() => deleteSuccessMessage.value = null, 3000);
    // Link is removed reactively by the store
  } catch (e: any) {
    deleteError.value = e.message || 'Failed to delete link.';
    setTimeout(() => deleteError.value = null, 3000);
  } finally {
    isDeleting.value = false;
  }
}

async function copyToClipboard() {
  if (!navigator.clipboard) {
    copyStatus.value = 'Failed';
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
/* Add any specific scoped styles here */
</style>
