import { defineStore } from 'pinia';
// import { useAuthStore } from './auth'; // Not strictly needed here if isAdmin check is done by middleware/component
import { apiService } from '~/utils/apiService';

// Define the structure of a Link object as expected by the admin section
// This should align with the Link entity from the backend, potentially including user details.
export interface AdminManagedLink {
  id: string;
  longLink: string;
  alias: string;
  shortLink?: string; // Constructed client-side for display
  views?: number; // `views` from backend, not viewCount
  createdAt?: string;
  updatedAt?: string;
  user?: { // The backend Link entity has a user object
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  // userId and userEmail can be derived from the user object if needed in component
}

interface AdminLinksState {
  allLinks: AdminManagedLink[];
  isLoading: boolean;
  error: string | null;
}

export const useAdminLinksStore = defineStore('adminLinks', {
  state: (): AdminLinksState => ({
    allLinks: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    // isAdmin getter is in authStore. Components/pages should use that.
  },
  actions: {
    async fetchAllLinks() {
      this.isLoading = true;
      this.error = null;
      console.log('Admin: Fetching all links...');
      try {
        const data = await apiService.get<AdminManagedLink[]>('links/all'); // Endpoint for all links by admin
        this.allLinks = data.map(link => ({
          ...link,
          // Ensure shortLink is constructed correctly based on your application's routing for short URLs
          shortLink: link.shortLink || (typeof window !== 'undefined' ? `${window.location.origin}/${link.alias}` : `yourdomain.com/${link.alias}`),
          // views property should come directly from 'link.views'
        }));
        console.log('Admin: All links fetched:', this.allLinks);
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch all links.';
        console.error('Admin: Failed to fetch all links:', this.error);
        this.allLinks = [];
      } finally {
        this.isLoading = false;
      }
    },

    async deleteLink(linkId: string) {
      this.isLoading = true;
      this.error = null;
      console.log(`Admin: Deleting link ${linkId}`);
      try {
        // Assuming admin uses the same delete endpoint, protected by role on backend
        await apiService.delete<void>(`links/${linkId}`);
        this.allLinks = this.allLinks.filter(link => link.id !== linkId);
        console.log(`Admin: Link ${linkId} deleted.`);
      } catch (e: any) {
        this.error = e.message || `Failed to delete link ${linkId}.`;
        console.error(`Admin: Failed to delete link ${linkId}:`, this.error);
        throw e; // Re-throw for component
      } finally {
        this.isLoading = false;
      }
    },
  },
});
