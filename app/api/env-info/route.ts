/**
 * Next.js Route Handler - Environment Info Endpoint
 * URL: /api/env-info
 */

import { NextRequest } from 'next/server';
import { getEnvironmentInfo, handleCORS } from '@/lib/auth-server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  console.log('🔧 GET /api/env-info - Next.js Route Handler');
  return getEnvironmentInfo();
}

export async function OPTIONS(request: NextRequest) {
  console.log('🔧 OPTIONS /api/env-info - CORS preflight');
  return handleCORS();
}
