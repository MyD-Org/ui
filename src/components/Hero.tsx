import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { AccentText } from './AccentText';

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroUsp {
  icon?: ReactNode;
  label: string;
}

export interface HeroProps extends HTMLAttributes<HTMLElement> {
  /** Vacío o ausente ⇒ no se muestra. */
  eyebrow?: string;
  /** Vacío o ausente ⇒ no se muestra. Admite marcas `*acento*` en cualquier posición (ej. "La luz que hace *hogar*"). */
  title?: string;
  /** Título para mobile (debajo de `md`), con las mismas marcas. Ausente ⇒ `title`. */
  titleMobile?: string;
  /** @deprecated Use `*acento*` dentro de `title`. Se agrega al final del título. */
  accent?: string;
  lead?: string;
  /** Bajada para mobile (debajo de `md`). Ausente ⇒ `lead`. */
  leadMobile?: string;
  imageSrc: string;
  imageAlt?: string;
  ctas?: HeroCta[];
  usps?: HeroUsp[];
}

export function Hero({
  eyebrow,
  title,
  titleMobile,
  accent,
  lead,
  leadMobile,
  imageSrc,
  imageAlt = '',
  ctas,
  usps,
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
      <img src={imageSrc} alt={imageAlt} className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(247,242,234,0.94)_0%,rgba(247,242,234,0.82)_34%,rgba(247,242,234,0.25)_62%,transparent_80%)]" />
      <div className="relative max-w-[600px] p-[clamp(28px,5vw,72px)]">
        {eyebrow ? (
          <span className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-accent-strong before:h-[1.5px] before:w-[26px] before:bg-accent-strong before:content-['']">
            {eyebrow}
          </span>
        ) : null}
        {title || titleMobile || accent ? (
          <h1 className="font-display text-[clamp(38px,4.6vw,64px)] font-medium leading-[1.06] tracking-tight text-text">
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
          <p className="mt-5 max-w-[42ch] text-[clamp(15px,1.35vw,17.5px)] leading-[1.65] text-muted">
            <AccentText text={lead ?? ''} mobileText={leadMobile} />
          </p>
        ) : null}
        {ctas && ctas.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3.5">
            {ctas.map((cta, i) => (
              <a
                key={cta.href + cta.label}
                href={cta.href}
                className={
                  i === 0
                    ? 'inline-flex items-center gap-2.5 rounded-full bg-primary px-[30px] py-4 text-sm font-extrabold text-on-primary transition-[background-color,color,transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-accent hover:text-white'
                    : 'inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-primary px-[30px] py-4 text-sm font-extrabold text-primary transition-[border-color,color,transform] duration-150 hover:-translate-y-0.5 hover:border-accent hover:text-accent'
                }
              >
                {cta.label}
              </a>
            ))}
          </div>
        ) : null}
        {usps && usps.length > 0 ? (
          <div className="mt-9 flex flex-wrap gap-8 text-[13px] font-bold text-muted [&_svg]:h-[17px] [&_svg]:w-[17px] [&_svg]:text-accent">
            {usps.map((usp) => (
              <span key={usp.label} className="inline-flex items-center gap-2.5">
                {usp.icon}
                {usp.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
