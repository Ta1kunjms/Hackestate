import React, { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  isLoading?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className = '',
  variant = 'default',
  size = 'md',
  placeholder,
  isLoading = false,
  disabled,
  children,
  ...props
}, ref) => {
  const baseClasses = 'w-full border rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none cursor-pointer';
  
  const variantClasses = {
    default: 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 hover:border-gray-400',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 pr-8 text-sm',
    md: 'px-4 py-3 pr-10 text-sm',
    lg: 'px-5 py-4 pr-12 text-base'
  };

  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white';

  return (
    <div className="relative">
      <select
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabledClasses}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 