/**
 * Scroll Reveal Animation Component
 * Triggers animations when elements enter viewport
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { sectionVariants, staggerContainer, staggerItem, createScrollObserver, prefersReducedMotion } from '@/lib/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'section' | 'stagger';
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({ 
  children, 
  className = '',
  variant = 'section',
  threshold = 0.2,
  once = true
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    const observer = createScrollObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              setHasAnimated(true);
            }
          } else if (!once && !hasAnimated) {
            setIsVisible(false);
          }
        });
      },
      threshold
    );

    if (observer) {
      observer.observe(element);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [threshold, once, hasAnimated]);

  const variants = variant === 'stagger' ? staggerContainer : sectionVariants;
  const initial = variant === 'stagger' ? 'hidden' : 'hidden';
  const animate = variant === 'stagger' ? 'visible' : 'visible';

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial={initial}
      animate={isVisible ? animate : initial}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item for staggered animations
 */
export function ScrollRevealItem({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
    >
      {children}
    </motion.div>
  );
}
