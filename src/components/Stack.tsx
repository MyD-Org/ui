import { type HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const stack = cva('flex', {
  variants: {
    direction: { col: 'flex-col', row: 'flex-row' },
    gap: { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' },
    align: { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' },
    justify: { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' },
  },
  defaultVariants: { direction: 'col', gap: 'md' },
});

export interface StackProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stack> {}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, gap, align, justify, ...props }, ref) => (
    <div ref={ref} className={cn(stack({ direction, gap, align, justify }), className)} {...props} />
  ),
);
Stack.displayName = 'Stack';
