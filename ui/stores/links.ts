import { defineStore } from 'pinia';
import { apiService } from '~/utils/apiService';

// Define the structure of a Link object based on your API
// Matches Link entity: id, longLink, alias, shortLink (constructed), views, createdAt, updatedAt
export interface Link {
  id: string;
  longLink: string;
  alias: string;
  shortLink?: string; // This will be constructed client-side for display if not sent by backend
  views?: number; // `views` from backend Link entity
  createdAt?: string;
  updatedAt?: string;
  // User information might be part of the response for `GET /links` if populated by the backend
  user?: { id: string; email?: string; firstName?: string; lastName?: string; };
}

// For creating a link, alias is optional, longLink is required
interface CreateLinkPayload {
  longLink: string;
  alias?: string;
}

// For updating a link, both are optional
interface UpdateLinkPayload {
  longLink?: string;
  alias?: string;
}

interface LinkState {
  links: Link[];
  isLoading: boolean;
  error: string | null;
}

export const useLinkStore = defineStore('links', {
  state: (): LinkState => ({
    links: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchLinks() {
      this.isLoading = true;
      this.error = null;
      console.log('Fetching links...');
      try {
        const data = await apiService.get<Link[]>('links');
        this.links = data.map(link => ({
          ...link,
          // Ensure shortLink is constructed correctly based on your application's routing for short URLs
          shortLink: link.shortLink || (typeof window !== 'undefined' ? `${window.location.origin}/${link.alias}` : `yourdomain.com/${link.alias}`),
        }));
        console.log('Links fetched:', this.links);
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch links.';
        console.error('Failed to fetch links:', this.error);
        this.links = []; 
      } finally {
        this.isLoading = false;
      }
    },

    async createLink(linkData: CreateLinkPayload) {
      this.isLoading = true;
      this.error = null;
      console.log('Creating link with:', linkData);
      try {
        const newLink = await apiService.post<Link>('links', linkData);
        newLink.shortLink = newLink.shortLink || (typeof window !== 'undefined' ? `${window.location.origin}/${newLink.alias}` : `yourdomain.com/${newLink.alias}`);
        this.links.push(newLink); 
        console.log('Link created:', newLink);
      } catch (e: any) {
        this.error = e.message || 'Failed to create link.';
        console.error('Failed to create link:', this.error);
        throw e; 
      } finally {
        this.isLoading = false;
      }
    },

    async updateLink(linkId: string, linkData: UpdateLinkPayload) {
      this.isLoading = true;
      this.error = null;
      console.log(`Updating link ${linkId} with:`, linkData);
      try {
        const updatedLink = await apiService.patch<Link>(`links/${linkId}`, linkData);
        updatedLink.shortLink = updatedLink.shortLink || (typeof window !== 'undefined' ? `${window.location.origin}/${updatedLink.alias}` : `yourdomain.com/${updatedLink.alias}`);
        
        const index = this.links.findIndex(link => link.id === linkId);
        if (index !== -1) {
          this.links[index] = updatedLink;
          console.log('Link updated:', this.links[index]);
        } else {
          console.warn(`Link with ID ${linkId} not found in local store after update. Re-fetching.`);
          await this.fetchLinks(); 
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to update link.';
        console.error('Failed to update link:', this.error);
        throw e; 
      } finally {
        this.isLoading = false;
      }
    },

    async deleteLink(linkId: string) {
      this.isLoading = true;
      this.error = null;
      console.log(`Deleting link ${linkId}`);
      try {
        await apiService.delete<void>(`links/${linkId}`); 
        this.links = this.links.filter(link => link.id !== linkId);
        console.log('Link deleted.');
      } catch (e: any) {
        this.error = e.message || 'Failed to delete link.';
        console.error('Failed to delete link:', this.error);
        throw e; 
      } finally {
        this.isLoading = false;
      }
    },
  },
});
