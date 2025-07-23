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
    sm: 'py-12 lg:py-16',
    md: 'py-16 lg:py-24',
    lg: 'py-20 lg:py-32',
  };

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-100',
    primary: 'bg-blue-50',
    gradient: 'bg-gradient-to-br from-blue-50 to-gray-50',
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
