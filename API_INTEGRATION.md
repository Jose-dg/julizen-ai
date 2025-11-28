# 🚀 Integración API DaydreamShop - Next.js

Esta implementación proporciona una integración completa con la API de DaydreamShop siguiendo las mejores prácticas de Next.js, TypeScript y React.

## 📁 Estructura del Proyecto

```
src/
├── types/
│   └── api.ts                 # Tipos TypeScript para toda la API
├── lib/
│   ├── config.ts             # Configuración de la aplicación
│   ├── api-client.ts         # Cliente HTTP con interceptores
│   └── utils.ts              # Utilidades generales
├── services/
│   ├── auth.service.ts       # Servicios de autenticación
│   ├── user.service.ts       # Servicios de usuario
│   ├── products.service.ts   # Servicios de productos
│   ├── cart.service.ts       # Servicios de carrito
│   ├── ai.service.ts         # Servicios de IA
│   ├── brands.service.ts     # Servicios de marcas
│   ├── notifications.service.ts # Servicios de notificaciones
│   ├── recommendations.service.ts # Servicios de recomendaciones
│   └── index.ts              # Exportaciones de servicios
├── stores/
│   ├── cart.store.ts         # Store Zustand para carrito
│   └── index.ts              # Exportaciones de stores
├── hooks/
│   ├── use-auth.ts           # Hook de autenticación
│   ├── use-user.ts           # Hook de usuario
│   ├── use-products.ts       # Hook de productos
│   ├── use-ai.ts             # Hook de IA
│   ├── use-notifications.ts  # Hook de notificaciones
│   ├── use-brands.ts         # Hook de marcas
│   ├── use-recommendations.ts # Hook de recomendaciones
│   └── index.ts              # Exportaciones de hooks
└── components/
    └── examples/
        └── product-card.tsx  # Componente de ejemplo
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_APP_NAME=DaydreamShop
NEXT_PUBLIC_APP_URL=https://daydream.ing
```

### Dependencias

Las siguientes dependencias ya están instaladas:

```json
{
  "axios": "^1.x.x",
  "zustand": "^4.x.x"
}
```

## 🚀 Uso Básico

### 1. Autenticación

```tsx
import { useAuth } from '@/hooks';

function LoginComponent() {
  const { login, register, logout, isAuthenticated, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: 'usuario@ejemplo.com',
      password: 'contraseña123'
    });
    
    if (result) {
      console.log('Login exitoso:', result.user);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Cerrar Sesión</button>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          Iniciar Sesión
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### 2. Productos

```tsx
import { useProducts } from '@/hooks';

function ProductsList() {
  const { 
    products, 
    isLoading, 
    error, 
    fetchProducts, 
    searchProducts 
  } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    await searchProducts({
      query: 'camiseta deportiva',
      limit: 20
    });
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price} EUR</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Carrito con Zustand

```tsx
import { useCartStore } from '@/stores';

function CartComponent() {
  const { 
    cart, 
    addItem, 
    removeItem, 
    getItemsCount, 
    getTotalPrice,
    isLoading 
  } = useCartStore();

  const handleAddToCart = async () => {
    await addItem({
      product_id: 'uuid-del-producto',
      quantity: 1,
      selected_variant: {
        color: 'azul',
        size: 'M'
      }
    });
  };

  return (
    <div>
      <h2>Carrito ({getItemsCount()} items)</h2>
      <p>Total: {getTotalPrice()} EUR</p>
      
      {cart?.items.map(item => (
        <div key={item.id}>
          <span>{item.product_name}</span>
          <span>{item.quantity}</span>
          <button onClick={() => removeItem(item.id)}>
            Eliminar
          </button>
        </div>
      ))}
      
      <button onClick={handleAddToCart} disabled={isLoading}>
        Agregar Producto
      </button>
    </div>
  );
}
```

### 4. Usuario y Perfil

