import React from 'react';
import {
  Card as MTCard,
  CardHeader,
  CardBody,
  CardFooter,
} from '@material-tailwind/react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  variant?: 'filled' | 'gradient';
  color?: 'transparent' | 'white' | 'gray';
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'filled' | 'gradient';
  color?: 'transparent' | 'white' | 'gray' | 'blue' | 'green';
  shadow?: boolean;
  floated?: boolean;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  shadow = true,
  variant = 'filled',
  color = 'white',
}) => {
  return (
    <MTCard
      className={`${shadow ? 'shadow-lg' : ''} ${className}`}
      variant={variant}
      color={color}
      placeholder=""
      onResize={undefined}
      onResizeCapture={undefined}
    >
      {children}
    </MTCard>
  );
};

export const CardHeaderComponent: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  variant = 'filled',
  color = 'transparent',
  shadow = false,
  floated = false,
}) => {
  return (
    <CardHeader
      variant={variant}
      color={color}
      className={`${shadow ? 'shadow-lg' : ''} ${floated ? '-mt-6 mx-4' : ''} ${className}`}
      floated={floated}
      shadow={shadow}
      placeholder=""
      onResize={undefined}
      onResizeCapture={undefined}
    >
      {children}
    </CardHeader>
  );
};

export const CardBodyComponent: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return (
    <CardBody 
      className={className} 
      placeholder=""
      onResize={undefined}
      onResizeCapture={undefined}
    >
      {children}
    </CardBody>
  );
};

export const CardFooterComponent: React.FC<CardFooterProps> = ({
  children,
  className = '',
  divider = false,
}) => {
  return (
    <CardFooter 
      className={`${divider ? 'pt-0' : ''} ${className}`} 
      placeholder=""
      onResize={undefined}
      onResizeCapture={undefined}
    >
      {children}
    </CardFooter>
  );
};

// Export all components
export { CardHeaderComponent as CardHeader };
export { CardBodyComponent as CardBody };
export { CardFooterComponent as CardFooter };

export default Card; 