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
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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
  /**
   * Slot opcional en el pie del sidebar, renderizado arriba del bloque de usuario.
   * Pensado para controles de estado del propio usuario (ej. toggle de presencia).
   */
  footerSlot?: ReactNode;
  className?: string;
  /**
   * Muestra el botón para ocultar/mostrar el sidebar. Default `true`.
   * En desktop (`md+`): con el sidebar oculto queda un botón flotante arriba a la izquierda
   * para volver a mostrarlo. En mobile (`< md`): el sidebar se comporta como un drawer
   * off-canvas cerrado por default, con un botón hamburguesa para abrirlo sobre el contenido.
   */
  collapsible?: boolean;
  /** Estado inicial colapsado en desktop (default `false`). No controlado: el toggle es interno. */
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
  footerSlot,
  className,
  collapsible = true,
  defaultCollapsed = false,
}: SideNavProps) {
  // Colapso en desktop (md+): oculta/muestra el sidebar inline (desmonta el aside).
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  // Drawer en mobile (< md): el sidebar se muestra como panel off-canvas sobre el contenido.
  // Independiente de `collapsed` para que el default sea cerrado en mobile sin afectar desktop.
  const [mobileOpen, setMobileOpen] = useState(false);

  function renderItem(item: SideNavItem) {
    const content = <NavItemContent item={item} />;
    if (renderLink) return renderLink(item.href, content, !!item.active);
    return (
      <a key={item.href} href={item.href} className="block">
        {content}
      </a>
    );
  }

  // El aside se monta si: no está colapsado en desktop, o el drawer mobile está abierto.
  // (En mobile `collapsed` sigue false por default, así que el aside se monta pero queda
  //  oculto por CSS hasta que `mobileOpen` lo muestra como drawer.)
  const asideMounted = !(collapsible && collapsed) || mobileOpen;

  return (
    <div className={cn('flex h-dvh overflow-hidden bg-bg', className)}>
      {/* Backdrop del drawer mobile: tap para cerrar. Solo < md. */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar. En mobile: drawer fixed off-canvas (oculto salvo que mobileOpen).
          En desktop: columna inline estática de ancho fijo. */}
      {asideMounted && (
      <aside
        className={cn(
          'z-40 flex-col bg-surface border-r border-border',
          'fixed inset-y-0 left-0 w-64 shadow-[0_10px_40px_rgba(0,0,0,0.18)]',
          'md:static md:inset-auto md:z-auto md:w-56 md:shrink-0 md:shadow-none',
          mobileOpen ? 'flex' : 'hidden md:flex',
        )}
      >
        {/* Header: logo + botón para ocultar (desktop) / cerrar drawer (mobile) */}
        {(logo || collapsible) && (
          <div className="flex items-start justify-between gap-2 px-4 py-4 border-b border-border">
            <div className="min-w-0">{logo}</div>
            {collapsible && (
              <>
                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  title="Ocultar menú"
                  aria-label="Ocultar menú"
                  className="hidden md:block shrink-0 p-1.5 rounded-sm text-subtle transition-colors hover:bg-elevated hover:text-text"
                >
                  <PanelLeftCloseIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  title="Cerrar menú"
                  aria-label="Cerrar menú"
                  className="md:hidden shrink-0 p-1.5 rounded-sm text-subtle transition-colors hover:bg-elevated hover:text-text"
                >
                  <XIcon />
                </button>
              </>
            )}
          </div>
        )}

        {/* Nav. Al tocar un ítem en mobile, cerramos el drawer. */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5" aria-label="Navegación principal">
          {items.map((item) => (
            <div key={item.href} onClick={() => setMobileOpen(false)}>{renderItem(item)}</div>
          ))}
        </nav>

        {/* Footer: slot opcional (ej. presencia) + bloque de usuario */}
        {(user || footerSlot) && (
          <div className="px-3 py-3 border-t border-border flex flex-col gap-1">
            {footerSlot}
            {user && (
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
            )}
          </div>
        )}
      </aside>
      )}

      {/* Contenido principal. En desktop con el sidebar colapsado aparece el botón flotante de
          "mostrar menú" en la esquina sup-izq: reservamos un canal (md:pl-12) para que no pise el
          contenido de la página (ej. el título). En mobile no aplica: ahí el gutter del botón ☰ lo
          maneja cada página en su encabezado (el contenido no debe correrse en pantallas chicas). */}
      <main
        className={cn(
          'relative flex-1 min-w-0 overflow-y-auto',
          collapsible && collapsed && 'md:pl-12',
        )}
      >
        {/* Desktop, sidebar oculto: botón flotante para volver a mostrarlo. */}
        {collapsible && collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Mostrar menú"
            aria-label="Mostrar menú"
            className="hidden md:block absolute left-3 top-3 z-20 rounded-sm border border-border bg-surface p-1.5 text-subtle shadow-sm transition-colors hover:bg-elevated hover:text-text"
          >
            <PanelLeftOpenIcon />
          </button>
        )}
        {/* Mobile: botón hamburguesa para abrir el drawer. */}
        {collapsible && (
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            title="Abrir menú"
            aria-label="Abrir menú"
            className="md:hidden absolute left-3 top-3 z-20 rounded-sm border border-border bg-surface p-1.5 text-subtle shadow-sm transition-colors hover:bg-elevated hover:text-text"
          >
            <MenuIcon />
          </button>
        )}
        {children}
      </main>
    </div>
  );
}

SideNav.displayName = 'SideNav';
