import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  /**
   * Logo compacto que se muestra en lugar de `logo` cuando el sidebar está en modo rail
   * (colapsado en desktop, ancho ~56px). Pensado para una versión mínima del logo (ej. la
   * inicial, un icono). Si no se provee, el header queda vacío en rail.
   */
  compactLogo?: ReactNode;
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
  /**
   * Versión compacta de `footerSlot` para modo rail. Si no se provee, en rail se oculta
   * `footerSlot` (no se renderiza) para no romper la barra angosta con contenido ancho.
   */
  footerSlotCompact?: ReactNode;
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
  /**
   * Comportamiento del colapso en desktop:
   * - `'hidden'` (default): oculta el sidebar por completo. Aparece un botón flotante para reabrirlo.
   * - `'rail'`: deja una barra angosta al costado mostrando solo los íconos de los ítems.
   * En mobile no aplica: el sidebar siempre se comporta como drawer off-canvas.
   */
  collapsedMode?: 'hidden' | 'rail';
  /**
   * Patrón de navegación en mobile (< sm):
   * - `'drawer'` (default): panel off-canvas desde la izquierda, botón hamburguesa arriba.
   *   Patrón "web app clásico".
   * - `'bottom-sheet'`: hoja que sube desde abajo con drag gesture, botón hamburguesa flotante
   *   abajo-derecha (FAB). Se cierra arrastrando hacia abajo o tocando el backdrop. Patrón
   *   "app nativa" — más pulgar-friendly y familiar en iOS/Android.
   */
  mobileMode?: 'drawer' | 'bottom-sheet';
  /**
   * Oculta el botón/FAB que abre el sidebar en mobile. Útil en vistas de detalle (chat abierto,
   * pantallas full-screen) donde la nav queda tapada por el compose y ya hay un back button
   * propio. NO afecta al aside en sí (sigue accesible por otras vías si el caller quiere).
   */
  hideMobileTrigger?: boolean;
}

export type SideNavCollapsedMode = 'hidden' | 'rail';

function NavItemContent({ item, rail }: { item: SideNavItem; rail?: boolean }) {
  return (
    <span
      title={rail ? item.label : undefined}
      className={cn(
        'flex w-full items-center rounded-sm text-sm font-medium transition-colors',
        rail ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2',
        item.active
          ? 'bg-primary-soft text-primary'
          : 'text-muted hover:bg-elevated hover:text-text',
      )}
    >
      {item.icon ? (
        <span className="shrink-0 [&>*]:block">{item.icon}</span>
      ) : rail ? (
        <span className="shrink-0 text-xs font-semibold uppercase">
          {item.label.charAt(0)}
        </span>
      ) : null}
      {!rail && item.label}
    </span>
  );
}

