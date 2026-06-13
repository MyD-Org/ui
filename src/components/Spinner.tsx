import { type HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const spinner = cva('inline-block animate-spin rounded-full border-2 border-current border-t-transparent', {
  variants: { size: { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-8 w-8' } },
  defaultVariants: { size: 'md' },
});

export interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinner> {
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label = 'Cargando', ...props }, ref) => (
    <span ref={ref} role="status" aria-label={label} className={cn(spinner({ size }), className)} {...props} />
  ),
);
Spinner.displayName = 'Spinner';
