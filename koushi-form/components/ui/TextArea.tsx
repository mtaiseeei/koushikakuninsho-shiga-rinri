'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  onChange?: (value: string) => void;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({
    label,
    required = false,
    error,
    helpText,
    maxLength,
    showCharCount = true,
    className,
    value,
    onChange,
    rows = 5,
    ...props
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    const currentValue = String(value || '');
    const currentLength = currentValue.length;
    const isNearLimit = maxLength && currentLength > maxLength * 0.8;
    const isOverLimit = maxLength && currentLength > maxLength;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            value={currentValue}
            onChange={handleChange}
            maxLength={maxLength}
            rows={rows}
            className={cn(
              'w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg resize-none bg-white',
              'text-gray-900 placeholder:text-gray-300',
              'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
              'hover:border-gray-300 transition-all duration-200',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
              className
            )}
            {...props}
          />
          
          {showCharCount && maxLength && (
            <div className={cn(
              'absolute bottom-2 right-3 text-xs bg-white px-1 rounded',
              isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-600' : 'text-gray-400'
            )}>
              {currentLength}/{maxLength}
            </div>
          )}
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
  }
);

TextArea.displayName = 'TextArea';