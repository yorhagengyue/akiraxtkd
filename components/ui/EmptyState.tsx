'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {/* 图标 */}
      <div 
        className="mx-auto mb-4 flex items-center justify-center"
        style={{ color: designTokens.states.empty.icon }}
      >
        {React.cloneElement(icon as React.ReactElement, { 
          className: 'w-16 h-16',
          size: 64 
        })}
      </div>
      
      {/* 标题 */}
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ 
          color: designTokens.states.empty.text,
          fontSize: designTokens.typography.scale.h3.size,
          fontWeight: designTokens.typography.scale.h3.weight
        }}
      >
        {title}
      </h3>
      
      {/* 描述 */}
      {description && (
        <p 
          className="text-sm mb-6 max-w-sm mx-auto"
          style={{ 
            color: designTokens.states.empty.subtext,
            fontSize: designTokens.typography.scale.bodySmall.size,
            lineHeight: designTokens.typography.scale.bodySmall.lineHeight
          }}
        >
          {description}
        </p>
      )}
      
      {/* 操作按钮 */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: designTokens.colors.primary[500],
            color: 'white',
            borderRadius: designTokens.borderRadius.button,
            fontSize: designTokens.typography.fontSize.sm,
            minHeight: designTokens.components.density.buttonHeight,
            boxShadow: designTokens.shadows.static,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = designTokens.shadows.interactive;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = designTokens.shadows.static;
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
