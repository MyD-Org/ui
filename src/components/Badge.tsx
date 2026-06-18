import { type HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badge = cva('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'bg-elevated text-muted',
      success: 'bg-success-soft text-success',
      danger: 'bg-danger-soft text-danger',
      warning: 'bg-warning-soft text-warning',
      info: 'bg-info-soft text-info',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export type BadgeTone = NonNullable<VariantProps<typeof badge>['tone']>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, ...props }, ref) => (
    <span ref={ref} className={cn(badge({ tone }), className)} {...props} />
  ),
);
Badge.displayName = 'Badge';
