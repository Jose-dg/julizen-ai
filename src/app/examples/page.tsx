'use client';

import { useEffect, useState } from 'react';
import { useProducts, useAuth, useCartStore } from '@/hooks';
import { ProductCard } from '@/components/examples/product-card';
import { Product } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, User, LogOut } from 'lucide-react';

export default function ExamplesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { 
    products, 
    categories, 
    isLoading: productsLoading, 
    error: productsError,
    fetchProducts,
    fetchCategories,
    searchProducts,
    fetchProductsByCategory,
  } = useProducts();
  
  const { 
    isAuthenticated, 
    logout, 
    isLoading: authLoading 
  } = useAuth();
  
  const { 
    getItemsCount, 
    getTotalPrice, 
    fetchCart 
  } = useCartStore();

  // Cargar datos iniciales
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    if (isAuthenticated) {
      fetchCart();
    }
  }, [fetchProducts, fetchCategories, fetchCart, isAuthenticated]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchProducts({
        query: searchQuery,
        limit: 20,
      });
    } else {
      await fetchProducts();
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    if (category) {
      await fetchProductsByCategory(category);
    } else {
      await fetchProducts();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">DaydreamShop</h1>
              <Badge variant="secondary">Demo API</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Carrito */}
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito
                {getItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getItemsCount()}
                  </Badge>
                )}
              </Button>
              
              {/* Usuario */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Usuario</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    disabled={authLoading}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline">
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros y búsqueda */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={productsLoading}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Categorías */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryFilter('')}
                >
                  Todas
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryFilter(category.name)}
                  >
                    {category.display_name}
                    <Badge variant="secondary" className="ml-2">
                      {category.product_count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de carga y errores */}
        {productsLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando productos...</p>
          </div>
        )}

        {productsError && (
          <Card className="mb-8 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error: {productsError}</p>
              <Button 
                variant="outline" 
                onClick={() => fetchProducts()}
                className="mt-2"
              >
                Reintentar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lista de productos */}
        {!productsLoading && !productsError && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Productos'}
              </h2>
              <p className="text-muted-foreground">
                {products.length} productos encontrados
              </p>
            </div>

            {products.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    No se encontraron productos. Intenta con otros filtros.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={(product) => {
                      console.log('Ver detalles:', product);
                    }}
                    onAddToWishlist={(product) => {
                      console.log('Agregar a wishlist:', product);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Información del carrito */}
        {isAuthenticated && getItemsCount() > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Resumen del Carrito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Total de items: {getItemsCount()}</span>
                <span className="font-semibold">Total: {getTotalPrice()} EUR</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

