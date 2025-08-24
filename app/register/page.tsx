/**
 * Registration Page - Centered Card, Concise Fields
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import AnimatedPage from '@/components/animations/AnimatedPage';
import { ToastContainer, useToast } from '@/components/animations/Toast';

type UserRole = 'student' | 'parent' | 'coach';

interface FormData {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  phone: string;
  agreeToTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { toasts, success, error, removeToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    role: 'student',
    name: '',
    email: '',
    password: '',
    phone: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { id: 'student' as UserRole, title: 'Student' },
    { id: 'parent' as UserRole, title: 'Parent' },
    { id: 'coach' as UserRole, title: 'Coach' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim()) newErrors.email = 'Please enter your email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Please enter a password';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Please agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      success('Account Created!', `Welcome, ${formData.name}!`, true);
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      error('Registration Failed', 'Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = Math.min(
    [formData.password.length >= 6, /[a-z]/.test(formData.password), /[A-Z]/.test(formData.password), /[0-9]/.test(formData.password), /[^a-zA-Z0-9]/.test(formData.password)].filter(Boolean).length,
    5,
  );
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden">
        {/* Subtle layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50" />
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
          <div className="w-full max-w-lg">
            <div className="rounded-2xl border border-gray-100 bg-white/90 p-8 shadow-xl backdrop-blur">
              {/* Header */}
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
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Create Account</h1>
                <p className="text-gray-600">Join our martial arts community</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Roles */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-900">I am a...</label>
                  <div className="grid grid-cols-3 gap-3">
                    {roleOptions.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                        className={`rounded-xl border-2 px-3 py-2 text-center text-sm transition-all ${
                          formData.role === role.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {role.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Phone (optional) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Phone Number <span className="text-gray-500">(optional)</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="+65 9XXX XXXX"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border px-4 py-3 pr-12 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div className={`h-2 rounded-full transition-all ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`} style={{ width: `${(passwordStrength / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{strengthLabels[passwordStrength - 1] || 'Too Short'}</span>
                    </div>
                  )}
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-700">
                    I agree to the <Link href="/terms" className="text-purple-600 hover:text-purple-500">Terms of Service</Link> and <Link href="/privacy" className="text-purple-600 hover:text-purple-500">Privacy Policy</Link>
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 transition-colors hover:text-blue-500">
                  Sign in
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