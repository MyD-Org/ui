'use client';

import { Fragment, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink.js';

export interface SiteFooterLink {
  label: string;
  href: string;
  /**
   * Enlace a otro sitio: se abre en una pestaña nueva (`target="_blank"` +
   * `rel="noopener noreferrer"`) y NO pasa por `renderLink`.
   */
  external?: boolean;
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
  /** Contenido extra de la barra inferior, a la derecha (p. ej. el QR de Data Fiscal). */
  barExtra?: ReactNode;
  /**
   * Enlace del framework (ej. `next/link`) para los links de las columnas. Sin esto son `<a>`
   * comunes y cada clic recarga la página entera.
   */
  renderLink?: RenderLink;
}

const LINK_CLASS =
  'block py-1.5 text-[14.5px] font-semibold text-on-primary/85 transition-[color,padding-left] duration-150 hover:pl-1.5 hover:text-highlight';

/** Columnas con más links que esto se reparten en dos en desktop, para no estirar el footer. */
const MAX_LINKS_UNA_COLUMNA = 4;

/*
 * Compacto a propósito: el footer es navegación secundaria.
 * - Mobile (< lg): marca en una línea y cada columna es un desplegable; la
 *   descripción y `barRight` no se muestran.
 * - Desktop: una sola fila, con la descripción recortada a dos líneas.
 * Los links están siempre en el DOM (en mobile, ocultos con CSS hasta abrir).
 */
export function SiteFooter({ brandName, brandAccent, description, columns, barLeft, barRight, barExtra, renderLink = defaultRenderLink, className, ...props }: SiteFooterProps) {
  return (
    <footer className={cn('mt-2 rounded-t-[32px] bg-primary text-on-primary', className)} {...props}>
      <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,48px)] pt-6 pb-2 lg:flex lg:items-start lg:gap-12 lg:py-8">
        <div className="pb-3 lg:max-w-[34ch] lg:flex-1 lg:pb-0">
          <span className="font-display text-xl font-semibold lg:text-2xl">
            {brandName}
            {brandAccent ? <em className="italic text-highlight"> {brandAccent}</em> : null}
          </span>
          <p className="mt-2 line-clamp-2 text-xs leading-[1.6] text-on-primary/60 max-lg:hidden">{description}</p>
        </div>
        {columns.map((col) => (
          <FooterColumn key={col.title} column={col} renderLink={renderLink} />
        ))}
      </div>
      {barLeft || barRight || barExtra ? (
        <div className="border-t border-on-primary/15">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-[clamp(18px,4vw,48px)] py-3 text-xs font-semibold text-on-primary/45">
            <div className="flex flex-wrap gap-x-2">
              {barLeft ? <span>{barLeft}</span> : null}
              {barRight ? (
                <span className="max-lg:hidden">
                  {barLeft ? <span aria-hidden="true">· </span> : null}
                  {barRight}
                </span>
              ) : null}
            </div>
            {barExtra ? <div className="flex shrink-0 items-center">{barExtra}</div> : null}
          </div>
        </div>
      ) : null}
    </footer>
  );
}

function FooterColumn({ column, renderLink }: { column: SiteFooterColumn; renderLink: RenderLink }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const larga = column.links.length > MAX_LINKS_UNA_COLUMNA;
  return (
    <div className="border-t border-on-primary/15 lg:shrink-0 lg:border-t-0">
      <h5 className="lg:mb-2">
        {/* En desktop la columna está siempre abierta: el botón no hace nada. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold lg:pointer-events-none lg:py-0 lg:text-[11px] lg:font-extrabold lg:uppercase lg:tracking-[0.22em] lg:text-on-primary/45"
        >
          {column.title}
          <svg
            viewBox="0 0 24 24"
            className={cn('h-4 w-4 transition-transform duration-200 motion-reduce:transition-none lg:hidden', open && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </h5>
      <div id={id} className={cn('pb-3 lg:pb-0', !open && 'max-lg:hidden', larga && 'lg:grid lg:grid-cols-2 lg:gap-x-6')}>
        {column.links.map((link) => (
          <Fragment key={link.label + link.href}>
            {link.external ? (
              <a href={link.href} className={LINK_CLASS} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ) : (
              renderLink({ href: link.href, className: LINK_CLASS, children: link.label })
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
