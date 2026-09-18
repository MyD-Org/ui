import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
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
  /** Zona de búsqueda (slot): el consumidor pasa su autocomplete. */
  search?: ReactNode;
  /** Zona de acciones (slot): cuenta, carrito, etc. */
  actions?: ReactNode;
  nav?: SiteNavItem[];
}

export const SiteHeader = forwardRef<HTMLElement, SiteHeaderProps>(
  ({ brandName, brandAccent, brandSub, search, actions, nav, className, ...props }, ref) => (
    <header ref={ref} className={cn('sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md', className)} {...props}>
      <div className="mx-auto grid h-[78px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-5 px-[clamp(18px,4vw,48px)] max-lg:h-auto max-lg:grid-cols-1 max-lg:py-3.5">
        <div className="flex max-lg:order-2 max-lg:w-full max-lg:col-span-full">{search}</div>
        <a href="/" className="text-center leading-none max-lg:order-1 max-lg:text-left">
          <span className="font-display text-[26px] font-semibold tracking-tight text-text">
            {brandName}
            {brandAccent ? <> {' '}<em className="italic text-accent">{brandAccent}</em></> : null}
          </span>
          <span className="mt-[5px] block text-[9.5px] font-bold uppercase tracking-[0.32em] text-muted">
            {brandSub}
          </span>
        </a>
        <div className="flex items-center justify-end gap-6 text-[13.5px] font-bold text-text max-lg:order-3">
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
                className="relative shrink-0 py-1.5 text-[13.5px] font-bold text-text transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-sm after:bg-accent after:transition-transform after:duration-200 hover:text-accent hover:after:scale-x-100"
              >
                {item.label}
                {item.badge ? (
                  <span className="ml-1.5 rounded-full bg-accent-soft px-2.5 py-[3px] align-middle text-[10px] font-extrabold uppercase tracking-wider text-accent-strong">
                    {item.badge}
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  ),
);
SiteHeader.displayName = 'SiteHeader';
