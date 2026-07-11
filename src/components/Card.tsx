import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Título del header (opcional; sin él, la Card es el contenedor pelado de siempre). */
  title?: string;
  /** Bajada corta bajo el título. */
  description?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-surface shadow-1 p-5', className)}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-semibold text-text">{title}</h3>}
          {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
        </div>
      )}
      {children}
    </div>
  ),
);
Card.displayName = 'Card';
