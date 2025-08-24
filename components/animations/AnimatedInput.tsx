/**
 * Animated Input Component
 * Features floating labels, validation feedback, and smooth transitions
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validationVariants, TIMING, strengthBarVariants } from '@/lib/animations';

interface AnimatedInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
  showPasswordStrength?: boolean;
  className?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export default function AnimatedInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  success,
  showPasswordStrength = false,
  className = '',
  icon,
  required = false,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasValue(value.length > 0);
  }, [value]);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = showPasswordStrength ? getPasswordStrength(value) : 0;
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthVariant = ['empty', 'weak', 'fair', 'good', 'strong', 'excellent'][passwordStrength] as keyof typeof strengthBarVariants;

  const shouldFloatLabel = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <motion.div
        className="relative"
        animate={
          error ? 'error' : success ? 'success' : 'rest'
        }
        variants={validationVariants}
      >
        {/* Input Field */}
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-transparent 
            transition-all duration-${TIMING.micro}
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : success ? 'border-green-500' : ''}
            ${shouldFloatLabel ? 'pt-6 pb-2' : ''}
          `}
          placeholder={shouldFloatLabel ? '' : placeholder}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor={name}
          className={`
            absolute left-4 text-gray-500 pointer-events-none
            transition-all duration-${TIMING.micro} ease-out
            ${icon ? 'left-10' : 'left-4'}
          `}
          animate={{
            top: shouldFloatLabel ? '8px' : '50%',
            fontSize: shouldFloatLabel ? '12px' : '16px',
            transform: shouldFloatLabel ? 'translateY(0)' : 'translateY(-50%)',
            color: isFocused ? '#3b82f6' : error ? '#ef4444' : '#6b7280',
          }}
          transition={{
            duration: TIMING.micro / 1000,
            ease: 'easeOut',
          }}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </motion.label>

        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Success/Error Icons */}
        <AnimatePresence>
          {(success || error) && (
            <motion.div
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                success ? 'text-green-500' : 'text-red-500'
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: TIMING.micro / 1000 }}
            >
              {success ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Password Strength Indicator */}
      {showPasswordStrength && value && (
        <motion.div
          className="mt-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: TIMING.micro / 1000 }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                variants={strengthBarVariants}
                animate={strengthVariant}
              />
            </div>
            <span className="text-xs text-gray-600 min-w-[60px]">
              {strengthLabels[passwordStrength]}
            </span>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 text-sm mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: TIMING.micro / 1000 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
