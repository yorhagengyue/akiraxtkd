/**
 * Route Protection and Role-Based Access Control
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, isAuthenticated } from '@/lib/auth-client';

interface RouteProtectionProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

interface User {
  user_id: string;
  email: string;
  role: string;
  display_name: string;
}

/**
 * Route protection component that checks authentication and role permissions
 */
export default function RouteProtection({
  children,
  allowedRoles = [],
  redirectTo = '/login',
  requireAuth = true
}: RouteProtectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      console.log('🔐 Route Protection Check Started');
      console.log('Required Auth:', requireAuth);
      console.log('Allowed Roles:', allowedRoles);

      // Check if authentication is required
      if (!requireAuth) {
        console.log('✅ No auth required, allowing access');
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Check if user is authenticated
      const authenticated = isAuthenticated();
      console.log('🔍 Is Authenticated:', authenticated);
      
      if (!authenticated) {
        console.log('❌ User not authenticated, redirecting to login');
        setIsAuthorized(false);
        setIsLoading(false);
        router.push(redirectTo);
        return;
      }

      // Get user data
      const user: User | null = getStoredUser();
      console.log('👤 User Data:', user);
      
      if (!user) {
        console.log('❌ No user data found, redirecting to login');
        setIsAuthorized(false);
        setIsLoading(false);
        router.push(redirectTo);
        return;
      }

      // Check role permissions
      if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.includes(user.role);
        console.log(`🎭 Role Check: User role '${user.role}' in allowed roles [${allowedRoles.join(', ')}]: ${hasPermission}`);
        
        if (!hasPermission) {
          console.log(`🚫 Access denied for role '${user.role}'`);
          
          // Redirect based on user's actual role
          const roleRedirects = {
            admin: '/dashboard/admin',
            coach: '/dashboard/coach',
            student: '/dashboard/student'
          };
          
          const userRoleRedirect = roleRedirects[user.role as keyof typeof roleRedirects];
          console.log(`🔄 Redirecting to: ${userRoleRedirect}`);
          
          setIsAuthorized(false);
          setIsLoading(false);
          
          if (userRoleRedirect) {
            router.push(userRoleRedirect);
          } else {
            router.push('/login');
          }
          return;
        }
      }

      // User is authenticated and authorized
      console.log('✅ Access granted');
      setIsAuthorized(true);
    } catch (error) {
      console.error('❌ Route protection error:', error);
      setIsAuthorized(false);
      router.push(redirectTo);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}

/**
 * Higher-order component for route protection
 */
export function withRouteProtection(
  Component: React.ComponentType<any>,
  options: Omit<RouteProtectionProps, 'children'> = {}
) {
  return function ProtectedComponent(props: any) {
    return (
      <RouteProtection {...options}>
        <Component {...props} />
      </RouteProtection>
    );
  };
}

/**
 * Hook to get current user with role checking
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      if (!isAuthenticated()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData = getStoredUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { logout: performLogout } = await import('@/lib/auth-client');
      await performLogout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isCoach = (): boolean => hasRole(['coach', 'admin']);
  const isStudent = (): boolean => hasRole('student');

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    hasRole,
    isAdmin,
    isCoach,
    isStudent,
    refresh: checkAuth
  };
}

/**
 * Role-based component rendering
 */
interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded h-4 w-full"></div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
