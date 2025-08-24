/**
 * Demo Account Card with Typewriter Fill Animation
 * Implements character-by-character form filling
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { hoverLift, buttonPress, createTypewriterEffect, roleBadgeVariants, TIMING } from '@/lib/animations';

interface DemoAccount {
  email: string;
  password: string;
  role: string;
  description?: string;
}

interface DemoAccountCardProps {
  account: DemoAccount;
  onFill: (email: string, password: string) => void;
  isActive?: boolean;
  className?: string;
}

export default function DemoAccountCard({ 
  account, 
  onFill, 
  isActive = false,
  className = '' 
}: DemoAccountCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleQuickFill = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      // Focus on email field first
      const emailField = document.querySelector('input[name="email"]') as HTMLInputElement;
      const passwordField = document.querySelector('input[name="password"]') as HTMLInputElement;
      
      if (emailField && passwordField) {
        // Clear existing values
        emailField.value = '';
        passwordField.value = '';
        
        // Focus email field and animate typing
        emailField.focus();
        await createTypewriterEffect(account.email, 30);
        
        // Small delay before moving to password
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Focus password field and animate typing
        passwordField.focus();
        await createTypewriterEffect(account.password, 35);
        
        // Trigger the parent's onFill callback to update state
        onFill(account.email, account.password);
      }
    } catch (error) {
      console.error('Demo fill animation failed:', error);
      // Fallback to instant fill
      onFill(account.email, account.password);
    } finally {
      setIsAnimating(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'coach':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'student':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleQuickFill}
      disabled={isAnimating}
      className={`
        w-full text-left p-4 bg-white rounded-lg border border-gray-200 
        transition-all duration-${TIMING.micro}
        ${isActive ? 'ring-2 ring-primary-500 border-primary-500' : ''}
        ${isAnimating ? 'cursor-wait opacity-75' : 'cursor-pointer'}
        ${className}
      `}
      variants={hoverLift}
      whileHover={!isAnimating ? 'hover' : 'rest'}
      whileTap={!isAnimating ? buttonPress.tap : {}}
      initial="rest"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Role Badge */}
          <motion.div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mb-2 ${getRoleColor(account.role)}`}
            variants={roleBadgeVariants}
            initial="initial"
            animate="animate"
          >
            {account.role}
          </motion.div>
          
          {/* Account Details */}
          <div className="space-y-1">
            <div className="font-medium text-gray-900 font-mono text-sm">
              {account.email}
            </div>
            {account.description && (
              <div className="text-xs text-gray-600">
                {account.description}
              </div>
            )}
          </div>
        </div>

        {/* Action Indicator */}
        <div className="flex items-center space-x-2 ml-4">
          {isAnimating ? (
            <motion.div
              className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ) : (
            <motion.div
              className="text-gray-400"
              whileHover={{ x: 2 }}
              transition={{ duration: TIMING.micro / 1000 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Typing Animation Indicator */}
      {isAnimating && (
        <motion.div
          className="mt-3 flex items-center space-x-2 text-xs text-primary-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: TIMING.micro / 1000 }}
        >
          <motion.div
            className="w-1 h-3 bg-primary-600 rounded"
            animate={{ opacity: [1, 0, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span>Filling form...</span>
        </motion.div>
      )}
    </motion.button>
  );
}
