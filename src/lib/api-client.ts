import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config';
import { ApiResponse, ApiError, RefreshTokenResponse } from '@/types/api';

// Cliente API base
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor de request para agregar token automáticamente
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de response para manejar errores de token
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Si ya estamos refrescando, agregar a la cola
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.client.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh/', {
                refresh: refreshToken,
              });

              const newToken = response.data.data.access;
              this.setAccessToken(newToken);

              // Procesar cola de requests fallidos
              this.processQueue(null, newToken);

              // Reintentar request original
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            } else {
              this.processQueue(new Error('No refresh token'), null);
              this.clearTokens();
              this.redirectToLogin();
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.clearTokens();
            this.redirectToLogin();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Métodos de manejo de tokens
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Métodos públicos para manejo de tokens
  public setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  public clearAuth(): void {
    this.clearTokens();
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Métodos HTTP
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Función helper para manejar errores de API
export const handleApiError = (error: any): ApiError => {
  if (error.response?.data) {
    return error.response.data;
  }

  return {
    error: {
      code: 'NETWORK_ERROR',
      message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
    },
    status: 'error',
    timestamp: new Date().toISOString(),
  };
};

