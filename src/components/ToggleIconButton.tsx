import { type ButtonHTMLAttributes, type ReactNode, forwardRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const toggle = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  {
    variants: {
      pressed: {
        false: 'border-border bg-surface text-muted hover:bg-elevated hover:text-text',
        true: 'border-transparent',
      },
      tone: { primary: '', danger: '' },
      size: { sm: 'h-8 w-8', md: 'h-9 w-9' },
    },
    compoundVariants: [
      { pressed: true, tone: 'primary', className: 'bg-primary-soft text-primary' },
      { pressed: true, tone: 'danger', className: 'bg-danger-soft text-danger' },
    ],
    defaultVariants: { pressed: false, tone: 'primary', size: 'md' },
  },
);

export type ToggleIconButtonTone = 'primary' | 'danger';

export interface ToggleIconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children' | 'type'> {
  /** Controlado: el estado vive afuera. */
  pressed: boolean;
  /** Se llama con `!pressed` en cada activación (después de `onClick`). */
  onPressedChange?: (pressed: boolean) => void;
  /** Obligatorio: el control es sólo ícono (ej. "Guardar en favoritos" / "Quitar de favoritos"). */
  'aria-label': string;
  /** El consumidor decide el relleno según `pressed` (ej. `fill={pressed ? 'currentColor' : 'none'}`). */
  icon: ReactNode;
  /** Color del estado presionado. Default 'primary'. */
  tone?: ToggleIconButtonTone;
  /** sm = 32px, md = 36px (igual que `Button size="icon"`). Default 'md'. */
  size?: 'sm' | 'md';
  /** Deshabilita y marca `aria-busy` mientras se guarda. */
  loading?: boolean;
}

/**
 * Botón alternable de sólo ícono (`aria-pressed`), p. ej. el corazón de favoritos.
 * `onClick` corre primero y `onPressedChange` se llama siempre: el consumidor puede
 * frenar la navegación de un enlace contenedor (`preventDefault`) sin perder el toggle.
 * No navega por sí mismo (`type="button"`).
 */
export const ToggleIconButton = forwardRef<HTMLButtonElement, ToggleIconButtonProps>(
  (
    { pressed, onPressedChange, icon, tone = 'primary', size = 'md', loading, disabled, onClick, className, ...props },
    ref,
  ) => {
    const ariaLabel = props['aria-label'];
    useEffect(() => {
      if (process.env.NODE_ENV === 'production') return;
      if (!ariaLabel) console.warn('ToggleIconButton: falta aria-label (el control es sólo ícono y queda sin nombre accesible).');
    }, [ariaLabel]);

    const ariaDisabled = props['aria-disabled'] === true || props['aria-disabled'] === 'true';

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cn(toggle({ pressed, tone, size }), className)}
        {...props}
        onClick={(e) => {
          if (ariaDisabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
          onPressedChange?.(!pressed);
        }}
      >
        {icon}
      </button>
    );
  },
);
ToggleIconButton.displayName = 'ToggleIconButton';
