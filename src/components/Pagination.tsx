import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '../lib/cn';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink';

/**
 * Números de página a mostrar, con `null` donde va una elipsis. Siempre incluye la
 * primera, la última y una ventana de `2*siblings+1` alrededor de la actual; en los
 * extremos la ventana se corre hacia adentro para no dejar un hueco de una sola página.
 */
export function paginationWindow(page: number, totalPages: number, siblings = 1): (number | null)[] {
  const size = 2 * siblings + 1;
  if (totalPages <= size + 4) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set<number>([1, totalPages, page]);
  const from = Math.min(Math.max(page - siblings, 2), totalPages - size);
  for (let i = from; i < from + size; i++) pages.add(i);

  const nums = [...pages].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push(null);
    out.push(n);
  });
  return out;
}

export interface PaginationLabels {
  previous: string;
  next: string;
  page: (n: number) => string;
  ariaLabel: string;
}

const defaultLabels: PaginationLabels = {
  previous: 'Página anterior',
  next: 'Página siguiente',
  page: (n) => `Página ${n}`,
  ariaLabel: 'Paginación',
};

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  page: number;
  totalPages: number;
  /** Páginas a cada lado de la actual. Default 1. */
  siblings?: number;
  /** Con `hrefFor` los ítems son enlaces reales (rastreables). */
  hrefFor?: (page: number) => string;
  /** Sin `hrefFor`, los ítems son `<button>` que llaman a `onPageChange`. */
  onPageChange?: (page: number) => void;
  renderLink?: RenderLink;
  labels?: Partial<PaginationLabels>;
}

const cell = 'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm transition-colors';
const cellIdle = `${cell} text-text hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]`;
const cellCurrent = `${cell} bg-primary font-semibold text-on-primary`;
const cellDisabled = `${cell} text-muted opacity-40`;

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    { page, totalPages, siblings = 1, hrefFor, onPageChange, renderLink = defaultRenderLink, labels, className, ...props },
    ref,
  ) => {
    if (totalPages <= 1) return null;
    const t = { ...defaultLabels, ...labels };

    const item = (n: number, children: ReactNode, label: string) =>
      hrefFor
        ? renderLink({ href: hrefFor(n), className: cellIdle, 'aria-label': label, children })
        : (
            <button type="button" className={cellIdle} aria-label={label} onClick={() => onPageChange?.(n)}>
              {children}
            </button>
          );

    const arrow = (n: number, children: ReactNode, label: string, enabled: boolean) =>
      enabled ? (
        item(n, children, label)
      ) : (
        <span aria-disabled="true" aria-label={label} className={cellDisabled}>
          {children}
        </span>
      );

    return (
      <nav ref={ref} aria-label={t.ariaLabel} className={className} {...props}>
        <ul className="flex flex-wrap items-center justify-center gap-1">
          <li>{arrow(page - 1, '‹', t.previous, page > 1)}</li>
          {paginationWindow(page, totalPages, siblings).map((n, i) =>
            n === null ? (
              <li key={`gap-${i}`} aria-hidden="true" className={cellDisabled}>
                …
              </li>
            ) : (
              <li key={n}>
                {n === page ? (
                  <span aria-current="page" className={cellCurrent}>
                    {n}
                  </span>
                ) : (
                  item(n, n, t.page(n))
                )}
              </li>
            ),
          )}
          <li>{arrow(page + 1, '›', t.next, page < totalPages)}</li>
        </ul>
      </nav>
    );
  },
);
Pagination.displayName = 'Pagination';
