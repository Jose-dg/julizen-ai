// Tipos base para la API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  status: 'error';
  timestamp: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  total_pages: number;
}

// Tipos de autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  style_preferences?: StylePreferences;
  size_profile?: SizeProfile;
  shopping_behavior?: ShoppingBehavior;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

// Tipos de usuario y perfil
export interface StylePreferences {
  colors: string[];
  styles: string[];
}

export interface SizeProfile {
  height: number;
  weight: number;
  shirt_size: string;
  pants_size: string;
}

export interface ShoppingBehavior {
  preferred_brands: string[];
  budget_range: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  style_preferences?: StylePreferences;
  size_profile?: SizeProfile;
}

export interface StylePassport {
  id: string;
  user_id: string;
  favorite_colors: string[];
  preferred_styles: string[];
  size_preferences: {
    shirt: string;
    pants: string;
    shoes: string;
  };
  budget_range: string;
  created_at: string;
  updated_at: string;
}

// Tipos de productos
export interface ProductVariant {
  colors?: Array<{
    name: string;
    hex: string;
    images: string[];
  }>;
  sizes?: Array<{
    size: string;
    stock: number;
  }>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  original_price?: string;
  currency: string;
  category: string;
  subcategory?: string;
  tags: string[];
  ai_description?: string;
  ai_tags?: string[];
  images: string[];
  variants: ProductVariant;
  in_stock: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at?: string;
}

export interface ProductSearchRequest {
  query: string;
  filters?: {
    category?: string;
    max_price?: number;
    brand_id?: string;
    min_price?: number;
    in_stock?: boolean;
  };
  limit?: number;
}

export interface ProductSearchResult {
  id: string;
  name: string;
  price: string;
  relevance_score: number;
  ai_match_reason: string;
}

export interface ProductSearchResponse {
  query: string;
  results: ProductSearchResult[];
  total: number;
  search_time: string;
}

export interface Category {
  name: string;
  display_name: string;
  subcategories: Array<{
    name: string;
    display_name: string;
  }>;
  product_count: number;
}

export interface ProductFilters {
  page?: number;
  page_size?: number;
  category?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
}

// Tipos de carrito
export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_image: string;
  quantity: number;
  selected_variant: {
    color: string;
    size: string;
  };
  total_price: string;
  created_at: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_price: string;
  items_count: number;
  created_at: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  selected_variant: {
    color: string;
    size: string;
  };
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CheckoutRequest {
  shipping_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
  payment_details: {
    card_number: string;
    expiry_date: string;
  };
}

export interface CheckoutResponse {
  order_id: string;
  total: string;
  items_count: number;
  shipping_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  estimated_delivery: string;
  tracking_number: string;
}

// Tipos de IA
export interface AIRecommendationRequest {
  user_id: string;
  context: 'homepage' | 'product_page' | 'cart';
  limit?: number;
  filters?: {
    category?: string;
    max_price?: number;
  };
}

export interface AIRecommendation {
  product_id: string;
  product_name: string;
  product_price: string;
  product_image: string;
  relevance_score: number;
  reason: string;
}

export interface AIRecommendationsResponse {
  recommendations: AIRecommendation[];
  total: number;
  context: string;
  generated_at: string;
}

export interface StyleAnalysisRequest {
  user_id: string;
  preferences: {
    colors: string[];
    styles: string[];
    budget_range: string;
  };
}

export interface StyleProfile {
  primary_style: string;
  confidence: number;
  color_palette: string[];
  recommended_brands: string[];
  style_tips: string[];
}

export interface StyleAnalysisResponse {
  style_profile: StyleProfile;
  generated_at: string;
}

export interface ProductDescriptionRequest {
  product_id: string;
  style: 'formal' | 'casual' | 'deportivo';
  target_audience: 'joven' | 'adulto' | 'profesional';
}

export interface ProductDescriptionResponse {
  enhanced_description: string;
  key_features: string[];
  style_tags: string[];
  generated_at: string;
}

// Tipos de marcas
export interface Brand {
  id: string;
  name: string;
  website_url?: string;
  logo_url?: string;
  description?: string;
  product_count: number;
  categories?: string[];
  is_active: boolean;
  created_at?: string;
}

// Tipos de notificaciones
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  results: Notification[];
  count: number;
  unread_count: number;
  next: string | null;
  previous: string | null;
}

export interface NotificationFilters {
  page?: number;
  unread_only?: boolean;
}

// Tipos de recomendaciones
export interface RecommendationRequest {
  type?: 'trending' | 'personalized' | 'similar';
  limit?: number;
}

export interface Recommendation {
  product_id: string;
  product_name: string;
  product_price: string;
  product_image: string;
  relevance_score: number;
  reason: string;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  type: string;
  total: number;
  generated_at: string;
}

export interface SimilarProduct {
  product_id: string;
  product_name: string;
  product_price: string;
  similarity_score: number;
  similarity_reasons: string[];
}

export interface SimilarProductsResponse {
  similar_products: SimilarProduct[];
  base_product: {
    id: string;
    name: string;
  };
  total: number;
}

// Tipos de eventos
export interface Event {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
  source: string;
}

export interface EventsResponse {
  events: Event[];
  total: number;
}

export interface EventFilters {
  type?: string;
  limit?: number;
}

// Rate limiting
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
}

