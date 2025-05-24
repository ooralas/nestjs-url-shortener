<template>
  <div>
    <select v-model="$colorMode.preference" 
            class="border border-gray-300 dark:border-gray-600 rounded-md p-2 
                   bg-white dark:bg-gray-700 
                   text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </div>
</template>

<script setup lang="ts">
// Using $colorMode provided by @nuxtjs/color-mode
</script>
