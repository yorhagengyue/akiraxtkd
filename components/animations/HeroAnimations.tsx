/**
 * Hero Section Animations
 * Lighting sweep, brand ring, and dojo texture effects
 */

'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { brandRingVariants, TIMING, createLightingSweepCSS, createDojoTextureCSS } from '@/lib/animations';

interface HeroAnimationsProps {
  children: React.ReactNode;
  showLightingSweep?: boolean;
  showDojoTexture?: boolean;
  className?: string;
}

export default function HeroAnimations({ 
  children, 
  showLightingSweep = true,
  showDojoTexture = true,
  className = '' 
}: HeroAnimationsProps) {
  useEffect(() => {
    // Inject CSS for lighting sweep and dojo texture
    const styleId = 'hero-animations-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        ${createLightingSweepCSS()}
        ${createDojoTextureCSS()}
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className={`relative overflow-hidden ${showDojoTexture ? 'dojo-texture dojo-noise' : ''} ${className}`}>
      {/* Lighting Sweep Effect */}
      {showLightingSweep && (
        <div className="lighting-sweep" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Animated Brand Ring Component
 */
interface BrandRingProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function BrandRing({ 
  size = 80, 
  strokeWidth = 2, 
  className = '' 
}: BrandRingProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      variants={brandRingVariants}
      initial="initial"
      animate="animate"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="brandRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Animated Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="url(#brandRingGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: TIMING.component / 1000, ease: 'easeOut' },
            opacity: { duration: TIMING.micro / 1000 },
          }}
        />
      </svg>
    </motion.div>
  );
}

/**
 * CTA Button with Pulse Effect
 */
interface AnimatedCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function AnimatedCTA({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary' 
}: AnimatedCTAProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative overflow-hidden px-8 py-4 rounded-lg font-semibold
        transition-all duration-${TIMING.micro}
        ${variant === 'primary' 
          ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-700 hover:to-accent-700' 
          : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
        }
        ${className}
      `}
      whileHover={{
        scale: 1.02,
        boxShadow: variant === 'primary' 
          ? '0 8px 25px rgba(59, 130, 246, 0.3)' 
          : '0 8px 25px rgba(0, 0, 0, 0.1)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: TIMING.micro / 1000 }}
    >
      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileTap={{
          opacity: [0, 0.2, 0],
          scale: [0, 1],
        }}
        transition={{ duration: 0.3 }}
        style={{
          borderRadius: '50%',
          transformOrigin: 'center',
        }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/**
 * Floating Elements Animation
 */
interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  amplitude?: number;
  duration?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  delay = 0,
  amplitude = 10,
  duration = 6,
  className = '' 
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
