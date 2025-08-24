/**
 * Environment Information API
 * Returns current environment configuration (dev mode only)
 */

interface Env {
  ENVIRONMENT: string;
  DEV_MODE: string;
  AUTH_ENABLED: string;
  DEV_USERS_ENABLED: string;
  APP_NAME: string;
  CONTACT_EMAIL: string;
  WHATSAPP_NUMBER: string;
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handle CORS preflight requests
 */
function handleCORS(): Response {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * Create JSON response with CORS headers
 */
function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

/**
 * Get environment information
 */
async function handleEnvInfo(request: Request, env: Env): Promise<Response> {
  const isDev = env.DEV_MODE === 'true';

  // Only allow in development mode
  if (!isDev) {
    return jsonResponse({
      success: false,
      error: 'Environment information not available in production',
    }, 403);
  }

  try {
    const envInfo = {
      success: true,
      environment: env.ENVIRONMENT || 'unknown',
      devMode: env.DEV_MODE === 'true',
      authEnabled: env.AUTH_ENABLED === 'true',
      devUsersEnabled: env.DEV_USERS_ENABLED === 'true',
      databaseName: 'akiraxtkd-db-dev', // From wrangler.toml
      appInfo: {
        name: env.APP_NAME || 'Akira X Taekwondo',
        contact: env.CONTACT_EMAIL || '',
        whatsapp: env.WHATSAPP_NUMBER || '',
      },
      timestamp: new Date().toISOString(),
      buildInfo: {
        version: '1.0.0-dev',
        node_env: 'development',
        platform: 'cloudflare-workers',
      },
    };

    return jsonResponse(envInfo);

  } catch (error) {
    console.error('Environment info error:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to retrieve environment information',
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
    return handleCORS();
  }

  // Only allow GET requests
  if (method !== 'GET') {
    return jsonResponse({
      success: false,
      error: 'Method not allowed',
    }, 405);
  }

  return handleEnvInfo(request, env);
}