```tsx
import { useUser } from '@/hooks';

function ProfileComponent() {
  const { 
    user, 
    stylePassport, 
    updateProfile, 
    isLoading, 
    error 
  } = useUser();

  const handleUpdateProfile = async () => {
    const success = await updateProfile({
      first_name: 'Juan Carlos',
      style_preferences: {
        colors: ['azul', 'negro'],
        styles: ['casual', 'deportivo']
      }
    });
    
    if (success) {
      console.log('Perfil actualizado');
    }
  };

  if (isLoading) return <div>Cargando perfil...</div>;

  return (
    <div>
      <h2>Perfil de {user?.first_name} {user?.last_name}</h2>
      <p>Email: {user?.email}</p>
      
      {stylePassport && (
        <div>
          <h3>Pasaporte de Estilo</h3>
          <p>Colores favoritos: {stylePassport.favorite_colors.join(', ')}</p>
          <p>Estilos preferidos: {stylePassport.preferred_styles.join(', ')}</p>
        </div>
      )}
      
      <button onClick={handleUpdateProfile} disabled={isLoading}>
        Actualizar Perfil
      </button>
    </div>
  );
}
```

### 5. Recomendaciones de IA

```tsx
import { useAI } from '@/hooks';

function AIRecommendations() {
  const { 
    recommendations, 
    getHomepageRecommendations, 
    isLoading, 
    error 
  } = useAI();

  useEffect(() => {
    // Obtener recomendaciones para la página de inicio
    getHomepageRecommendations('user-uuid', 10);
  }, []);

  if (isLoading) return <div>Cargando recomendaciones...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Recomendaciones para ti</h2>
      {recommendations?.recommendations.map(rec => (
        <div key={rec.product_id}>
          <h3>{rec.product_name}</h3>
          <p>{rec.product_price} EUR</p>
          <p>Relevancia: {Math.round(rec.relevance_score * 100)}%</p>
          <p>Razón: {rec.reason}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Gestión de Estado

### Carrito con Zustand

El carrito utiliza Zustand para la gestión de estado con persistencia:

```tsx
import { useCartStore } from '@/stores';

// El store se persiste automáticamente en localStorage
const { 
  cart,           // Estado del carrito
  addItem,        // Agregar producto
  removeItem,     // Eliminar producto
  updateItem,     // Actualizar cantidad
  clearCart,      // Limpiar carrito
  getItemsCount,  // Contar items
  getTotalPrice,  // Obtener total
  isLoading,      // Estado de carga
  error           // Errores
} = useCartStore();
```

### Autenticación

La autenticación se maneja automáticamente:

- Los tokens se almacenan en localStorage
- Se renuevan automáticamente cuando expiran
- Se limpian al cerrar sesión
- Los interceptores de axios manejan la autenticación automáticamente

## 🛡️ Manejo de Errores

Todos los hooks incluyen manejo de errores:

```tsx
const { error, clearError } = useProducts();

// Mostrar error
{error && (
  <div className="error">
    {error}
    <button onClick={clearError}>Cerrar</button>
  </div>
)}
```

## 🔧 Configuración Avanzada

### Cliente API Personalizado

El cliente API incluye:

- Interceptores automáticos para autenticación
- Renovación automática de tokens
- Manejo de errores centralizado
- Timeout configurable
- Headers automáticos

### Tipos TypeScript

Todos los tipos están definidos en `src/types/api.ts`:

```tsx
import { Product, User, Cart, ApiResponse } from '@/types/api';
```

## 📱 Ejemplo Completo

Visita `/examples` para ver una implementación completa que incluye:

- Lista de productos con filtros
- Búsqueda semántica
- Carrito de compras
- Autenticación
- Manejo de errores
- Estados de carga

## 🚀 Próximos Pasos

1. **Configurar variables de entorno** con la URL de tu API
2. **Implementar componentes UI** específicos para tu aplicación
3. **Agregar validación de formularios** con react-hook-form
4. **Implementar tests** con Jest y React Testing Library
5. **Agregar optimizaciones** como React Query para cache

## 📚 Recursos Adicionales

- [Documentación de la API DaydreamShop](./API_DOCUMENTATION.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

*Implementación creada siguiendo las mejores prácticas de Next.js y TypeScript para DaydreamShop.*

