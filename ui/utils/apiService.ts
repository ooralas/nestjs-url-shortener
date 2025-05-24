import { ofetch } from 'ofetch';
import { useAuthStore } from '~/stores/auth'; // Assuming your auth store is here

// Define a type for API error structure if you have a consistent one
interface ApiError {
  message: string;
  statusCode?: number;
  // Add other potential error fields
}

// Helper to get the API base URL from runtime config
function getApiBaseUrl(): string {
  const config = useRuntimeConfig();
  // Default to '/api' which can be proxied by Nuxt/Vite in dev,
  // or set to a full URL for production.
  return config.public.apiBase || 'http://localhost:3000';
}

// Core fetch function
async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  endpoint: string,
  payload?: any,
  includeAuth: boolean = true // Default to including auth token
): Promise<T> {
  const authStore = useAuthStore();
  const token = authStore.token;
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`API Request: ${method} ${url}`, payload ? `Payload: ${JSON.stringify(payload)}` : '');
    const response = await ofetch<T>(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
      // By default, ofetch throws errors for non-2xx responses.
      // We can customize error handling if needed.
    });
    console.log(`API Response: ${method} ${url}`, response);
    return response;
  } catch (error: any) {
    console.error(`API Error: ${method} ${url}`, error.data || error.message);
    // error.data usually contains the parsed error body from ofetch if the server sent JSON
    const apiError: ApiError = {
      message: error.data?.message || error.message || 'An unexpected API error occurred.',
      statusCode: error.data?.statusCode || error.status,
    };
    throw apiError; // Re-throw a structured error
  }
}

// Exported API methods
export const apiService = {
  get: <T>(endpoint: string, includeAuth: boolean = true) =>
    request<T>('GET', endpoint, undefined, includeAuth),

  post: <T>(endpoint: string, payload: any, includeAuth: boolean = true) =>
    request<T>('POST', endpoint, payload, includeAuth),

  patch: <T>(endpoint: string, payload: any, includeAuth: boolean = true) =>
    request<T>('PATCH', endpoint, payload, includeAuth),

  put: <T>(endpoint: string, payload: any, includeAuth: boolean = true) =>
    request<T>('PUT', endpoint, payload, includeAuth),
    
  delete: <T>(endpoint: string, includeAuth: boolean = true) =>
    request<T>('DELETE', endpoint, undefined, includeAuth),
};

// Example usage (optional, for testing or demonstration):
// async function testApiService() {
//   try {
//     const data = await apiService.get<{ message: string }>('health'); // Assuming a /health endpoint
//     console.log('Health check data:', data.message);
//   } catch (error) {
//     console.error('Health check failed:', error);
//   }
// }
// if (process.client) testApiService(); // Run only on client-side if it makes sense
