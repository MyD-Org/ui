import { type HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const alert = cva('rounded-lg border px-4 py-3 text-sm', {
  variants: {
    tone: {
      neutral: 'border-border bg-elevated text-text',
      success: 'border-transparent bg-success-soft text-success',
      warning: 'border-transparent bg-warning-soft text-warning',
      danger: 'border-transparent bg-danger-soft text-danger',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alert> {
  title?: string;
}

export type AlertTone = NonNullable<VariantProps<typeof alert>['tone']>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone, title, children, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alert({ tone }), className)} {...props}>
      {title && <p className="font-medium">{title}</p>}
      {children != null && <div className={cn(title && 'mt-1')}>{children}</div>}
    </div>
  ),
);
Alert.displayName = 'Alert';
