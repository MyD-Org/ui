import { Fragment, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink';

export interface SiteFooterLink {
  label: string;
  href: string;
}

export interface SiteFooterColumn {
  title: string;
  links: SiteFooterLink[];
}

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  brandName: string;
  brandAccent?: string;
  description: string;
  columns: SiteFooterColumn[];
  barLeft?: string;
  barRight?: string;
  /**
   * Enlace del framework (ej. `next/link`) para los links de las columnas. Sin esto son `<a>`
   * comunes y cada clic recarga la página entera.
   */
  renderLink?: RenderLink;
}

export function SiteFooter({ brandName, brandAccent, description, columns, barLeft, barRight, renderLink = defaultRenderLink, className, ...props }: SiteFooterProps) {
  return (
    <footer className={cn('mt-2 rounded-t-[32px] bg-primary text-on-primary', className)} {...props}>
      {/* En mobile las columnas van de a dos (la marca ocupa la fila entera):
          una debajo de otra, el footer medía más que la pantalla. */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-8 px-[clamp(18px,4vw,48px)] py-[clamp(40px,6vw,80px)] lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-9">
        <div className="col-span-2 lg:col-span-1">
          <span className="font-display text-3xl font-semibold">
            {brandName}
            {brandAccent ? <em className="italic text-highlight"> {brandAccent}</em> : null}
          </span>
          <p className="mt-4 max-w-[34ch] text-sm leading-[1.7] text-on-primary/60">{description}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h5 className="mb-3 text-[11px] lg:mb-4 font-extrabold uppercase tracking-[0.22em] text-on-primary/45">
              {col.title}
            </h5>
            {col.links.map((link) => (
              <Fragment key={link.label + link.href}>
                {renderLink({
                  href: link.href,
                  className:
                    'block py-1.5 text-[14.5px] font-semibold text-on-primary/85 transition-[color,padding-left] duration-150 hover:pl-1.5 hover:text-highlight',
                  children: link.label,
                })}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      {barLeft || barRight ? (
        <div className="border-t border-on-primary/15">
          <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-4 px-[clamp(18px,4vw,48px)] py-5 text-xs font-semibold text-on-primary/45">
            <span>{barLeft}</span>
            <span>{barRight}</span>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
