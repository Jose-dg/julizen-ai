import { apiClient, handleApiError } from '@/lib/api-client';
import {
  Notification,
  NotificationsResponse,
  NotificationFilters,
  ApiResponse,
} from '@/types/api';

export class NotificationsService {
  /**
   * Obtiene las notificaciones del usuario
   */
  static async getNotifications(filters?: NotificationFilters): Promise<ApiResponse<NotificationsResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const queryString = params.toString();
      const url = queryString ? `/notifications/?${queryString}` : '/notifications/';
      
      return await apiClient.get<NotificationsResponse>(url);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Marca una notificación como leída
   */
  static async markAsRead(notificationId: string): Promise<ApiResponse<null>> {
    try {
      return await apiClient.put<null>(`/notifications/${notificationId}/read/`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  static async markAllAsRead(): Promise<ApiResponse<null>> {
    try {
      return await apiClient.put<null>('/notifications/mark-all-read/');
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene solo notificaciones no leídas
   */
  static async getUnreadNotifications(): Promise<ApiResponse<NotificationsResponse>> {
    try {
      return await this.getNotifications({ unread_only: true });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene el número de notificaciones no leídas
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const response = await this.getNotifications({ page: 1, unread_only: true });
      return response.data.unread_count || 0;
    } catch (error) {
      return 0;
    }
  }
}

