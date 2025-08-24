/**
 * Next.js Route Handler - Login Endpoint
 * URL: /api/auth/login
 */

import { NextRequest } from 'next/server';
import { handleLogin, handleCORS } from '@/lib/auth-server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  console.log('🔐 POST /api/auth/login - Next.js Route Handler');
  return handleLogin(request);
}

export async function OPTIONS(request: NextRequest) {
  console.log('🔧 OPTIONS /api/auth/login - CORS preflight');
  return handleCORS();
}
