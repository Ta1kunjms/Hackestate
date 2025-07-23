import React from 'react';
import { Input as MTInput } from '@material-tailwind/react';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  success?: boolean;
  size?: 'md' | 'lg';
  variant?: 'outlined' | 'standard' | 'static';
  color?: 'blue' | 'green' | 'red' | 'gray';
  className?: string;
  icon?: React.ReactNode;
  name?: string;
  id?: string;
  autoComplete?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  label,
  value,
  defaultValue,
  onChange,
  onBlur,
  onKeyDown,
  disabled = false,
  required = false,
  error = false,
  success = false,
  size = 'md',
  variant = 'outlined',
  color = 'blue',
  className = '',
  icon,
  name,
  id,
  autoComplete,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}, ref) => {
  return (
    <MTInput
      type={type}
      placeholder={placeholder}
      label={label}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      disabled={disabled}
      autoComplete={autoComplete}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      required={required}
      error={error}
      success={success}
      size={size}
      variant={variant}
      color={color}
      className={className}
      icon={icon}
      name={name}
      id={id}
      crossOrigin=""
      onResize={undefined}
      onResizeCapture={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      ref={ref}
    />
  );
});

Input.displayName = 'Input';

export default Input; 