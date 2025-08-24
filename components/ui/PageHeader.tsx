'use client';

import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className = ''
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div 
        className="px-6 py-6"
        style={{ padding: designTokens.spacing.page.padding }}
      >
        {/* 面包屑 */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 mb-4">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRightIcon 
                    className="w-4 h-4 text-gray-400 flex-shrink-0" 
                  />
                )}
                {crumb.href || crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontSize: designTokens.typography.fontSize.sm }}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span 
                    className="text-sm text-gray-900 font-medium"
                    style={{ fontSize: designTokens.typography.fontSize.sm }}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* 标题区 */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h1 
              className="text-2xl font-bold text-gray-900 truncate"
              style={{ 
                fontSize: designTokens.typography.scale.h1.size,
                fontWeight: designTokens.typography.scale.h1.weight,
                lineHeight: designTokens.typography.scale.h1.lineHeight
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p 
                className="mt-2 text-gray-600"
                style={{ 
                  fontSize: designTokens.typography.scale.body.size,
                  lineHeight: designTokens.typography.scale.body.lineHeight
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* 操作按钮 */}
          {actions && (
            <div className="ml-6 flex items-center space-x-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
