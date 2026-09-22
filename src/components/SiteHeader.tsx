import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export interface SiteNavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  brandName: string;
  /** Segunda palabra de la marca, en itálica ámbar (ej. "Led"). */
  brandAccent?: string;
  /** Descriptor chico en small caps bajo la marca. */
  brandSub: string;
  /**
   * Dónde va la marca desde lg: `center` (default: búsqueda a la izquierda) o
   * `start` (marca a la izquierda y búsqueda al centro). Debajo de lg el header
   * se apila igual en los dos casos.
   */
  brandPlacement?: 'center' | 'start';
  /** Zona de búsqueda (slot): el consumidor pasa su autocomplete. */
  search?: ReactNode;
  /** Zona de acciones (slot): cuenta, carrito, etc. */
  actions?: ReactNode;
  nav?: SiteNavItem[];
  /**
   * Con `true` el header deja de estar pegado arriba y se va con el scroll;
   * cuando sale de pantalla lo reemplaza una barra compacta fija (marca + nav +
   * búsqueda + acciones). Sin esto el header es sticky como siempre.
   *
   * Ojo: monta una segunda instancia de los slots. Si la de búsqueda o la del
   * carrito tienen estado o se abren solas, pasá versiones propias por
   * `compactSearch` / `compactActions`.
   */
  compactOnScroll?: boolean;
  /** Búsqueda de la barra compacta. Sin esto reusa la de `search`. */
  compactSearch?: ReactNode;
  /** Acciones de la barra compacta. Sin esto reusa las de `actions`. */
  compactActions?: ReactNode;
  /**
   * Avisa cuándo la barra compacta pasa a estar a la vista. Sirve para que el
   * consumidor sepa cuál de las dos instancias de un slot es la visible.
   */
  onCompactChange?: (compacto: boolean) => void;
}

const NAV_LINK =
  'relative shrink-0 font-bold text-text transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-sm after:bg-accent after:transition-transform after:duration-200 hover:text-accent hover:after:scale-x-100';

const NAV_BADGE =
  'rounded-full bg-accent-soft align-middle font-extrabold uppercase tracking-wider text-accent-strong';

