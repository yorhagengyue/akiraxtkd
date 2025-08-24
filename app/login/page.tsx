/**
 * Login Page - Centered Card, Refined Background
 * Modern, concise layout with minimal distractions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedPage from '@/components/animations/AnimatedPage';
import { ToastContainer, useToast } from '@/components/animations/Toast';

const demoAccounts = [
  { role: 'Admin', email: 'admin@akiraxtkd.com', password: 'admin123' },
  { role: 'Coach', email: 'coach@akiraxtkd.com', password: 'coach123' },
  { role: 'Student', email: 'student@akiraxtkd.com', password: 'student123' },
];

export default function LoginPage() {
  const router = useRouter();
  const { toasts, success, error, removeToast } = useToast();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 检查是否已登录
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { isAuthenticated, getStoredUser } = await import('@/lib/auth-client');
        
        if (isAuthenticated()) {
          const user = getStoredUser();
          if (user) {
            console.log('✅ User already logged in, redirecting...');
            success('Already signed in', `Welcome back, ${user.display_name}!`);
            
            // 根据用户角色重定向
            const redirectPath = user.role === 'admin' ? '/dashboard/admin' :
                               user.role === 'coach' ? '/dashboard/coach' :
                               '/dashboard/student';
            
            router.push(redirectPath);
            return;
          }
        }
        
        setIsCheckingAuth(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setLoginError('Please enter both email and password');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.login(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (data.success) {
        // Store JWT tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        localStorage.setItem('token_expires_at', Date.now() + (data.expires_in * 1000));
        
        success('Welcome back!', `Signed in as ${data.user.display_name}`, true);
        
        // 触发自定义事件通知其他组件认证状态已改变
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Redirect based on user role
        const redirectPath = data.user.role === 'admin' ? '/dashboard/admin' :
                           data.user.role === 'coach' ? '/dashboard/coach' :
                           '/dashboard/student';
        
        setTimeout(() => router.push(redirectPath), 1200);
      } else {
        const msg = data.error || 'Sign in failed. Please check your credentials.';
        setLoginError(msg);
        error('Sign In Failed', msg);
      }
    } catch (err) {
      const msg = 'Connection error. Please try again.';
      setLoginError(msg);
      error('Connection Error', msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[number]) => {
    setFormData({ email: account.email, password: account.password });
  };

  // 显示认证检查加载状态
  if (isCheckingAuth) {
    return (
      <AnimatedPage>
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
          
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking login status...</p>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden">
        {/* Subtle layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

        {/* Header */}
        <header className="relative z-10">
          <div className="mx-auto max-w-5xl px-6 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="group flex items-center space-x-3">
                <div className="h-10 w-10 overflow-hidden rounded-2xl border-2 border-white shadow-lg transition-transform group-hover:scale-105">
                  <img src="/img/logo.jpg" alt="Akira X Taekwondo" className="h-full w-full object-cover" />
                </div>
                <span className="text-xl font-bold text-gray-900">Akira X Taekwondo</span>
              </Link>
              <Link href="/" className="font-medium text-gray-600 transition-colors hover:text-gray-900">
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Centered form */}
        <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-gray-100 bg-white/90 p-8 shadow-xl backdrop-blur">
              {/* Form header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src="/img/logo.jpg"
                    alt="Akira X Taekwondo Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Akira X Taekwondo</h2>
            <p className="text-sm text-gray-500">Singapore Premier Academy</p>
            <p className="text-xs text-blue-600 font-medium mt-1">demo v0.2 - Next.js Route Handlers</p>
          </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Sign In</h1>
                <p className="text-gray-600">Enter your credentials to continue</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{loginError}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Demo accounts - compact */}
              <div className="mt-6">
                <div className="mb-2 text-center text-sm font-medium text-gray-900">Quick Demo</div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {demoAccounts.map((a) => (
                    <button
                      key={a.role}
                      onClick={() => handleDemoLogin(a)}
                      className="group rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
                      title={`${a.email} / ${a.password}`}
                    >
                      <span className="mr-1 inline-block h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 align-middle" />
                      {a.role}
                      <ArrowRight className="ml-1 inline h-3 w-3 text-gray-400 transition-colors group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-center text-xs text-gray-500">Click a role to auto-fill the form</p>
              </div>

              {/* Footer link */}
              <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
                New here?{' '}
                <Link href="/register" className="font-medium text-blue-600 transition-colors hover:text-blue-500">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AnimatedPage>
  );
}