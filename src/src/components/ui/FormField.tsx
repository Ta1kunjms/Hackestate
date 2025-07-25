import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  hint,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <div className="flex items-center space-x-1 text-red-600">
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs">{error}</span>
        </div>
      )}
      
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default FormField; 