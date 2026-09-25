import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/*
 * `pointer-coarse:text-base` (16 px con puntero táctil) en Input, Textarea,
 * SearchInput y QuantityStepper: Safari de iOS hace zoom al enfocar un campo
 * con letra de menos de 16 px. En desktop siguen en `text-sm`.
 */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-sm border-[1.5px] border-border-strong bg-surface px-3 py-2 text-sm text-text pointer-coarse:text-base transition-[color,box-shadow,border-color] duration-150 ease-out',
        'placeholder:text-muted focus-visible:outline-none focus-visible:border-primary',
        'disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
