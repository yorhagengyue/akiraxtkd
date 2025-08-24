/**
 * Unified Animation System - "Dojo Quality" Brand Effects
 * Following professional timing and easing standards
 */

// Animation timing constants (ms)
export const TIMING = {
  micro: 120,      // Micro-interactions (hover, focus)
  component: 240,  // Component transitions
  section: 420,    // Section/page transitions
  belt: 600,       // Belt progress animations
  sweep: 12000,    // Hero lighting sweep cycle
} as const;

// Easing functions (Framer Motion format)
export const EASING = {
  easeOutCubic: [0.215, 0.610, 0.355, 1.000],
  easeInCubic: [0.550, 0.055, 0.675, 0.190],
  spring: { stiffness: 200, damping: 23 },
} as const;

// Movement distances (px)
export const DISTANCE = {
  micro: 2,        // Hover lift
  component: 8,    // Page enter
  section: 16,     // Section reveal
  stagger: 60,     // Stagger delay between items
} as const;

// Brand colors for belt progression
export const BELT_COLORS = {
  white: '#ffffff',
  yellow: '#fbbf24',
  green: '#10b981',
  blue: '#3b82f6',
  red: '#ef4444',
  black: '#1f2937',
} as const;

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Page transition variants for Framer Motion
 */
export const pageVariants = {
  initial: {
    opacity: 0,
    y: DISTANCE.component,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.component / 1000,
      ease: EASING.easeOutCubic,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.micro / 1000,
      ease: EASING.easeInCubic,
    },
  },
};

/**
 * Section reveal animation with stagger
 */
export const sectionVariants = {
  hidden: {
    opacity: 0,
    y: DISTANCE.section,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.component / 1000,
      ease: EASING.easeOutCubic,
    },
  },
};

/**
 * Staggered container for lists/cards
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TIMING.stagger / 1000,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual card/item animation
 */
export const staggerItem = {
  hidden: {
    opacity: 0,
    x: -DISTANCE.section,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: TIMING.component / 1000,
      ease: EASING.easeOutCubic,
    },
  },
};

/**
 * Hover lift effect for cards
 */
export const hoverLift = {
  rest: {
    y: 0,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  hover: {
    y: -DISTANCE.micro,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: {
      duration: TIMING.micro / 1000,
      ease: EASING.easeOutCubic,
    },
  },
};

/**
 * Button press effect
 */
export const buttonPress = {
  rest: { scale: 1 },
  tap: { 
    scale: 0.98,
    transition: {
      duration: 0.05,
    },
  },
};

/**
 * Form validation animations
 */
export const validationVariants = {
  success: {
    borderColor: '#10b981',
    boxShadow: '0 0 0 1px #10b981',
    transition: {
      duration: TIMING.micro / 1000,
    },
  },
  error: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 1px #ef4444',
    x: [0, -2, 2, -2, 2, 0],
    transition: {
      duration: TIMING.stagger / 1000,
      x: {
        duration: 0.06,
        repeat: 2,
        repeatType: 'reverse' as const,
      },
    },
  },
};

/**
 * Password strength bar animation
 */
export const strengthBarVariants = {
  empty: { width: '0%', backgroundColor: '#e5e7eb' },
  weak: { 
    width: '20%', 
    backgroundColor: '#ef4444',
    transition: { duration: TIMING.micro / 1000 },
  },
  fair: { 
    width: '40%', 
    backgroundColor: '#f59e0b',
    transition: { duration: TIMING.micro / 1000 },
  },
  good: { 
    width: '60%', 
    backgroundColor: '#eab308',
    transition: { duration: TIMING.micro / 1000 },
  },
  strong: { 
    width: '80%', 
    backgroundColor: '#22c55e',
    transition: { duration: TIMING.micro / 1000 },
  },
  excellent: { 
    width: '100%', 
    backgroundColor: '#10b981',
    transition: { duration: TIMING.micro / 1000 },
  },
};

/**
 * Demo account fill animation
 */
export const createTypewriterEffect = (text: string, delay: number = 40) => {
  return new Promise<void>((resolve) => {
    let index = 0;
    const element = document.activeElement as HTMLInputElement;
    if (!element) {
      resolve();
      return;
    }

    const typeChar = () => {
      if (index < text.length) {
        element.value = text.substring(0, index + 1);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        index++;
        setTimeout(typeChar, delay);
      } else {
        resolve();
      }
    };

    element.value = '';
    typeChar();
  });
};

/**
 * Belt progress bar animation
 */
export const beltProgressVariants = {
  initial: { width: '0%' },
  loading: {
    width: '100%',
    transition: {
      duration: TIMING.belt / 1000,
      ease: 'linear',
    },
  },
  complete: {
    width: '100%',
    opacity: 0,
    transition: {
      opacity: {
        delay: 0.2,
        duration: 0.3,
      },
    },
  },
};

/**
 * Role badge animation
 */
export const roleBadgeVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: TIMING.micro / 1000,
      ease: EASING.easeOutCubic,
    },
  },
};

/**
 * Success celebration animation
 */
export const celebrationVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 10, 0],
    transition: {
      duration: TIMING.section / 1000,
      ease: EASING.easeOutCubic,
    },
  },
};

/**
 * Toast notification animation
 */
export const toastVariants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: TIMING.micro / 1000,
      ease: EASING.easeOutCubic,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: TIMING.micro / 1000,
      ease: EASING.easeInCubic,
    },
  },
};

/**
 * Skeleton loading animation
 */
export const skeletonVariants = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Hero brand ring animation
 */
export const brandRingVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
    rotate: -90,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: TIMING.micro / 1000,
      ease: EASING.easeOutCubic,
    },
  },
};

/**
 * Utility function to create CSS keyframes for lighting sweep
 */
export const createLightingSweepCSS = () => `
  @keyframes lightingSweep {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(200vw) rotate(45deg);
    }
  }

  .lighting-sweep {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: lightingSweep ${TIMING.sweep}ms linear infinite;
    pointer-events: none;
  }
`;

/**
 * Utility function to create dojo texture background
 */
export const createDojoTextureCSS = () => `
  .dojo-texture {
    position: relative;
    overflow: hidden;
  }

  .dojo-texture::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.02) 2px,
        rgba(0, 0, 0, 0.02) 4px
      );
    pointer-events: none;
    z-index: 1;
  }

  .dojo-noise {
    position: relative;
  }

  .dojo-noise::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.008'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 2;
  }
`;

/**
 * Performance optimization utilities
 */
export const optimizeAnimation = (element: HTMLElement) => {
  element.style.willChange = 'transform, opacity';
  
  // Clean up after animation
  const cleanup = () => {
    element.style.willChange = 'auto';
  };
  
  return cleanup;
};

/**
 * Intersection Observer for scroll-triggered animations
 */
export const createScrollObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  threshold: number = 0.2
) => {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    threshold,
    rootMargin: '0px 0px -10% 0px',
  });
};

export default {
  TIMING,
  EASING,
  DISTANCE,
  BELT_COLORS,
  pageVariants,
  sectionVariants,
  staggerContainer,
  staggerItem,
  hoverLift,
  buttonPress,
  validationVariants,
  strengthBarVariants,
  beltProgressVariants,
  roleBadgeVariants,
  celebrationVariants,
  toastVariants,
  skeletonVariants,
  brandRingVariants,
  createTypewriterEffect,
  createLightingSweepCSS,
  createDojoTextureCSS,
  optimizeAnimation,
  createScrollObserver,
  prefersReducedMotion,
};
