'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  height?: number;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '',
  height = 4,
  animated = true
}) => {
  return (
    <div 
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      <div 
        className={`h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{ 
          width: `${Math.min(100, Math.max(0, progress))}%`,
        }}
      >
        {/* 光沢エフェクト */}
        <div 
          className="h-full w-full opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
            animation: animated ? 'shimmer 2s infinite' : 'none',
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};