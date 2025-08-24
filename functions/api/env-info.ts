/**
 * Environment Information API Endpoint
 * Provides system and environment details for debugging
 */

interface Env {
  ENVIRONMENT?: string;
  APP_NAME?: string;
  CONTACT_EMAIL?: string;
  WHATSAPP_NUMBER?: string;
  DEV_MODE?: string;
  AUTH_ENABLED?: string;
  DEV_USERS_ENABLED?: string;
  DB?: D1Database;
}

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Handle environment info requests
 */
async function handleEnvInfo(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const isDevMode = env.DEV_MODE === 'true';
    
    // Basic environment info (always available)
    const envInfo = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: env.ENVIRONMENT || 'unknown',
      app_name: env.APP_NAME || 'Akira X Taekwondo',
      dev_mode: isDevMode,
      auth_enabled: env.AUTH_ENABLED === 'true',
      hostname: url.hostname,
      pathname: url.pathname,
      method: request.method,
    };

    // Add detailed info only in dev mode
    if (isDevMode) {
      Object.assign(envInfo, {
        dev_users_enabled: env.DEV_USERS_ENABLED === 'true',
        contact_email: env.CONTACT_EMAIL,
        whatsapp_number: env.WHATSAPP_NUMBER,
        database_available: !!env.DB,
        headers: Object.fromEntries(request.headers.entries()),
      });
    }

    return jsonResponse(envInfo);
  } catch (error) {
    console.error('Environment info error:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to get environment info',
    }, 500);
  }
}

/**
 * Main request handler
 */
export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context;
  const method = request.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (method === 'GET') {
    return handleEnvInfo(request, env);
  }

  // Method not allowed
  return jsonResponse({
    success: false,
    error: 'Method not allowed',
    allowed_methods: ['GET'],
  }, 405);
}
