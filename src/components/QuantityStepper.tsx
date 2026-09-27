'use client';

import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn.js';

export type QuantityStepperSize = 'sm' | 'md' | 'lg';
export type QuantityStepperTone = 'outline' | 'soft';

export interface QuantityStepperProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'defaultValue' | 'size'> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decrementLabel?: string;
  incrementLabel?: string;
  /** Alto: sm 36 px (default, el de siempre) · md 40 · lg 48. Los mismos que `Button`. */
  size?: QuantityStepperSize;
  /**
   * `outline` (default): con borde. `soft`: fondo `accent-soft` sin bordes internos, pensado para
   * "este producto está en el carrito" (mismo fondo que `Button variant="soft"`).
   */
  tone?: QuantityStepperTone;
  /** Ocupa todo el ancho; el número toma el espacio del medio. */
  fullWidth?: boolean;
  /**
   * Si se pasa, cuando el próximo "−" llevaría el valor al mínimo, ese botón pasa a ser un tacho
   * con este nombre ("Quitar del carrito"): deja claro que ese toque saca el producto.
   */
  removeLabel?: string;
}

const raiz = cva('inline-flex items-center', {
  variants: {
    tone: {
      outline: 'rounded-sm border border-border-strong',
      soft: 'rounded-sm bg-accent-soft text-accent',
    },
    fullWidth: { true: 'flex w-full', false: '' },
  },
  defaultVariants: { tone: 'outline', fullWidth: false },
});

const alto: Record<QuantityStepperSize, { boton: string; input: string }> = {
  sm: { boton: 'h-9 w-9', input: 'h-9 w-12 text-sm' },
  md: { boton: 'h-10 w-10', input: 'h-10 w-12 text-sm' },
  lg: { boton: 'h-12 w-12', input: 'h-12 w-14 text-base' },
};

const TachoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M9 7V4h6v3" />
  </svg>
);

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
      size = 'sm',
      tone = 'outline',
      fullWidth = false,
      removeLabel,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const clamp = (n: number) => Math.min(max, Math.max(min, n));
    const [draft, setDraft] = useState<string | null>(null);
    const displayed = draft ?? String(value);
    const soft = tone === 'soft';
    const quita = removeLabel != null && value > min && value - step <= min;

    const boton = cn(
      'flex shrink-0 items-center justify-center text-lg transition-colors disabled:pointer-events-none',
      alto[size].boton,
      soft ? 'rounded-sm text-accent hover:bg-accent/10 disabled:opacity-40' : 'text-muted hover:bg-elevated',
    );

    return (
      <div className={cn(raiz({ tone, fullWidth }), disabled && 'opacity-50', className)}>
        <button
          type="button"
          aria-label={quita ? removeLabel : decrementLabel}
          disabled={disabled || value <= min}
          onClick={() => onValueChange(clamp(value - step))}
          className={cn(boton, !soft && 'rounded-l-sm')}
        >
          {quita ? <TachoIcon /> : '−'}
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
          className={cn(
            'bg-transparent text-center pointer-coarse:text-base outline-none',
            alto[size].input,
            soft ? 'font-semibold text-text' : 'border-x border-border-strong font-medium text-text',
            fullWidth && 'min-w-0 flex-1',
          )}
          {...props}
        />
        <button
          type="button"
          aria-label={incrementLabel}
          disabled={disabled || value >= max}
          onClick={() => onValueChange(clamp(value + step))}
          className={cn(boton, !soft && 'rounded-r-sm')}
        >
          +
        </button>
      </div>
    );
  },
);
QuantityStepper.displayName = 'QuantityStepper';
