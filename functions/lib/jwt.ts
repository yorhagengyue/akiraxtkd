/**
 * JWT Authentication Library
 * Secure token generation, validation, and management
 */

import { Env } from '../types';

interface JWTPayload {
  user_id: string;
  email: string;
  role: string;
  display_name: string;
  iat: number;  // issued at
  exp: number;  // expires at
  jti: string;  // JWT ID for revocation
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

// Token configuration
const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
  ISSUER: 'akiraxtkd.com',
  ALGORITHM: 'HS256'
};

/**
 * Generate JWT secret key from environment
 */
function getJWTSecret(env: Env): string {
  return env.JWT_SECRET || 'dev-secret-key-change-in-production';
}

/**
 * Generate a secure random string for JTI
 */
function generateJTI(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create JWT header and payload
 */
function createJWTComponents(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'>, expirySeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  
  const header = {
    alg: JWT_CONFIG.ALGORITHM,
    typ: 'JWT'
  };

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expirySeconds,
    jti: generateJTI(),
    iss: JWT_CONFIG.ISSUER
  };

  return { header, payload: fullPayload };
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

/**
 * Create HMAC signature
 */
async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signatureArray = new Uint8Array(signature);
  const signatureString = String.fromCharCode.apply(null, Array.from(signatureArray));
  return base64UrlEncode(signatureString);
}

/**
 * Verify HMAC signature
 */
async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
  try {
    const expectedSignature = await createSignature(data, secret);
    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Generate JWT token
 */
export async function generateJWT(
  user: { user_id: string; email: string; role: string; display_name: string },
  env: Env,
  expirySeconds: number = JWT_CONFIG.ACCESS_TOKEN_EXPIRY
): Promise<string> {
  try {
    const secret = getJWTSecret(env);
    const { header, payload } = createJWTComponents(user, expirySeconds);
    
    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
    const data = `${headerEncoded}.${payloadEncoded}`;
    
    const signature = await createSignature(data, secret);
    
    return `${data}.${signature}`;
  } catch (error) {
    console.error('JWT generation error:', error);
    throw new Error('Failed to generate JWT token');
  }
}

/**
 * Verify and decode JWT token
 */
export async function verifyJWT(token: string, env: Env): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerEncoded, payloadEncoded, signature] = parts;
    const data = `${headerEncoded}.${payloadEncoded}`;
    const secret = getJWTSecret(env);
    
    // Verify signature
    const isValid = await verifySignature(data, signature, secret);
    if (!isValid) {
      return null;
    }

    // Decode payload
    const payloadJson = base64UrlDecode(payloadEncoded);
    const payload: JWTPayload = JSON.parse(payloadJson);
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    // Check issuer
    if (payload.iss !== JWT_CONFIG.ISSUER) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Generate token pair (access + refresh)
 */
export async function generateTokenPair(
  user: { user_id: string; email: string; role: string; display_name: string },
  env: Env
): Promise<TokenPair> {
  try {
    const accessToken = await generateJWT(user, env, JWT_CONFIG.ACCESS_TOKEN_EXPIRY);
    const refreshToken = await generateJWT(user, env, JWT_CONFIG.REFRESH_TOKEN_EXPIRY);
    
    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      refreshExpiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY
    };
  } catch (error) {
    console.error('Token pair generation error:', error);
    throw new Error('Failed to generate token pair');
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string, env: Env): Promise<string | null> {
  try {
    const payload = await verifyJWT(refreshToken, env);
    if (!payload) {
      return null;
    }

    // Generate new access token
    const user = {
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
      display_name: payload.display_name
    };

    return await generateJWT(user, env, JWT_CONFIG.ACCESS_TOKEN_EXPIRY);
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * Extract user from JWT token
 */
export async function getUserFromToken(token: string, env: Env): Promise<any | null> {
  const payload = await verifyJWT(token, env);
  if (!payload) {
    return null;
  }

  return {
    user_id: payload.user_id,
    email: payload.email,
    role: payload.role,
    display_name: payload.display_name
  };
}

/**
 * Blacklist token (for logout)
 * In production, this should use a distributed cache like Redis
 */
const tokenBlacklist = new Set<string>();

export function blacklistToken(jti: string): void {
  tokenBlacklist.add(jti);
}

export function isTokenBlacklisted(jti: string): boolean {
  return tokenBlacklist.has(jti);
}

/**
 * Decode JWT without verification (for getting JTI)
 */
export function decodeJWTUnsafe(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

/**
 * Authentication middleware
 */
export async function requireAuth(request: Request, env: Env): Promise<any> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authentication required');
  }

  const token = authHeader.substring(7);
  const user = await getUserFromToken(token, env);
  
  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Check if token is blacklisted
  const payload = decodeJWTUnsafe(token);
  if (payload && isTokenBlacklisted(payload.jti)) {
    throw new Error('Token has been revoked');
  }

  return user;
}

/**
 * Role-based authorization middleware
 */
export function requireRole(allowedRoles: string[]) {
  return (user: any) => {
    if (!allowedRoles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }
    return user;
  };
}

export default {
  generateJWT,
  verifyJWT,
  generateTokenPair,
  refreshAccessToken,
  getUserFromToken,
  blacklistToken,
  isTokenBlacklisted,
  decodeJWTUnsafe,
  requireAuth,
  requireRole,
  JWT_CONFIG
};
