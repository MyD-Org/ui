import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '../lib/cn';

export interface CategoryTileProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  label: string;
  count?: number;
}

export const CategoryTile = forwardRef<HTMLDivElement, CategoryTileProps>(
  ({ icon, label, count, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center transition-colors hover:border-primary hover:bg-primary/5',
        className,
      )}
      {...props}
    >
      {icon && <span className="text-2xl text-primary">{icon}</span>}
      <span className="text-sm font-semibold text-text">{label}</span>
      {count != null && (
        <span className="text-xs text-muted">{count.toLocaleString('es-AR')} art.</span>
      )}
    </div>
  ),
);
CategoryTile.displayName = 'CategoryTile';
