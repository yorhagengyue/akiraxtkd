/**
 * Cloudflare Workers Entry Point
 * Routes requests to appropriate API handlers
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Route API requests
    if (pathname.startsWith('/api/')) {
      // Auth endpoints
      if (pathname.startsWith('/api/auth')) {
        const { onRequest } = await import('./api/auth.ts');
        return onRequest({ request, env, ctx });
      }
      
      // Environment info endpoint
      if (pathname === '/api/env-info') {
        const { onRequest } = await import('./api/env-info.ts');
        return onRequest({ request, env, ctx });
      }
      
      // Dashboard endpoints
      if (pathname.startsWith('/api/dashboard')) {
        const { onRequest } = await import('./api/dashboard.ts');
        return onRequest({ request, env, ctx });
      }
      
      // Students endpoint (existing)
      if (pathname.startsWith('/api/students')) {
        const { onRequest } = await import('./api/students.ts');
        return onRequest({ request, env, ctx });
      }
    }

    // Default response for unmatched routes
    return new Response(JSON.stringify({
      success: false,
      error: 'API endpoint not found',
      path: pathname,
      available_endpoints: [
        'POST /api/auth/login',
        'GET /api/auth/me',
        'GET /api/auth/dev-users',
        'GET /api/env-info',
        'GET /api/students',
        'POST /api/students',
      ],
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  },
};
