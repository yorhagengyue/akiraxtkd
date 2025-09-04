/**
 * Error State Components
 * 统一的错误状态组件
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronLeft } from 'lucide-react';
import { LoadingButton } from './Loading';

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorMessage({ title = 'Error', message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
        <div>
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  retrying?: boolean;
  className?: string;
}

export function ErrorCard({ 
  title = 'Something went wrong', 
  message, 
  onRetry, 
  retryLabel = 'Try again',
  retrying = false,
  className = '' 
}: ErrorCardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-8 text-center ${className}`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <LoadingButton
          onClick={onRetry}
          loading={retrying}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {retryLabel}
        </LoadingButton>
      )}
    </div>
  );
}

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  retrying?: boolean;
  className?: string;
}

export function ErrorPage({ 
  title = 'Oops! Something went wrong', 
  message = 'We encountered an unexpected error. Please try again or contact support if the problem persists.',
  onRetry,
  onGoHome,
  onGoBack,
  retrying = false,
  className = '' 
}: ErrorPageProps) {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-4 ${className}`}>
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <LoadingButton
              onClick={onRetry}
              loading={retrying}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </LoadingButton>
          )}
          
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          )}
          
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface NetworkErrorProps {
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}

export function NetworkError({ onRetry, retrying = false, className = '' }: NetworkErrorProps) {
  return (
    <ErrorCard
      title="Connection Problem"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      retrying={retrying}
      className={className}
    />
  );
}

interface NotFoundErrorProps {
  resource?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function NotFoundError({ 
  resource = 'Page', 
  onGoBack, 
  onGoHome,
  className = '' 
}: NotFoundErrorProps) {
  return (
    <ErrorPage
      title={`${resource} Not Found`}
      message={`The ${resource.toLowerCase()} you're looking for doesn't exist or has been moved.`}
      onGoBack={onGoBack}
      onGoHome={onGoHome}
      className={className}
    />
  );
}

interface PermissionErrorProps {
  message?: string;
  onGoBack?: () => void;
  className?: string;
}

export function PermissionError({ 
  message = 'You don\'t have permission to access this resource.',
  onGoBack,
  className = '' 
}: PermissionErrorProps) {
  return (
    <ErrorCard
      title="Access Denied"
      message={message}
      onRetry={onGoBack}
      retryLabel="Go Back"
      className={className}
    />
  );
}
