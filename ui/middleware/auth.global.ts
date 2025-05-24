import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ensure Pinia store is initialized before running middleware logic
  // This typically happens in a plugin or app.vue's onMounted
  const authStore = useAuthStore();

  // Initialize auth state if it hasn't been yet (e.g., on direct navigation or page refresh)
  // This is a safeguard; primary initialization should be in a plugin.
  if (process.client && !authStore.token && localStorage.getItem('authToken')) {
    console.log('Middleware: Initializing auth from localStorage as it was not done yet.');
    authStore.initializeAuth();
  }

  const requiresAuth = to.meta.requiresAuth as boolean;
  const requiresAdmin = to.meta.requiresAdmin as boolean;
  const isAuthenticated = authStore.isAuthenticated;
  // Assuming user object has a 'role' property, e.g., user.role === 'ADMIN'
  const isAdmin = authStore.user?.role === 'ADMIN';

  console.log(`Navigating to: ${to.path}, Requires Auth: ${requiresAuth}, Requires Admin: ${requiresAdmin}, Is Authenticated: ${isAuthenticated}, Is Admin: ${isAdmin}`);

  // Handle unauthenticated users trying to access protected routes
  if (requiresAuth && !isAuthenticated) {
    console.log('Middleware: User not authenticated. Redirecting to /auth/signin.');
    return navigateTo('/auth/signin');
  }

  // Handle authenticated users trying to access auth pages (signin/signup)
  if (isAuthenticated && (to.path === '/auth/signin' || to.path === '/auth/signup')) {
    console.log('Middleware: User authenticated, trying to access auth pages. Redirecting to /dashboard.');
    return navigateTo('/dashboard');
  }

  // Handle admin routes
  if (requiresAdmin) {
    if (!isAuthenticated) { // Should be caught by requiresAuth first, but good for safety
      console.log('Middleware: Admin route, user not authenticated. Redirecting to /auth/signin.');
      return navigateTo('/auth/signin');
    }
    if (!isAdmin) {
      console.log('Middleware: Admin route, user is not admin. Redirecting to /dashboard (or a "not authorized" page).');
      // It's often better to redirect to a generic page like dashboard or a specific "access denied" page
      // than to show the signin page again.
      return navigateTo('/dashboard'); // Or create a specific /unauthorized page
    }
  }

  // Allow navigation otherwise
  console.log('Middleware: Navigation allowed.');
});
