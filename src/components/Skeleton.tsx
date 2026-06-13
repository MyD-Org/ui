import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} aria-hidden="true" className={cn('animate-pulse rounded-sm bg-elevated', className)} {...props} />
  ),
);
Skeleton.displayName = 'Skeleton';
