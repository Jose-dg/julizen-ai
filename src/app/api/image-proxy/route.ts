import { NextRequest, NextResponse } from 'next/server';

// GET /api/image-proxy - Proxy de imágenes sin almacenar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = searchParams.get('w');
    const height = searchParams.get('h');
    const quality = searchParams.get('q') || '80';

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL de imagen es requerida' },
        { status: 400 }
      );
    }

    // Validar que sea una URL válida
    try {
      new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: 'URL de imagen inválida' },
        { status: 400 }
      );
    }

    // Configurar headers para la petición
    const headers: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
      'Accept': 'image/*',
      'Referer': new URL(imageUrl).origin,
    };

    // Hacer la petición a la imagen original
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(10000), // 10 segundos timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error al obtener imagen: ${response.status}` },
        { status: response.status }
      );
    }

    // Verificar que sea una imagen
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El recurso no es una imagen válida' },
        { status: 400 }
      );
    }

    // Obtener la imagen
    const imageBuffer = await response.arrayBuffer();

    // Si se especifican dimensiones, redimensionar (implementación básica)
    // En producción, usarías una librería como sharp
    let processedBuffer = imageBuffer;

    // Headers de respuesta
    const responseHeaders: HeadersInit = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400', // Cache por 1 hora, CDN por 24 horas
      'Content-Length': processedBuffer.byteLength.toString(),
    };

    // Agregar headers de CORS si es necesario
    responseHeaders['Access-Control-Allow-Origin'] = '*';
    responseHeaders['Access-Control-Allow-Methods'] = 'GET';
    responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type';

    return new NextResponse(processedBuffer, {
      status: 200,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Error en proxy de imágenes:', error);
    
    // Retornar imagen placeholder en caso de error
    const placeholderSvg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">
          Imagen no disponible
        </text>
      </svg>
    `;

    return new NextResponse(placeholderSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
      },
    });
  }
}

// OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

