import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary-fixed text-on-primary-fixed-variant',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-fixed text-tertiary',
    accent: 'bg-tertiary-container text-on-primary',
    glass: 'bg-surface-container-lowest/80 backdrop-blur-md text-primary',
  };

  return (
    <span className={`inline-flex items-center px-space-sm py-1 rounded-full font-label-caps text-label-caps uppercase ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </span>
  );
};