export function SideNav({
  logo,
  compactLogo,
  items,
  user,
  renderLink,
  children,
  footerSlot,
  footerSlotCompact,
  className,
  collapsible = true,
  defaultCollapsed = false,
  collapsedMode = 'hidden',
  mobileMode = 'drawer',
  hideMobileTrigger = false,
}: SideNavProps) {
  // Colapso en desktop (md+): oculta/muestra el sidebar inline (desmonta el aside).
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  // Drawer en mobile (< md): el sidebar se muestra como panel off-canvas sobre el contenido.
  // Independiente de `collapsed` para que el default sea cerrado en mobile sin afectar desktop.
  const [mobileOpen, setMobileOpen] = useState(false);

  const isRail = collapsible && collapsed && collapsedMode === 'rail';
  const isHiddenCollapsed = collapsible && collapsed && collapsedMode === 'hidden';

  function renderItem(item: SideNavItem, rail: boolean) {
    const content = <NavItemContent item={item} rail={rail} />;
    if (renderLink) return renderLink(item.href, content, !!item.active);
    return (
      <a key={item.href} href={item.href} className="block">
        {content}
      </a>
    );
  }

  // El aside se monta si: no está colapsado en desktop (o está en modo rail), o el drawer mobile
  // está abierto, o estamos en bottom-sheet (siempre montado para animar el slide desde abajo).
  const asideMounted = !isHiddenCollapsed || mobileOpen || (mobileMode === 'bottom-sheet');

  // ── Drag gesture del bottom sheet (mobile mobileMode='bottom-sheet') ────────
  // El operador puede arrastrar la hoja hacia abajo para cerrarla. Durante el drag desactivamos
  // la transición para que la hoja siga al dedo 1:1. Al soltar: si arrastró >30% de la altura,
  // cerramos; si no, volvemos a la posición abierta con transición suave.
  const [dragY, setDragY] = useState(0); // offset en px desde la posición abierta, >=0
  const [dragging, setDragging] = useState(false); // durante drag: sin transition
  const dragStartYRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLElement | null>(null);
  const isBottomSheet = mobileMode === 'bottom-sheet';
  // Detecta si estamos en viewport mobile (< sm = 640px). El transform del bottom sheet SOLO
  // se aplica en mobile; en desktop el aside vuelve a ser sidebar inline (sm:static) y el
  // transform lo movería fuera de vista. En SSR asumimos "no mobile" para que desktop SSR
  // no aplique transform (cliente lo actualiza post-mount si corresponde).
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobileViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Reset del dragY cada vez que la hoja se abre (por si quedó del cierre anterior).
  useEffect(() => {
    if (!mobileOpen) setDragY(0);
  }, [mobileOpen]);

  function onSheetTouchStart(e: React.TouchEvent) {
    if (!isBottomSheet) return;
    dragStartYRef.current = e.touches[0].clientY;
    setDragging(true);
  }
  function onSheetTouchMove(e: React.TouchEvent) {
    if (!isBottomSheet || dragStartYRef.current == null) return;
    const delta = e.touches[0].clientY - dragStartYRef.current;
    // Solo arrastramos hacia abajo (>=0). Arriba lo ignoramos: la hoja no se sube más.
    setDragY(Math.max(0, delta));
  }
  function onSheetTouchEnd() {
    if (!isBottomSheet || dragStartYRef.current == null) return;
    const height = sheetRef.current?.getBoundingClientRect().height ?? 400;
    setDragging(false);
    dragStartYRef.current = null;
    if (dragY > height * 0.3) {
      // Cerró: transición al 100% (fuera de vista), y luego seteamos mobileOpen=false.
      setDragY(height);
      // Esperamos a que termine la transition (~200ms) para desmarcar mobileOpen.
      setTimeout(() => {
        setMobileOpen(false);
        setDragY(0);
      }, 200);
    } else {
      // Snap back a la posición abierta.
      setDragY(0);
    }
  }

  return (
    <div className={cn('flex h-dvh overflow-hidden bg-bg', className)}>
      {/* Backdrop del drawer mobile: tap para cerrar. Solo < md. */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
        />
      )}

      {/* Sidebar. En mobile: drawer fixed off-canvas O bottom sheet, según mobileMode. En
          desktop (sm+): columna inline estática. Rail mode: ancho angosto (solo íconos). */}
      {asideMounted && (
      <aside
        ref={sheetRef}
        className={cn(
          'z-40 flex-col bg-surface',
          // Mobile: layout depende del mobileMode.
          isBottomSheet
            // Bottom sheet: hoja fija abajo, alto máx 70vh, esquinas superiores redondeadas.
            // La visibilidad se controla con transform (translateY): se anima la subida y bajada.
            ? [
              'fixed inset-x-0 bottom-0 max-h-[70vh] rounded-t-2xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.18)]',
              // En sm+ vuelve a comportarse como columna estática; overrideamos los fixed.
              'sm:static sm:inset-auto sm:max-h-none sm:rounded-none sm:border-t-0 sm:border-r sm:shadow-none',
            ]
            // Drawer clásico desde la izquierda (comportamiento original).
            : [
              'border-r border-border',
              'fixed inset-y-0 left-0 w-64 shadow-[0_10px_40px_rgba(0,0,0,0.18)]',
              'sm:static sm:inset-auto sm:z-auto sm:shrink-0 sm:shadow-none',
            ],
          'sm:border-r sm:border-t-0',
          // En mobile el drawer/sheet siempre se abre expandido. Rail solo aplica en sm+.
          isRail && !mobileOpen ? 'sm:w-14' : 'sm:w-56',
          // Mount + display. En bottom-sheet siempre `flex` en mobile (usamos transform para
          // ocultar); en drawer usamos hidden/flex.
          isBottomSheet
            ? 'flex'
            : (mobileOpen ? 'flex' : 'hidden sm:flex'),
        )}
        style={
          // Transform del bottom sheet SOLO en mobile viewport (< sm). En desktop no aplicamos
          // ningún transform: el aside vuelve a ser sidebar inline (sm:static) y translateY lo
          // movería fuera de vista.
          isBottomSheet && isMobileViewport
            ? {
                transform: mobileOpen
                  ? `translateY(${dragY}px)`
                  : 'translateY(100%)',
                transition: dragging ? 'none' : 'transform 200ms ease-out',
              }
            : undefined
        }
        onTouchStart={onSheetTouchStart}
        onTouchMove={onSheetTouchMove}
        onTouchEnd={onSheetTouchEnd}
      >
        {/* Handle del bottom sheet (solo mobile en modo bottom-sheet): barrita horizontal en
            el tope que indica "arrastrable". Escucha touch para que el drag se pueda hacer
            desde ahí (el resto del sheet también, pero el handle da el hint visual). */}
        {isBottomSheet && (
          <div className="sm:hidden flex items-center justify-center pt-2 pb-1 shrink-0" aria-hidden="true">
            <span
              className="h-1 w-10 rounded-full bg-border"
            />
          </div>
        )}

        {/* Header: solo logo (desktop) y close del drawer (mobile).
            El toggle desktop vive en el footer para no competir con el logo. */}
        {(logo || collapsible) && (
          <div
            className={cn(
              'flex items-start gap-2 border-b border-border justify-between px-4 py-4',
              isRail && !mobileOpen && 'sm:justify-center sm:px-2',
            )}
          >
            {/* En rail (desktop colapsado) mostramos `compactLogo` si el caller lo proveyó;
                si no, ocultamos el logo entero. En mobile drawer o desktop expandido va el logo full. */}
            {isRail && !mobileOpen ? (
              compactLogo ? (
                <div className="min-w-0 hidden sm:flex items-center justify-center">
                  {compactLogo}
                </div>
              ) : null
            ) : (
              <div className="min-w-0">{logo}</div>
            )}
            {/* Cierre del drawer clásico (mobile). En bottom-sheet no va: se cierra arrastrando
                hacia abajo o tocando el backdrop, la X sería redundante. */}
            {collapsible && !isBottomSheet && (
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                title="Cerrar menú"
                aria-label="Cerrar menú"
                className="sm:hidden shrink-0 p-1.5 rounded-sm text-subtle transition-colors hover:bg-elevated hover:text-text"
              >
                <XIcon />
              </button>
            )}
          </div>
        )}

        {/* Nav. Al tocar un ítem en mobile, cerramos el drawer. */}
        <nav
          className={cn(
            'flex-1 py-3 flex flex-col gap-0.5',
            isRail && !mobileOpen ? 'sm:px-2 px-3' : 'px-3',
          )}
          aria-label="Navegación principal"
        >
          {items.map((item) => (
            <div key={item.href} onClick={() => setMobileOpen(false)}>
              {renderItem(item, isRail && !mobileOpen)}
            </div>
          ))}
        </nav>

        {/* Footer: toggle de colapso (desktop) + slot opcional + bloque de usuario.
            En rail: toggle y avatar centrados, sin nombre ni subtítulo. */}
        {(user || footerSlot || collapsible) && (
          <div
            className={cn(
              'py-3 border-t border-border flex flex-col gap-1',
              isRail && !mobileOpen ? 'sm:px-2 px-3' : 'px-3',
            )}
          >
            {/* Toggle desktop del sidebar (colapsar / expandir). Solo md+. */}
            {collapsible && (
              <div
                className={cn(
                  'hidden sm:flex',
                  isRail && !mobileOpen ? 'justify-center' : 'justify-end',
                )}
              >
                {isRail ? (
                  <button
                    type="button"
                    onClick={() => setCollapsed(false)}
                    title="Expandir menú"
                    aria-label="Expandir menú"
                    className="shrink-0 p-1.5 rounded-sm text-subtle transition-colors hover:bg-elevated hover:text-text"
                  >
                    <PanelLeftOpenIcon />
                  </button>
                ) : (
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
            {/* footerSlot: en rail (desktop colapsado) usamos `footerSlotCompact` si existe;
                si no, no renderizamos nada (evita que un slot ancho reviente la barra angosta). */}
            {isRail && !mobileOpen
              ? (footerSlotCompact ?? null)
              : footerSlot}
            {user && (
              isRail && !mobileOpen ? (
                <div className="flex items-center justify-center px-1 py-2" title={user.name}>
                  {user.onLogout ? (
                    <button
                      type="button"
                      onClick={user.onLogout}
                      title={user.logoutLabel ?? 'Salir'}
                      aria-label={user.logoutLabel ?? 'Salir'}
                      className="rounded-full transition-opacity hover:opacity-80"
                    >
                      <Avatar name={user.name} size="sm" />
                    </button>
                  ) : (
                    <Avatar name={user.name} size="sm" />
                  )}
                </div>
              ) : (
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
              )
            )}
          </div>
        )}
      </aside>
      )}

      {/* Contenido principal. En desktop con el sidebar colapsado aparece el botón flotante de
          "mostrar menú" en la esquina sup-izq: reservamos un canal (sm:pl-12) para que no pise el
          contenido de la página (ej. el título). En mobile no aplica: ahí el gutter del botón ☰ lo
          maneja cada página en su encabezado (el contenido no debe correrse en pantallas chicas). */}
      <main
        className={cn(
          'relative flex-1 min-w-0 overflow-y-auto',
          isHiddenCollapsed && 'sm:pl-12',
        )}
      >
        {/* Desktop, sidebar oculto (modo `hidden`): botón flotante para volver a mostrarlo.
            En modo `rail` el botón para expandir vive dentro del propio sidebar. */}
        {isHiddenCollapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Mostrar menú"
            aria-label="Mostrar menú"
            className="hidden sm:block absolute left-3 top-3 z-20 rounded-sm border border-border bg-surface p-1.5 text-subtle shadow-sm transition-colors hover:bg-elevated hover:text-text"
          >
            <PanelLeftOpenIcon />
          </button>
        )}
        {/* Mobile: botón para abrir el menú. En drawer clásico va arriba-izquierda; en
            bottom-sheet va como FAB abajo-derecha, más al alcance del pulgar. Ambos ocultos en sm+.
            `hideMobileTrigger` lo esconde en vistas de detalle (chat abierto) donde ya hay back button
            propio y el FAB taparía el compose. */}
        {collapsible && !mobileOpen && !hideMobileTrigger && (
          isBottomSheet ? (
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              title="Abrir menú"
              aria-label="Abrir menú"
              className="sm:hidden fixed bottom-4 right-4 z-20 rounded-full border border-border bg-surface p-3 text-subtle shadow-lg transition-colors hover:bg-elevated hover:text-text"
            >
              <MenuIcon />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              title="Abrir menú"
              aria-label="Abrir menú"
              className="sm:hidden absolute left-3 top-3 z-20 rounded-sm border border-border bg-surface p-1.5 text-subtle shadow-sm transition-colors hover:bg-elevated hover:text-text"
            >
              <MenuIcon />
            </button>
          )
        )}
        {children}
      </main>
    </div>
  );
}

SideNav.displayName = 'SideNav';
