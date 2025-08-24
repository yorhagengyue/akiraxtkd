/**
 * Authentication API Endpoints
 * Handles user login, registration, and session management
 */

interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  DEV_MODE: string;
  AUTH_ENABLED: string;
  DEV_USERS_ENABLED: string;
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
 * Verify Firebase ID Token (placeholder for production)
 */
async function verifyFirebaseToken(token: string): Promise<any> {
  // TODO: Implement Firebase Admin SDK verification
  // For now, return mock data for development
  return {
    uid: 'firebase_' + Date.now(),
    email: 'user@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg',
    email_verified: true,
  };
}

/**
 * Get or create user account in D1 database
 */
async function getOrCreateUser(db: D1Database, firebaseUser: any, provider: string = 'google'): Promise<UserAccount> {
  // Check if user exists
  const existingUser = await db
    .prepare('SELECT * FROM user_accounts WHERE firebase_uid = ? OR email = ?')
    .bind(firebaseUser.uid, firebaseUser.email)
    .first<UserAccount>();

  if (existingUser) {
    // Update last login
    await db
      .prepare(`
        UPDATE user_accounts 
        SET last_login_at = CURRENT_TIMESTAMP, 
            login_count = login_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `)
      .bind(existingUser.user_id)
      .run();

    return existingUser;
  }

  // Create new user
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db
    .prepare(`
      INSERT INTO user_accounts (
        user_id, email, firebase_uid, role, status, display_name, 
        photo_url, email_verified, provider, login_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    .bind(
      userId,
      firebaseUser.email,
      firebaseUser.uid,
      'student', // Default role
      'active',
      firebaseUser.name || firebaseUser.email,
      firebaseUser.picture || null,
      firebaseUser.email_verified || false,
      provider,
      1
    )
    .run();

  // Fetch the created user
  const newUser = await db
    .prepare('SELECT * FROM user_accounts WHERE user_id = ?')
    .bind(userId)
    .first<UserAccount>();

  if (!newUser) {
    throw new Error('Failed to create user account');
  }

  return newUser;
}

/**
 * Development mode: Get dev user by email
 */
async function getDevUser(db: D1Database, email: string): Promise<UserAccount | null> {
  const user = await db
    .prepare('SELECT * FROM user_accounts WHERE email = ? AND provider = ?')
    .bind(email, 'dev')
    .first<UserAccount>();

  if (user) {
    // Update last login for dev user
    await db
      .prepare(`
        UPDATE user_accounts 
        SET last_login_at = CURRENT_TIMESTAMP, 
            login_count = login_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `)
      .bind(user.user_id)
      .run();
  }

  return user;
}

/**
 * Import JWT utilities and password hashing
 */
import { generateTokenPair, refreshAccessToken, requireAuth, blacklistToken, decodeJWTUnsafe } from '../lib/jwt';
import { verifyPassword, createPasswordHash } from '../lib/password';

/**
 * Handle login request
 */
async function handleLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body: LoginRequest = await request.json();
    const isDev = env.DEV_MODE === 'true';
    const authEnabled = env.AUTH_ENABLED === 'true';
    const devUsersEnabled = env.DEV_USERS_ENABLED === 'true';

    // Email/Password login
    if (body.email && body.password) {
      const user = await env.DB
        .prepare('SELECT * FROM user_accounts WHERE email = ?')
        .bind(body.email)
        .first<UserAccount>();
      
      if (!user) {
        return jsonResponse({
          success: false,
          error: 'Invalid email or password',
          dev_mode: isDev,
        }, 401);
      }

      // Verify password
      let passwordValid = false;
      
      // For demo users, check both demo_password and password_hash
      if (user.demo_password && user.demo_password === body.password) {
        passwordValid = true;
        
        // Hash the demo password and store it for future use
        if (!user.password_hash) {
          const hashedPassword = await createPasswordHash(body.password);
          await env.DB
            .prepare('UPDATE user_accounts SET password_hash = ? WHERE user_id = ?')
            .bind(hashedPassword, user.user_id)
            .run();
        }
      } else if (user.password_hash) {
        passwordValid = await verifyPassword(body.password, user.password_hash);
      }
      
      if (!passwordValid) {
        return jsonResponse({
          success: false,
          error: 'Invalid email or password',
          dev_mode: isDev,
        }, 401);
      }

      // Update last login
      await env.DB
        .prepare(`
          UPDATE user_accounts 
          SET last_login_at = CURRENT_TIMESTAMP, 
              login_count = login_count + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `)
        .bind(user.user_id)
        .run();

      // Generate JWT token pair
      const tokenPair = await generateTokenPair({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        display_name: user.display_name || user.email
      }, env);

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

    // Development mode login (legacy)
    if (isDev && !authEnabled && devUsersEnabled && body.dev_user_email) {
      const devUser = await getDevUser(env.DB, body.dev_user_email);
      
      if (!devUser) {
        return jsonResponse({
          success: false,
          error: 'Development user not found',
          dev_mode: true,
        }, 404);
      }

      // Generate JWT token pair for dev user
      const tokenPair = await generateTokenPair({
        user_id: devUser.user_id,
        email: devUser.email,
        role: devUser.role,
        display_name: devUser.display_name || devUser.email
      }, env);

      return jsonResponse({
        success: true,
        user: devUser,
        access_token: tokenPair.accessToken,
        refresh_token: tokenPair.refreshToken,
        expires_in: tokenPair.expiresIn,
        token_type: 'Bearer',
        dev_mode: true,
      });
    }

    // Production mode login with Firebase
    if (authEnabled && body.firebase_token) {
      try {
        const firebaseUser = await verifyFirebaseToken(body.firebase_token);
        const user = await getOrCreateUser(env.DB, firebaseUser);
        // Generate JWT token pair for Firebase user
        const tokenPair = await generateTokenPair({
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          display_name: user.display_name || user.email
        }, env);

        return jsonResponse({
          success: true,
          user,
          access_token: tokenPair.accessToken,
          refresh_token: tokenPair.refreshToken,
          expires_in: tokenPair.expiresIn,
          token_type: 'Bearer',
          dev_mode: false,
        });
      } catch (error) {
        return jsonResponse({
          success: false,
          error: 'Invalid Firebase token',
          dev_mode: false,
        }, 401);
      }
    }

    return jsonResponse({
      success: false,
      error: 'Invalid login request',
      dev_mode: isDev,
    }, 400);

  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse({
      success: false,
      error: 'Internal server error',
    }, 500);
  }
}

/**
 * Handle logout request
 */
async function handleLogout(request: Request, env: Env): Promise<Response> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = decodeJWTUnsafe(token);
      
      if (payload && payload.jti) {
        // Blacklist the token
        blacklistToken(payload.jti);
      }
    }

    return jsonResponse({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return jsonResponse({
      success: false,
      error: 'Logout failed'
    }, 500);
  }
}

/**
 * Handle token refresh request
 */
async function handleRefresh(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return jsonResponse({
        success: false,
        error: 'Refresh token required'
      }, 400);
    }

    const newAccessToken = await refreshAccessToken(refresh_token, env);
    
    if (!newAccessToken) {
      return jsonResponse({
        success: false,
        error: 'Invalid or expired refresh token'
      }, 401);
    }

    return jsonResponse({
      success: true,
      access_token: newAccessToken,
      token_type: 'Bearer',
      expires_in: 15 * 60 // 15 minutes
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return jsonResponse({
      success: false,
      error: 'Token refresh failed'
    }, 500);
  }
}

/**
 * Get current user info
 */
async function handleMe(request: Request, env: Env): Promise<Response> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonResponse({
        success: false,
        error: 'No authorization token provided',
      }, 401);
    }

    const token = authHeader.substring(7);
    
    try {
      // Decode session token (in production, verify JWT signature)
      const payload = JSON.parse(atob(token));
      
      // Check if token is expired
      if (payload.exp < Date.now()) {
        return jsonResponse({
          success: false,
          error: 'Token expired',
        }, 401);
      }

      // Get current user data from database
      const user = await env.DB
        .prepare('SELECT * FROM user_accounts WHERE user_id = ?')
        .bind(payload.user_id)
        .first<UserAccount>();

      if (!user) {
        return jsonResponse({
          success: false,
          error: 'User not found',
        }, 404);
      }

      return jsonResponse({
        success: true,
        user,
      });

    } catch (error) {
      return jsonResponse({
        success: false,
        error: 'Invalid token',
      }, 401);
    }

  } catch (error) {
    console.error('Me endpoint error:', error);
    return jsonResponse({
      success: false,
      error: 'Internal server error',
    }, 500);
  }
}

/**
 * Get development users (only in dev mode)
 */
async function handleDevUsers(request: Request, env: Env): Promise<Response> {
  const isDev = env.DEV_MODE === 'true';
  const devUsersEnabled = env.DEV_USERS_ENABLED === 'true';

  if (!isDev || !devUsersEnabled) {
    return jsonResponse({
      success: false,
      error: 'Development users not available',
    }, 403);
  }

  try {
    const devUsers = await env.DB
      .prepare('SELECT user_id, email, role, display_name, status FROM user_accounts WHERE provider = ? ORDER BY role')
      .bind('dev')
      .all();

    return jsonResponse({
      success: true,
      users: devUsers.results,
      dev_mode: true,
    });

  } catch (error) {
    console.error('Dev users error:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to fetch development users',
    }, 500);
  }
}

/**
 * Main request handler
 */
export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return handleCORS();
  }

  // Route requests
  if (method === 'POST' && url.pathname.endsWith('/login')) {
    return handleLogin(request, env);
  }

  if (method === 'POST' && url.pathname.endsWith('/logout')) {
    return handleLogout(request, env);
  }

  if (method === 'POST' && url.pathname.endsWith('/refresh')) {
    return handleRefresh(request, env);
  }

  if (method === 'GET' && url.pathname.endsWith('/me')) {
    return handleMe(request, env);
  }

  if (method === 'GET' && url.pathname.endsWith('/dev-users')) {
    return handleDevUsers(request, env);
  }

  // Default response
  return jsonResponse({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: {
      'POST /api/auth/login': 'User login',
      'POST /api/auth/logout': 'User logout',
      'POST /api/auth/refresh': 'Refresh access token',
      'GET /api/auth/me': 'Get current user',
      'GET /api/auth/dev-users': 'Get development users (dev mode only)',
    },
  }, 404);
}
