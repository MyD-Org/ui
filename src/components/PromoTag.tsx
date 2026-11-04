'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn.js';

export interface PromoTagProps extends HTMLAttributes<HTMLDivElement> {
  /** Número o símbolo grande ("6", "20%", "%"). Ausente ⇒ sólo título y texto. */
  value?: string;
  /** Texto chico junto al número ("Hasta"). Se lee antes del número. */
  eyebrow?: string;
  /** `value` es decorativo (un símbolo, no un dato): se oculta a lectores de pantalla. */
  decorativeValue?: boolean;
  title: string;
  /** Vacío o ausente ⇒ no se muestra. */
  text?: string;
}

/**
 * Etiqueta de promoción estilo góndola: troquel a la izquierda (muesca + línea punteada) y número
 * grande en el acento. Compacta para que entre bajo el hero en la primera pantalla: en desktop número
 * y textos van en una franja; en mobile el número va arriba ("Hasta" al lado) para que dos etiquetas
 * entren lado a lado.
 */
export function PromoTag({ value, eyebrow, decorativeValue, title, text, className, ...props }: PromoTagProps) {
  return (
    <div
      className={cn(
        'relative flex h-full flex-col gap-1 rounded-2xl bg-accent-soft py-3 pl-7 pr-3.5 sm:flex-row sm:items-center sm:gap-4 sm:py-3.5 sm:pl-9 sm:pr-6',
        '[mask:radial-gradient(circle_7px_at_0_50%,transparent_98%,#000)] sm:[mask:radial-gradient(circle_9px_at_0_50%,transparent_98%,#000)]',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-3.5 top-3 border-l-2 border-dashed border-accent/25 sm:bottom-3.5 sm:left-[18px] sm:top-3.5"
      />
      {value || eyebrow ? (
        <span
          className="flex shrink-0 items-baseline gap-1.5 sm:flex-col sm:items-start sm:gap-0.5"
          aria-hidden={decorativeValue && !eyebrow ? true : undefined}
        >
          {eyebrow ? (
            <span className="font-display text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-accent sm:text-[12px]">
              {eyebrow}{' '}
            </span>
          ) : null}
          {value ? (
            <span
              aria-hidden={decorativeValue ? true : undefined}
              className="font-display text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[0.9] tracking-[-0.04em] text-accent"
            >
              {value}
            </span>
          ) : null}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="font-display text-[14px] font-bold leading-tight text-primary sm:text-[17px]">{title}</p>
        {text ? <p className="mt-1 text-[12px] leading-snug text-muted sm:text-[13px]">{text}</p> : null}
      </div>
    </div>
  );
}
