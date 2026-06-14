import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-surface shadow-1 p-5', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
