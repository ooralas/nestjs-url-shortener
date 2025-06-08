<template>
  <div :class="{ dark: isDark }" class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="container mx-auto p-4">
      <div class="flex justify-end">
        <button @click="toggleDark" class="p-2 rounded bg-gray-200 dark:bg-gray-700">
          {{ isDark ? 'Light' : 'Dark' }} Mode
        </button>
      </div>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const isDark = ref(false)

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  updateHtml()
})

watch(isDark, () => {
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  updateHtml()
})

function toggleDark() {
  isDark.value = !isDark.value
}

function updateHtml() {
  const html = document.documentElement
  if (isDark.value) html.classList.add('dark')
  else html.classList.remove('dark')
}
</script>
