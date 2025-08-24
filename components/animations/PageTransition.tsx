/**
 * Global Page Transition Wrapper
 * Provides consistent page transitions across all routes
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { TIMING, BELT_COLORS, beltProgressVariants } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Simplified page variants to avoid white screen issues
const simplePageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={simplePageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Belt Progress Bar Component
 * Shows during page transitions
 */
interface BeltProgressProps {
  isVisible: boolean;
  color?: keyof typeof BELT_COLORS;
}

export function BeltProgress({ isVisible, color = 'blue' }: BeltProgressProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 h-0.5"
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
            transition={{
              duration: TIMING.belt / 1000,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
