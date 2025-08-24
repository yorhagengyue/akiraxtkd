/**
 * Simple test endpoint for Cloudflare Pages Functions
 * Access at: /test
 */

export async function onRequest(context: any): Promise<Response> {
  const { request } = context;
  const url = new URL(request.url);
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Cloudflare Pages Functions is working!',
    timestamp: new Date().toISOString(),
    method: request.method,
    path: url.pathname,
    hostname: url.hostname
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
