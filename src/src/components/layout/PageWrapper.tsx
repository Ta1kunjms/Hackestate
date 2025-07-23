import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  containerClass?: string;
  fullWidth?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  containerClass = '',
  fullWidth = false,
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={fullWidth ? 'w-full' : `container-custom ${containerClass}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
