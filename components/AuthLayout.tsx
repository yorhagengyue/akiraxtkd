/**
 * Simplified Layout for Authentication Pages
 * Minimal navigation focused on auth flow
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white">
                <img
                  src="/img/logo.jpg"
                  alt="Akira X Taekwondo Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="ml-3 text-lg font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent">
                Akira X Taekwondo
              </span>
            </Link>

            {/* Back to Home */}
            <Link 
              href="/"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-2">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-4">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-md mx-auto px-4 py-6 text-center">
          <div className="text-xs text-gray-500 space-y-2">
            <div>
              <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
              {' • '}
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            </div>
            <div>
              © 2024 Akira X Taekwondo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
