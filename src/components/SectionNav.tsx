'use client';

import { type ReactNode, Fragment, useId } from 'react';
import { cn } from '../lib/cn.js';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink.js';

export interface SectionNavItem {
  id: string;
  label: string;
  /** Ítem de navegación (enlace). Si hay `href`, gana sobre `onSelect`. */
  href?: string;
  /** Ítem de acción (`<button type="button">`), p. ej. "Cerrar sesión". */
  onSelect?: () => void;
  /** Decorativo (`aria-hidden`); el label siempre queda visible. 18-20px, `currentColor`. */
  icon?: ReactNode;
  /** Sección actual: `aria-current="page"`. */
  active?: boolean;
  /** 'danger' pinta el ítem en rojo y agrega un separador antes del primero. */
  tone?: 'danger';
  disabled?: boolean;
  /**
   * Contador (p. ej. avisos sin leer). Se oculta en 0 o ausente; más de 99 se ve "99+".
   * El nombre accesible del ítem suma `badgeLabel` con el número real.
   */
  badge?: number;
}

/** Bloque de ítems con título ("Compras online", "Facturación", …). */
export interface SectionNavGroup {
  id: string;
  label: string;
  items: SectionNavItem[];
}

export interface SectionNavProps {
  /**
   * Sin `groups`: la lista completa. Con `groups`: ítems sueltos que van después de los
   * grupos, sin título (p. ej. "Cerrar sesión").
   */
  items?: SectionNavItem[];
  /**
   * Ítems agrupados. Desde `md` cada grupo lleva su título arriba; en móvil (fila
   * horizontal) los grupos se separan con una línea vertical y el título no se ve.
   * Un grupo sin ítems no se renderiza.
   */
  groups?: SectionNavGroup[];
  /** Nombre accesible del `<nav>`. Default 'Secciones de su cuenta'. */
  ariaLabel?: string;
  /** Texto accesible del badge; `{n}` es la cantidad. Default '{n} sin leer'. */
  badgeLabel?: string;
  renderLink?: RenderLink;
  className?: string;
}

const itemBase =
  'flex shrink-0 items-center gap-3 whitespace-nowrap rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] md:w-full';

function itemClass({ active, tone, disabled }: SectionNavItem) {
  return cn(
    itemBase,
    active
      ? 'bg-primary-soft text-primary hover:bg-primary-soft'
      : tone === 'danger'
        ? 'text-danger hover:bg-danger-soft hover:text-danger'
        : 'text-muted hover:bg-elevated hover:text-text',
    disabled && 'pointer-events-none opacity-50',
  );
}

const listClass = 'flex gap-1 overflow-x-auto md:flex-col md:overflow-visible';
const MAX_BADGE = 99;

function ItemControl({ item, renderLink, badgeLabel }: { item: SectionNavItem; renderLink: RenderLink; badgeLabel: string }) {
  const badge = item.badge !== undefined && item.badge > 0 ? item.badge : null;
  const children = (
    <>
      {item.icon && (
        <span aria-hidden="true" className="flex shrink-0">
          {item.icon}
        </span>
      )}
      <span className="truncate">{item.label}</span>
      {badge !== null && (
        <>
          <span
            aria-hidden="true"
            className="ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-on-primary"
          >
            {badge > MAX_BADGE ? `${MAX_BADGE}+` : badge}
          </span>
          <span className="sr-only"> {badgeLabel.replace('{n}', String(badge))}</span>
        </>
      )}
    </>
  );
  const className = itemClass(item);
  if (item.href !== undefined && !item.disabled) {
    return <>{renderLink({ href: item.href, className, 'aria-current': item.active ? 'page' : undefined, children })}</>;
  }
  if (item.href !== undefined) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    );
  }
  return (
    <button type="button" onClick={item.onSelect} disabled={item.disabled} className={className}>
      {children}
    </button>
  );
}

/** `<li>` de cada ítem, con el separador horizontal (desde `md`) antes del primer danger. */
function renderItems(items: SectionNavItem[], renderLink: RenderLink, badgeLabel: string) {
  const firstDanger = items.findIndex((item) => item.tone === 'danger');
  return items.map((item, i) => (
    <Fragment key={item.id}>
      {i === firstDanger && (
        <li role="separator" aria-orientation="horizontal" className="my-2 hidden border-t border-border md:block" />
      )}
      <li className="flex shrink-0">
        <ItemControl item={item} renderLink={renderLink} badgeLabel={badgeLabel} />
      </li>
    </Fragment>
  ));
}

/** Separador entre bloques en la fila horizontal de móvil. Desde `md` separan los títulos. */
function MobileSeparator() {
  return (
    <li role="separator" aria-orientation="vertical" className="mx-1 my-1.5 w-px shrink-0 self-stretch bg-border md:hidden" />
  );
}

/**
 * Navegación de secciones dentro de una página (p. ej. "Mi cuenta"): lista vertical desde
 * `md`, fila horizontal desplazable debajo. No es un shell de app (para eso, `SideNav`).
 */
export function SectionNav({
  items = [],
  groups,
  ariaLabel = 'Secciones de su cuenta',
  badgeLabel = '{n} sin leer',
  renderLink = defaultRenderLink,
  className,
}: SectionNavProps) {
  const baseId = useId();

  if (!groups) {
    return (
      <nav aria-label={ariaLabel} className={cn('min-w-0', className)}>
        <ul className={listClass}>{renderItems(items, renderLink, badgeLabel)}</ul>
      </nav>
    );
  }

  const visibles = groups.filter((group) => group.items.length > 0);
  return (
    <nav aria-label={ariaLabel} className={cn('min-w-0', className)}>
      <ul className={listClass}>
        {visibles.map((group, i) => {
          const titleId = `${baseId}-${group.id}`;
          return (
            <Fragment key={group.id}>
              {i > 0 && <MobileSeparator />}
              <li className={cn('flex shrink-0 md:block', i > 0 && 'md:mt-4')}>
                {/* El título nombra la sublista (aria-labelledby funciona aunque esté oculto en móvil). */}
                <span id={titleId} className="hidden px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-subtle md:block">
                  {group.label}
                </span>
                <ul aria-labelledby={titleId} className="flex gap-1 md:flex-col">
                  {renderItems(group.items, renderLink, badgeLabel)}
                </ul>
              </li>
            </Fragment>
          );
        })}
        {items.length > 0 && visibles.length > 0 && <MobileSeparator />}
        {renderItems(items, renderLink, badgeLabel)}
      </ul>
    </nav>
  );
}
