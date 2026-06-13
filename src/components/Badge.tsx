import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badge = cva('inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'bg-elevated text-muted',
      success: 'bg-success-soft text-success',
      danger: 'bg-danger-soft text-danger',
      warning: 'bg-warning-soft text-warning',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}
