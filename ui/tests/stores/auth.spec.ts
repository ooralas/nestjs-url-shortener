import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore, type User } from '~/stores/auth'; // Adjust User import if needed

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock apiService (if not already globally mocked via Vitest config)
// We are testing store logic, not the API service itself here.
// So, we can mock the service's methods if they are called by actions.
vi.mock('~/utils/apiService', () => ({
  apiService: {
    post: vi.fn(),
    get: vi.fn(),
    // Add other methods if your auth store uses them
  },
}));


describe('Auth Store', () => {
  beforeEach(() => {
    // Creates a fresh Pinia instance and makes it active so it's automatically picked
    // up by any useStore() call without needing to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
    // Clear localStorage before each test
    localStorageMock.clear();
    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up Pinia instance
    // No explicit cleanup needed for setActivePinia with default createPinia
  });

  it('initializes with no user and no token', () => {
    const authStore = useAuthStore();
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('logout action clears user, token, and localStorage items', () => {
    const authStore = useAuthStore();
    
    // Setup initial authenticated state
    const mockUser: User = { id: '1', email: 'test@example.com', role: 'USER' };
    const mockToken = 'test-token';
    
    authStore.user = mockUser;
    authStore.token = mockToken;
    localStorageMock.setItem('authUser', JSON.stringify(mockUser));
    localStorageMock.setItem('authToken', mockToken);

    expect(authStore.isAuthenticated).toBe(true);
    expect(localStorageMock.getItem('authToken')).toBe(mockToken);

    // Spy on localStorage.removeItem
    const removeItemSpy = vi.spyOn(localStorageMock, 'removeItem');

    // Dispatch logout action
    authStore.logout();

    // Assertions
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    
    expect(removeItemSpy).toHaveBeenCalledWith('authToken');
    expect(removeItemSpy).toHaveBeenCalledWith('authUser');
    
    expect(localStorageMock.getItem('authToken')).toBeNull();
    expect(localStorageMock.getItem('authUser')).toBeNull();

    removeItemSpy.mockRestore(); // Clean up spy
  });

  it('initializeAuth correctly loads from localStorage', () => {
    const authStore = useAuthStore();
    const mockUser: User = { id: 'user123', email: 'init@example.com', role: 'ADMIN' };
    const mockToken = 'init-token-123';

    localStorageMock.setItem('authUser', JSON.stringify(mockUser));
    localStorageMock.setItem('authToken', mockToken);

    authStore.initializeAuth();

    expect(authStore.user).toEqual(mockUser);
    expect(authStore.token).toBe(mockToken);
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.isAdmin).toBe(true);
  });
  
  it('initializeAuth handles missing or corrupt localStorage data', () => {
    const authStore = useAuthStore();
    
    // Scenario 1: No data in localStorage
    authStore.initializeAuth();
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);

    // Scenario 2: Corrupt user data
    localStorageMock.setItem('authUser', 'this is not json');
    localStorageMock.setItem('authToken', 'some-token');
    authStore.initializeAuth();
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull(); // Token should also be cleared if user data is corrupt
    expect(authStore.isAuthenticated).toBe(false);
    expect(localStorageMock.getItem('authUser')).toBeNull(); // Ensure corrupt item is removed
    expect(localStorageMock.getItem('authToken')).toBeNull();
  });

  // Example for an async action like signin (if you were to test it)
  // This requires mocking apiService.post
  // it('signin action sets user and token on successful API call', async () => {
  //   const authStore = useAuthStore();
  //   const mockCredentials = { email: 'test@example.com', password: 'password' };
  //   const mockUser: User = { id: '2', email: 'test@example.com', role: 'USER' };
  //   const mockToken = 'new-signin-token';
      
  //   // Mock the apiService.post implementation for this test
  //   const { apiService } = await import('~/utils/apiService');
  //   (apiService.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
  //     accessToken: mockToken,
  //     user: mockUser,
  //   });

  //   await authStore.signin(mockCredentials);

  //   expect(authStore.user).toEqual(mockUser);
  //   expect(authStore.token).toBe(mockToken);
  //   expect(authStore.isAuthenticated).toBe(true);
  //   expect(localStorageMock.getItem('authToken')).toBe(mockToken);
  //   expect(JSON.parse(localStorageMock.getItem('authUser')!)).toEqual(mockUser);
  // });
});
