import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  isLoading?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className = '',
  variant = 'default',
  size = 'md',
  resize = 'vertical',
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

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white';

  return (
    <div className="relative">
      <textarea
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${resizeClasses[resize]}
          ${disabledClasses}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea; 