import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const chip = cva(
  'inline-flex items-center gap-1.5 rounded-full text-sm font-medium transition-colors duration-150',
  {
    variants: {
      variant: {
        toggle:
          'border px-3 py-1',
        removable:
          'border border-primary/20 bg-primary/5 text-primary px-3 py-1',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'toggle', selected: true, className: 'border-primary bg-primary text-on-primary' },
      { variant: 'toggle', selected: false, className: 'border-border-strong bg-surface text-text hover:bg-elevated' },
    ],
    defaultVariants: { variant: 'toggle', selected: false },
  },
);

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    VariantProps<typeof chip> {
  onRemove?: () => void;
  removeLabel?: string;
}

export type ChipVariant = NonNullable<VariantProps<typeof chip>['variant']>;

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, selected, onRemove, removeLabel = 'Quitar', children, ...props }, ref) => {
    if (variant === 'removable') {
      return (
        <span className={cn(chip({ variant }), className)}>
          <span className="leading-none">{children}</span>
          <button
            ref={ref}
            type="button"
            aria-label={removeLabel}
            onClick={onRemove}
            className="shrink-0 rounded-full p-0.5 transition-opacity hover:opacity-70"
            {...props}
          >
            <XIcon />
          </button>
        </span>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={!!selected}
        className={cn(chip({ variant, selected: !!selected }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Chip.displayName = 'Chip';
