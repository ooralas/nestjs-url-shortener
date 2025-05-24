<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Placeholder for a logo or app name -->
        <NuxtLink to="/" class="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
          Link Shortener
        </NuxtLink>
        <ThemeSwitcher />
      </div>
    </header>
    <main class="container mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
    <footer class="text-center py-4 text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 transition-colors duration-300">
      © {{ new Date().getFullYear() }} Link Shortener App. All rights reserved.
    </footer>
  </div>
</template>
