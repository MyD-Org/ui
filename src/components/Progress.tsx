import { type HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const bar = cva('h-full rounded-full transition-[width] duration-300 ease-out', {
  variants: {
    tone: {
      primary: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger',
    },
  },
  defaultVariants: { tone: 'primary' },
});

export type ProgressTone = NonNullable<VariantProps<typeof bar>['tone']>;

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  value: number;
  max?: number;
  tone?: ProgressTone;
  size?: 'sm' | 'md';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, tone, size = 'md', className, ...props }, ref) => {
    const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('w-full overflow-hidden rounded-full bg-elevated', size === 'sm' ? 'h-1' : 'h-2', className)}
        {...props}
      >
        <div className={cn(bar({ tone }))} style={{ width: `${pct}%` }} />
      </div>
    );
  },
);
Progress.displayName = 'Progress';
