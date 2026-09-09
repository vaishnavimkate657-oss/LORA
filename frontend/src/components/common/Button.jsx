import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'ghost', 'accent'
  size = 'md',        // 'sm', 'md', 'lg'
  icon = null,
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none';

  const variants = {
    primary: 'bg-primary-container text-on-primary shadow-[0_8px_20px_-4px_rgba(14,165,233,0.4)] hover:bg-primary',
    secondary: 'bg-on-secondary-fixed text-on-primary hover:opacity-90 shadow-sm',
    accent: 'bg-tertiary-container text-on-primary shadow-md hover:bg-tertiary',
    ghost: 'bg-surface-container-low text-on-surface hover:bg-surface-container',
    glass: 'bg-surface-container-lowest/20 backdrop-blur-md text-on-primary shadow-md hover:bg-surface-container-lowest/30',
    outline: 'border border-outline/30 text-on-surface hover:bg-surface-container-low',
  };

  const sizes = {
    sm: 'px-space-sm py-1 text-xs gap-1',
    md: 'px-space-md py-space-xs text-body-md gap-space-2xs',
    lg: 'px-space-xl py-space-sm text-title-sm gap-space-xs',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <>
          {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
