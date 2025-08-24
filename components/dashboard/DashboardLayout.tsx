/**
 * Dashboard Layout - Shared layout for all dashboard pages
 */

'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  LogOut, 
  User, 
  Settings,
  Menu,
  X,
  Bell
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  userRole: 'admin' | 'coach' | 'student';
}

interface UserData {
  display_name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  userRole 
}: DashboardLayoutProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-red-500 to-red-600';
      case 'coach': return 'from-green-500 to-green-600';
      case 'student': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleInitial = (role: string) => {
    switch (role) {
      case 'admin': return 'A';
      case 'coach': return 'C';
      case 'student': return 'S';
      default: return 'U';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src="/img/logo.jpg"
                alt="Akira X Taekwondo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-gray-900">Akira X TKD</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            <Link 
              href={`/dashboard/${userRole}`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
            
            {userRole === 'admin' && (
              <>
                <Link 
                  href="/dashboard/admin/students"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <User className="mr-3 h-4 w-4" />
                  Students
                </Link>
                <Link 
                  href="/dashboard/admin/classes"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Classes
                </Link>
              </>
            )}

            {userRole === 'coach' && (
              <>
                <Link 
                  href="/dashboard/coach/classes"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  My Classes
                </Link>
                <Link 
                  href="/dashboard/coach/students"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <User className="mr-3 h-4 w-4" />
                  My Students
                </Link>
              </>
            )}

            {userRole === 'student' && (
              <>
                <Link 
                  href="/dashboard/student/classes"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  My Classes
                </Link>
                <Link 
                  href="/dashboard/student/progress"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <User className="mr-3 h-4 w-4" />
                  My Progress
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(userRole)} rounded-full flex items-center justify-center text-white font-semibold`}>
              {getRoleInitial(userRole)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData?.display_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData?.email}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="lg:ml-0 ml-3">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
