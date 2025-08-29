<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Pagination from '$lib/components/Pagination.svelte';
  import type { Notification } from './+page';

  // Props from page load function
  export let data: {
    notifications: Notification[];
    pagination: {
      total_count: number;
      offset: number;
      limit: number;
      total_pages: number;
    };
    search: string;
    currentPage: number;
  };

  // Local state
  let searchQuery = data.search;
  let notifications = data.notifications;
  let pagination = data.pagination;
  let loading = false;

  // Format date for display
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get notification type styling
  function getNotificationTypeClasses(type: Notification['type']): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  }

  // Get notification type icon
  function getNotificationIcon(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'info':
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  // Handle search
  function handleSearch() {
    const params = new URLSearchParams($page.url.searchParams);
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page when searching
    goto(`?${params.toString()}`);
  }

  // Handle page change
  function handlePageChange(newPage: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', newPage.toString());
    goto(`?${params.toString()}`);
  }

  // Mark notification as read
  async function markAsRead(notificationId: string) {
    try {
      loading = true;
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state
        notifications = notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      loading = false;
    }
  }

  // Delete notification
  async function deleteNotification(notificationId: string) {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      loading = true;
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from local state
        notifications = notifications.filter(notification => notification.id !== notificationId);
        
        // Update pagination
        pagination = {
          ...pagination,
          total_count: pagination.total_count - 1
        };
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      loading = false;
    }
  }

  // Handle search input key press
  function handleSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }
</script>

<div class="space-y-6">
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200">
    <!-- Left Side: Title Section -->
    <div>
      <h3 class="text-lg font-semibold text-black">Notifications</h3>
      <p class="text-xs text-gray-500">Manage your notifications.</p>
    </div>

    <!-- Right Side: Search -->
    <div class="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
      <!-- Search Box -->
      <div class="relative text-gray-500 focus-within:text-gray-900">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M15.75 15.75L13.875 13.875M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C9.90046 14.25 11.3953 13.5836 12.48 12.5052C13.5732 11.4184 14.25 9.91325 14.25 8.25Z" stroke="#9CA3AF" stroke-width="1.2" stroke-linecap="round"></path>
          </svg>
        </div>
        <input 
          type="search" 
          bind:value={searchQuery}
          on:keypress={handleSearchKeyPress}
          class="block w-full max-w-xs pr-4 pl-8 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed" 
          placeholder="Search notifications..."
        />
      </div>
      
      <!-- Search Button -->
      <button 
        on:click={handleSearch}
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Search
      </button>
    </div>
  </div>

  <!-- Table Section -->
  <div class="rounded-xl border border-solid border-gray-200 overflow-auto">
    <table class="w-full rounded-xl font-poppins">
      <thead>
        <tr class="bg-gray-50 text-sm">
          <th scope="col" class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize">
            #
          </th>
          <th scope="col" class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize">
            Type
          </th>
          <th scope="col" class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize">
            Message
          </th>
          <th scope="col" class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize">
            Date
          </th>
          <th scope="col" class="py-3.5 pl-4 text-left whitespace-nowrap font-medium text-gray-900 capitalize">
            Status
          </th>
          <th scope="col" class="py-3.5 pl-4 w-32 text-left whitespace-nowrap font-medium text-gray-900 capitalize">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 text-sm font-normal">
        {#if notifications.length === 0}
          <tr>
            <td colspan="6" class="py-8 text-center text-gray-500">
              No notifications found
            </td>
          </tr>
        {:else}
          {#each notifications as notification, index}
            <tr class="hover:bg-gray-50 {notification.isRead ? 'opacity-75' : ''}">
              <td class="py-3.5 pl-4 whitespace-nowrap text-gray-900">
                {index + 1 + (data.currentPage - 1) * pagination.limit}
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getNotificationIcon(notification.type)} />
                  </svg>
                  <span class={getNotificationTypeClasses(notification.type)}>
                    {notification.type}
                  </span>
                </div>
              </td>
              <td class="py-3.5 pl-4 text-gray-900">
                <div class="max-w-md">
                  <p class="{notification.isRead ? 'font-normal' : 'font-medium'}">
                    {notification.message}
                  </p>
                </div>
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap text-gray-500">
                {formatDate(notification.createdAt)}
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-full text-xs {notification.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}">
                  {notification.isRead ? 'Read' : 'Unread'}
                </span>
              </td>
              <td class="py-3.5 pl-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  {#if !notification.isRead}
                    <button 
                      on:click={() => markAsRead(notification.id)}
                      disabled={loading}
                      class="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      title="Mark as read"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  {/if}
                  <button 
                    on:click={() => deleteNotification(notification.id)}
                    disabled={loading}
                    class="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                    title="Delete notification"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <Pagination 
    pagination={pagination} 
    handlePageChange={handlePageChange} 
  />
</div>
