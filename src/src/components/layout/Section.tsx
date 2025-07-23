import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'white' | 'gray' | 'primary' | 'gradient';
  id?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  padding = 'md',
  background = 'white',
  id,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'section-padding-sm',
    md: 'section-padding',
    lg: 'py-20 lg:py-32',
  };

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-secondary-50',
    primary: 'bg-primary-50',
    gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50',
  };

  return (
    <section
      id={id}
      className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;
