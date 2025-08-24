/**
 * Next.js Route Handler - Logout Endpoint
 * URL: /api/auth/logout
 */

import { NextRequest } from 'next/server';
import { handleLogout, handleCORS } from '@/lib/auth-server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  console.log('🚪 POST /api/auth/logout - Next.js Route Handler');
  return handleLogout(request);
}

export async function OPTIONS(request: NextRequest) {
  console.log('🔧 OPTIONS /api/auth/logout - CORS preflight');
  return handleCORS();
}
