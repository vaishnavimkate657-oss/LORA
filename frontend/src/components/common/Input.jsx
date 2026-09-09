import React from 'react';

export const Input = ({
  label,
  icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`w-full py-2.5 ${icon ? 'pl-10' : 'pl-4'} pr-4 bg-surface-container-low rounded-2xl text-on-surface placeholder:text-outline font-title-sm text-title-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all ${error ? 'border border-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-error mt-0.5">{error}</span>}
    </div>
  );
};
