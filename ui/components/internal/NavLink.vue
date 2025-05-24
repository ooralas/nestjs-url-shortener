<template>
  <NuxtLink 
    :to="to" 
    :class="[
      'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
      isActive 
        ? (admin ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100' : 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200')
        : (admin ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white')
    ]"
    :exact-active-class="admin ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100' : 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200'"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#vue-router';

const props = defineProps<{
  to: string;
  admin?: boolean;
}>();

const route = useRoute();

// For NuxtLink, active class is handled automatically by default via `router-link-active` and `router-link-exact-active`.
// However, NuxtLink's default active class might not be specific enough if you have nested routes.
// This computed property provides a more robust way to check active state, especially for partial matches (e.g. /dashboard should be active for /dashboard/links)
// For this component, we'll rely on NuxtLink's `exact-active-class` for exact matches and general hover/styling for inactive.
// The isActive computed prop can be used if more complex logic is needed than exact match.
const isActive = computed(() => {
  // For admin links, we might want them to be active only on exact match.
  // For others like /dashboard, it might be active if any child route is active.
  // Using route.path for exact matching for simplicity here.
  return route.path === props.to;
});
</script>

<style scoped>
/* Custom active styles can be fine-tuned here if needed, but Tailwind classes are preferred. */
</style>
