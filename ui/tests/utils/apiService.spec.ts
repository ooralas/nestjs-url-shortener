import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ofetch } from 'ofetch';
import { apiService } from '~/utils/apiService';
import { useAuthStore } from '~/stores/auth';
import { setActivePinia, createPinia } from 'pinia';

// Mock ofetch
vi.mock('ofetch', () => ({
  ofetch: vi.fn(),
}));

// Mock Nuxt's useRuntimeConfig
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000', // Mock base URL
    },
  }),
}));

// Mock the auth store
// Since apiService imports and uses it directly, we need to mock its behavior.
// A simpler way for unit testing apiService in isolation might be to pass token as an argument,
// but given the current implementation, we mock the store.
vi.mock('~/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    token: null, // Default to no token
  })),
}));


describe('apiService', () => {
  let authStoreMock: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    // Create a fresh Pinia instance and set it as active
    setActivePinia(createPinia());
    
    // Get a reference to the mocked store instance IF NEEDED for manipulation in tests.
    // For these tests, we'll re-mock its return value per test case.
    authStoreMock = useAuthStore(); // This will use the vi.mock above.
    
    vi.clearAllMocks(); // Clear mocks before each test
  });

  afterEach(() => {
    // Reset the specific mock for useAuthStore to its default behavior if needed,
    // or ensure it's fresh for each test via vi.mock's behavior.
    (useAuthStore as ReturnType<typeof vi.fn>).mockImplementation(() => ({ token: null }));
  });

  describe('GET requests', () => {
    it('constructs the URL correctly and makes a GET request', async () => {
      const endpoint = 'test/health';
      const mockResponseData = { status: 'ok' };
      (ofetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponseData);

      const result = await apiService.get(endpoint);

      expect(ofetch).toHaveBeenCalledWith(
        `http://localhost:3000/${endpoint}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponseData);
    });

    it('includes Authorization header if token is provided (and includeAuth is true by default)', async () => {
      const mockToken = 'test-bearer-token';
      // Update the mock return value for this specific test case
      (useAuthStore as ReturnType<typeof vi.fn>).mockImplementation(() => ({ token: mockToken }));

      const endpoint = 'secure/data';
      (ofetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: 'secret' });

      await apiService.get(endpoint);

      expect(ofetch).toHaveBeenCalledWith(
        expect.any(String), // URL
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
    });
    
    it('does NOT include Authorization header if includeAuth is false', async () => {
      const mockToken = 'test-bearer-token';
      (useAuthStore as ReturnType<typeof vi.fn>).mockImplementation(() => ({ token: mockToken }));

      const endpoint = 'public/data';
      (ofetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: 'public stuff' });

      await apiService.get(endpoint, false); // includeAuth = false

      expect(ofetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String),
          }),
        })
      );
    });
  });

  describe('POST requests', () => {
    it('makes a POST request with the correct payload and headers', async () => {
      const endpoint = 'submit/form';
      const payload = { name: 'Test User', email: 'test@example.com' };
      const mockResponseData = { id: '123', ...payload };
      (ofetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponseData);

      const result = await apiService.post(endpoint, payload);

      expect(ofetch).toHaveBeenCalledWith(
        `http://localhost:3000/${endpoint}`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
          body: JSON.stringify(payload),
        })
      );
      expect(result).toEqual(mockResponseData);
    });
  });
  
  describe('Error Handling', () => {
    it('throws a structured error on API failure', async () => {
      const endpoint = 'test/error';
      const mockErrorResponse = {
        message: 'Something went terribly wrong!',
        statusCode: 500,
      };
      // Simulate ofetch throwing an error (as it does for non-2xx responses)
      (ofetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
        data: mockErrorResponse, // This is how ofetch often structures its errors
        status: 500,
        message: 'HTTP error 500' // Generic message
      });

      try {
        await apiService.get(endpoint);
        // Should not reach here
        expect(true).toBe(false); 
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toBe(mockErrorResponse.message);
        expect(error.statusCode).toBe(mockErrorResponse.statusCode);
      }
    });

     it('handles errors without a specific data message from ofetch', async () => {
      const endpoint = 'test/generic-error';
      // Simulate ofetch throwing an error with only a status and generic message
      (ofetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
        status: 404,
        message: 'Not Found' 
      });

      try {
        await apiService.get(endpoint);
      } catch (error: any) {
        expect(error).toBeDefined();
        // The apiService should try to use error.data.message, then error.message
        expect(error.message).toBe('Not Found'); 
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
