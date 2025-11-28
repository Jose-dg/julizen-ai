'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts, useAuth, useAI } from '@/hooks';
import { useCartStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  Menu,
  X,
  Bot,
  Wand2,
  SlidersHorizontal,
  Filter,
  MessageSquareText,
  Bell,
} from 'lucide-react';

// Utilidad de formato de moneda (COP por defecto)
const asMoney = (value: number, currency = 'COP', locale = 'es-CO') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

// Parse naive de intentos si el hook de IA aún no está conectado
function naivePlan(prompt: string) {
  const lower = prompt.toLowerCase();
  const brand = (lower.match(/nike|jordan|adidas|new balance|puma|asics|reebok|salomon|converse/) || [])[0];
  const size = (lower.match(/(talla|size)\s*(eu|us|mx)?\s*(\d{1,2}(\.5)?)/) || [])[3];
  const priceRaw = (lower.match(/(?:<|men(or|os)?|hasta|bajo|por debajo de)\s*\$?\s*([\d\.\,kK]+)/) || [])[2];
  const priceMax = priceRaw
    ? (() => {
        const clean = priceRaw.replace(/\./g, '').replace(/,/g, '').replace(/k/i, '000');
        const n = Number(clean);
        return isNaN(n) ? undefined : n;
      })()
    : undefined;
  const color = (lower.match(/negro|blanco|blanca|rojo|azul|verde|gris|beige|marrón|morado|rosa|amarillo/) || [])[0];
  const modelMatch = lower.match(/(dunk|air force 1|af1|air max 90|air max|jordan 1|jordan 4|gazelle|samba|campus|550|990|2002r|ultraboost|ride|speedcross)/);
  const model = modelMatch ? modelMatch[1] : undefined;
  return {
    provider: 'naive',
    brand,
    size,
    priceMax,
    color,
    model,
    sort: priceMax ? 'price_asc' : 'relevance',
    tokens: [brand, model, color, size ? `EU ${size}` : undefined]
      .filter(Boolean)
      .map(String),
  } as const;
}

