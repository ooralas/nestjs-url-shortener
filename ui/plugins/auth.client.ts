import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Ensure this plugin runs only on the client side,
  // although Pinia and localStorage access should be client-side safe already.
  if (process.server) {
    return;
  }

  console.log('Auth plugin: Initializing auth state...');
  const authStore = useAuthStore(nuxtApp.$pinia); // Pass $pinia if needed, or it might be auto-injected

  try {
    // Attempt to initialize authentication state from localStorage
    // This typically involves checking for a stored token and user data
    authStore.initializeAuth();
    console.log('Auth plugin: Auth state initialized. User:', authStore.user);
  } catch (error) {
    console.error('Auth plugin: Error initializing auth state:', error);
  }
});
