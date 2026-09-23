import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { AccentText } from './AccentText';

export interface PromoBannerProps extends HTMLAttributes<HTMLElement> {
  /** Vacío o ausente ⇒ no se muestra. */
  eyebrow?: string;
  /** Vacío o ausente ⇒ no se muestra. Admite marcas `*acento*` en cualquier posición (ej. "Ambientá tus noches con *luz cálida*"). */
  title?: string;
  /** Título para mobile (debajo de `md`), con las mismas marcas. Ausente ⇒ `title`. */
  titleMobile?: string;
  /** @deprecated Use `*acento*` dentro de `title`. Se agrega al final del título. */
  accent?: string;
  lead?: string;
  /** Bajada para mobile (debajo de `md`). Ausente ⇒ `lead`. */
  leadMobile?: string;
  cta?: { label: string; href: string };
  imageSrc: string;
  imageAlt?: string;
}

export function PromoBanner({
  eyebrow,
  title,
  titleMobile,
  accent,
  lead,
  leadMobile,
  cta,
  imageSrc,
  imageAlt = '',
  className,
  ...props
}: PromoBannerProps) {
  return (
    <section
      className={cn('relative isolate flex min-h-[420px] items-center overflow-hidden rounded-[28px] shadow-2', className)}
      {...props}
    >
      <img src={imageSrc} alt={imageAlt} className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgba(24,17,10,0.78)_0%,rgba(24,17,10,0.45)_45%,transparent_75%)]" />
      {/* Velo pegado a la columna de texto (ver Hero). */}
      <div
        className={cn(
          'relative flex max-w-[560px] flex-col items-start justify-center self-stretch p-[clamp(30px,5vw,72px)] [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]',
          "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:-right-24 before:-z-10 before:content-['']",
          'before:bg-[linear-gradient(to_right,rgba(24,17,10,0.8)_0%,rgba(24,17,10,0.62)_70%,transparent_100%)]',
        )}
      >
        {eyebrow ? (
          <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-highlight before:h-[1.5px] before:w-[26px] before:bg-highlight before:content-['']">
            {eyebrow}
          </span>
        ) : null}
        {title || titleMobile || accent ? (
          <h2 className="font-display text-[clamp(30px,3.6vw,50px)] font-medium leading-[1.08] text-white">
            <AccentText text={title ?? ''} mobileText={titleMobile} accentClassName="italic text-highlight" />
            {accent ? (
              <>
                {' '}
                <em className="italic text-highlight">{accent}</em>
              </>
            ) : null}
          </h2>
        ) : null}
        {lead || leadMobile ? (
          <p className="mt-4 max-w-[44ch] text-[15.5px] leading-[1.65] text-white/80">
            <AccentText text={lead ?? ''} mobileText={leadMobile} />
          </p>
        ) : null}
        {cta ? (
          <a
            href={cta.href}
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-surface px-[30px] py-4 text-sm font-extrabold text-text transition-[background-color,transform] duration-150 hover:-translate-y-0.5 hover:bg-highlight"
          >
            {cta.label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
