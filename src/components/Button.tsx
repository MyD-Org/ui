'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink.js';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-[color,background-color,opacity,box-shadow,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover',
        secondary: 'bg-elevated text-text hover:opacity-80',
        ghost: 'bg-transparent text-text hover:bg-elevated',
        danger: 'bg-danger text-on-primary hover:opacity-90',
        link: 'bg-transparent text-primary hover:underline',
        /** Acción secundaria con borde ("Volver a comprar", "Descargar PDF"). */
        outline: 'border border-border bg-surface text-text hover:bg-elevated',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        // shrink-0: cuadrado fijo — sin esto, dentro de un flex que se queda corto
        // de espacio el ícono se achica de ancho y deja de ser cuadrado.
        icon: 'h-9 w-9 shrink-0 text-sm',
        'icon-lg': 'h-10 w-10 shrink-0 text-base',
        /** Sin alto ni padding: para links de texto en línea ("Limpiar", "Ver todas"). */
        inline: 'h-auto p-0 text-sm',
      },
      shape: { square: '', round: 'rounded-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md', shape: 'square' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean;
  /**
   * Con `href` el botón se renderiza como enlace con el mismo aspecto (vía `renderLink`,
   * default `<a>`). `disabled`, `loading`, `onClick`, `type` y el `ref` sólo aplican
   * al `<button>`: no se pasan al enlace.
   */
  href?: string;
  /** Escape hatch para enchufar el `<Link>` del framework cuando hay `href`. */
  renderLink?: RenderLink;
}

export type ButtonVariant = NonNullable<VariantProps<typeof button>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof button>['size']>;
export type ButtonShape = NonNullable<VariantProps<typeof button>['shape']>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, loading, disabled, href, renderLink = defaultRenderLink, children, ...props }, ref) => {
    const classes = cn(button({ variant, size, shape }), className);
    if (href !== undefined) {
      return <>{renderLink({ href, className: classes, children, 'aria-label': props['aria-label'] })}</>;
    }
    return (
      <button ref={ref} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
