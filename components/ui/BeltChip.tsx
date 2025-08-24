'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';

interface BeltChipProps {
  belt: string;
  size?: 'sm' | 'md' | 'lg';
  showStripe?: boolean;
  className?: string;
}

const BeltChip: React.FC<BeltChipProps> = ({ 
  belt, 
  size = 'md', 
  showStripe = false,
  className = '' 
}) => {
  // 腰带颜色映射
  const getBeltColor = (beltName: string) => {
    const normalizedBelt = beltName.toLowerCase().replace(/\s+belt$/i, '');
    
    switch (normalizedBelt) {
      case 'white': return designTokens.colors.belt.white;
      case 'yellow': return designTokens.colors.belt.yellow;
      case 'orange': return designTokens.colors.belt.orange;
      case 'green': return designTokens.colors.belt.green;
      case 'blue': return designTokens.colors.belt.blue;
      case 'brown': return designTokens.colors.belt.brown;
      case 'red': return designTokens.colors.belt.red;
      case 'black': return designTokens.colors.belt.black;
      default: return designTokens.colors.belt.white;
    }
  };

  // 尺寸映射
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const beltColor = getBeltColor(belt);
  
  return (
    <div className="relative inline-flex items-center">
      <span
        className={`
          inline-flex items-center font-medium rounded-full
          ${sizeClasses[size]}
          ${className}
        `}
        style={{
          backgroundColor: beltColor.bg,
          color: beltColor.text,
          border: `1px solid ${beltColor.border}`,
        }}
      >
        {/* 腰带条纹效果 */}
        {showStripe && (
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                ${beltColor.border} 2px,
                ${beltColor.border} 4px
              )`
            }}
          />
        )}
        
        {/* 腰带圆点指示器 */}
        <div
          className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
          style={{ backgroundColor: beltColor.border }}
        />
        
        <span className="relative z-10">{belt}</span>
      </span>
    </div>
  );
};

export default BeltChip;
