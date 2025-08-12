'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  required = false,
  error,
  helpText,
  name,
  options,
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer',
              'hover:border-gray-300 hover:bg-gray-50 transition-all duration-200',
              value === option.value && 'border-blue-500 bg-blue-50'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              className="mt-0.5 w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-xs text-gray-600 mt-1">{option.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};