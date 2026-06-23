import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../lib/cn';

export interface QuantityStepperProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'defaultValue'> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decrementLabel?: string;
  incrementLabel?: string;
}

export const QuantityStepper = forwardRef<HTMLInputElement, QuantityStepperProps>(
  (
    {
      value,
      onValueChange,
      min = 1,
      max = 9999,
      step = 1,
      decrementLabel = 'Disminuir cantidad',
      incrementLabel = 'Aumentar cantidad',
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const clamp = (n: number) => Math.min(max, Math.max(min, n));
    const [draft, setDraft] = useState<string | null>(null);
    const displayed = draft ?? String(value);

    return (
      <div
        className={cn(
          'inline-flex items-center rounded-sm border border-border-strong',
          disabled && 'opacity-50',
          className,
        )}
      >
        <button
          type="button"
          aria-label={decrementLabel}
          disabled={disabled || value <= min}
          onClick={() => onValueChange(clamp(value - step))}
          className="flex h-9 w-9 items-center justify-center text-lg text-muted transition-colors hover:bg-elevated disabled:pointer-events-none"
        >
          −
        </button>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayed}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            const n = parseInt(displayed, 10);
            setDraft(null);
            onValueChange(Number.isNaN(n) ? min : clamp(n));
          }}
          className="h-9 w-12 border-x border-border-strong bg-transparent text-center text-sm font-medium text-text outline-none"
          {...props}
        />
        <button
          type="button"
          aria-label={incrementLabel}
          disabled={disabled || value >= max}
          onClick={() => onValueChange(clamp(value + step))}
          className="flex h-9 w-9 items-center justify-center text-lg text-muted transition-colors hover:bg-elevated disabled:pointer-events-none"
        >
          +
        </button>
      </div>
    );
  },
);
QuantityStepper.displayName = 'QuantityStepper';
