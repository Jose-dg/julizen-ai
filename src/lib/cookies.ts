/**
 * Utilidades para manejo de cookies
 * Compatible con SSR de Next.js
 */

export const cookieUtils = {
  /**
   * Obtiene una cookie por nombre
   */
  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  },

  /**
   * Establece una cookie
   */
  set: (name: string, value: string, options: {
    expires?: Date;
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}): void => {
    if (typeof document === 'undefined') return;

    let cookieString = `${name}=${value}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += `; secure`;
    }

    if (options.httpOnly) {
      cookieString += `; httponly`;
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  },

  /**
   * Elimina una cookie
   */
  remove: (name: string, options: {
    path?: string;
    domain?: string;
  } = {}): void => {
    if (typeof document === 'undefined') return;

    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    document.cookie = cookieString;
  },

  /**
   * Obtiene todas las cookies como objeto
   */
  getAll: (): Record<string, string> => {
    if (typeof document === 'undefined') return {};

    const cookies: Record<string, string> = {};
    
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });

    return cookies;
  },
};

/**
 * Utilidades específicas para autenticación
 */
export const authCookies = {
  /**
   * Establece los tokens de autenticación
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 días

    cookieUtils.set('access_token', accessToken, {
      expires,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    cookieUtils.set('refresh_token', refreshToken, {
      expires,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  },

  /**
   * Obtiene el token de acceso
   */
  getAccessToken: (): string | null => {
    return cookieUtils.get('access_token');
  },

  /**
   * Obtiene el refresh token
   */
  getRefreshToken: (): string | null => {
    return cookieUtils.get('refresh_token');
  },

  /**
   * Limpia todos los tokens de autenticación
   */
  clearTokens: (): void => {
    cookieUtils.remove('access_token', { path: '/' });
    cookieUtils.remove('refresh_token', { path: '/' });
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated: (): boolean => {
    return !!authCookies.getAccessToken();
  },
};

