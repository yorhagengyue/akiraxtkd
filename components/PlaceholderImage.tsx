/**
 * CSS-based Placeholder Image Component
 * Creates beautiful gradient placeholders without external dependencies
 */

'use client';

import React from 'react';

interface PlaceholderImageProps {
  width: number;
  height: number;
  text: string;
  color?: string;
  textColor?: string;
  className?: string;
}

export default function PlaceholderImage({
  width,
  height,
  text,
  color = '#3b82f6',
  textColor = '#ffffff',
  className = '',
}: PlaceholderImageProps) {
  // Convert hex color to RGB for gradient
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 59, g: 130, b: 246 }; // Default blue
  };

  const rgb = hexToRgb(color);
  
  // Create gradient colors
  const lightColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
  const darkColor = `rgba(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)}, 1)`;

  return (
    <div
      className={`flex items-center justify-center text-center relative overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `linear-gradient(135deg, ${lightColor} 0%, ${darkColor} 100%)`,
        color: textColor,
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)
          `,
        }}
      />
      
      {/* Text Content */}
      <div className="relative z-10 px-4">
        <div 
          className="font-semibold leading-tight"
          style={{
            fontSize: Math.min(width / 12, height / 8, 24),
          }}
        >
          {text}
        </div>
        <div 
          className="mt-2 opacity-75"
          style={{
            fontSize: Math.min(width / 20, height / 12, 14),
          }}
        >
          {width} × {height}
        </div>
      </div>
    </div>
  );
}

// PlaceholderImage component - no external constants to avoid client component issues
