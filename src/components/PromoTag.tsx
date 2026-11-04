'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn.js';

export interface PromoTagProps extends HTMLAttributes<HTMLDivElement> {
  /** Número o símbolo grande ("6", "20%", "%"). Ausente ⇒ sólo título y texto. */
  value?: string;
  /** Texto chico arriba del número ("Hasta"). Se lee junto al número. */
  eyebrow?: string;
  /** `value` es decorativo (un símbolo, no un dato): se oculta a lectores de pantalla. */
  decorativeValue?: boolean;
  title: string;
  /** Vacío o ausente ⇒ no se muestra. */
  text?: string;
}

/**
 * Etiqueta de promoción estilo góndola: troquel a la izquierda (muesca + línea punteada), número grande
 * en el acento y título al lado. En mobile el número va arriba del título, para que dos etiquetas entren
 * lado a lado.
 */
export function PromoTag({ value, eyebrow, decorativeValue, title, text, className, ...props }: PromoTagProps) {
  return (
    <div
      className={cn(
        'relative h-full rounded-2xl bg-accent-soft py-4 pl-7 pr-3.5 sm:py-5 sm:pl-9 sm:pr-6',
        '[mask:radial-gradient(circle_7px_at_0_50%,transparent_98%,#000)] sm:[mask:radial-gradient(circle_9px_at_0_50%,transparent_98%,#000)]',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-3.5 top-3 border-l-2 border-dashed border-accent/25 sm:bottom-3.5 sm:left-[18px] sm:top-3.5"
      />
      <p className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
        {value || eyebrow ? (
          <span className="flex flex-col" aria-hidden={decorativeValue && !eyebrow ? true : undefined}>
            {eyebrow ? (
              <span className="font-display text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-accent sm:text-[12px]">
                {eyebrow}{' '}
              </span>
            ) : null}
            {value ? (
              <span
                aria-hidden={decorativeValue ? true : undefined}
                className="font-display text-[clamp(36px,5vw,60px)] font-extrabold leading-[0.9] tracking-[-0.04em] text-accent"
              >
                {value}
              </span>
            ) : null}
          </span>
        ) : null}
        <span className="font-display text-[14px] font-bold leading-tight text-primary sm:max-w-[14ch] sm:pb-0.5 sm:text-[17px]">
          {title}
        </span>
      </p>
      {text ? <p className="mt-2 text-[12px] leading-snug text-muted sm:mt-2.5 sm:text-[13px]">{text}</p> : null}
    </div>
  );
}
