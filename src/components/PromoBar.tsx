'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn.js';

export interface PromoBarItem {
  /** Número o símbolo grande ("8", "%"). Ausente ⇒ sólo título y texto. */
  value?: string;
  /** Texto chico arriba del número ("Hasta"). Se lee antes del número. */
  eyebrow?: string;
  /** `value` es decorativo (un símbolo, no un dato): se oculta a lectores de pantalla. */
  decorativeValue?: boolean;
  title: string;
  /** Vacío o ausente ⇒ no se muestra. */
  text?: string;
}

export interface PromoBarProps extends HTMLAttributes<HTMLUListElement> {
  items: PromoBarItem[];
}

/**
 * Barra de promociones translúcida para ir sobre una foto (ej. el pie del `Hero`, por `footer`).
 * En desktop los avisos van en fila, separados por una línea; en mobile, apilados. Sin `items` no
 * dibuja nada.
 */
export function PromoBar({ items, className, ...props }: PromoBarProps) {
  if (items.length === 0) return null;
  return (
    <ul
      className={cn(
        'grid divide-y divide-border rounded-2xl bg-surface/85 shadow-2 ring-1 ring-border/60 backdrop-blur-md',
        'sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0',
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <li key={`${item.title}-${i}`} className="flex items-center gap-4 px-5 py-3 sm:px-7 sm:py-4">
          {item.value || item.eyebrow ? (
            <span
              className="flex min-w-11 shrink-0 flex-col items-start leading-none"
              aria-hidden={item.decorativeValue && !item.eyebrow ? true : undefined}
            >
              {item.eyebrow ? (
                <span className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
                  {item.eyebrow}{' '}
                </span>
              ) : null}
              {item.value ? (
                <span
                  aria-hidden={item.decorativeValue ? true : undefined}
                  className="font-display text-[clamp(30px,3vw,42px)] font-extrabold leading-[0.95] tracking-[-0.04em] text-accent"
                >
                  {item.value}
                </span>
              ) : null}
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="font-display text-[15px] font-bold leading-tight text-primary sm:text-[17px]">{item.title}</p>
            {item.text ? <p className="mt-1 text-[13px] leading-snug text-muted">{item.text}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
