'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getStoredUser, setupAutoRefresh, initAuth } from '@/lib/auth-client';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - 全局认证状态管理
 * 处理：
 * 1. 认证系统初始化
 * 2. 自动token刷新
 * 3. 登录状态持久化检查
 * 4. 自动重定向到dashboard（如果已登录）
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 初始化认证系统
    initAuth();
    setupAutoRefresh();
    
    // 检查登录状态并处理自动重定向
    handleAuthState();
    
    setIsInitialized(true);
  }, []);

  const handleAuthState = () => {
    // 如果用户已登录且在登录页面，自动重定向到dashboard
    if (isAuthenticated() && pathname === '/login') {
      const user = getStoredUser();
      if (user) {
        console.log('✅ User already authenticated, redirecting to dashboard');
        
        // 根据用户角色重定向
        const redirectPath = user.role === 'admin' ? '/dashboard/admin' :
                           user.role === 'coach' ? '/dashboard/coach' :
                           '/dashboard/student';
        
        router.push(redirectPath);
        return;
      }
    }

    // 如果用户在dashboard页面但未登录，重定向到登录页
    if (pathname.startsWith('/dashboard') && !isAuthenticated()) {
      console.log('❌ User not authenticated on dashboard, redirecting to login');
      router.push('/login');
      return;
    }

    // 输出当前认证状态用于调试
    if (isAuthenticated()) {
      const user = getStoredUser();
      console.log('🔐 Auth Status: Authenticated as', user?.display_name, `(${user?.role})`);
    } else {
      console.log('🔓 Auth Status: Not authenticated');
    }
  };

  // 监听路由变化，重新检查认证状态
  useEffect(() => {
    if (isInitialized) {
      handleAuthState();
    }
  }, [pathname, isInitialized]);

  return <>{children}</>;
}

/**
 * 检查当前用户是否有权限访问指定路径
 */
export function checkRouteAccess(path: string): boolean {
  const user = getStoredUser();
  
  if (!user) return false;

  // Dashboard路径权限检查
  if (path.startsWith('/dashboard/admin')) {
    return user.role === 'admin';
  }
  
  if (path.startsWith('/dashboard/coach')) {
    return user.role === 'coach' || user.role === 'admin';
  }
  
  if (path.startsWith('/dashboard/student')) {
    return user.role === 'student';
  }

  return true;
}
