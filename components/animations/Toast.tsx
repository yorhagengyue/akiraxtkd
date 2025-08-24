/**
 * Toast Notification Component
 * Animated success/error notifications with celebration effects
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { toastVariants, celebrationVariants, TIMING } from '@/lib/animations';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  showCelebration?: boolean;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  showCelebration = false,
}, ref) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), TIMING.micro);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          className={`
            relative max-w-sm w-full rounded-lg border p-4 shadow-lg
            ${getColors()}
          `}
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
        >
          {/* Celebration Effect */}
          {showCelebration && type === 'success' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  variants={celebrationVariants}
                  initial="initial"
                  animate="animate"
                  transition={{
                    delay: i * 0.05,
                    duration: TIMING.section / 1000,
                  }}
                  animate={{
                    x: Math.cos((i * 360) / 12 * Math.PI / 180) * 60,
                    y: Math.sin((i * 360) / 12 * Math.PI / 180) * 60,
                    opacity: [1, 1, 0],
                    scale: [0, 1, 0],
                  }}
                />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{title}</h4>
              {message && (
                <p className="text-sm mt-1 opacity-90">{message}</p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), TIMING.micro);
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Toast.displayName = 'Toast';

export default Toast;

/**
 * Toast Container Component
 */
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ToastContainer({ 
  toasts, 
  onClose, 
  position = 'top-right' 
}: ToastContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-3`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook for managing toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message?: string, showCelebration = false) => {
    return addToast({ type: 'success', title, message, showCelebration });
  };

  const error = (title: string, message?: string) => {
    return addToast({ type: 'error', title, message });
  };

  const warning = (title: string, message?: string) => {
    return addToast({ type: 'warning', title, message });
  };

  const info = (title: string, message?: string) => {
    return addToast({ type: 'info', title, message });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
