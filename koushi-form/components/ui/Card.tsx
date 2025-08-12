'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-lg border border-gray-100 p-8',
        'hover:shadow-xl transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};