import React from 'react';
import { Select as MTSelect, Option, Textarea as MTTextarea } from '@material-tailwind/react';

export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value?: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  size?: 'md' | 'lg';
  variant?: 'outlined' | 'standard' | 'static';
  color?: 'blue' | 'green' | 'red' | 'gray';
  className?: string;
  placeholder?: string;
  children: React.ReactNode;
  name?: string;
}

export interface OptionProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface TextareaProps {
  placeholder?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  success?: boolean;
  size?: 'md' | 'lg';
  variant?: 'outlined' | 'standard' | 'static';
  color?: 'blue' | 'green' | 'red' | 'gray';
  className?: string;
  rows?: number;
  name?: string;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  success = false,
  size = 'md',
  variant = 'outlined',
  color = 'blue',
  className = '',
  placeholder,
  children,
  name,
}) => {
  return (
    <MTSelect
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      success={success}
      size={size}
      variant={variant}
      color={color}
      className={className}
      placeholder={placeholder}
      name={name}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      {children}
    </MTSelect>
  );
};

export const SelectOption: React.FC<OptionProps> = ({
  value,
  children,
  disabled = false,
  className = '',
}) => {
  return (
    <Option value={value} disabled={disabled} className={className}>
      {children}
    </Option>
  );
};

export const Textarea: React.FC<TextareaProps> = ({
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
  rows = 4,
  name,
  id,
}) => {
  return (
    <MTTextarea
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
      rows={rows}
      name={name}
      id={id}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    />
  );
};

export default { Select, SelectOption, Textarea }; 