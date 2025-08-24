/**
 * Cloudflare Pages Functions API Handler
 * 处理所有 /api 路由请求
 */

interface PagesContext {
  request: Request;
  env: any;
  params?: any;
  next: () => Promise<Response>;
  waitUntil: (promise: Promise<any>) => void;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  console.log('🔄 API Request:', request.method, pathname);

  try {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // Remove /api prefix for routing
    const apiPath = pathname.replace('/api', '');
    console.log('🔍 API Path:', apiPath);

    // Auth endpoints - /api/auth/*
    if (apiPath.startsWith('/auth')) {
      console.log('🔐 Routing to auth handler');
      const { onRequest } = await import('./api/auth');
      return onRequest({ request, env, ctx: context });
    }
    
    // Environment info endpoint - /api/env-info
    if (apiPath === '/env-info') {
      console.log('ℹ️ Routing to env-info handler');
      const { onRequest } = await import('./api/env-info');
      return onRequest({ request, env, ctx: context });
    }
    
    // Dashboard endpoints - /api/dashboard/*
    if (apiPath.startsWith('/dashboard')) {
      console.log('📊 Routing to dashboard handler');
      const { onRequest } = await import('./api/dashboard');
      return onRequest({ request, env, ctx: context });
    }
    
    // Students endpoints - /api/students/*
    if (apiPath.startsWith('/students')) {
      console.log('👥 Routing to students handler');
      const { onRequest } = await import('./api/students');
      return onRequest({ request, env, ctx: context });
    }

    // 404 for unmatched routes
    console.log('❌ No matching route for:', apiPath);
    return new Response(JSON.stringify({
      success: false,
      error: 'API endpoint not found',
      path: apiPath,
      method: request.method,
      available_endpoints: [
        'POST /api/auth/login',
        'POST /api/auth/logout', 
        'POST /api/auth/refresh',
        'GET /api/auth/me',
        'GET /api/auth/dev-users',
        'GET /api/env-info',
        'GET /api/dashboard/{role}/stats',
        'GET /api/students'
      ]
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('❌ API Router Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
