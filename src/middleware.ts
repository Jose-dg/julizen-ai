import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/profile', '/cart', '/orders'];

// Rutas de autenticación (redirigir si ya está autenticado)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si el usuario está autenticado
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  // Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Verificar rutas de autenticación
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirigir a login si intenta acceder a ruta protegida sin autenticación
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir a dashboard si intenta acceder a rutas de auth estando autenticado
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

