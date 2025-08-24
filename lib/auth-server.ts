/**
 * Server-side Authentication Logic
 * Shared between Next.js Route Handlers and Cloudflare Functions
 */

import { NextRequest } from 'next/server';

// Types for compatibility with Cloudflare Functions
interface Env {
  DB: any; // D1Database or compatible
  ENVIRONMENT: string;
  DEV_MODE: string;
  AUTH_ENABLED: string;
  DEV_USERS_ENABLED: string;
  JWT_SECRET: string;
}

interface UserAccount {
  user_id: string;
  email: string;
  google_id?: string;
  firebase_uid: string;
  role: 'student' | 'coach' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  display_name?: string;
  photo_url?: string;
  email_verified: boolean;
  provider: 'google' | 'email' | 'dev';
  last_login_at?: string;
  login_count: number;
  terms_accepted_at?: string;
  privacy_accepted_at?: string;
  created_at: string;
  updated_at: string;
  demo_password?: string;
  password_hash?: string;
}

interface LoginRequest {
  firebase_token?: string;
  dev_user_email?: string;
  email?: string;
  password?: string;
}

interface LoginResponse {
  success: boolean;
  user?: UserAccount;
  session_token?: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  dev_mode?: boolean;
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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
 * Get environment variables for Next.js
 */
function getEnv(): Env {
  return {
    DB: null, // Will be set by the route handler
    ENVIRONMENT: process.env.ENVIRONMENT || 'development',
    DEV_MODE: process.env.DEV_MODE || 'true',
    AUTH_ENABLED: process.env.AUTH_ENABLED || 'true',
    DEV_USERS_ENABLED: process.env.DEV_USERS_ENABLED || 'true',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  };
}

/**
 * Mock D1 Database for Next.js (will be replaced with actual DB connection)
 */
class MockD1Database {
  async prepare(query: string) {
    console.log('Mock D1 Query:', query);
    return {
      bind: (...params: any[]) => ({
        first: async () => {
          // Mock user data for testing
          if (query.includes('SELECT * FROM user_accounts WHERE email')) {
            return {
              user_id: 'demo_admin_001',
              email: 'admin@akiraxtkd.com',
              role: 'admin',
              status: 'active',
              display_name: 'Demo Admin',
              provider: 'dev',
              demo_password: 'admin123',
              password_hash: null,
              email_verified: true,
              login_count: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          }
          return null;
        },
        all: async () => ({
          results: [
            {
              user_id: 'demo_admin_001',
              email: 'admin@akiraxtkd.com',
              role: 'admin',
              display_name: 'Demo Admin',
              status: 'active',
            },
            {
              user_id: 'demo_coach_001',
              email: 'coach@akiraxtkd.com',
              role: 'coach',
              display_name: 'Demo Coach',
              status: 'active',
            },
            {
              user_id: 'demo_student_001',
              email: 'student@akiraxtkd.com',
              role: 'student',
              display_name: 'Demo Student',
              status: 'active',
            },
          ],
        }),
        run: async () => ({ success: true }),
      }),
    };
  }
}

/**
 * Base64 encode for Edge Runtime compatibility
 */
function base64Encode(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(str);
  }
  // Edge Runtime fallback - manual base64 encoding
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  
  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : 0;
    const c = i < str.length ? str.charCodeAt(i++) : 0;
    
    const bitmap = (a << 16) | (b << 8) | c;
    
    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    result += chars.charAt((bitmap >> 6) & 63);
    result += chars.charAt(bitmap & 63);
  }
  
  // Pad with '=' characters
  const pad = str.length % 3;
  if (pad === 1) result = result.slice(0, -2) + '==';
  if (pad === 2) result = result.slice(0, -1) + '=';
  
  return result;
}

/**
 * Simple JWT generation for Next.js (simplified version)
 */
function generateSimpleJWT(payload: any, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + 15 * 60, // 15 minutes
    jti: Math.random().toString(36).substr(2, 9),
  };

  const headerB64 = base64Encode(JSON.stringify(header));
  const payloadB64 = base64Encode(JSON.stringify(jwtPayload));
  
  // Simple signature (in production, use proper HMAC)
  const signature = base64Encode(`${headerB64}.${payloadB64}.${secret}`).substr(0, 32);
  
  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Generate token pair for Next.js
 */