export const SiteHeader = forwardRef<HTMLElement, SiteHeaderProps>(
  (
    {
      brandName,
      brandAccent,
      brandSub,
      brandPlacement = 'center',
      search,
      actions,
      nav,
      compactOnScroll = false,
      compactSearch,
      compactActions,
      onCompactChange,
      className,
      ...props
    },
    ref,
  ) => {
    const propio = useRef<HTMLElement | null>(null);
    const avisar = useRef(onCompactChange);
    avisar.current = onCompactChange;
    const [compacto, setCompacto] = useState(false);

    useEffect(() => {
      if (!compactOnScroll) return;
      const el = propio.current;
      if (!el || typeof IntersectionObserver === 'undefined') return;
      // La barra compacta entra recién cuando el header salió entero de
      // pantalla: sin salto de layout y sin listener de scroll.
      const io = new IntersectionObserver(([entry]) => {
        const visible = !entry.isIntersecting;
        setCompacto(visible);
        avisar.current?.(visible);
      });
      io.observe(el);
      return () => io.disconnect();
    }, [compactOnScroll]);

    function asignarRef(el: HTMLElement | null) {
      propio.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    }

    const alInicio = brandPlacement === 'start';

    const marcaLarga = (
      <>
        <span className="font-display text-[26px] font-semibold tracking-tight text-text">
          {brandName}
          {brandAccent ? (
            <>
              {' '}
              <em className="italic text-highlight">{brandAccent}</em>
            </>
          ) : null}
        </span>
        <span className="mt-[5px] block text-[9.5px] font-bold uppercase tracking-[0.32em] text-muted">
          {brandSub}
        </span>
      </>
    );

    return (
      <>
        <header
          ref={asignarRef}
          className={cn(
            'z-50 border-b border-border bg-bg/90 backdrop-blur-md',
            // Con barra compacta el header completo se va con el scroll: si
            // quedara pegado habría dos headers arriba a la vez.
            compactOnScroll ? 'relative' : 'sticky top-0',
            className,
          )}
          {...props}
        >
          <div
            className={cn(
              'mx-auto grid h-[78px] max-w-[1280px] items-center gap-5 px-[clamp(18px,4vw,48px)] max-lg:h-auto max-lg:grid-cols-1 max-lg:py-3.5',
              alInicio ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[1fr_auto_1fr]',
            )}
          >
            <div
              className={cn(
                'flex max-lg:order-2 max-lg:w-full max-lg:col-span-full',
                alInicio && 'lg:order-2',
              )}
            >
              {search}
            </div>
            <a
              href="/"
              className={cn(
                'leading-none max-lg:order-1 max-lg:text-left',
                alInicio ? 'text-left lg:order-1' : 'text-center',
              )}
            >
              {marcaLarga}
            </a>
            <div
              className={cn(
                'flex items-center justify-end gap-6 text-[13.5px] font-bold text-text max-lg:order-3',
                alInicio && 'lg:order-3',
              )}
            >
              {actions}
            </div>
          </div>
          {nav && nav.length > 0 ? (
            <nav className="border-t border-border">
              <div className="mx-auto flex h-[52px] max-w-[1280px] items-center justify-center gap-[clamp(18px,3.5vw,44px)] overflow-x-auto px-[clamp(18px,4vw,48px)] max-lg:justify-start">
                {nav.map((item) => (
                  <a
                    key={item.label + item.href}
                    href={item.href}
                    className={cn(NAV_LINK, 'py-1.5 text-[13.5px]')}
                  >
                    {item.label}
                    {item.badge ? (
                      <span className={cn(NAV_BADGE, 'ml-1.5 px-2.5 py-[3px] text-[10px]')}>
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>
            </nav>
          ) : null}
        </header>

        {compactOnScroll ? (
          <div
            // `inert` saca la barra oculta del tab order. El peer es react>=18
            // y sus tipos todavía no lo declaran, así que va como atributo: React
            // pasa los desconocidos en minúscula al DOM tal cual.
            {...({ inert: compacto ? undefined : true } as HTMLAttributes<HTMLDivElement>)}
            aria-hidden={!compacto}
            data-compacto={compacto ? '' : undefined}
            // Transición, no keyframes: subiendo y bajando justo en el umbral
            // retoma desde donde está. Sale más rápido de lo que entra.
            className={cn(
              'fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md transition-[translate,opacity,visibility] ease-[cubic-bezier(0.23,1,0.32,1)]',
              compacto
                ? 'visible translate-y-0 opacity-100 duration-200'
                : 'invisible -translate-y-full opacity-100 duration-150 motion-reduce:translate-y-0 motion-reduce:opacity-0',
            )}
          >
            <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-5 px-[clamp(18px,4vw,48px)]">
              <a
                href="/"
                className="hidden shrink-0 font-display text-lg font-semibold leading-none tracking-tight text-text lg:block"
              >
                {brandName}
                {brandAccent ? (
                  <>
                    {' '}
                    <em className="italic text-highlight">{brandAccent}</em>
                  </>
                ) : null}
              </a>

              {nav && nav.length > 0 ? (
                <nav className="hidden min-w-0 flex-1 items-center gap-[clamp(16px,2vw,28px)] overflow-x-auto pr-6 [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] [scrollbar-width:none] lg:flex">
                  {nav.map((item) => (
                    <a
                      key={item.label + item.href}
                      href={item.href}
                      className={cn(NAV_LINK, 'py-1 text-[13px]')}
                    >
                      {item.label}
                      {item.badge ? (
                        <span className={cn(NAV_BADGE, 'ml-1.5 px-2 py-[2px] text-[9.5px]')}>
                          {item.badge}
                        </span>
                      ) : null}
                    </a>
                  ))}
                </nav>
              ) : null}

              <div className="min-w-0 flex-1 lg:ml-auto lg:w-[200px] lg:flex-none xl:w-[340px]">
                {compactSearch ?? search}
              </div>
              <div className="shrink-0">{compactActions ?? actions}</div>
            </div>
          </div>
        ) : null}
      </>
    );
  },
);
SiteHeader.displayName = 'SiteHeader';
