import { type HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const divider = cva('border-border', {
  variants: { orientation: { horizontal: 'w-full border-t', vertical: 'h-full border-l' } },
  defaultVariants: { orientation: 'horizontal' },
});

export interface DividerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof divider> {}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation ?? 'horizontal'}
      className={cn(divider({ orientation }), className)}
      {...props}
    />
  ),
);
Divider.displayName = 'Divider';
