'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';

interface CapacityBarProps {
  current: number;
  capacity: number;
  waitlist?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const CapacityBar: React.FC<CapacityBarProps> = ({
  current,
  capacity,
  waitlist = 0,
  size = 'md',
  showLabels = true,
  className = ''
}) => {
  const percentage = Math.min((current / capacity) * 100, 100);
  const isOverCapacity = current > capacity;
  const waitlistPercentage = waitlist > 0 ? Math.min((waitlist / capacity) * 100, 50) : 0;

  // 尺寸配置
  const sizeConfig = {
    sm: { height: '4px', text: 'text-xs' },
    md: { height: '6px', text: 'text-sm' },
    lg: { height: '8px', text: 'text-base' }
  };

  const config = sizeConfig[size];

  // 状态颜色
  const getStatusColor = () => {
    if (isOverCapacity) return designTokens.colors.danger[500];
    if (percentage >= 90) return designTokens.colors.warning[500];
    if (percentage >= 70) return designTokens.colors.info[500];
    return designTokens.colors.success[500];
  };

  const getStatusText = () => {
    if (isOverCapacity) return 'Over Capacity';
    if (percentage >= 90) return 'Nearly Full';
    if (percentage >= 70) return 'Filling Up';
    return 'Available';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 标签 */}
      {showLabels && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`font-medium text-gray-900 ${config.text}`}>
              {current}/{capacity}
            </span>
            <span className={`text-gray-500 ${config.text}`}>
              ({Math.round(percentage)}% full)
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {waitlist > 0 && (
              <span className={`text-orange-600 ${config.text}`}>
                {waitlist} waitlist
              </span>
            )}
            <span 
              className={`font-medium ${config.text}`}
              style={{ color: getStatusColor() }}
            >
              {getStatusText()}
            </span>
          </div>
        </div>
      )}

      {/* 进度条 */}
      <div className="relative">
        {/* 背景轨道 */}
        <div 
          className="w-full bg-gray-200 rounded-full overflow-hidden"
          style={{ height: config.height }}
        >
          {/* 当前容量 */}
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getStatusColor(),
            }}
          />
          
          {/* 超容量指示 */}
          {isOverCapacity && (
            <div
              className="absolute top-0 left-0 h-full bg-red-600 opacity-30 rounded-full animate-pulse"
              style={{ width: '100%' }}
            />
          )}
        </div>

        {/* 候补队列指示器 */}
        {waitlist > 0 && (
          <div 
            className="absolute top-0 right-0 h-full bg-orange-400 opacity-60 rounded-r-full"
            style={{ 
              width: `${waitlistPercentage}%`,
              height: config.height,
              transform: 'translateX(2px)'
            }}
          />
        )}
      </div>

      {/* 详细信息 */}
      {showLabels && (current > capacity || waitlist > 0) && (
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          {current > capacity && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Over by {current - capacity}</span>
            </div>
          )}
          
          {waitlist > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Waitlist: {waitlist}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CapacityBar;
