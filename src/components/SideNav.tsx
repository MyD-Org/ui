import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Avatar } from './Avatar';

// Íconos inline (la lib no depende de lucide-react). Paths equivalentes a
// lucide `panel-left-close` / `panel-left-open`.
function PanelLeftCloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  );
}
function PanelLeftOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 9 3 3-3 3" />
    </svg>
  );
}

export interface SideNavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface SideNavUser {
  name: string;
  subtitle?: string;
  logoutIcon?: ReactNode;
  logoutLabel?: string;
  onLogout?: () => void;
}

export interface SideNavProps {
  /** Slot para el logo/marca en la cabecera del sidebar. */
  logo?: ReactNode;
  items: SideNavItem[];
  user?: SideNavUser;
  /**
   * Renderiza el wrapper de cada ítem de nav (ej. Next.js Link, React Router Link).
   * Si no se provee, se usa `<a href>`.
   */
  renderLink?: (href: string, children: ReactNode, active: boolean) => ReactNode;
  /** Contenido principal (a la derecha del sidebar). */
  children?: ReactNode;
  className?: string;
  /**
   * Muestra el botón para ocultar/mostrar el sidebar. Default `true`.
   * Con el sidebar oculto queda un botón flotante arriba a la izquierda para volver a mostrarlo.
   */
  collapsible?: boolean;
  /** Estado inicial colapsado (default `false`). No controlado: el toggle es interno. */
  defaultCollapsed?: boolean;
}

function NavItemContent({ item }: { item: SideNavItem }) {
  return (
    <span
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 rounded-sm text-sm font-medium transition-colors',
        item.active
          ? 'bg-primary-soft text-primary'
          : 'text-muted hover:bg-elevated hover:text-text',
      )}
    >
      {item.icon && <span className="shrink-0 [&>*]:block">{item.icon}</span>}
      {item.label}
    </span>
  );
}

export function SideNav({
  logo,
  items,
  user,
  renderLink,
  children,
  className,
  collapsible = true,
  defaultCollapsed = false,
}: SideNavProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  function renderItem(item: SideNavItem) {
    const content = <NavItemContent item={item} />;
    if (renderLink) return renderLink(item.href, content, !!item.active);
    return (
      <a key={item.href} href={item.href} className="block">
        {content}
      </a>
    );
  }

  return (
    <div className={cn('flex h-screen overflow-hidden bg-bg', className)}>
      {/* Sidebar */}
      {!(collapsible && collapsed) && (
      <aside className="flex w-56 shrink-0 flex-col bg-surface border-r border-border">
        {/* Header: logo + botón para ocultar */}
        {(logo || collapsible) && (
          <div className="flex items-start justify-between gap-2 px-4 py-4 border-b border-border">
            <div className="min-w-0">{logo}</div>
            {collapsible && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                title="Ocultar menú"
                aria-label="Ocultar menú"
                className="shrink-0 p-1.5 rounded-sm text-subtle transition-colors hover:bg-elevated hover:text-text"
              >
                <PanelLeftCloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5" aria-label="Navegación principal">
          {items.map((item) => (
            <div key={item.href}>{renderItem(item)}</div>
          ))}
        </nav>

        {/* User footer */}
        {user && (
          <div className="px-3 py-3 border-t border-border">
            <div className="flex items-center gap-2 px-3 py-2">
              <Avatar name={user.name} size="sm" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text truncate">{user.name}</p>
                {user.subtitle && (
                  <p className="text-[10px] text-subtle truncate">{user.subtitle}</p>
                )}
              </div>
              {user.onLogout && (
                <button
                  onClick={user.onLogout}
                  title={user.logoutLabel ?? 'Salir'}
                  className="shrink-0 p-1.5 rounded-sm text-subtle transition-colors hover:bg-elevated hover:text-text"
                >
                  {user.logoutIcon ?? (
                    <span className="text-[10px]">{user.logoutLabel ?? 'Salir'}</span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
      )}

      {/* Contenido principal */}
      <main className="relative flex-1 overflow-y-auto">
        {/* Con el sidebar oculto, botón flotante para volver a mostrarlo. */}
        {collapsible && collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Mostrar menú"
            aria-label="Mostrar menú"
            className="absolute left-3 top-3 z-20 rounded-sm border border-border bg-surface p-1.5 text-subtle shadow-sm transition-colors hover:bg-elevated hover:text-text"
          >
            <PanelLeftOpenIcon />
          </button>
        )}
        {children}
      </main>
    </div>
  );
}

SideNav.displayName = 'SideNav';
