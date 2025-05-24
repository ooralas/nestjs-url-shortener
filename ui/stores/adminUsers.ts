import { defineStore } from 'pinia';
import { useAuthStore } from './auth'; // To check current user's role and ID
import { apiService } from '~/utils/apiService'; // Import the API service

// Define the structure of a User object as expected by the admin section
// This should match the User entity from the backend.
export interface AdminManagedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN'; // Roles defined in common/enums/role.enum.ts
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null; // If soft delete is used
  // Add other user properties as needed by admin, e.g., links count, last login
}

// Payload for updating a user's role
interface UpdateUserRolePayload {
  role: 'USER' | 'ADMIN';
}

interface AdminUsersState {
  users: AdminManagedUser[];
  isLoading: boolean;
  error: string | null;
}

export const useAdminUsersStore = defineStore('adminUsers', {
  state: (): AdminUsersState => ({
    users: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    // isAdmin getter is now in authStore.
  },
  actions: {
    async fetchUsers() {
      this.isLoading = true;
      this.error = null;
      const authStore = useAuthStore();
      console.log('Admin: Fetching users...');
      try {
        const data = await apiService.get<AdminManagedUser[]>('user');
        this.users = data.filter(user => user.id !== authStore.user?.id);
        console.log('Admin: Users fetched:', this.users);
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch users.';
        console.error('Admin: Failed to fetch users:', this.error);
        this.users = [];
      } finally {
        this.isLoading = false;
      }
    },

    async updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
      this.isLoading = true;
      this.error = null;
      console.log(`Admin: Updating role for user ${userId} to ${role}`);
      try {
        const payload: UpdateUserRolePayload = { role };
        const updatedUser = await apiService.patch<AdminManagedUser>(`user/${userId}`, payload);
        
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
          console.log('Admin: User role updated:', this.users[index]);
        } else {
          console.warn(`User with ID ${userId} not found in local store after role update.`);
          await this.fetchUsers();
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to update user role.';
        console.error('Admin: Failed to update user role:', this.error);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteUser(userId: string) {
      this.isLoading = true;
      this.error = null;
      console.log(`Admin: Deleting user ${userId}`);
      try {
        await apiService.delete<void>(`user/${userId}`);
        this.users = this.users.filter(user => user.id !== userId);
        console.log('Admin: User deleted.');
      } catch (e: any) {
        this.error = e.message || 'Failed to delete user.';
        console.error('Admin: Failed to delete user:', this.error);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
