<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Admin: Manage Users</h1>
      <!-- Placeholder for future actions like "Add New User" -->
    </div>

    <div v-if="adminUsersStore.isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      <p class="ml-4 text-lg text-gray-600 dark:text-gray-400">Loading user data...</p>
    </div>

    <div v-else-if="adminUsersStore.error" class="text-center py-10 bg-red-50 dark:bg-red-900_ p-6 rounded-lg shadow-md">
      <svg class="mx-auto h-12 w-12 text-red-400 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-red-800 dark:text-red-200">Failed to Load Users</h3>
      <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ adminUsersStore.error }}</p>
      <button @click="adminUsersStore.fetchUsers()" 
              class="mt-6 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-900">
        Retry Loading
      </button>
    </div>
    
    <div v-else-if="!isAdmin" class="text-center py-10 bg-yellow-50 dark:bg-yellow-900_ p-6 rounded-lg shadow-md">
       <svg class="mx-auto h-12 w-12 text-yellow-400 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <h3 class="mt-2 text-lg font-medium text-yellow-800 dark:text-yellow-200">Authorization Denied</h3>
      <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">You are not authorized to view this page. Please contact an administrator if you believe this is an error.</p>
       <NuxtLink to="/dashboard" class="mt-6 inline-block px-5 py-2.5 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-yellow-900">
          Go to Dashboard
      </NuxtLink>
    </div>

    <div v-else-if="adminUsersStore.users.length === 0" class="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.588M14.25 10.5a8.25 8.25 0 00-16.5 0M12 12.75a4.5 4.5 0 110-9 4.5 4.5 0 010 9zM1.5 19.5h12.15M6.621 16.875a10.466 10.466 0 011.732-4.042" />
      </svg>
      <h3 class="mt-2 text-xl font-medium text-gray-900 dark:text-white">No Users Found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        There are currently no other users in the system to manage.
      </p>
      <!-- Optional: Button to invite/add users could go here if functionality exists -->
    </div>

    <div v-else class="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors duration-300">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="user in adminUsersStore.users" :key="user.id">
          <AdminUserListItem :user="user" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAdminUsersStore } from '~/stores/adminUsers'; // Removed AdminManagedUser as it's used in component
import { useAuthStore } from '~/stores/auth'; 
import AdminUserListItem from '~/components/admin/UserListItem.vue'; 

definePageMeta({
  layout: 'authenticated',
  meta: {
    requiresAuth: true,
    requiresAdmin: true, 
  },
});

const adminUsersStore = useAdminUsersStore();
const authStore = useAuthStore();

const isAdmin = computed(() => authStore.user?.role === 'ADMIN');

onMounted(async () => {
  // Middleware should handle redirection. This fetch is conditional on isAdmin for safety.
  if (isAdmin.value && (adminUsersStore.users.length === 0 || adminUsersStore.error)) {
    await adminUsersStore.fetchUsers();
  } else if (!isAdmin.value) {
    // This part is mostly a fallback; middleware should prevent non-admins from reaching here.
    // Setting an error in the store can make the UI reflect the lack of authorization.
    adminUsersStore.error = "You are not authorized to manage users.";
    console.warn("Admin User List Page: User is not an admin. Not fetching users.");
  }
});
</script>

<style scoped>
/* Scoped styles if needed */
</style>
