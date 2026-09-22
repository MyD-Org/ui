import { type ReactNode, Fragment } from 'react';
import { cn } from '../lib/cn';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink';

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
}

export interface SectionNavProps {
  items: SectionNavItem[];
  /** Nombre accesible del `<nav>`. Default 'Secciones de su cuenta'. */
  ariaLabel?: string;
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

/**
 * Navegación de secciones dentro de una página (p. ej. "Mi cuenta"): lista vertical desde
 * `md`, fila horizontal desplazable debajo. No es un shell de app (para eso, `SideNav`).
 */
export function SectionNav({
  items,
  ariaLabel = 'Secciones de su cuenta',
  renderLink = defaultRenderLink,
  className,
}: SectionNavProps) {
  const firstDanger = items.findIndex((item) => item.tone === 'danger');

  return (
    <nav aria-label={ariaLabel} className={cn('min-w-0', className)}>
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {items.map((item, i) => {
          const children = (
            <>
              {item.icon && (
                <span aria-hidden="true" className="flex shrink-0">
                  {item.icon}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </>
          );
          const className = itemClass(item);
          let control: ReactNode;
          if (item.href !== undefined && !item.disabled) {
            control = renderLink({ href: item.href, className, 'aria-current': item.active ? 'page' : undefined, children });
          } else if (item.href !== undefined) {
            control = (
              <span aria-disabled="true" className={className}>
                {children}
              </span>
            );
          } else {
            control = (
              <button type="button" onClick={item.onSelect} disabled={item.disabled} className={className}>
                {children}
              </button>
            );
          }
          return (
            <Fragment key={item.id}>
              {i === firstDanger && (
                <li role="separator" aria-orientation="horizontal" className="my-2 hidden border-t border-border md:block" />
              )}
              <li className="flex shrink-0">{control}</li>
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
