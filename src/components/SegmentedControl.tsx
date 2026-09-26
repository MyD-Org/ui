'use client';

import { type KeyboardEvent, type ReactNode, forwardRef, useEffect, useRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn.js';

export interface SegmentedOption {
  value: string;
  /** Texto visible (opcional si hay `icon`). */
  label?: string;
  icon?: ReactNode;
  /** Nombre accesible; obligatorio cuando sólo hay `icon`. */
  ariaLabel?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
  className?: string;
}

const segment = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-sm px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      size: { sm: 'h-8', md: 'h-9' },
      checked: { true: 'bg-primary-soft text-primary', false: 'text-muted hover:text-text' },
    },
    defaultVariants: { size: 'md', checked: false },
  },
);

const NEXT: Record<string, 1 | -1> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ options, value, onValueChange, size = 'md', ariaLabel, className }, ref) => {
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
      if (process.env.NODE_ENV === 'production') return;
      for (const o of options) {
        if (!o.label && !o.ariaLabel) {
          console.warn(`SegmentedControl: la opción "${o.value}" no tiene label ni ariaLabel (sin nombre accesible).`);
        }
      }
    }, [options]);

    const enabled = (i: number) => !options[i]?.disabled;

    const move = (from: number, to: number) => {
      const target = options[to];
      if (!target) return;
      onValueChange(target.value);
      buttons.current[to]?.focus();
      void from;
    };

    const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
      const n = options.length;
      let to: number | undefined;
      if (e.key in NEXT) {
        const dir = NEXT[e.key];
        let j = i;
        for (let k = 0; k < n; k++) {
          j = (j + dir + n) % n;
          if (enabled(j)) break;
        }
        to = j;
      } else if (e.key === 'Home') {
        to = options.findIndex((_, j) => enabled(j));
      } else if (e.key === 'End') {
        for (let j = n - 1; j >= 0; j--) if (enabled(j)) { to = j; break; }
      }
      if (to === undefined || to < 0 || to === i) return;
      e.preventDefault();
      move(i, to);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn('inline-flex rounded-sm border border-border bg-surface p-0.5', className)}
      >
        {options.map((o, i) => {
          const checked = o.value === value;
          return (
            <button
              key={o.value}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={o.ariaLabel}
              tabIndex={checked ? 0 : -1}
              disabled={o.disabled}
              onClick={() => onValueChange(o.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={segment({ size, checked })}
            >
              {o.icon && <span className="inline-flex shrink-0 items-center" aria-hidden={o.label ? true : undefined}>{o.icon}</span>}
              {o.label}
            </button>
          );
        })}
      </div>
    );
  },
);
SegmentedControl.displayName = 'SegmentedControl';
