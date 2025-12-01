import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config';
import { ApiResponse, ApiError } from '@/types/api';
import { getSession, signOut } from 'next-auth/react';

// Cliente API base
class ApiClient {
  private client: AxiosInstance;

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
      async (config) => {
        const token = await this.getAccessToken();
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
        if (error.response?.status === 401) {
          // If we get a 401, it means the token is invalid/expired.
          // Since NextAuth handles refresh on session access, if we are here, 
          // it likely means the session itself is invalid or refresh failed.
          // We should sign the user out.
          if (typeof window !== 'undefined') {
            await signOut({ callbackUrl: '/auth/login' });
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de manejo de tokens
  private async getAccessToken(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      const session = await getSession();
      // We cast session to any because we extended the type but TypeScript might not pick it up here without full type imports
      return (session as any)?.access_token || null;
    }
    return null;
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
