/**
 * Cloudflare Pages Functions - Login Endpoint
 * URL: /api/auth/login
 */

export async function onRequestPost(context: any): Promise<Response> {
  console.log('🔐 Login endpoint called directly');
  
  const { request, env } = context;
  
  try {
    // Import the auth handler and delegate to it
    const authModule = await import('../auth');
    
    // Create a mock context that the auth handler expects
    const authContext = {
      request,
      env,
      ctx: context
    };
    
    return await authModule.onRequest(authContext);
  } catch (error) {
    console.error('Login endpoint error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Login service unavailable',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
