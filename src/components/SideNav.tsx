import { type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Avatar } from './Avatar';

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
}: SideNavProps) {
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
      <aside className="flex w-56 shrink-0 flex-col bg-surface border-r border-border">
        {/* Logo */}
        {logo && (
          <div className="px-4 py-4 border-b border-border">
            {logo}
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

      {/* Contenido principal */}
      {children != null && (
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      )}
    </div>
  );
}

SideNav.displayName = 'SideNav';
