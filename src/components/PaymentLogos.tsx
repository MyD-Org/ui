'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn.js';
import { Tooltip, TooltipProvider } from './Tooltip.js';

export interface PaymentLogo {
  /** Nombre de la tarjeta o del medio ("Visa", "Mastercard Débito"). Es el texto alternativo del logo. */
  name: string;
  /** URL del logo. */
  src: string;
}

export interface PaymentLogosProps extends HTMLAttributes<HTMLUListElement> {
  logos: PaymentLogo[];
  /**
   * `compact`: sólo los logos, chicos (footer). `labeled`: logo + nombre, para una lista que se lee
   * (p. ej. "Tarjetas aceptadas" en un diálogo).
   */
  variant?: 'compact' | 'labeled';
}

/**
 * Logos de tarjetas o medios de pago. Cada logo va sobre una pastilla blanca: los logos de las marcas
 * están pensados para fondo claro, así se ven bien también sobre el footer oscuro.
 */
export function PaymentLogos({ logos, variant = 'compact', className, ...props }: PaymentLogosProps) {
  if (logos.length === 0) return null;
  const conNombre = variant === 'labeled';
  const lista = (
    <ul
      className={cn(
        conNombre ? 'grid grid-cols-2 gap-2 sm:grid-cols-3' : 'flex flex-wrap items-center gap-1.5',
        className,
      )}
      {...props}
    >
      {logos.map((logo) => {
        const item = (
          <li
            key={logo.name + logo.src}
            className={cn(
              'flex items-center rounded-md bg-white',
              conNombre ? 'gap-2 border border-border px-2.5 py-2 text-sm text-text' : 'h-7 border border-border px-1.5',
            )}
          >
            <img
              src={logo.src}
              alt={conNombre ? '' : logo.name}
              loading="lazy"
              decoding="async"
              className={cn('w-auto object-contain', conNombre ? 'h-6 max-w-12' : 'h-5 max-w-10')}
            />
            {conNombre ? <span className="min-w-0 truncate">{logo.name}</span> : null}
          </li>
        );
        // Compacto: el nombre aparece al pasar el mouse por el logo.
        return conNombre ? (
          item
        ) : (
          <Tooltip key={logo.name + logo.src} content={logo.name} skipProvider>
            {item}
          </Tooltip>
        );
      })}
    </ul>
  );
  return conNombre ? lista : <TooltipProvider delayDuration={100}>{lista}</TooltipProvider>;
}
