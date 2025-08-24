/**
 * Next.js Route Handler - Test Endpoint
 * URL: /api/test
 */

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🧪 GET /api/test - Next.js Route Handler');
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Next.js Route Handlers with next-on-pages is working!',
    timestamp: new Date().toISOString(),
    version: 'next-on-pages v0.2',
    environment: process.env.NODE_ENV || 'development',
    deployment_trigger: 'auto-deploy-test',
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
