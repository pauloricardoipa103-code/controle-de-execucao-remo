import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            'bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-md': variant === 'primary',
            'bg-[#10b981] text-white hover:bg-emerald-600 shadow-md': variant === 'secondary',
            'border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700': variant === 'outline',
            'bg-red-500 text-white hover:bg-red-600 shadow-md': variant === 'danger',
            'h-10 px-4 text-sm': size === 'sm',
            'h-12 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg font-semibold': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
