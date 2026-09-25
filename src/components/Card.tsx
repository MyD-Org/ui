'use client';

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Título del header (opcional; sin él, la Card es el contenedor pelado de siempre). */
  title?: string;
  /** Bajada corta bajo el título. */
  description?: string;
  /** Acción alineada a la derecha del título (ej. un `Button variant="link"` "Limpiar"). */
  action?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-surface shadow-1 p-5', className)}
      {...props}
    >
      {action ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-semibold text-text">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
          <div className="shrink-0">{action}</div>
        </div>
      ) : (
        (title || description) && (
          <div className="mb-4">
            {title && <h3 className="text-sm font-semibold text-text">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
        )
      )}
      {children}
    </div>
  ),
);
Card.displayName = 'Card';
