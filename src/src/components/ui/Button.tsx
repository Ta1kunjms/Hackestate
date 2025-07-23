import React from 'react';
import { Button as MTButton } from '@material-tailwind/react';

export interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'text' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'gray' | 'blue-gray';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-describedby'?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'filled',
  size = 'md',
  color = 'blue',
  fullWidth = false,
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
  className = '',
  'aria-describedby': ariaDescribedBy,
}, ref) => {
  return (
    <MTButton
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      aria-describedby={ariaDescribedBy}
      placeholder=""
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
      ref={ref}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </MTButton>
  );
});

Button.displayName = 'Button';

export default Button; 