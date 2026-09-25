'use client';

import { Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { AccentText } from './AccentText.js';
import { visibleOnClass, type VisibleOn } from '../lib/visibleOn.js';
import { type RenderImage, defaultRenderImage } from '../lib/renderImage.js';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink.js';

export interface HeroCta {
  label: string;
  href: string;
  /** Dónde se ve el botón. Ausente ⇒ en los dos tamaños. */
  visibleOn?: VisibleOn;
}

export interface HeroUsp {
  icon?: ReactNode;
  label: string;
  /** Con `href` el USP es un link (ej. el de WhatsApp). Si es http(s) abre en otra pestaña. */
  href?: string;
  /** Dónde se ve. Ausente ⇒ en los dos tamaños. */
  visibleOn?: VisibleOn;
}

export interface HeroProps extends HTMLAttributes<HTMLElement> {
  /** Vacío o ausente ⇒ no se muestra. */
  eyebrow?: string;
  /** Dónde se ve el eyebrow. Ausente ⇒ en los dos tamaños. Lo mismo `titleVisibleOn` y `leadVisibleOn`. */
  eyebrowVisibleOn?: VisibleOn;
  /** Vacío o ausente ⇒ no se muestra. Admite marcas `*acento*` en cualquier posición (ej. "La luz que hace *hogar*"). */
  title?: string;
  /** Título para mobile (debajo de `md`), con las mismas marcas. Ausente ⇒ `title`. */
  titleMobile?: string;
  titleVisibleOn?: VisibleOn;
  /** @deprecated Use `*acento*` dentro de `title`. Se agrega al final del título. */
  accent?: string;
  lead?: string;
  /** Bajada para mobile (debajo de `md`). Ausente ⇒ `lead`. */
  leadMobile?: string;
  leadVisibleOn?: VisibleOn;
  /** Foto de fondo. Se ignora si viene `media`. */
  imageSrc?: string;
  imageAlt?: string;
  /**
   * Fondo propio en lugar de la foto (una escena, un video, algo interactivo).
   * Ocupa todo el hero debajo del velo y del texto; el velo se mantiene, así
   * que el lado izquierdo sigue legible. Los eventos de puntero sobre el texto
   * no le llegan: si necesita reaccionar al cursor, escuche en el `<section>`.
   */
  media?: ReactNode;
  ctas?: HeroCta[];
  usps?: HeroUsp[];
  /**
   * Imagen del framework (ej. `next/image`) para la foto de fondo. Recibe
   * `priority: true` y `fit: 'cover'`; lo que devuelve queda como hijo directo
   * del `<section>`, igual que el `<img>` por defecto. Sin esto es un `<img>`
   * con `loading="eager"` y `decoding="async"`.
   */
  renderImage?: RenderImage;
  /** `sizes` de la foto de fondo. Default `'100vw'`. */
  imageSizes?: string;
  /**
   * Enlace del framework (ej. `next/link`) para los `ctas`. Sin esto son `<a>`
   * comunes y cada clic recarga la página entera. Los `usps` con enlace no pasan
   * por acá (los http(s) abren en otra pestaña).
   */
  renderLink?: RenderLink;
}

export function Hero({
  eyebrow,
  eyebrowVisibleOn,
  title,
  titleMobile,
  titleVisibleOn,
  accent,
  lead,
  leadMobile,
  leadVisibleOn,
  imageSrc,
  imageAlt = '',
  media,
  ctas,
  usps,
  renderImage = defaultRenderImage,
  imageSizes = '100vw',
  renderLink = defaultRenderLink,
  className,
  ...props
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative isolate flex min-h-[clamp(480px,72vh,680px)] items-center overflow-hidden rounded-[28px] shadow-2',
        className,
      )}
      {...props}
    >
      {/* El velo degradado va de crema sólida a transparente: el texto va a la
          izquierda sobre fondo claro y la foto respira a la derecha. */}
      {media ? (
        <div className="absolute inset-0 -z-20">{media}</div>
      ) : imageSrc ? (
        renderImage({
          src: imageSrc,
          alt: imageAlt,
          className: 'absolute inset-0 -z-20 h-full w-full object-cover',
          sizes: imageSizes,
          fit: 'cover',
          priority: true,
        })
      ) : null}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(247,242,234,0.94)_0%,rgba(247,242,234,0.82)_34%,rgba(247,242,234,0.25)_62%,transparent_80%)]" />
      {/* Velo pegado a la columna de texto (a todo el alto y 96px más ancho
          que el texto): el contraste no depende de la foto ni del ancho de
          pantalla. */}
      <div
        className={cn(
          'relative flex max-w-[600px] flex-col items-start justify-center self-stretch p-[clamp(28px,5vw,72px)]',
          "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:-right-24 before:-z-10 before:content-['']",
          'before:bg-[linear-gradient(to_right,rgba(247,242,234,0.9)_0%,rgba(247,242,234,0.78)_70%,transparent_100%)]',
        )}
      >
        {eyebrow ? (
          <span
            className={cn(
              "mb-5 inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-accent-strong before:h-[1.5px] before:w-[26px] before:bg-accent-strong before:content-['']",
              visibleOnClass(eyebrowVisibleOn),
            )}
          >
            {eyebrow}
          </span>
        ) : null}
        {title || titleMobile || accent ? (
          <h1
            className={cn(
              'font-display text-[clamp(38px,4.6vw,64px)] font-medium leading-[1.06] tracking-tight text-text',
              visibleOnClass(titleVisibleOn),
            )}
          >
            <AccentText text={title ?? ''} mobileText={titleMobile} accentClassName="italic text-accent" />
            {accent ? (
              <>
                {' '}
                <em className="italic text-accent">{accent}</em>
              </>
            ) : null}
          </h1>
        ) : null}
        {lead || leadMobile ? (
          <p
            className={cn(
              'mt-5 max-w-[42ch] text-[clamp(15px,1.35vw,17.5px)] leading-[1.65] text-muted',
              visibleOnClass(leadVisibleOn),
            )}
          >
            <AccentText text={lead ?? ''} mobileText={leadMobile} />
          </p>
        ) : null}
        {ctas && ctas.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3.5">
            {ctas.map((cta, i) => (
              <Fragment key={cta.href + cta.label}>
                {renderLink({
                  href: cta.href,
                  className: cn(
                    i === 0
                      ? 'inline-flex items-center gap-2.5 rounded-full bg-primary px-[30px] py-4 text-sm font-extrabold text-on-primary transition-[background-color,color,transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-accent hover:text-white'
                      : 'inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-primary px-[30px] py-4 text-sm font-extrabold text-primary transition-[border-color,color,transform] duration-150 hover:-translate-y-0.5 hover:border-accent hover:text-accent',
                    visibleOnClass(cta.visibleOn),
                  ),
                  children: cta.label,
                })}
              </Fragment>
            ))}
          </div>
        ) : null}
        {usps && usps.length > 0 ? (
          <div className="mt-9 flex flex-wrap gap-8 text-[13px] font-bold text-muted [&_svg]:h-[17px] [&_svg]:w-[17px] [&_svg]:text-accent">
            {usps.map((usp) =>
              usp.href ? (
                <a
                  key={usp.label}
                  href={usp.href}
                  {...(/^https?:\/\//.test(usp.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={cn(
                    'inline-flex items-center gap-2.5 underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-current',
                    visibleOnClass(usp.visibleOn),
                  )}
                >
                  {usp.icon}
                  {usp.label}
                </a>
              ) : (
                <span key={usp.label} className={cn('inline-flex items-center gap-2.5', visibleOnClass(usp.visibleOn))}>
                  {usp.icon}
                  {usp.label}
                </span>
              ),
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
