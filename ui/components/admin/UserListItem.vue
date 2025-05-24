<template>
  <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 transition-colors duration-300">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      <!-- User Info Section -->
      <div class="flex-grow mb-4 md:mb-0 md:mr-4">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ user.firstName || 'N/A' }} {{ user.lastName || 'N/A' }}
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">({{ user.email }})</span>
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {{ user.id }}</p>
        <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Current Role: 
          <span :class="['font-semibold px-2 py-0.5 rounded-full text-xs', user.role === 'ADMIN' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100']">
            {{ user.role }}
          </span>
        </p>
        <p v-if="user.createdAt" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Created: {{ new Date(user.createdAt).toLocaleDateString() }}
        </p>
      </div>

      <!-- Actions Section -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
        <div class="relative w-full sm:w-auto">
          <label :for="'role-' + user.id" class="sr-only">Change Role</label>
          <select :id="'role-' + user.id" v-model="selectedRole" 
                  :disabled="adminUsersStore.isLoading"
                  class="block w-full appearance-none px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                         focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 
                         sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-150">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <button @click="handleUpdateRole" 
                :disabled="adminUsersStore.isLoading || user.role === selectedRole"
                class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                       rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                       dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150">
          Update Role
        </button>
        <button @click="handleDeleteUser" 
                :disabled="adminUsersStore.isLoading"
                class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 
                       rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                       dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150">
          Delete User
        </button>
      </div>
    </div>
    <p v-if="updateError" class="mt-3 text-sm text-red-500 dark:text-red-400 text-right">{{ updateError }}</p>
    <p v-if="updateSuccessMessage" class="mt-3 text-sm text-green-500 dark:text-green-400 text-right">{{ updateSuccessMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAdminUsersStore, type AdminManagedUser } from '~/stores/adminUsers';

const props = defineProps<{
  user: AdminManagedUser;
}>();

const adminUsersStore = useAdminUsersStore();
const selectedRole = ref<'USER' | 'ADMIN'>(props.user.role);
const updateError = ref<string | null>(null);
const updateSuccessMessage = ref<string | null>(null);


async function handleUpdateRole() {
  if (selectedRole.value === props.user.role) {
    updateError.value = "This user already has that role.";
    updateSuccessMessage.value = null;
    setTimeout(() => updateError.value = null, 3000);
    return;
  }
  updateError.value = null;
  updateSuccessMessage.value = null;

  if (!confirm(`Are you sure you want to change ${props.user.email}'s role to ${selectedRole.value}?`)) {
    return;
  }
  try {
    await adminUsersStore.updateUserRole(props.user.id, selectedRole.value);
    updateSuccessMessage.value = "User role updated successfully.";
    // The user object in the list will reactively update due to store changes.
    // props.user.role will update if the parent component's list updates,
    // or selectedRole can be reset if needed: selectedRole.value = adminUsersStore.users.find(u => u.id === props.user.id)?.role || props.user.role;
    setTimeout(() => updateSuccessMessage.value = null, 3000);
  } catch (e: any) {
    updateError.value = e.message || 'Failed to update role.';
    setTimeout(() => updateError.value = null, 3000);
    // Revert optimistic UI update if necessary, though store should handle source of truth
    // selectedRole.value = props.user.role; 
  }
}

async function handleDeleteUser() {
  updateError.value = null;
  updateSuccessMessage.value = null;
  if (!confirm(`Are you sure you want to PERMANENTLY delete user ${props.user.email}? This action cannot be undone.`)) {
    return;
  }
  try {
    await adminUsersStore.deleteUser(props.user.id);
    updateSuccessMessage.value = "User deleted successfully.";
    // The user will be removed from the list reactively.
    setTimeout(() => updateSuccessMessage.value = null, 3000);
  } catch (e: any) {
    updateError.value = e.message || 'Failed to delete user.';
    setTimeout(() => updateError.value = null, 3000);
  }
}
</script>

<style scoped>
/* Additional custom styles if needed, e.g. for select arrow */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
