import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-sm border-[1.5px] border-border-strong bg-surface px-3 py-2 text-sm text-text transition-[color,box-shadow,border-color] duration-150 ease-out',
        'placeholder:text-muted focus-visible:outline-none focus-visible:border-primary',
        'disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
