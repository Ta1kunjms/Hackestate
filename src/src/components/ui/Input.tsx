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
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  label,
  value,
  defaultValue,
  onChange,
  onBlur,
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
}) => {
  return (
    <MTInput
      type={type}
      placeholder={placeholder}
      label={label}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
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
    />
  );
};

export default Input; 