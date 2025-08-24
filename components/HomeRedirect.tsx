'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getStoredUser } from '@/lib/auth-client';

interface HomeRedirectProps {
  children: React.ReactNode;
}

/**
 * HomeRedirect - 主页智能重定向
 * 如果用户已登录，显示"前往Dashboard"的快捷链接
 */
export default function HomeRedirect({ children }: HomeRedirectProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const userData = getStoredUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/login';
    
    return user.role === 'admin' ? '/dashboard/admin' :
           user.role === 'coach' ? '/dashboard/coach' :
           '/dashboard/student';
  };

  const handleGoToDashboard = () => {
    router.push(getDashboardPath());
  };

  // 如果已登录，在页面顶部显示快捷链接
  if (user && !isChecking) {
    return (
      <>
        {/* 已登录用户的快捷导航条 */}
        <div className="bg-blue-600 text-white py-2 px-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm">
              Welcome back, <strong>{user.display_name}</strong>!
            </span>
            <button
              onClick={handleGoToDashboard}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-1 rounded-lg text-sm font-medium transition-colors"
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}
