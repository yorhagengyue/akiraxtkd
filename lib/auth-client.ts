/**
 * Client-side Authentication Utilities
 * JWT token management and API authentication
 */

import { API_ENDPOINTS, buildApiUrl } from './config';

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

/**
 * Get stored tokens from localStorage
 */
export function getStoredTokens(): TokenData | null {
  if (typeof window === 'undefined') return null;
  
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const expiresAt = localStorage.getItem('token_expires_at');
  
  if (!accessToken || !refreshToken || !expiresAt) {
    return null;
  }
  
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: parseInt(expiresAt)
  };
}

/**
 * Check if access token is expired or will expire soon
 */
export function isTokenExpired(tokens: TokenData, bufferMinutes: number = 5): boolean {
  const now = Date.now();
  const buffer = bufferMinutes * 60 * 1000; // Convert to milliseconds
  return tokens.expires_at - buffer <= now;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const tokens = getStoredTokens();
  if (!tokens) return null;
  
  try {
    const response = await fetch(API_ENDPOINTS.auth.refresh(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Update stored tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_expires_at', Date.now() + (data.expires_in * 1000));
        return data.access_token;
      }
    }
    
    // Refresh failed, clear tokens
    clearTokens();
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    return null;
  }
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = getStoredTokens();
  if (!tokens) return null;
  
  // If token is not expired, return it
  if (!isTokenExpired(tokens)) {
    return tokens.access_token;
  }
  
  // Try to refresh the token
  return await refreshAccessToken();
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getValidAccessToken();
  
  if (!accessToken) {
    throw new Error('No valid access token available');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    ...options.headers
  };
  
  return fetch(url, {
    ...options,
    headers
  });
}

/**
 * Logout user and clear all tokens
 */
export async function logout(): Promise<void> {
  const accessToken = localStorage.getItem('access_token');
  
  if (accessToken) {
    try {
      // Call logout endpoint to blacklist the token
      await fetch(API_ENDPOINTS.auth.logout(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  }
  
  // Clear all stored tokens and user data
  clearTokens();
}

/**
 * Clear all stored authentication data
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
  localStorage.removeItem('user_data');
}

/**
 * Get stored user data
 */
export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user_data');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const tokens = getStoredTokens();
  return tokens !== null && !isTokenExpired(tokens, 0); // No buffer for this check
}

/**
 * Auto-refresh token when it's close to expiring
 */
export function setupAutoRefresh(): void {
  if (typeof window === 'undefined') return;
  
  // Check every minute
  const interval = setInterval(async () => {
    const tokens = getStoredTokens();
    if (!tokens) {
      clearInterval(interval);
      return;
    }
    
    // If token expires in the next 5 minutes, refresh it
    if (isTokenExpired(tokens, 5)) {
      console.log('Auto-refreshing access token...');
      const newToken = await refreshAccessToken();
      if (!newToken) {
        console.log('Auto-refresh failed, user needs to re-login');
        clearInterval(interval);
        // Optionally redirect to login page
        window.location.href = '/login';
      }
    }
  }, 60000); // Check every minute
  
  // Clear interval when page unloads
  window.addEventListener('beforeunload', () => {
    clearInterval(interval);
  });
}

/**
 * Initialize authentication system
 */
export function initAuth(): void {
  if (typeof window === 'undefined') return;
  
  // Setup auto-refresh
  setupAutoRefresh();
  
  // Handle token expiration globally
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    
    // If we get a 401 and we have tokens, try to refresh
    if (response.status === 401 && getStoredTokens()) {
      const newToken = await refreshAccessToken();
      if (newToken && args[1]?.headers) {
        // Retry the request with new token
        const headers = args[1].headers as Record<string, string>;
        if (headers['Authorization']?.startsWith('Bearer ')) {
          headers['Authorization'] = `Bearer ${newToken}`;
          return originalFetch.apply(this, args);
        }
      }
    }
    
    return response;
  };
}

export default {
  getStoredTokens,
  isTokenExpired,
  refreshAccessToken,
  getValidAccessToken,
  authenticatedFetch,
  logout,
  clearTokens,
  getStoredUser,
  isAuthenticated,
  setupAutoRefresh,
  initAuth
};
