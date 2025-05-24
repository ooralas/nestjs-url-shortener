import { defineStore } from 'pinia';
import { apiService } from '~/utils/apiService'; // Import the API service

// Define the User interface based on your backend's User entity
// Ensure it includes all properties you expect, especially 'role'.
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN'; // Define roles based on your application
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null; // For storing auth-related errors
  isLoading: boolean; // For loading states during API calls
}

// Assumed response structure for signin
interface SigninResponse {
  accessToken: string;
  user: User;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    error: null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    async signup(credentials: Record<string, any>) {
      this.isLoading = true;
      this.error = null;
      console.log('Attempting signup with:', credentials);
      try {
        // Backend endpoint is /auth/signup (POST)
        // Assuming it returns the created user or a success message.
        // Not including auth token here as it's a public route.
        const response = await apiService.post<User | { message: string }>('auth/signup', credentials, false);
        console.log('Signup successful:', response);
        // Depending on backend response, you might want to automatically sign in
        // or just show a success message. For now, just log.
        // If it returns the user, you could potentially set this.user if desired.
      } catch (e: any) {
        console.error('Signup failed:', e.message);
        this.error = e.message || 'Signup failed. Please try again.';
        throw e; // Re-throw for the component to handle
      } finally {
        this.isLoading = false;
      }
    },
    async signin(credentials: Record<string, any>) {
      this.isLoading = true;
      this.error = null;
      console.log('Attempting signin with:', credentials);
      try {
        // Backend endpoint is /auth/signin (POST)
        // Assuming it returns { accessToken: string, user: User }
        // Not including auth token here as it's a public route.
        const response = await apiService.post<SigninResponse>('auth/signin', credentials, false);

        if (response.accessToken && response.user) {
          this.token = response.accessToken;
          this.user = response.user;
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('authUser', JSON.stringify(this.user));
          }
          console.log('Signin successful. User:', this.user, 'Token:', this.token);
        } else {
          // This case should ideally be handled by the API service throwing an error
          // if the response structure is not as expected.
          throw new Error('Invalid response structure from signin API.');
        }
      } catch (e: any) {
        console.error('Signin failed:', e.message);
        this.error = e.message || 'Invalid email or password.';
        this.token = null;
        this.user = null;
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
        throw e; // Re-throw for the component to handle
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      console.log('Logging out');
      this.token = null;
      this.user = null;
      this.error = null;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
      console.log('User logged out. isAuthenticated:', this.isAuthenticated);
      // No API call for logout in this backend, it's client-side token removal.
    },
    initializeAuth() {
      this.isLoading = true; // Indicate loading while initializing
      console.log('Initializing auth state from localStorage');
      try {
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('authToken');
          const storedUser = localStorage.getItem('authUser');

          if (token && storedUser) {
            this.token = token;
            try {
              this.user = JSON.parse(storedUser) as User;
              // Basic validation of stored user object
              if (!this.user || typeof this.user.id === 'undefined' || typeof this.user.email === 'undefined') {
                  throw new Error("Invalid user data in localStorage.")
              }
            } catch (e: any) {
              console.error('Failed to parse or validate stored user:', e.message);
              this.user = null;
              this.token = null; // Also clear token if user data is corrupt
              localStorage.removeItem('authToken');
              localStorage.removeItem('authUser');
            }
            console.log('Auth state initialized. User:', this.user);
          } else {
            console.log('No auth token or user data found in localStorage.');
            this.token = null;
            this.user = null;
          }
        } else {
          console.log('localStorage is not available. Skipping auth initialization.');
        }
      } catch (e: any) {
        console.error("Error during auth initialization:", e.message);
        this.error = e.message;
        this.token = null;
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
    // Optional: Action to fetch current user details if signin only returns a token
    // async fetchCurrentUser() {
    //   if (!this.token) return; // No token, no fetch
    //   this.isLoading = true;
    //   try {
    //     // Assuming an endpoint like /auth/me or /users/me
    //     const user = await apiService.get<User>('auth/me'); // Or 'users/me'
    //     this.user = user;
    //     if (typeof localStorage !== 'undefined') {
    //       localStorage.setItem('authUser', JSON.stringify(this.user));
    //     }
    //   } catch (e:any) {
    //     console.error("Failed to fetch current user:", e.message);
    //     this.error = e.message;
    //     // Potentially logout if token is invalid
    //     // this.logout();
    //   } finally {
    //     this.isLoading = false;
    //   }
    // }
  },
});
