<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-3">
          <NuxtLink to="/dashboard" class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            AppDashboard
          </NuxtLink>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-3">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/dashboard/links">Links</NavLink>
            <NavLink to="/dashboard/profile">Profile</NavLink>
            
            <div v-if="isAdmin" class="flex items-center space-x-3 pl-2 border-l border-gray-200 dark:border-gray-700">
              <NavLink to="/admin/users" :admin="true">Admin Users</NavLink>
              <NavLink to="/admin/links" :admin="true">Admin Links</NavLink>
            </div>
            
            <ThemeSwitcher />
            <button @click="handleLogout" 
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors duration-150">
              Logout
            </button>
          </div>
          
          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <ThemeSwitcher />
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="ml-3 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span class="sr-only">Open main menu</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink to="/dashboard" @click="closeMobileMenu">Dashboard</MobileNavLink>
          <MobileNavLink to="/dashboard/links" @click="closeMobileMenu">Links</MobileNavLink>
          <MobileNavLink to="/dashboard/profile" @click="closeMobileMenu">Profile</MobileNavLink>
          
          <div v-if="isAdmin" class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
             <MobileNavLink to="/admin/users" :admin="true" @click="closeMobileMenu">Admin Users</MobileNavLink>
             <MobileNavLink to="/admin/links" :admin="true" @click="closeMobileMenu">Admin Links</MobileNavLink>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
             <button @click="handleLogoutMobile" 
                    class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-150">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="container mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
     <footer class="text-center py-4 text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 transition-colors duration-300">
      © {{ new Date().getFullYear() }} AppDashboard. Securely managed.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from '#vue-router';
import ThemeSwitcher from '~/components/ThemeSwitcher.vue';
import NavLink from '~/components/internal/NavLink.vue'; // Create this
import MobileNavLink from '~/components/internal/MobileNavLink.vue'; // Create this

const authStore = useAuthStore();
const router = useRouter();

const isAdmin = computed(() => authStore.user?.role === 'ADMIN');
const mobileMenuOpen = ref(false);

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

async function handleLogout() {
  closeMobileMenu();
  await authStore.logout();
  router.push('/auth/signin');
}

async function handleLogoutMobile() {
  // This specifically handles logout from mobile to ensure menu closes first.
  // It's a bit redundant but makes the intent clear for mobile context.
  await handleLogout();
}
</script>
