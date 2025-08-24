/**
 * Animated Page Wrapper
 * Provides consistent page transitions and belt progress bar
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMING, BELT_COLORS, beltProgressVariants } from '@/lib/animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
  showBeltProgress?: boolean;
  beltColor?: keyof typeof BELT_COLORS;
}

export default function AnimatedPage({ 
  children, 
  className = '', 
  showBeltProgress = false,
  beltColor = 'blue'
}: AnimatedPageProps) {
  const [isLoading, setIsLoading] = useState(showBeltProgress);

  useEffect(() => {
    if (showBeltProgress) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, TIMING.belt);

      return () => clearTimeout(timer);
    }
  }, [showBeltProgress]);

  return (
    <>
      {/* Belt Progress Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(90deg, ${BELT_COLORS.yellow}, ${BELT_COLORS.green}, ${BELT_COLORS.blue}, ${BELT_COLORS.red})`,
              }}
              variants={beltProgressVariants}
              initial="initial"
              animate="loading"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
