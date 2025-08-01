import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'w-full border rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const variantClasses = {
    default: 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 hover:border-gray-400',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white';

  const paddingClasses = leftIcon && rightIcon 
    ? 'pl-10 pr-10' 
    : leftIcon 
    ? 'pl-10' 
    : rightIcon 
    ? 'pr-10' 
    : '';

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      
      <input
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabledClasses}
          ${paddingClasses}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      />
      
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 