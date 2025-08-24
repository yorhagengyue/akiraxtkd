/**
 * Pattern Video Poster Component
 * CSS-based placeholder for pattern video thumbnails
 */

import React from 'react';
import { Play } from 'lucide-react';

interface PatternPosterProps {
  patternName: string;
  beltColor: string;
  className?: string;
}

export default function PatternPoster({ patternName, beltColor, className = '' }: PatternPosterProps) {
  return (
    <div className={`relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${beltColor}40 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${beltColor}40 0%, transparent 50%)`,
        }}></div>
      </div>
      
      {/* Belt Stripe */}
      <div 
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: beltColor === '#ffffff' ? '#e5e7eb' : beltColor }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white p-8">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{patternName}</h3>
        <p className="text-sm opacity-80">Pattern Demonstration</p>
      </div>
      
      {/* Corner Decoration */}
      <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
        <div className="w-3 h-3 bg-white/50 rounded-full"></div>
      </div>
    </div>
  );
}