export default function HomeSneakerLLM() {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const {
    products,
    categories,
    isLoading: productsLoading,
    error: productsError,
    fetchProducts,
    fetchProductsByCategory,
    searchProducts,
    fetchBestSellingProducts,
    fetchRecentProducts,
  } = useProducts();

  const { isAuthenticated, logout, isLoading: authLoading } = useAuth();

  const { getItemsCount, fetchCart } = useCartStore();

  const { isLoading: aiLoading } = useAI?.() || ({} as any);

  const [assistantMsg, setAssistantMsg] = useState<string>('');
  const [chips, setChips] = useState<string[]>([]);

  // Datos iniciales
  useEffect(() => {
    fetchProducts({ page_size: 12 });
    fetchBestSellingProducts?.(8);
    if (isAuthenticated) fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const examplePrompts = useMemo(
    () => [
      'Encuentra Nike Dunk Low negras talla 42 EU por menos de $400.000',
      'Quiero Jordan 1 mid rojas entre $300k y $600k, envío rápido',
      'Sambas blancas para mujer en 38 EU con descuento',
    ],
    []
  );

  async function handleLLMSearch(submitted?: string) {
    const text = (submitted ?? query).trim();
    if (!text) return;

    setAssistantMsg('Pensando… afinando tu búsqueda con IA…');

    // 1) Obtener plan desde el hook de IA (si existe) o usar fallback naive
    let plan: any;
    try {
      // Por ahora usamos solo el parser naive
      plan = naivePlan(text);
    } catch (e) {
      plan = naivePlan(text);
    }

    // 2) Construir consulta y aplicar a tu catálogo
    const qTokens: string[] = [];
    if (plan.brand) qTokens.push(plan.brand);
    if (plan.model) qTokens.push(plan.model);
    if (plan.color) qTokens.push(plan.color);
    if (plan.size) qTokens.push(`EU ${plan.size}`);
    const finalQuery = qTokens.join(' ');

    await searchProducts({
      query: finalQuery || text,
      limit: 24,
      // Si tu API acepta filtros adicionales, agrégalos aquí
      // filters: { price_lte: plan.priceMax, color: plan.color, brand: plan.brand, size: plan.size }
    });

    // 3) Mensaje de asistente + chips
    const why: string[] = [];
    if (plan.brand) why.push(`Marca: ${capitalize(plan.brand)}`);
    if (plan.model) why.push(`Modelo: ${plan.model.toUpperCase()}`);
    if (plan.color) why.push(`Color: ${capitalize(plan.color)}`);
    if (plan.size) why.push(`Talla: EU ${plan.size}`);
    if (plan.priceMax) why.push(`Máx: ${asMoney(plan.priceMax)}`);

    setChips(why);
    setAssistantMsg(
      `Busqué ${why.length ? 'con ' + why.join(' · ') : 'por relevancia'}.
Puedes afinar pidiendo, por ejemplo: "solo con envío gratis", "ordenar por menor precio", o "muestra alternativas similares".`
    );
  }

  function capitalize(s?: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    if (category) await fetchProductsByCategory(category, { page_size: 12 });
    else await fetchProducts({ page_size: 12 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLLMSearch();
  };

  const handleLogout = async () => await logout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SneakerScout
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Inicio
              </Link>
              <Link href="/products" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Sneakers
              </Link>
              <Link href="/alerts" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center">
                Alertas
                <Bell className="ml-1 h-4 w-4" />
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Sobre Nosotros
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito
                {getItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getItemsCount()}
                  </Badge>
                )}
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} disabled={authLoading}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Iniciar Sesión</Button>
                  <Button size="sm">Registrarse</Button>
                </div>
              )}

              <Button
                aria-label="Abrir menú"
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t bg-white/95 backdrop-blur-md dark:bg-slate-900/95">
              <div className="container mx-auto px-4 py-4 space-y-4">
                <Link href="/" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Inicio</Link>
                <Link href="/products" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Sneakers</Link>
                <Link href="/alerts" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Alertas</Link>
                <Link href="/about" className="block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Sobre Nosotros</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero + Prompt tipo LLM */}
        <section className="relative pt-12 pb-6 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Busca sneakers hablando natural
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
                "Consígueme <span className="font-semibold">Nike Dunk</span> negras talla 42 por menos de <span className="font-semibold">$400k</span> en envío rápido".
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
              <div className="relative flex items-center gap-2 rounded-2xl border bg-white/70 dark:bg-slate-900/70 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700">
                <Bot className="h-5 w-5 text-slate-500" />
                <input
                  aria-label="Pregúntale a la IA por sneakers"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-base md:text-lg"
                  placeholder={examplePrompts[0]}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) handleSearchSubmit(e);
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button type="submit" size="sm" className="hidden sm:inline-flex">
                    Buscar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" onClick={() => setQuery(examplePrompts[1])}>
                    <Wand2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {/* Sugerencias rápidas */}
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {examplePrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setQuery(p);
                      handleLLMSearch(p);
                    }}
                    className="text-sm px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 border hover:bg-white dark:hover:bg-slate-800 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </section>

        {/* Resumen del plan de IA */}
        {(aiLoading || assistantMsg || chips.length > 0) && (
          <section className="px-4">
            <div className="container mx-auto max-w-3xl">
              <Card className="bg-white/80 dark:bg-slate-900/80">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MessageSquareText className="h-4 w-4" />
                    <span className="text-sm">Asistente</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {aiLoading ? (
                    <p className="animate-pulse text-slate-500">Pensando…</p>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line">{assistantMsg}</p>
                  )}
                  {chips.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {chips.map((c) => (
                        <Badge key={c} variant="secondary" className="rounded-full">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Categorías/Marcas rápidas */}
        <section className="py-10 px-4 bg-white/50 dark:bg-slate-800/50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Marcas populares</h2>
              <div className="hidden md:flex items-center text-slate-500 gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm">Usa el prompt para combinar marca, talla, color y presupuesto</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => handleCategoryFilter('')}
                className="flex items-center space-x-2"
              >
                <span>Todas</span>
                <Badge variant="secondary">{products.length}</Badge>
              </Button>
              {categories.slice(0, 8).map((cat) => (
                <Button
                  key={cat.name}
                  variant={selectedCategory === cat.name ? 'default' : 'outline'}
                  onClick={() => handleCategoryFilter(cat.name)}
                  className="flex items-center space-x-2"
                >
                  <span>{cat.display_name}</span>
                  <Badge variant="secondary">{cat.product_count}</Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Resultados / Productos */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">Resultados</h2>
                <p className="text-slate-600 dark:text-slate-300">Mejores ofertas y matches según tu búsqueda</p>
              </div>
              <Button variant="outline" className="hidden md:flex">
                Ordenar
                <SlidersHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : productsError ? (
              <Card className="p-8 text-center">
                <p className="text-red-600 mb-4">Error: {productsError}</p>
                <Button onClick={() => fetchProducts({ page_size: 12 })}>Reintentar</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.slice(0, 24).map((product: any) => {
                  const price = Number(product.price || 0);
                  const original = Number(product.original_price || 0);
                  const hasDiscount = original > price && price > 0;
                  const discountPct = hasDiscount ? Math.round(((original - price) / original) * 100) : 0;

                  return (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {hasDiscount && (
                          <Badge className="absolute top-2 left-2 bg-green-600">
                            -{discountPct}%
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0" aria-label="Guardar en favoritos">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-blue-600">{asMoney(price)}</p>
                            {hasDiscount && (
                              <p className="text-sm text-slate-500 line-through">{asMoney(original)}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-slate-600">4.8</span>
                          </div>
                        </div>
                        {product.store && (
                          <p className="mt-1 text-xs text-slate-500">Tienda: {product.store}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Bloque de tips de IA */}
        <section className="py-10 px-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-slate-600"><Wand2 className="h-4 w-4" /><span className="font-semibold">Afina con lenguaje natural</span></div>
                  <p className="text-sm text-slate-600">Di cosas como "solo en 42 EU", "menor a $500k" o "color blanco y envío gratis".</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-slate-600"><SlidersHorizontal className="h-4 w-4" /><span className="font-semibold">Combina filtros</span></div>
                  <p className="text-sm text-slate-600">Marca + modelo + talla + presupuesto para resultados precisos.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-slate-600"><Bell className="h-4 w-4" /><span className="font-semibold">Activa alertas</span></div>
                  <p className="text-sm text-slate-600">Te avisamos cuando baje de precio o aparezca tu talla.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">SneakerScout</span>
              </div>
              <p className="text-slate-400">Cazamos ofertas de tenis en tus tiendas favoritas, con IA.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explorar</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/products" className="hover:text-white transition-colors">Sneakers</Link></li>
                <li><Link href="/brands" className="hover:text-white transition-colors">Marcas</Link></li>
                <li><Link href="/alerts" className="hover:text-white transition-colors">Alertas</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Ayuda</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Envíos</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Devoluciones</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:bg-slate-800">Twitter</Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:bg-slate-800">Instagram</Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:bg-slate-800">Facebook</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} SneakerScout. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}