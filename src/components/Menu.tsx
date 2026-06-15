import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface MenuItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
}

export interface MenuProps {
  items: MenuItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function Menu({ items, value, onValueChange, ariaLabel, className }: MenuProps) {
  return (
    <nav aria-label={ariaLabel} className={cn('flex flex-col gap-0.5', className)}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            aria-current={active ? 'page' : undefined}
            onClick={() => onValueChange?.(item.value)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              active
                ? 'bg-primary-soft text-primary'
                : 'text-text hover:bg-elevated',
            )}
          >
            {item.icon != null && <span className="shrink-0 text-muted">{item.icon}</span>}
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge != null && <span className="shrink-0 text-xs text-muted">{item.badge}</span>}
          </button>
        );
      })}
    </nav>
  );
}
Menu.displayName = 'Menu';