function generateTokenPair(user: any, env: Env) {
  const accessToken = generateSimpleJWT({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    display_name: user.display_name,
  }, env.JWT_SECRET);

  const refreshToken = generateSimpleJWT({
    user_id: user.user_id,
    type: 'refresh',
  }, env.JWT_SECRET);

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60, // 15 minutes
    refreshExpiresIn: 7 * 24 * 60 * 60, // 7 days
  };
}

/**
 * Simple password verification (for demo purposes)
 */
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // For demo, just compare directly
  return password === storedHash;
}

/**
 * Handle login request (adapted from Cloudflare Functions)
 */
export async function handleLogin(request: NextRequest): Promise<Response> {
  try {
    console.log('🔐 Login endpoint called');
    
    const body: LoginRequest = await request.json();
    const env = getEnv();
    
    const isDev = env.DEV_MODE === 'true';
    console.log('🔐 Login attempt:', { email: body.email, isDev });

    // Email/Password login
    if (body.email && body.password) {
      // Hardcoded demo users for testing
      const demoUsers = {
        'admin@akiraxtkd.com': {
          user_id: 'demo_admin_001',
          email: 'admin@akiraxtkd.com',
          role: 'admin',
          status: 'active',
          display_name: 'Demo Admin',
          provider: 'dev',
          demo_password: 'admin123',
          email_verified: true,
          login_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        'coach@akiraxtkd.com': {
          user_id: 'demo_coach_001',
          email: 'coach@akiraxtkd.com',
          role: 'coach',
          status: 'active',
          display_name: 'Demo Coach',
          provider: 'dev',
          demo_password: 'coach123',
          email_verified: true,
          login_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        'student@akiraxtkd.com': {
          user_id: 'demo_student_001',
          email: 'student@akiraxtkd.com',
          role: 'student',
          status: 'active',
          display_name: 'Demo Student',
          provider: 'dev',
          demo_password: 'student123',
          email_verified: true,
          login_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };

      const user = demoUsers[body.email as keyof typeof demoUsers];
      
      if (!user) {
        console.log('❌ User not found:', body.email);
        return jsonResponse({
          success: false,
          error: 'Invalid email or password',
          dev_mode: isDev,
        }, 401);
      }

      console.log('👤 User found:', { email: user.email, role: user.role });

      // Verify password
      if (user.demo_password !== body.password) {
        console.log('❌ Password mismatch');
        return jsonResponse({
          success: false,
          error: 'Invalid email or password',
          dev_mode: isDev,
        }, 401);
      }

      console.log('✅ Password verified');

      // Generate JWT token pair
      const tokenPair = generateTokenPair(user, env);

      console.log('🎫 Token generated');

      return jsonResponse({
        success: true,
        user,
        access_token: tokenPair.accessToken,
        refresh_token: tokenPair.refreshToken,
        expires_in: tokenPair.expiresIn,
        token_type: 'Bearer',
        dev_mode: isDev,
      });
    }

    console.log('❌ Invalid login request format');
    return jsonResponse({
      success: false,
      error: 'Invalid login request',
      dev_mode: isDev,
    }, 400);

  } catch (error) {
    console.error('❌ Login error:', error);
    return jsonResponse({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
}

/**
 * Handle logout request
 */
export async function handleLogout(request: NextRequest): Promise<Response> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    console.log('🚪 Logout request:', { hasAuth: !!authHeader });

    // In a real implementation, we would blacklist the token
    // For now, just return success
    return jsonResponse({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    return jsonResponse({
      success: false,
      error: 'Logout failed'
    }, 500);
  }
}

/**
 * Handle CORS preflight requests
 */
export function handleCORS(): Response {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * Get environment info
 */
export function getEnvironmentInfo(): Response {
  const env = getEnv();
  
  return jsonResponse({
    success: true,
    environment: env.ENVIRONMENT,
    dev_mode: env.DEV_MODE === 'true',
    auth_enabled: env.AUTH_ENABLED === 'true',
    dev_users_enabled: env.DEV_USERS_ENABLED === 'true',
    timestamp: new Date().toISOString(),
    version: 'next-on-pages',
  });
}
