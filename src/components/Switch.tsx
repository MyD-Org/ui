'use client';

import { forwardRef, useId } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn.js';

const track = cva(
  'relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: { sm: 'h-4 w-7', md: 'h-5 w-9' },
      checked: { true: 'bg-primary', false: 'bg-border-strong' },
    },
    defaultVariants: { size: 'md', checked: false },
  },
);

const thumb = cva('pointer-events-none block rounded-full shadow-1 transition-transform duration-150', {
  variants: {
    size: { sm: 'h-3 w-3', md: 'h-4 w-4' },
    checked: { true: 'bg-on-primary', false: 'bg-surface' },
  },
  compoundVariants: [
    { size: 'md', checked: true, className: 'translate-x-4' },
    { size: 'md', checked: false, className: 'translate-x-0.5' },
    { size: 'sm', checked: true, className: 'translate-x-3.5' },
    { size: 'sm', checked: false, className: 'translate-x-0.5' },
  ],
  defaultVariants: { size: 'md', checked: false },
});

export interface SwitchProps {
  /** Controlado: el estado vive afuera. Default false. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  /** Texto visible a la derecha. Si falta, pasar `aria-label`. */
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled, id, label, size = 'md', className, ...aria }, ref) => {
    const autoId = useId();
    const switchId = id ?? autoId;
    // El <button> nativo dispara click con Space y Enter: no hace falta onKeyDown.
    const control = (
      <button
        ref={ref}
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        aria-label={aria['aria-label']}
        aria-describedby={aria['aria-describedby']}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(track({ size, checked }), className)}
      >
        <span className={thumb({ size, checked })} />
      </button>
    );
    if (!label) return control;
    return (
      <span className="inline-flex items-center gap-2">
        {control}
        <label htmlFor={switchId} className={cn('cursor-pointer text-sm text-text', disabled && 'opacity-50')}>
          {label}
        </label>
      </span>
    );
  },
);
Switch.displayName = 'Switch';
