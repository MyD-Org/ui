import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface PromoBannerProps extends HTMLAttributes<HTMLElement> {
  eyebrow: string;
  title: string;
  /** Frase final en itálica dorada (ej. "luz cálida"). */
  accent?: string;
  lead?: string;
  cta?: { label: string; href: string };
  imageSrc: string;
  imageAlt?: string;
}

export function PromoBanner({ eyebrow, title, accent, lead, cta, imageSrc, imageAlt = '', className, ...props }: PromoBannerProps) {
  return (
    <section
      className={cn('relative isolate flex min-h-[420px] items-center overflow-hidden rounded-[28px] shadow-2', className)}
      {...props}
    >
      <img src={imageSrc} alt={imageAlt} className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgba(24,17,10,0.78)_0%,rgba(24,17,10,0.45)_45%,transparent_75%)]" />
      <div className="max-w-[560px] p-[clamp(30px,5vw,72px)]">
        <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-highlight before:h-[1.5px] before:w-[26px] before:bg-highlight before:content-['']">
          {eyebrow}
        </span>
        <h2 className="font-display text-[clamp(30px,3.6vw,50px)] font-medium leading-[1.08] text-white">
          {title}
          {accent ? (
            <>
              {' '}
              <em className="italic text-highlight">{accent}</em>
            </>
          ) : null}
        </h2>
        {lead ? <p className="mt-4 max-w-[44ch] text-[15.5px] leading-[1.65] text-white/80">{lead}</p> : null}
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
