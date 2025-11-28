// Configuración de la aplicación
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'DaydreamShop',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://daydream.ing',
  },
} as const;

