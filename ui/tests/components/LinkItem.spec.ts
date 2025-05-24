import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LinkItem from '~/components/LinkItem.vue';
import { createTestingPinia } from '@pinia/testing'; // For mocking Pinia stores
import { useLinkStore } from '~/stores/links'; // To interact with the store if needed

// Mock NuxtLink for testing purposes
const NuxtLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to']
};

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
  },
  writable: true,
  configurable: true,
});


describe('LinkItem.vue', () => {
  const mockLink = {
    id: '123',
    alias: 'test-alias',
    longLink: 'https://example.com/very-long-link',
    views: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shortLink: 'http://localhost:3000/test-alias', // Assuming store provides this
    // user: { id: 'user1', email: 'user@example.com' } // if your Link type includes this
  };

  function mountComponent(linkProps = mockLink) {
    return mount(LinkItem, {
      props: {
        link: linkProps,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })], // Initialize Pinia for testing
        stubs: { // Stub NuxtLink to avoid router-related warnings/errors in tests
          NuxtLink: NuxtLinkStub,
        },
        mocks: {
          // If $colorMode is used internally and not crucial for this component's logic
          // $colorMode: { preference: 'light' } 
        }
      },
    });
  }

  it('renders link alias and longLink', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain(mockLink.alias);
    expect(wrapper.find('a[href="' + mockLink.longLink + '"]').exists()).toBe(true);
    expect(wrapper.html()).toContain(mockLink.longLink);
  });

  it('renders link views and creation date', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain(`Views: ${mockLink.views}`);
    expect(wrapper.text()).toContain(`Created: ${new Date(mockLink.createdAt!).toLocaleString()}`);
  });
  
  it('has an "Edit" button/link pointing to the correct edit page', () => {
    const wrapper = mountComponent();
    const editLink = wrapper.findComponent(NuxtLinkStub); // Find the stubbed NuxtLink
    // Check if any NuxtLink points to the edit page
    const editButton = wrapper.findAllComponents(NuxtLinkStub).find(link => link.props().to === `/dashboard/links/edit/${mockLink.id}`);
    expect(editButton).not.toBeUndefined();
    expect(editButton?.text()).toBe('Edit');
  });

  it('has a "Delete" button', () => {
    const wrapper = mountComponent();
    const deleteButton = wrapper.findAll('button').find(button => button.text().includes('Delete'));
    expect(deleteButton).not.toBeUndefined();
  });
  
  it('has a "Copy to Clipboard" button', () => {
    const wrapper = mountComponent();
    // Find button by text or a more specific selector if possible
    const copyButton = wrapper.findAll('button').find(button => button.text().includes('Copy'));
    expect(copyButton).not.toBeUndefined();
  });

  it('calls navigator.clipboard.writeText when "Copy to Clipboard" button is clicked', async () => {
    const wrapper = mountComponent();
    const copyButton = wrapper.findAll('button').find(button => button.text().includes('Copy'));
    
    expect(copyButton).not.toBeUndefined();
    if (!copyButton) return; // Should not happen if previous test passed

    await copyButton.trigger('click');
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    // Check if it was called with the correct short link.
    // The fullShortLink computed property might rely on `window.location.origin` or similar.
    // For testing, ensure this is either mocked or the shortLink is directly provided.
    const expectedShortLink = mockLink.shortLink; // Use the one provided in mock data
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedShortLink);
  });

  it('displays "Copied!" after successfully copying to clipboard', async () => {
    const wrapper = mountComponent();
    const copyButton = wrapper.findAll('button').find(button => button.text().includes('Copy'));
    expect(copyButton).not.toBeUndefined();
    if (!copyButton) return;

    await copyButton.trigger('click');
    await wrapper.vm.$nextTick(); // Wait for DOM updates

    expect(copyButton.text()).toBe('Copied!');
  });

  // Optional: Test delete functionality (mocking store action)
  it('calls the deleteLink store action when delete button is clicked and confirmed', async () => {
    // Mock window.confirm
    window.confirm = vi.fn(() => true);

    const wrapper = mountComponent();
    const linkStore = useLinkStore(); // Get the mocked store instance

    const deleteButton = wrapper.findAll('button').find(button => button.text().includes('Delete'));
    expect(deleteButton).not.toBeUndefined();
    if (!deleteButton) return;

    await deleteButton.trigger('click');

    expect(window.confirm).toHaveBeenCalled();
    expect(linkStore.deleteLink).toHaveBeenCalledTimes(1);
    expect(linkStore.deleteLink).toHaveBeenCalledWith(mockLink.id);

    // Clean up mock
    vi.restoreAllMocks();
  });
});
