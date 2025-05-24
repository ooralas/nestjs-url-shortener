<template>
  <NuxtLink 
    :to="to" 
    :class="[
      'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150',
      isActive 
        ? (admin ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100' : 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300')
        : (admin ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white')
    ]"
    :exact-active-class="admin ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100' : 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300'"
    @click="handleClick"
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

const emit = defineEmits(['click']);

const route = useRoute();

const isActive = computed(() => {
  return route.path === props.to;
});

function handleClick(event: MouseEvent) {
  emit('click', event); // Emit click event for the parent to handle (e.g., closing mobile menu)
}
</script>

<style scoped>
/* Custom active styles can be fine-tuned here if needed */
</style>
