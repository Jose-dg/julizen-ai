import { useState, useEffect, useCallback } from 'react';
import { NotificationsService } from '@/services/notifications.service';
import {
  Notification,
  NotificationsResponse,
  NotificationFilters,
  ApiError,
} from '@/types/api';

interface UseNotificationsReturn {
  // Estado
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  } | null;
  
  // Acciones
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  fetchUnreadNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  
  // Helpers
  clearError: () => void;
  refreshNotifications: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  } | null>(null);

  const fetchNotifications = useCallback(async (filters?: NotificationFilters): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await NotificationsService.getNotifications(filters);
      setNotifications(response.data.results);
      setUnreadCount(response.data.unread_count);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al cargar notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await NotificationsService.markAsRead(notificationId);
      
      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Decrementar el contador de no leídas
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al marcar notificación como leída');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await NotificationsService.markAllAsRead();
      
      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      // Resetear el contador de no leídas
      setUnreadCount(0);
      
      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Error al marcar todas las notificaciones como leídas');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadNotifications = useCallback(async (): Promise<void> => {
    await fetchNotifications({ unread_only: true });
  }, [fetchNotifications]);

  const fetchUnreadCount = useCallback(async (): Promise<void> => {
    try {
      const count = await NotificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      // No mostrar error para el contador, solo log
      console.warn('Error al obtener contador de notificaciones no leídas:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshNotifications = useCallback(async (): Promise<void> => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Cargar notificaciones automáticamente al montar el hook
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Cargar contador de no leídas cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    fetchUnreadNotifications,
    fetchUnreadCount,
    clearError,
    refreshNotifications,
  };
};

