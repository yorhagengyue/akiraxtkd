/**
 * Cloudflare Pages Functions API Router
 * 处理所有 /api/* 路由请求
 */

export async function onRequest(context: any): Promise<Response> {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // 移除 /api 前缀
    const apiPath = pathname.replace(/^\/api/, '');

    // Auth endpoints
    if (apiPath.startsWith('/auth')) {
      const { onRequest } = await import('./auth');
      return onRequest({ request, env, ctx: context });
    }
    
    // Environment info endpoint
    if (apiPath === '/env-info') {
      const { onRequest } = await import('./env-info');
      return onRequest({ request, env, ctx: context });
    }
    
    // Dashboard endpoints
    if (apiPath.startsWith('/dashboard')) {
      const { onRequest } = await import('./dashboard');
      return onRequest({ request, env, ctx: context });
    }
    
    // Students endpoints
    if (apiPath.startsWith('/students')) {
      const { onRequest } = await import('./students');
      return onRequest({ request, env, ctx: context });
    }

    // 404 for unmatched routes
    return new Response(JSON.stringify({
      success: false,
      error: 'API endpoint not found',
      path: apiPath
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
    console.error('API Router Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
