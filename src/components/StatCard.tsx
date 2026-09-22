import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink';
import { Skeleton } from './Skeleton';

export interface StatCardProps {
  /** Ícono (20-24px, `currentColor`); se pinta en un tile `bg-primary-soft text-primary`. */
  icon: ReactNode;
  /** number → `Intl.NumberFormat(locale)`; sin valor y sin `loading` → '—'. */
  value?: number | string;
  label: string;
  /** Toda la tarjeta pasa a ser un enlace (nombre accesible "{valor} {label}"). */
  href?: string;
  renderLink?: RenderLink;
  /** Esqueleto en lugar del valor + `aria-busy`. */
  loading?: boolean;
  /** Default 'es-AR'. */
  locale?: string;
  className?: string;
}

const base = 'flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-1';
const linkable =
  'transition-shadow hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]';

/** Tarjeta de indicador con ícono, valor grande y etiqueta; opcionalmente enlazable. `KpiCard` es la de dashboards. */
export function StatCard({
  icon,
  value,
  label,
  href,
  renderLink = defaultRenderLink,
  loading,
  locale = 'es-AR',
  className,
}: StatCardProps) {
  const display =
    value === undefined || value === null
      ? '—'
      : typeof value === 'number'
        ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)
        : value;

  const content = (
    <>
      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col" aria-busy={href && loading ? true : undefined}>
        <span className="font-display text-3xl font-semibold tracking-tight text-text">
          {loading ? <Skeleton className="my-1 h-7 w-12" /> : display}
        </span>
        {/* Espacio explícito: el nombre accesible del enlace queda "{valor} {label}" y no "{valor}{label}". */}
        {' '}
        <span className="text-sm text-muted">{label}</span>
      </span>
    </>
  );

  if (href !== undefined) {
    return <>{renderLink({ href, className: cn(base, linkable, className), children: content })}</>;
  }
  return (
    <div className={cn(base, className)} aria-busy={loading || undefined}>
      {content}
    </div>
  );
}
