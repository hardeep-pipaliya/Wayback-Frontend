import type { PageLoad } from './$types';

// Types for notifications
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    total_count: number;
    offset: number;
    limit: number;
    total_pages: number;
  };
}

export const load: PageLoad = async ({ fetch, url }) => {
  try {
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    // Build API URL with query parameters
    const apiUrl = `/api/notifications?offset=${offset}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    
    const response: NotificationsResponse = await res.json();
    
    return {
      notifications: response.data,
      pagination: response.pagination,
      search,
      currentPage: page
    };
  } catch (e) {
    console.error('Error loading notifications:', e);
    
    // Return mock data for development/testing
    const mockNotifications: Notification[] = [
      {
        id: '1',
        message: 'Your domain example.com has been successfully processed',
        type: 'success',
        isRead: false,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        message: 'New article scraped from techcrunch.com',
        type: 'info',
        isRead: true,
        createdAt: '2024-01-14T15:45:00Z',
        updatedAt: '2024-01-14T15:45:00Z'
      },
      {
        id: '3',
        message: 'Payment failed for domain processing',
        type: 'error',
        isRead: false,
        createdAt: '2024-01-13T09:20:00Z',
        updatedAt: '2024-01-13T09:20:00Z'
      },
      {
        id: '4',
        message: 'System maintenance scheduled for tomorrow',
        type: 'warning',
        isRead: true,
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-12T14:00:00Z'
      }
    ];

    return {
      notifications: mockNotifications,
      pagination: {
        total_count: mockNotifications.length,
        offset: 0,
        limit: 10,
        total_pages: 1
      },
      search: '',
      currentPage: 1
    };
  }
};
