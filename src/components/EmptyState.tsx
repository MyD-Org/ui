import { type ReactNode, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, icon, action, className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-elevated/40 px-6 py-10 text-center',
        className,
      )}
      {...props}
    >
      {icon != null && <div className="mb-1 text-muted">{icon}</div>}
      <p className="text-sm font-medium text-text">{title}</p>
      {description != null && <p className="text-xs text-muted">{description}</p>}
      {action != null && <div className="mt-2">{action}</div>}
    </div>
  ),
);
EmptyState.displayName = 'EmptyState';
