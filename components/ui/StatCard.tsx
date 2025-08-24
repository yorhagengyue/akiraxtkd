'use client';

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  link?: {
    text: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  link,
  icon,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const getDeltaColor = (type: string) => {
    switch (type) {
      case 'increase': return designTokens.colors.success[600];
      case 'decrease': return designTokens.colors.danger[600];
      default: return designTokens.colors.gray[600];
    }
  };

  const getDeltaIcon = (type: string) => {
    switch (type) {
      case 'increase': return <ArrowUpIcon className="w-4 h-4" />;
      case 'decrease': return <ArrowDownIcon className="w-4 h-4" />;
      default: return <TrendingUpIcon className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100 p-6 
        hover:shadow-md transition-all duration-200
        ${link ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={link?.onClick}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-sm font-medium text-gray-600 truncate"
          style={{ fontSize: designTokens.typography.fontSize.sm }}
        >
          {title}
        </h3>
        {icon && (
          <div className="text-gray-400 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* 主要数值 */}
      <div className="mb-2">
        <span 
          className="text-3xl font-bold text-gray-900"
          style={{ 
            fontSize: designTokens.typography.fontSize['3xl'],
            fontWeight: designTokens.typography.fontWeight.bold 
          }}
        >
          {value}
        </span>
      </div>

      {/* 变化指标 */}
      {delta && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span style={{ color: getDeltaColor(delta.type) }}>
              {getDeltaIcon(delta.type)}
            </span>
            <span 
              className="text-sm font-medium"
              style={{ 
                color: getDeltaColor(delta.type),
                fontSize: designTokens.typography.fontSize.sm 
              }}
            >
              {delta.value > 0 ? '+' : ''}{delta.value}%
            </span>
            {delta.period && (
              <span 
                className="text-xs text-gray-500"
                style={{ fontSize: designTokens.typography.fontSize.xs }}
              >
                {delta.period}
              </span>
            )}
          </div>
          
          {link && (
            <span 
              className="text-xs font-medium hover:underline"
              style={{ 
                color: designTokens.colors.primary[600],
                fontSize: designTokens.typography.fontSize.xs 
              }}
            >
              {link.text} →
            </span>
          )}
        </div>
      )}

      {/* 无delta时的链接 */}
      {!delta && link && (
        <div className="mt-2">
          <span 
            className="text-xs font-medium hover:underline"
            style={{ 
              color: designTokens.colors.primary[600],
              fontSize: designTokens.typography.fontSize.xs 
            }}
          >
            {link.text} →
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
